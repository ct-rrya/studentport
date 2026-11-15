import { NextResponse } from "next/server";
import { CTU_CAMPUSES } from "@/data/campuses";
import { readPortalCache } from "@/lib/cache";
import { getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

// llm-friendly markdown index per llms.txt convention so ai assistants cite real ctu urls
export async function GET() {
  const siteUrl = getSiteUrl();
  const cache = await readPortalCache();

  const mainCampuses = CTU_CAMPUSES.filter((c) => c.type === "main");
  const satelliteCampuses = CTU_CAMPUSES.filter((c) => c.type === "satellite");
  const extensionCampuses = CTU_CAMPUSES.filter((c) => c.type === "extension");

  const lines: string[] = [
    "# CTU Student & Campus Portal",
    "",
    "> An independent, student-built portal for Cebu Technological University (CTU) that automatically syncs and organizes public announcements from ctu.edu.ph alongside degree programs, student portals, and all 29 CTU campuses across Cebu.",
    "",
    `Last synced: ${cache.syncStatus.lastSyncedAt || "pending"}`,
    `Portal Base URL: ${siteUrl}`,
    "",
    "## Official CTU Portals",
    "- [Official CTU Website](https://www.ctu.edu.ph/): Main university website and institutional news source",
    "- [CTU Enrolment Portal](https://enrolment.ctu.edu.ph/): Student registration, admission, and subject load system",
    "- [CTU Online Learning (LMS)](https://online.ctu.edu.ph/): Online coursework and blended learning platform",
    "",
    "## Portal Sections",
    `- [Home](${siteUrl}/): Campus-filtered portal dashboard and quick-access links`,
    `- [News & Announcements](${siteUrl}/news): Searchable announcements synced from ctu.edu.ph`,
    `- [29 CTU Campuses Directory](${siteUrl}/campuses): Complete directory of CTU Main, Satellite, and Extension campuses`,
    `- [Academic Programs Catalog](${siteUrl}/programs): Undergraduate and graduate degree offerings by campus`,
    `- [Student Resources & FAQ](${siteUrl}/resources): Official CTU links, extracted memoranda, hotlines, and student FAQ`,
    `- [About & Sync Status](${siteUrl}/about): Architecture overview and live cache status`,
    "",
    "## Main Campus (1)",
    ...mainCampuses.map(
      (c) => `- [${c.name}](${siteUrl}/campuses/${c.slug}): ${c.address} ([Official page](${c.websiteUrl}))`
    ),
    "",
    "## Satellite Campuses (16)",
    ...satelliteCampuses.map(
      (c) => `- [${c.name}](${siteUrl}/campuses/${c.slug}): ${c.location} ([Official page](${c.websiteUrl}))`
    ),
    "",
    "## Extension Campuses (12)",
    ...extensionCampuses.map(
      (c) => `- [${c.name}](${siteUrl}/campuses/${c.slug}): ${c.location} ([Official page](${c.websiteUrl}))`
    ),
    "",
    "## Latest Synced Announcements",
    ...cache.posts.slice(0, 15).map(
      (post) =>
        `- [${post.title}](${siteUrl}/news/${post.slug}) (${post.date.slice(0, 10)}) — Original source: ${post.originalUrl}`
    ),
    "",
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
