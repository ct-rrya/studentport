"use client";

import React, { useMemo, useState } from "react";
import { Calendar, Filter, Search, Tag, X } from "lucide-react";
import { CTU_CAMPUSES, getCampusBySlug } from "@/data/campuses";
import { useCampus } from "@/context/CampusContext";
import { NewsPost } from "@/types/portal";
import { NewsCard } from "./NewsCard";

export function NewsFeedClient({
  posts,
  referenceNowMs,
}: {
  posts: NewsPost[];
  referenceNowMs: number;
}) {
  const { selectedCampus, setSelectedCampus } = useCampus();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState<"all" | "7d" | "30d" | "90d">("all");

  // gather unique categories & tags from cached posts for filter dropdown
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const cat of post.categories) {
        counts.set(cat, (counts.get(cat) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const dayMs = 24 * 60 * 60 * 1000;

    return posts.filter((post) => {
      if (selectedCampus !== "all" && !post.campusSlugs.includes(selectedCampus)) {
        return false;
      }

      if (
        selectedCategory !== "all" &&
        !post.categories.some((c) => c === selectedCategory)
      ) {
        return false;
      }

      if (dateRange !== "all") {
        const postTime = new Date(post.date).getTime();
        const daysLimit = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
        if (!Number.isNaN(postTime) && referenceNowMs - postTime > daysLimit * dayMs) {
          return false;
        }
      }

      if (q) {
        const hay = [
          post.title,
          post.excerpt,
          post.categories.join(" "),
          post.tags.join(" "),
          post.author,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [posts, selectedCampus, selectedCategory, dateRange, search, referenceNowMs]);

  const activeCampus =
    selectedCampus !== "all" ? getCampusBySlug(selectedCampus) : undefined;

  const hasFilters =
    selectedCampus !== "all" ||
    selectedCategory !== "all" ||
    dateRange !== "all" ||
    search.trim() !== "";

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-8 sm:py-7">
      {/* compact formal header with inline count & reset */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#EBD3AE] pb-3.5">
        <div>
          <h1 className="display text-[24px] font-bold leading-tight tracking-[-0.01em] text-[#2A170B] sm:text-[28px]">
            News & Announcements
          </h1>
          <p className="mt-0.5 text-[13px] text-[#6B4A33]">
            Synced institutional updates from ctu.edu.ph, filtered by campus, category, or date.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B4A33]">
          <Filter className="h-3.5 w-3.5 text-[#EE6200]" />
          <span>
            Showing <strong className="text-[#2A170B]">{filteredPosts.length}</strong> of{" "}
            {posts.length}
          </span>
          {activeCampus && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#2A170B] px-2.5 py-0.5 font-bold text-[#FFF9EC]">
              {activeCampus.shortName}
              <button
                type="button"
                aria-label="Clear campus filter"
                onClick={() => setSelectedCampus("all")}
                className="rounded-full p-0.5 hover:bg-[#5A3A22]"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setDateRange("all");
                setSelectedCampus("all");
              }}
              className="font-bold text-[#EE6200] hover:text-[#2A170B] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* single-row filter bar */}
      <div className="mt-4 rounded-[14px] border border-[#EBD3AE] bg-[#FFEFD0]/65 p-2.5">
        <div className="grid gap-2 md:grid-cols-12">
          {/* keyword search */}
          <div className="relative md:col-span-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B4A33]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements, memos, events..."
              className="h-9 w-full rounded-[10px] border border-[#EBD3AE] bg-[#FFF9EC] pl-9 pr-3 text-[13px] text-[#2A170B] placeholder:text-[#6B4A33]/70 focus:border-[#EE6200] focus:outline-none"
            />
          </div>

          {/* category filter */}
          <div className="relative md:col-span-3">
            <Tag className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#EE6200]" />
            <select
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 w-full rounded-[10px] border border-[#EBD3AE] bg-[#FFF9EC] pl-8 pr-2 text-[13px] text-[#2A170B] focus:border-[#EE6200] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* date window */}
          <div className="relative md:col-span-2">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#EE6200]" />
            <select
              aria-label="Filter by date range"
              value={dateRange}
              onChange={(e) =>
                setDateRange(e.target.value as "all" | "7d" | "30d" | "90d")
              }
              className="h-9 w-full rounded-[10px] border border-[#EBD3AE] bg-[#FFF9EC] pl-8 pr-2 text-[13px] text-[#2A170B] focus:border-[#EE6200] focus:outline-none"
            >
              <option value="all">Any Date</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          {/* campus dropdown */}
          <div className="md:col-span-2">
            <select
              aria-label="Quick campus filter"
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="h-9 w-full rounded-[10px] border border-[#EBD3AE] bg-[#FFF9EC] px-2.5 text-[13px] font-bold text-[#2A170B] focus:border-[#EE6200] focus:outline-none"
            >
              <option value="all">All Campuses</option>
              {CTU_CAMPUSES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* results grid */}
      {filteredPosts.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[20px] border border-dashed border-[#EBD3AE] bg-[#FFEFD0]/60 p-10 text-center">
          <p className="display text-lg font-bold text-[#2A170B]">
            No announcements matched your current filters.
          </p>
          <p className="mt-1 text-sm text-[#6B4A33]">
            Try clearing your search keyword or switching to All Campuses.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setDateRange("all");
              setSelectedCampus("all");
            }}
            className="mt-4 rounded-[12px] bg-[#2A170B] px-4 py-2.5 text-xs font-bold text-[#FFF9EC] transition-colors hover:bg-[#EE6200]"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
