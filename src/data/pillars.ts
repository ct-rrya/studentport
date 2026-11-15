export interface PillarItem {
  number: number;
  title: string;
  tagline: string;
  description: string;
  accent: "crimson" | "gold" | "navy";
  iconKey:
    | "layers"
    | "refresh"
    | "compass"
    | "smartphone"
    | "wrench"
    | "sparkles"
    | "graduation";
}

// 7u stands for our 7 core pillars bridging ctu campuses for the hackathon
export const SEVEN_PILLARS: PillarItem[] = [
  {
    number: 1,
    title: "Unified",
    tagline: "One central hub for all 29 CTU campuses",
    description:
      "Breaks campus silos by bringing CTU's 29 campuses (1 Main, 16 Satellite, 12 Extension) into one central hub.",
    accent: "crimson",
    iconKey: "layers",
  },
  {
    number: 2,
    title: "Updated",
    tagline: "Live sync directly from ctu.edu.ph",
    description:
      "Automatically syncs announcements and urgent advisories straight from ctu.edu.ph without manual encoding.",
    accent: "gold",
    iconKey: "refresh",
  },
  {
    number: 3,
    title: "University-Wide",
    tagline: "Connecting North to South Cebu",
    description:
      "Bridges north-to-south Cebu, connecting students from Daanbantayan and Bantayan down to Argao, Moalboal, and Oslob.",
    accent: "navy",
    iconKey: "compass",
  },
  {
    number: 4,
    title: "User-Centered",
    tagline: "Built fast and mobile-first for students",
    description:
      "Strips away slow, cluttered WordPress pages into a fast, mobile-first experience built around what students actually need.",
    accent: "crimson",
    iconKey: "smartphone",
  },
  {
    number: 5,
    title: "Utility-Driven",
    tagline: "One-click access to daily student systems",
    description:
      "Centralizes essential academic tools in one click: Enrollment (enrolment.ctu.edu.ph), LMS (online.ctu.edu.ph), programs, and official FB feeds.",
    accent: "gold",
    iconKey: "wrench",
  },
  {
    number: 6,
    title: "Understandable",
    tagline: "Clear, cited answers from 7U AI Assistant",
    description:
      "Turns dense institutional memos into clear, cited answers through our Gemini AI Student Assistant and structured search.",
    accent: "navy",
    iconKey: "sparkles",
  },
  {
    number: 7,
    title: "Uplifting",
    tagline: "Equal academic access for every Technologist",
    description:
      "Empowers every Technologist with equal, friction-free access to campus opportunities, scholarships, and academic resources.",
    accent: "crimson",
    iconKey: "graduation",
  },
];
