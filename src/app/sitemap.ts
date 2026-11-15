import type { MetadataRoute } from "next";
import { CTU_CAMPUSES } from "@/data/campuses";
import { readPortalCache } from "@/lib/cache";
import { getSiteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const cache = await readPortalCache();
  const lastSyncDate = cache.syncStatus.lastSyncedAt
    ? new Date(cache.syncStatus.lastSyncedAt)
    : new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: lastSyncDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/news`,
      lastModified: lastSyncDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/campuses`,
      lastModified: lastSyncDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/programs`,
      lastModified: lastSyncDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/resources`,
      lastModified: lastSyncDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: lastSyncDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // include all 29 ctu campus pages
  const campusRoutes: MetadataRoute.Sitemap = CTU_CAMPUSES.map((campus) => ({
    url: `${siteUrl}/campuses/${campus.slug}`,
    lastModified: lastSyncDate,
    changeFrequency: "weekly",
    priority: campus.type === "main" ? 0.9 : 0.8,
  }));

  // pull cached news articles with actual publish timestamps
  const newsRoutes: MetadataRoute.Sitemap = cache.posts.map((post) => {
    const parsed = new Date(post.date);
    return {
      url: `${siteUrl}/news/${post.slug}`,
      lastModified: Number.isNaN(parsed.getTime()) ? lastSyncDate : parsed,
      changeFrequency: "weekly",
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...campusRoutes, ...newsRoutes];
}
