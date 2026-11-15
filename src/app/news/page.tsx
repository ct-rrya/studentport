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
  searchParams: Promise<{ q?: string; filter?: string }>;
}) {
  const [{ q, filter }, cache] = await Promise.all([searchParams, readPortalCache()]);
  // eslint-disable-next-line react-hooks/purity
  const referenceNowMs = Date.now();
  const initialAdvisoriesOnly = filter === "advisories";
  return (
    <NewsFeedClient
      key={`${q ?? ""}:${filter ?? ""}`}
      posts={cache.posts}
      referenceNowMs={referenceNowMs}
      initialQuery={q ?? ""}
      initialAdvisoriesOnly={initialAdvisoriesOnly}
    />
  );
}
