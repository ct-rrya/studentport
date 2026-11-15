import { AcademicProgram } from "@/types/portal";
import { CTU_CAMPUSES } from "./campuses";
import { BASELINE_PROGRAMS } from "./programs-seed";

export const PROGRAM_CATEGORY_FILTERS = [
  "All",
  "Technology",
  "Education",
  "Hospitality",
  "Engineering",
  "Agriculture",
  "Business",
] as const;

export type ProgramCategoryFilter = (typeof PROGRAM_CATEGORY_FILTERS)[number];
export type ProgramCategory = Exclude<ProgramCategoryFilter, "All">;

export interface ProgramMatchRecord extends AcademicProgram {
  category: ProgramCategory;
}

const CODE_CATEGORY_MAP: Record<string, ProgramCategory> = {
  BSIT: "Technology",
  BIT: "Technology",
  MIT: "Technology",
  "PHD-TM": "Technology",
  BSHM: "Hospitality",
  BSTM: "Hospitality",
  BEED: "Education",
  BSED: "Education",
  BSCE: "Engineering",
  BSME: "Engineering",
  BSEE: "Engineering",
  BSIE: "Engineering",
  BSA: "Agriculture",
  BSFI: "Agriculture",
  BSF: "Agriculture",
  "DAT-BAT": "Agriculture",
  BSBA: "Business",
};

// infer category cleanly for any scraped wp program that isnt in our hardcoded map
export function inferProgramCategory(prog: AcademicProgram): ProgramCategory {
  const byCode = CODE_CATEGORY_MAP[prog.code.trim().toUpperCase()];
  if (byCode) return byCode;

  const text = `${prog.code} ${prog.name} ${prog.college}`.toLowerCase();
  if (/(educat|teach|beed|bsed)/.test(text)) return "Education";
  if (/(hospitality|tourism|culinary|hotel|bshm|bstm)/.test(text)) return "Hospitality";
  if (/(civil|mechanical|electrical|industrial engineering|engineering)/.test(text)) {
    return "Engineering";
  }
  if (/(agricult|fisher|forest|marine|aquaculture)/.test(text)) return "Agriculture";
  if (/(business|management|entrep|account|finance)/.test(text)) return "Business";
  return "Technology";
}

// map programs across campuses to break info silos using campuses.ts as source of truth
const EXTRA_SEED_PROGRAMS: AcademicProgram[] = [
  {
    id: "prog-dat-bat",
    code: "DAT-BAT",
    name: "Diploma in Agricultural Technology – Bachelor of Agricultural Technology",
    college: "College of Agriculture, Forestry, and Environment",
    level: "Diploma / Tech-Voc",
    description:
      "Ladderized applied agriculture degree combining farm mechanization, agribusiness operations, and sustainable livestock management.",
    campusSlugs: CTU_CAMPUSES.filter((c) => c.offeredPrograms.includes("DAT-BAT")).map(
      (c) => c.slug
    ),
    sourceUrl: "https://www.ctu.edu.ph/barili/",
  },
];

export const CTU_PROGRAM_MAPPINGS: ProgramMatchRecord[] = [
  ...BASELINE_PROGRAMS,
  ...EXTRA_SEED_PROGRAMS,
].map((prog) => ({
  ...prog,
  category: inferProgramCategory(prog),
}));

// merge baseline mapped programs with live scraped programs without duplicate codes
export function buildCrossCampusProgramCatalog(
  scrapedPrograms: AcademicProgram[]
): ProgramMatchRecord[] {
  const byCode = new Map<string, ProgramMatchRecord>();

  for (const base of CTU_PROGRAM_MAPPINGS) {
    byCode.set(base.code.trim().toUpperCase(), {
      ...base,
      campusSlugs: [...base.campusSlugs],
    });
  }

  for (const scraped of scrapedPrograms) {
    const key = scraped.code.trim().toUpperCase();
    const existing = byCode.get(key);
    if (existing) {
      const mergedCampuses = Array.from(
        new Set([...existing.campusSlugs, ...scraped.campusSlugs])
      );
      byCode.set(key, {
        ...existing,
        campusSlugs: mergedCampuses,
      });
    } else {
      byCode.set(key, {
        ...scraped,
        category: inferProgramCategory(scraped),
      });
    }
  }

  return Array.from(byCode.values());
}
