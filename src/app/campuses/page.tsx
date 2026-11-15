import { readPortalCache } from "@/lib/cache";
import { CampusesDirectoryClient } from "@/components/CampusesDirectoryClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Campuses Directory (29 Campuses) | CTU Student Portal",
  description:
    "Directory of CTU Main Campus, 16 Satellite Campuses, and 12 Extension Campuses across Cebu.",
};

export default async function CampusesPage() {
  const cache = await readPortalCache();
  return <CampusesDirectoryClient posts={cache.posts} />;
}
