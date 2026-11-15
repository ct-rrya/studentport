// core types for the ctu portal cache and ui

export type CampusType = "main" | "satellite" | "extension";

export interface Campus {
  slug: string;
  name: string;
  shortName: string;
  type: CampusType;
  location: string;
  address: string;
  description: string;
  keywords: string[];
  offeredPrograms: string[];
  hotline?: string;
  email?: string;
  websiteUrl: string;
  facebookUrl: string;
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  date: string;
  modifiedDate?: string;
  author: string;
  categories: string[];
  tags: string[];
  campusSlugs: string[];
  featuredImage?: string;
  originalUrl: string;
  source: "wp-rest" | "rss";
}

export interface AcademicProgram {
  id: string;
  code: string;
  name: string;
  college: string;
  level: "Undergraduate" | "Graduate" | "Diploma / Tech-Voc";
  description: string;
  campusSlugs: string[];
  sourceUrl?: string;
  fromLiveScrape?: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: "Official Portal" | "Downloadable Form / Memo" | "Campus Hotline";
  url?: string;
  description: string;
  campusSlugs: string[];
  date?: string;
  phone?: string;
}

export interface SyncStatus {
  lastSyncedAt: string | null;
  sourceUsed: "wp-rest" | "rss" | "none";
  postCount: number;
  programCount: number;
  resourceCount: number;
  status: "ok" | "error" | "never";
  errorMessage?: string;
}

export interface PortalCache {
  syncStatus: SyncStatus;
  posts: NewsPost[];
  scrapedPrograms: AcademicProgram[];
  scrapedResources: ResourceItem[];
}
