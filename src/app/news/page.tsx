import { readPortalCache } from "@/lib/cache";
import { NewsFeedClient } from "@/components/NewsFeedClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "News & Announcements | CTU Student Portal",
  description:
    "Searchable and campus-filterable CTU announcements synced from ctu.edu.ph.",
};

export default async function NewsPage() {
  const cache = await readPortalCache();
  // eslint-disable-next-line react-hooks/purity
  const referenceNowMs = Date.now();
  return <NewsFeedClient posts={cache.posts} referenceNowMs={referenceNowMs} />;
}
