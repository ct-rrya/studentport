import { NextRequest, NextResponse } from "next/server";
import { readPortalCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

// frontend only reads from our local/supabase cache — never hits ctu.edu.ph directly
export async function GET(req: NextRequest) {
  const cache = await readPortalCache();
  const campus = req.nextUrl.searchParams.get("campus") || "all";
  const category = req.nextUrl.searchParams.get("category") || "all";
  const query = (req.nextUrl.searchParams.get("q") || "").trim().toLowerCase();

  const filtered = cache.posts.filter((post) => {
    if (campus !== "all" && !post.campusSlugs.includes(campus)) {
      return false;
    }
    if (
      category !== "all" &&
      !post.categories.some((c) => c.toLowerCase() === category.toLowerCase())
    ) {
      return false;
    }
    if (query) {
      const haystack = `${post.title} ${post.excerpt} ${post.categories.join(" ")} ${post.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  return NextResponse.json({
    syncStatus: cache.syncStatus,
    total: filtered.length,
    posts: filtered,
  });
}
