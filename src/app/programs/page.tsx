import type { Metadata } from "next";
import { buildCrossCampusProgramCatalog } from "@/data/programs";
import { readPortalCache } from "@/lib/cache";
import { ProgramsClient } from "@/components/ProgramsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cross-Campus Program Matcher",
  description:
    "Match Cebu Technological University (CTU) degree programs across all 29 Main, Satellite, and Extension campuses, compare locations, and ask CTU AI.",
  alternates: { canonical: "/programs" },
};

export default async function ProgramsPage() {
  const cache = await readPortalCache();
  const programs = buildCrossCampusProgramCatalog(cache.scrapedPrograms);
  return <ProgramsClient programs={programs} />;
}
