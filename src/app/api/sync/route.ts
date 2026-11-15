import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { syncCTUData } from "@/lib/sync";
import { readPortalCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

function safeSecretMatch(provided: string, expected: string): boolean {
  const hashA = createHash("sha256").update(provided).digest();
  const hashB = createHash("sha256").update(expected).digest();
  return timingSafeEqual(hashA, hashB);
}

// protected endpoint so random bots cant spam ctu.edu.ph through our server
function isAuthorized(req: NextRequest): { ok: boolean; reason?: string } {
  const configuredSecret = process.env.SYNC_SECRET;
  if (!configuredSecret) {
    // if no SYNC_SECRET is set in env, only allow in local dev
    if (process.env.NODE_ENV === "production") {
      return { ok: false, reason: "SYNC_SECRET is not configured on the server." };
    }
    return { ok: true };
  }

  const headerSecret = req.headers.get("x-sync-secret");
  const authHeader = req.headers.get("authorization");
  const bearerSecret = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  // header-only auth so secrets never leak in access logs via ?secret=
  const provided = headerSecret || bearerSecret;
  if (!provided || !safeSecretMatch(provided, configuredSecret)) {
    return { ok: false, reason: "Invalid or missing sync secret." };
  }

  return { ok: true };
}

export async function GET() {
  const cache = await readPortalCache();
  return NextResponse.json({
    syncStatus: cache.syncStatus,
    secretConfigured: Boolean(process.env.SYNC_SECRET),
  });
}

export async function POST(req: NextRequest) {
  const auth = isAuthorized(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: 401 });
  }

  try {
    const updated = await syncCTUData();
    return NextResponse.json({
      ok: true,
      syncStatus: updated.syncStatus,
    });
  } catch (err) {
    console.error("[api/sync] sync failed:", err);
    return NextResponse.json(
      { ok: false, error: "Sync failed. Please check server logs." },
      { status: 500 }
    );
  }
}
