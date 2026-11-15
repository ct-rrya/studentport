import type { Metadata } from "next";
import { readPortalCache } from "@/lib/cache";
import { CampusesDirectoryClient } from "@/components/CampusesDirectoryClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Campuses Directory (29 Campuses)",
  description:
    "Directory of Cebu Technological University (CTU) Main Campus, 16 Satellite Campuses, and 12 Extension Campuses across Cebu.",
  alternates: { canonical: "/campuses" },
};

export default async function CampusesPage() {
  const cache = await readPortalCache();
  return <CampusesDirectoryClient posts={cache.posts} />;
}
