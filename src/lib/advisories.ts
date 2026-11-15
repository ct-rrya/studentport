import { getCampusBySlug } from "@/data/campuses";
import { NewsPost } from "@/types/portal";

// urgent keywords students cant afford to miss across campuses
export const URGENT_ADVISORY_KEYWORDS = [
  "suspension",
  "advisory",
  "enrollment",
  "enrolment",
  "deadline",
  "memorandum",
] as const;

// secondary notice keywords so the bridge bar still surfaces official campus updates if no suspension happened recently
const SECONDARY_NOTICE_KEYWORDS = [
  "update",
  "drill",
  "notice",
  "guideline",
  "schedule",
  "memo",
] as const;

export type AdvisorySeverity = "urgent" | "notice";

export interface UrgentAdvisory {
  post: NewsPost;
  severity: AdvisorySeverity;
  matchedKeyword: string;
  campusLabel: string;
  primaryCampusSlug?: string;
}

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

function findMatchedKeyword(
  title: string,
  keywords: readonly string[]
): string | null {
  const lower = title.toLowerCase();
  for (const kw of keywords) {
    // match whole words or prefix stems like "enroll..."
    const pattern = new RegExp(`\\b${kw}`, "i");
    if (pattern.test(lower)) return kw;
  }
  return null;
}

function buildCampusLabel(campusSlugs: string[]): {
  label: string;
  primarySlug?: string;
} {
  if (!campusSlugs || campusSlugs.length === 0) {
    return { label: "CTU Systemwide" };
  }
  const first = getCampusBySlug(campusSlugs[0]);
  if (!first) {
    return { label: "CTU Systemwide" };
  }
  if (campusSlugs.length === 1) {
    return { label: first.shortName, primarySlug: first.slug };
  }
  return {
    label: `${first.shortName} +${campusSlugs.length - 1}`,
    primarySlug: first.slug,
  };
}

// scan latest posts from the last 14 days for urgent keywords so students dont miss suspensions or deadlines
export function getUrgentAdvisories(
  posts: NewsPost[],
  referenceNowMs: number,
  windowMs: number = FOURTEEN_DAYS_MS
): UrgentAdvisory[] {
  const results: UrgentAdvisory[] = [];

  for (const post of posts) {
    const publishedMs = new Date(post.date).getTime();
    if (Number.isNaN(publishedMs)) continue;
    if (referenceNowMs - publishedMs > windowMs) continue;

    const matched = findMatchedKeyword(post.title, URGENT_ADVISORY_KEYWORDS);
    if (!matched) continue;

    const { label, primarySlug } = buildCampusLabel(post.campusSlugs);
    results.push({
      post,
      severity: "urgent",
      matchedKeyword: matched,
      campusLabel: label,
      primaryCampusSlug: primarySlug,
    });
  }

  return results.sort(
    (a, b) => new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
  );
}

// returns the top urgent advisory first, or falls back to the latest official campus notice within 14 days
export function getLatestBannerAdvisory(
  posts: NewsPost[],
  referenceNowMs: number
): UrgentAdvisory | null {
  const urgent = getUrgentAdvisories(posts, referenceNowMs);
  if (urgent.length > 0) {
    return urgent[0];
  }

  // fallback to official update/drill posts in the 14-day window so the bridge bar stays helpful year-round
  const recentPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  for (const post of recentPosts) {
    const publishedMs = new Date(post.date).getTime();
    if (Number.isNaN(publishedMs)) continue;
    if (referenceNowMs - publishedMs > FOURTEEN_DAYS_MS) continue;

    const secondaryMatch = findMatchedKeyword(
      post.title,
      SECONDARY_NOTICE_KEYWORDS
    );
    if (!secondaryMatch) continue;

    const { label, primarySlug } = buildCampusLabel(post.campusSlugs);
    return {
      post,
      severity: "notice",
      matchedKeyword: secondaryMatch,
      campusLabel: label,
      primaryCampusSlug: primarySlug,
    };
  }

  return null;
}

// shared predicate used by /news?filter=advisories so the banner link and feed stay in sync
export function isAdvisoryPost(post: NewsPost): boolean {
  const text = `${post.title} ${post.categories.join(" ")}`;
  return (
    findMatchedKeyword(text, URGENT_ADVISORY_KEYWORDS) !== null ||
    findMatchedKeyword(post.title, SECONDARY_NOTICE_KEYWORDS) !== null
  );
}
