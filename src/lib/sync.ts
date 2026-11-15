import https from "node:https";
import * as cheerio from "cheerio";
import Parser from "rss-parser";
import { matchCampusesInText } from "@/data/campuses";
import { BASELINE_PROGRAMS } from "@/data/programs-seed";
import { writePortalCache, readPortalCache } from "@/lib/cache";
import {
  decodeHtmlEntities,
  sanitizeCtuHtml,
  stripHtmlToText,
} from "@/lib/sanitize";
import {
  AcademicProgram,
  NewsPost,
  PortalCache,
  ResourceItem,
} from "@/types/portal";

const WP_POSTS_URL =
  "https://www.ctu.edu.ph/wp-json/wp/v2/posts?_embed&per_page=30";
const WP_PAGES_URL =
  "https://www.ctu.edu.ph/wp-json/wp/v2/pages?per_page=30";
const RSS_FEED_URL = "https://www.ctu.edu.ph/feed/";

const USER_AGENT =
  "CTU-Student-Portal-Sync/1.0 (+https://www.ctu.edu.ph/; student-aggregator)";

interface WpTerm {
  name?: string;
  taxonomy?: string;
}

interface WpPost {
  id: number;
  slug: string;
  date: string;
  modified?: string;
  link: string;
  jetpack_featured_media_url?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  _embedded?: {
    author?: Array<{ name?: string }>;
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: {
        sizes?: {
          medium_large?: { source_url?: string };
          large?: { source_url?: string };
          full?: { source_url?: string };
        };
      };
    }>;
    "wp:term"?: WpTerm[][];
  };
}

interface WpPage {
  id: number;
  slug: string;
  link: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function extractFirstImageFromHtml(html: string): string | undefined {
  if (!html) return undefined;
  const $ = cheerio.load(html);
  const src = $("img").first().attr("src");
  if (!src) return undefined;
  if (src.startsWith("/")) return `https://www.ctu.edu.ph${src}`;
  return src;
}

// scans post html for downloadable pdf/doc/xls memo links so /resources stays fresh
function extractResourceLinks(posts: NewsPost[]): ResourceItem[] {
  const seenUrls = new Set<string>();
  const items: ResourceItem[] = [];

  for (const post of posts) {
    if (!post.contentHtml) continue;
    const $ = cheerio.load(post.contentHtml);
    $("a[href]").each((_, el) => {
      const href = ($(el).attr("href") || "").trim();
      if (!href) return;
      const isDoc = /\.(pdf|docx?|xlsx?|pptx?|zip)(\?.*)?$/i.test(href);
      const looksLikeMemo = /memo|memorandum|calendar|form|guidelines|admission|enroll|scholarship/i.test(
        `${href} ${$(el).text()}`
      );
      if (!isDoc && !looksLikeMemo) return;
      if (seenUrls.has(href)) return;
      seenUrls.add(href);

      const linkText = $(el).text().replace(/\s+/g, " ").trim();
      const title =
        linkText && linkText.length > 4
          ? linkText
          : `Attachment from: ${post.title}`;

      items.push({
        id: `res-${slugify(title)}-${items.length}`,
        title,
        category: "Downloadable Form / Memo",
        url: href,
        description: `Linked in "${post.title}"`,
        campusSlugs: post.campusSlugs,
        date: post.date,
      });
    });
  }

  return items.slice(0, 30);
}

// best-effort extraction of academic programs from wp pages (with fallback to baseline catalog)
function extractProgramsFromPages(pages: WpPage[]): AcademicProgram[] {
  const found: AcademicProgram[] = [];
  const seenCodes = new Set(BASELINE_PROGRAMS.map((p) => p.code.toUpperCase()));

  const degreeRegex =
    /\b(Bachelor of [A-Za-z\s,&-]+|Master (?:of|in) [A-Za-z\s,&-]+|Doctor of [A-Za-z\s,&-]+)\b(?:\s*\(([A-Z0-9-]{2,12})\))?/g;

  for (const page of pages) {
    const title = decodeHtmlEntities(page.title?.rendered ?? "");
    const rawHtml = page.content?.rendered ?? "";
    const text = stripHtmlToText(rawHtml, 12000);
    const combined = `${title} ${text}`;

    // only bother scanning pages that look academic-related
    if (!/program|curriculum|degree|college|academic|course|bachelor|master/i.test(combined)) {
      continue;
    }

    const pageCampuses = matchCampusesInText(combined);
    let match: RegExpExecArray | null;
    degreeRegex.lastIndex = 0;

    while ((match = degreeRegex.exec(text)) !== null) {
      const fullName = match[1].trim().replace(/\s+/g, " ");
      if (fullName.length < 15 || fullName.length > 90) continue;

      const explicitCode = match[2]?.trim().toUpperCase();
      const derivedCode =
        explicitCode ||
        fullName
          .split(/\s+/)
          .filter((w) => !["of", "in", "and", "the"].includes(w.toLowerCase()))
          .map((w) => w[0]?.toUpperCase() || "")
          .join("")
          .slice(0, 8);

      if (!derivedCode || seenCodes.has(derivedCode)) continue;
      seenCodes.add(derivedCode);

      const level: AcademicProgram["level"] = /^Master|^Doctor/i.test(fullName)
        ? "Graduate"
        : "Undergraduate";

      found.push({
        id: `prog-scraped-${slugify(derivedCode)}`,
        code: derivedCode,
        name: fullName,
        college: title || "CTU Academic Offerings",
        level,
        description: `Program mentioned on ${title || "ctu.edu.ph"}. Verify specific campus availability with the Campus Registrar.`,
        campusSlugs: pageCampuses.length > 0 ? pageCampuses : ["main"],
        sourceUrl: page.link,
        fromLiveScrape: true,
      });
    }
  }

  return found;
}

function requestHttpsText(
  url: string,
  rejectUnauthorized: boolean,
  timeoutMs = 20000,
  redirectsLeft = 3
): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json, application/rss+xml, application/xml, text/xml",
        },
        agent: new https.Agent({ rejectUnauthorized }),
        timeout: timeoutMs,
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400 && res.headers.location && redirectsLeft > 0) {
          const nextUrl = new URL(res.headers.location, url).toString();
          res.resume();
          requestHttpsText(nextUrl, rejectUnauthorized, timeoutMs, redirectsLeft - 1)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (status < 200 || status >= 300) {
          res.resume();
          reject(new Error(`HTTP ${status} from ${url}`));
          return;
        }

        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        res.on("error", reject);
      }
    );

    req.on("timeout", () => {
      req.destroy(new Error(`Request timed out after ${timeoutMs}ms: ${url}`));
    });
    req.on("error", reject);
  });
}

