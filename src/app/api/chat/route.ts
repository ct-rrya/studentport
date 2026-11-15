import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { SEVEN_PILLARS } from "@/data/pillars";
import { readPortalCache } from "@/lib/cache";
import { buildPortalGroundingContext } from "@/lib/chat-rag";

export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

const rateBucket = new Map<string, { count: number; resetAt: number }>();

// simple per-ip sliding bucket so bots cant drain gemini quota in seconds
function checkRateLimit(req: NextRequest): { allowed: boolean; retryAfterSec?: number } {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  const ip =
    forwarded.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown";

  const now = Date.now();
  // prune stale buckets occasionally so memory stays flat
  if (rateBucket.size > 500) {
    for (const [key, entry] of rateBucket.entries()) {
      if (entry.resetAt <= now) rateBucket.delete(key);
    }
  }

  const current = rateBucket.get(ip);
  if (!current || current.resetAt <= now) {
    rateBucket.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true };
  }

  if (current.count >= RATE_LIMIT_MAX) {
    const retryAfterSec = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return { allowed: false, retryAfterSec };
  }

  current.count += 1;
  return { allowed: true };
}

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message?: string;
  history?: IncomingMessage[];
  selectedCampus?: string;
}

export async function POST(req: NextRequest) {
  const rate = checkRateLimit(req);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many chat requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSec ?? 60) },
      }
    );
  }

  // make sure api key exists before calling sdk
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY is not configured yet. Add your Gemini API key to enable the 7U AI Assistant.",
      },
      { status: 503 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const userMessage = typeof body.message === "string" ? body.message.trim() : "";
  if (!userMessage) {
    return NextResponse.json(
      { error: "Message cannot be empty." },
      { status: 400 }
    );
  }
  if (userMessage.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).` },
      { status: 400 }
    );
  }

  const rawCampus = typeof body.selectedCampus === "string" ? body.selectedCampus.trim() : "all";
  const selectedCampus = /^[a-z0-9-]+$/i.test(rawCampus) ? rawCampus : "all";
  const cache = await readPortalCache();

  // grab top relevant posts form cache so gemini doesnt hallucinate
  const { contextText, matchedPosts } = buildPortalGroundingContext(
    cache,
    userMessage,
    selectedCampus
  );

  // keep chat history short so we dont blow up token limits
  const recentHistory = (body.history || [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content?.trim())
    .slice(-6)
    .map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content.trim().slice(0, 1200) }],
    }));

  const pillarsSummary = SEVEN_PILLARS.map(
    (p) => `${p.number}. ${p.title} — ${p.description}`
  ).join("\n");

  const systemInstruction = [
    "You are the 7U AI Assistant, a helpful and concise student assistant for Cebu Technological University (CTU).",
    "Answer based on the 7U BRAND & 7 PILLARS and the GROUNDED CTU PORTAL DATA provided below (cached ctu.edu.ph announcements, 29-campus directory, academic programs, and official CTU URLs such as https://enrolment.ctu.edu.ph/ and https://online.ctu.edu.ph/).",
    "Rules:",
    "1. Whenever you reference a specific announcement or memo, ALWAYS cite its exact post title and include a clickable markdown link to the original ctu.edu.ph URL (e.g. [Post Title](https://www.ctu.edu.ph/...)).",
    "2. If asked what '7U' means or why the portal is named 7U, explain the 'Breaking Silos, Building Bridges' theme and list all 7 core 'U' pillars clearly.",
    "3. If a user asks about a campus announcement, deadline, memo, or program detail that is NOT in the provided synced ctu.edu.ph records, politely state that it is not in the currently synced records yet and recommend checking https://www.ctu.edu.ph/ or running a fresh sync — never guess or invent dates/policies.",
    "4. Keep answers clean, student-friendly, and formatted with concise bullet points and bold labels where helpful.",
    "",
    "--- 7U BRAND & 7 CORE PILLARS ---",
    pillarsSummary,
    "",
    "--- GROUNDED CTU PORTAL DATA ---",
    contextText,
  ].join("\n");

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...recentHistory,
        { role: "user", parts: [{ text: userMessage }] },
      ],
      config: {
        systemInstruction,
        temperature: 0.25,
        maxOutputTokens: 900,
      },
    });

    const reply =
      response.text?.trim() ||
      "I couldn't generate a response right now. Please try asking again.";

    return NextResponse.json({
      reply,
      model,
      sources: matchedPosts.slice(0, 4).map((p) => ({
        title: p.title,
        slug: p.slug,
        originalUrl: p.originalUrl,
      })),
    });
  } catch (err) {
    console.error("[api/chat] gemini call failed:", err);
    return NextResponse.json(
      { error: "AI assistant is temporarily unavailable. Please try again shortly." },
      { status: 502 }
    );
  }
}
