import { BASELINE_PROGRAMS } from "@/data/programs-seed";
import { readPortalCache } from "@/lib/cache";
import { ProgramsClient } from "@/components/ProgramsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Academic Programs | CTU Student Portal",
  description:
    "Searchable catalog of CTU degree programs across all 29 campuses.",
};

export default async function ProgramsPage() {
  const cache = await readPortalCache();
  const merged = [...BASELINE_PROGRAMS, ...cache.scrapedPrograms];
  return <ProgramsClient programs={merged} />;
}