// ctu.edu.ph's apache server omits the intermediate tls chain cert so strict node openssl fails
// try strict tls first, then retry just for ctu.edu.ph if it hits UNABLE_TO_VERIFY_LEAF_SIGNATURE
async function fetchCtuText(url: string, timeoutMs = 20000): Promise<string> {
  try {
    return await requestHttpsText(url, true, timeoutMs);
  } catch (err) {
    const code = (err as { code?: string })?.code;
    const isCtuHost = new URL(url).hostname.endsWith("ctu.edu.ph");
    if (isCtuHost && code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
      return await requestHttpsText(url, false, timeoutMs);
    }
    throw err;
  }
}

async function fetchJsonWithTimeout<T>(url: string, timeoutMs = 20000): Promise<T> {
  const raw = await fetchCtuText(url, timeoutMs);
  return JSON.parse(raw) as T;
}

// fetch posts form wp api first before falling back to rss feed
async function fetchFromWpRest(): Promise<NewsPost[]> {
  const wpPosts = await fetchJsonWithTimeout<WpPost[]>(WP_POSTS_URL, 25000);
  if (!Array.isArray(wpPosts) || wpPosts.length === 0) {
    throw new Error("WP REST API returned empty post list");
  }

  return wpPosts.map((p) => {
    const title = decodeHtmlEntities(p.title?.rendered || "Untitled CTU Post");
    const rawContent = p.content?.rendered || p.excerpt?.rendered || "";
    const contentHtml = sanitizeCtuHtml(rawContent);
    const excerpt =
      stripHtmlToText(p.excerpt?.rendered || rawContent, 210) ||
      "Read the full announcement for details.";

    const terms = (p._embedded?.["wp:term"] ?? []).flat();
    const categories = terms
      .filter((t) => t.taxonomy === "category" && t.name)
      .map((t) => decodeHtmlEntities(t.name!));
    const tags = terms
      .filter((t) => t.taxonomy === "post_tag" && t.name)
      .map((t) => decodeHtmlEntities(t.name!));

    const media = p._embedded?.["wp:featuredmedia"]?.[0];
    const featuredImage =
      media?.media_details?.sizes?.medium_large?.source_url ||
      media?.media_details?.sizes?.large?.source_url ||
      media?.source_url ||
      p.jetpack_featured_media_url ||
      extractFirstImageFromHtml(contentHtml);

    const author =
      decodeHtmlEntities(p._embedded?.author?.[0]?.name || "") ||
      "CTU Public Information";

    // combine title, cats, tags, and plain body text to auto-detect campus mentions
    const matchText = [
      title,
      categories.join(" "),
      tags.join(" "),
      stripHtmlToText(rawContent, 6000),
    ].join(" ");
    const campusSlugs = matchCampusesInText(matchText);

    return {
      id: String(p.id),
      slug: p.slug || slugify(title) || String(p.id),
      title,
      excerpt,
      contentHtml,
      date: p.date,
      modifiedDate: p.modified,
      author,
      categories: categories.length > 0 ? categories : ["Announcements"],
      tags,
      campusSlugs,
      featuredImage,
      originalUrl: p.link,
      source: "wp-rest" as const,
    };
  });
}

