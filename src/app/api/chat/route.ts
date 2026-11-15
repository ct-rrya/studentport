import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { readPortalCache } from "@/lib/cache";
import { buildPortalGroundingContext } from "@/lib/chat-rag";

export const dynamic = "force-dynamic";

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
  // make sure api key exists before calling sdk
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY is not configured in .env.local yet. Add your Gemini API key to enable the CTU AI Assistant.",
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

  const userMessage = (body.message || "").trim();
  if (!userMessage) {
    return NextResponse.json(
      { error: "Message cannot be empty." },
      { status: 400 }
    );
  }

  const selectedCampus = body.selectedCampus || "all";
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

  const systemInstruction = [
    "You are the CTU Portal Assistant, a helpful and concise student assistant for Cebu Technological University (CTU).",
    "Answer strictly based on the GROUNDED CTU PORTAL DATA provided below (cached ctu.edu.ph announcements, 29-campus directory, academic programs, and official CTU URLs such as https://enrolment.ctu.edu.ph/ and https://online.ctu.edu.ph/).",
    "Rules:",
    "1. Whenever you reference a specific announcement or memo, ALWAYS cite its exact post title and include a clickable markdown link to the original ctu.edu.ph URL (e.g. [Post Title](https://www.ctu.edu.ph/...)).",
    "2. If a user asks about a campus announcement, deadline, memo, or program detail that is NOT in the provided synced ctu.edu.ph records, politely state that it is not in the currently synced records yet and recommend checking https://www.ctu.edu.ph/ or running a fresh sync — never guess or invent dates/policies.",
    "3. Keep answers clean, student-friendly, and formatted with concise bullet points and bold labels where helpful.",
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
    const message =
      err instanceof Error ? err.message : "Failed to reach Gemini API.";
    return NextResponse.json(
      { error: `AI assistant error: ${message}` },
      { status: 502 }
    );
  }
}
