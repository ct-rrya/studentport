import type { Metadata } from "next";
import { readPortalCache } from "@/lib/cache";
import { NewsFeedClient } from "@/components/NewsFeedClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News & Announcements",
  description:
    "Searchable and campus-filterable Cebu Technological University announcements synced from ctu.edu.ph.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, cache] = await Promise.all([searchParams, readPortalCache()]);
  // eslint-disable-next-line react-hooks/purity
  const referenceNowMs = Date.now();
  return (
    <NewsFeedClient
      posts={cache.posts}
      referenceNowMs={referenceNowMs}
      initialQuery={q ?? ""}
    />
  );
}