async function fetchFromRssFallback(): Promise<NewsPost[]> {
  const parser = new Parser({
    customFields: {
      item: [
        ["content:encoded", "contentEncoded"],
        ["dc:creator", "creator"],
      ],
    },
  });

  const xml = await fetchCtuText(RSS_FEED_URL, 25000);
  const feed = await parser.parseString(xml);
  const items = feed.items ?? [];
  if (items.length === 0) {
    throw new Error("RSS feed returned 0 items");
  }

  return items.slice(0, 30).map((item, idx) => {
    const title = decodeHtmlEntities(item.title || "Untitled CTU Announcement");
    const rawHtml =
      (item as unknown as { contentEncoded?: string }).contentEncoded ||
      item.content ||
      item.contentSnippet ||
      "";
    const contentHtml = sanitizeCtuHtml(rawHtml);
    const excerpt =
      stripHtmlToText(rawHtml || item.contentSnippet || "", 210) ||
      "Read the full announcement on ctu.edu.ph.";

    const categories = (item.categories ?? []).map((c) =>
      decodeHtmlEntities(String(c))
    );
    const link = item.link || "https://www.ctu.edu.ph/";
    const urlSlug = link.split("/").filter(Boolean).pop() || slugify(title);
    const campusSlugs = matchCampusesInText(
      `${title} ${categories.join(" ")} ${stripHtmlToText(rawHtml, 6000)}`
    );

    return {
      id: item.guid || `rss-${idx}-${urlSlug}`,
      slug: urlSlug || `post-${idx}`,
      title,
      excerpt,
      contentHtml,
      date: item.isoDate || item.pubDate || new Date().toISOString(),
      author:
        (item as unknown as { creator?: string }).creator ||
        item.creator ||
        "CTU Public Information",
      categories: categories.length > 0 ? categories : ["Announcements"],
      tags: [],
      campusSlugs,
      featuredImage: extractFirstImageFromHtml(contentHtml),
      originalUrl: link,
      source: "rss" as const,
    };
  });
}

// main sync entry used by both scripts/sync-ctu.ts and /api/sync
export async function syncCTUData(): Promise<PortalCache> {
  let posts: NewsPost[] = [];
  let sourceUsed: "wp-rest" | "rss" = "wp-rest";

  try {
    posts = await fetchFromWpRest();
    sourceUsed = "wp-rest";
  } catch (wpErr) {
    console.warn("[sync] wp rest failed, falling back to rss feed:", wpErr);
    try {
      posts = await fetchFromRssFallback();
      sourceUsed = "rss";
    } catch (rssErr) {
      // keep previous posts if both endpoints fail temporarily
      const existing = await readPortalCache();
      const errMsg =
        rssErr instanceof Error ? rssErr.message : "Both WP REST and RSS failed";
      const failedCache: PortalCache = {
        ...existing,
        syncStatus: {
          ...existing.syncStatus,
          status: "error",
          errorMessage: errMsg,
        },
      };
      await writePortalCache(failedCache);
      throw new Error(errMsg);
    }
  }

  // best-effort scrape of wp pages for academic programs
  let scrapedPrograms: AcademicProgram[] = [];
  try {
    const pages = await fetchJsonWithTimeout<WpPage[]>(WP_PAGES_URL, 20000);
    if (Array.isArray(pages)) {
      scrapedPrograms = extractProgramsFromPages(pages);
    }
  } catch (pageErr) {
    console.warn("[sync] skipping wp pages scrape (non-fatal):", pageErr);
  }

  const scrapedResources = extractResourceLinks(posts);

  const nextCache: PortalCache = {
    syncStatus: {
      lastSyncedAt: new Date().toISOString(),
      sourceUsed,
      postCount: posts.length,
      programCount: BASELINE_PROGRAMS.length + scrapedPrograms.length,
      resourceCount: scrapedResources.length,
      status: "ok",
    },
    posts,
    scrapedPrograms,
    scrapedResources,
  };

  await writePortalCache(nextCache);
  return nextCache;
}
