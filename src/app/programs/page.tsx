import type { Metadata } from "next";
import { BASELINE_PROGRAMS } from "@/data/programs-seed";
import { readPortalCache } from "@/lib/cache";
import { ProgramsClient } from "@/components/ProgramsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Academic Programs",
  description:
    "Searchable catalog of Cebu Technological University (CTU) undergraduate and graduate degree programs across all 29 campuses.",
  alternates: { canonical: "/programs" },
};

export default async function ProgramsPage() {
  const cache = await readPortalCache();
  const merged = [...BASELINE_PROGRAMS, ...cache.scrapedPrograms];
  return <ProgramsClient programs={merged} />;
}
