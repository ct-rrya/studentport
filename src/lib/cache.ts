import { promises as fs } from "fs";
import path from "path";
import { PortalCache } from "@/types/portal";

const CACHE_DIR = path.join(process.cwd(), "data");
const CACHE_FILE = path.join(CACHE_DIR, "cache.json");

const EMPTY_CACHE: PortalCache = {
  syncStatus: {
    lastSyncedAt: null,
    sourceUsed: "none",
    postCount: 0,
    programCount: 0,
    resourceCount: 0,
    status: "never",
  },
  posts: [],
  scrapedPrograms: [],
  scrapedResources: [],
};

// optional supabase env vars — falls back to local data/cache.json when unset
function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

async function readFromSupabase(): Promise<PortalCache | null> {
  const sb = getSupabaseConfig();
  if (!sb) return null;

  try {
    const res = await fetch(
      `${sb.url}/rest/v1/ctu_portal_cache?id=eq.singleton&select=payload`,
      {
        headers: {
          apikey: sb.key,
          Authorization: `Bearer ${sb.key}`,
        },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ payload?: PortalCache }>;
    if (rows?.[0]?.payload) {
      return rows[0].payload;
    }
  } catch {
    // silently fall back to local json file if supabase isnt reachable
  }
  return null;
}

async function writeToSupabase(cache: PortalCache): Promise<void> {
  const sb = getSupabaseConfig();
  if (!sb) return;

  try {
    await fetch(`${sb.url}/rest/v1/ctu_portal_cache`, {
      method: "POST",
      headers: {
        apikey: sb.key,
        Authorization: `Bearer ${sb.key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        id: "singleton",
        payload: cache,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.warn("[cache] failed to push cache to supabase, local json still saved:", err);
  }
}

// reads cached portal data from supabase (if configured) or local data/cache.json
export async function readPortalCache(): Promise<PortalCache> {
  const remote = await readFromSupabase();
  if (remote) return remote;

  try {
    const raw = await fs.readFile(CACHE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as PortalCache;
    return {
      ...EMPTY_CACHE,
      ...parsed,
      syncStatus: {
        ...EMPTY_CACHE.syncStatus,
        ...(parsed.syncStatus ?? {}),
      },
    };
  } catch {
    return EMPTY_CACHE;
  }
}

// writes updated portal data to local json cache (and supabase if env vars exist)
export async function writePortalCache(cache: PortalCache): Promise<void> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  await writeToSupabase(cache);
}
