import { OFFICIAL_RESOURCES } from "@/data/resources-seed";
import { readPortalCache } from "@/lib/cache";
import { ResourcesClient } from "@/components/ResourcesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student Resources & Hotlines | CTU Student Portal",
  description:
    "Official CTU portals, downloadable memoranda, and campus contact hotlines.",
};

export default async function ResourcesPage() {
  const cache = await readPortalCache();
  return (
    <ResourcesClient
      officialResources={OFFICIAL_RESOURCES}
      scrapedResources={cache.scrapedResources}
    />
  );
}
