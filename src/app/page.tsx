import { readPortalCache } from "@/lib/cache";
import { HomeClient } from "@/components/HomeClient";

// force dynamic so newly synced data/cache.json shows up without rebuilding
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cache = await readPortalCache();
  return <HomeClient posts={cache.posts} />;
}
