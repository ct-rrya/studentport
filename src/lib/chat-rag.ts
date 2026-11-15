import {
  CTU_CAMPUSES,
  getCampusBySlug,
  getCampusFacebookUrl,
  matchCampusesInText,
} from "@/data/campuses";
import { BASELINE_PROGRAMS } from "@/data/programs-seed";
import { OFFICIAL_RESOURCES } from "@/data/resources-seed";
import { stripHtmlToText } from "@/lib/sanitize";
import { NewsPost, PortalCache } from "@/types/portal";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "are",
  "you",
  "can",
  "how",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "does",
  "did",
  "with",
  "from",
  "this",
  "that",
  "have",
  "has",
  "about",
  "into",
  "your",
  "ctu",
  "cebu",
  "campus",
  "campuses",
  "latest",
  "update",
  "updates",
  "news",
  "list",
  "all",
  "tell",
  "give",
]);

function extractSearchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
}

// grab top relevant posts form cache so gemini doesnt hallucinate
export function retrieveRelevantPosts(
  posts: NewsPost[],
  query: string,
  selectedCampus: string,
  limit = 7
): NewsPost[] {
  if (posts.length === 0) return [];

  const terms = extractSearchTerms(query);
  const queryCampuses = matchCampusesInText(query);

  const scored = posts.map((post, idx) => {
    let score = 0;

    // prioritize the active campus selected in the navbar
    if (selectedCampus !== "all" && post.campusSlugs.includes(selectedCampus)) {
      score += 8;
    }

    // also boost if user named a specific campus right inside their message
    for (const cSlug of queryCampuses) {
      if (post.campusSlugs.includes(cSlug)) {
        score += 7;
      }
    }

    const titleLower = post.title.toLowerCase();
    const catsLower = `${post.categories.join(" ")} ${post.tags.join(" ")}`.toLowerCase();
    const bodyLower = stripHtmlToText(post.contentHtml || post.excerpt, 1500).toLowerCase();

    for (const term of terms) {
      if (titleLower.includes(term)) score += 4;
      if (catsLower.includes(term)) score += 3;
      if (bodyLower.includes(term)) score += 1.5;
    }

    // tiny recency tie-breaker (posts array is already newest-first)
    score += Math.max(0, 0.5 - idx * 0.015);

    return { post, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((item) => item.post);
}

// formats grounded context string from cache + 29-campus directory + programs
export function buildPortalGroundingContext(
  cache: PortalCache,
  query: string,
  selectedCampus: string
): { contextText: string; matchedPosts: NewsPost[] } {
  const matchedPosts = retrieveRelevantPosts(cache.posts, query, selectedCampus, 7);
  const activeCampus =
    selectedCampus !== "all" ? getCampusBySlug(selectedCampus) : undefined;

  const mainList = CTU_CAMPUSES.filter((c) => c.type === "main");
  const satList = CTU_CAMPUSES.filter((c) => c.type === "satellite");
  const extList = CTU_CAMPUSES.filter((c) => c.type === "extension");

  const formatCampusLine = (c: (typeof CTU_CAMPUSES)[number]) =>
    `- ${c.name} (${c.location}) | Address: ${c.address} | Programs: ${c.offeredPrograms.join(", ")}${c.hotline ? ` | Hotline: ${c.hotline}` : ""} | Web: ${c.websiteUrl || `https://www.ctu.edu.ph/${c.slug}/`} | FB: ${getCampusFacebookUrl(c)}`;

  const allPrograms = [...BASELINE_PROGRAMS, ...cache.scrapedPrograms];
  const programLines = allPrograms.map(
    (p) =>
      `- ${p.code}: ${p.name} (${p.level}, ${p.college}) — Campuses: ${p.campusSlugs.join(", ")}`
  );

  const portalLines = OFFICIAL_RESOURCES.map((r) =>
    r.url
      ? `- ${r.title}: ${r.url} (${r.description})`
      : `- ${r.title}: ${r.phone || ""} (${r.description})`
  );

  const memoLines =
    cache.scrapedResources.length > 0
      ? cache.scrapedResources.slice(0, 10).map(
          (m) => `- ${m.title}: ${m.url} (${m.description})`
        )
      : ["- None extracted from the latest 30 posts."];

  const postLines =
    matchedPosts.length > 0
      ? matchedPosts.map((p, idx) => {
          const snippet = stripHtmlToText(p.contentHtml || p.excerpt, 650);
          const campusText =
            p.campusSlugs.length > 0 ? p.campusSlugs.join(", ") : "University-wide";
          return [
            `[Article ${idx + 1}]`,
            `Title: ${p.title}`,
            `Date: ${p.date}`,
            `Campuses: ${campusText}`,
            `Categories: ${p.categories.join(", ")}`,
            `Portal Link: /news/${p.slug}`,
            `Original ctu.edu.ph Link: ${p.originalUrl}`,
            `Summary: ${snippet}`,
          ].join("\n");
        })
      : ["No synced announcements available in cache yet."];

  const contextText = [
    `CACHE SYNC STATUS: Last synced at ${cache.syncStatus.lastSyncedAt ?? "never"} (${cache.syncStatus.postCount} total cached posts).`,
    activeCampus
      ? `ACTIVE USER CAMPUS FILTER: ${activeCampus.name} (${activeCampus.type}, ${activeCampus.address})`
      : `ACTIVE USER CAMPUS FILTER: All 29 Campuses (University-wide)`,
    "",
    "OFFICIAL CTU PORTALS & HOTLINES:",
    ...portalLines,
    "",
    "SCRAPED MEMOS / ATTACHMENTS:",
    ...memoLines,
    "",
    "COMPLETE 29 CTU CAMPUSES DIRECTORY:",
    "Main Campus (1):",
    ...mainList.map(formatCampusLine),
    "Satellite Campuses (16):",
    ...satList.map(formatCampusLine),
    "Extension Campuses (12):",
    ...extList.map(formatCampusLine),
    "",
    "ACADEMIC PROGRAMS CATALOG:",
    ...programLines,
    "",
    "TOP RELEVANT SYNCED ANNOUNCEMENTS FROM CTU.EDU.PH:",
    ...postLines,
  ].join("\n");

  return { contextText, matchedPosts };
}
