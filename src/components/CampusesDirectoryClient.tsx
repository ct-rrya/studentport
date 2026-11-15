"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, Newspaper, Search } from "lucide-react";
import { CTU_CAMPUSES } from "@/data/campuses";
import { Campus, CampusType, NewsPost } from "@/types/portal";
import { CampusTypeBadge } from "./CampusBadge";

export function CampusesDirectoryClient({ posts }: { posts: NewsPost[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | CampusType>("all");

  // count cached posts per campus slug once
  const postCountByCampus = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) {
      for (const slug of post.campusSlugs) {
        counts[slug] = (counts[slug] ?? 0) + 1;
      }
    }
    return counts;
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CTU_CAMPUSES.filter((c) => {
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.offeredPrograms.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [search, typeFilter]);

  const grouped: Array<{ title: string; subtitle: string; items: Campus[] }> = [
    {
      title: "Main Campus",
      subtitle: "Central flagship university seat in Cebu City (1)",
      items: filtered.filter((c) => c.type === "main"),
    },
    {
      title: "Satellite Campuses",
      subtitle: "Autonomous regional & municipal campuses across Cebu (16)",
      items: filtered.filter((c) => c.type === "satellite"),
    },
    {
      title: "Extension Campuses",
      subtitle: "Community extension units expanding access across towns & islands (12)",
      items: filtered.filter((c) => c.type === "extension"),
    },
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#EBD3AE] pb-3.5">
        <div>
          <h1 className="display text-[24px] font-bold leading-tight tracking-[-0.01em] text-[#2A170B] sm:text-[28px]">
            All 29 CTU Campuses
          </h1>
          <p className="mt-0.5 text-[13px] text-[#6B4A33]">
            Main (1), Satellite (16), and Extension (12) campuses across Cebu with programs and synced news.
          </p>
        </div>
        <span className="text-xs font-bold text-[#6B4A33]">
          {filtered.length} campuses shown
        </span>
      </div>

      {/* compact search + type tabs */}
      <div className="mt-4 flex flex-col gap-2.5 rounded-[14px] border border-[#EBD3AE] bg-[#FFEFD0]/65 p-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B4A33]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campus, town, or program (e.g. Daanbantayan, BSIT)..."
            className="h-9 w-full rounded-[10px] border border-[#EBD3AE] bg-[#FFF9EC] pl-9 pr-3 text-[13px] text-[#2A170B] placeholder:text-[#6B4A33]/70 focus:border-[#EE6200] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: "all", label: "All (29)" },
              { id: "main", label: "Main (1)" },
              { id: "satellite", label: "Satellite (16)" },
              { id: "extension", label: "Extension (12)" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-colors ${
                typeFilter === tab.id
                  ? "bg-[#2A170B] text-[#FFF9EC]"
                  : "border border-[#EBD3AE] bg-[#FFF9EC] text-[#2A170B] hover:border-[#EE6200]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* grouped sections */}
      <div className="mt-6 space-y-8">
        {grouped.map((group) => {
          if (group.items.length === 0) return null;
          return (
            <section key={group.title}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="display text-xl font-bold text-[#2A170B]">{group.title}</h2>
                  <p className="text-xs text-[#6B4A33]">{group.subtitle}</p>
                </div>
                <span className="rounded-full bg-[#FFEFD0] px-3 py-1 text-xs font-bold text-[#2A170B]">
                  {group.items.length} shown
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((campus) => {
                  const newsCount = postCountByCampus[campus.slug] ?? 0;
                  return (
                    <Link
                      key={campus.slug}
                      href={`/campuses/${campus.slug}`}
                      className="group flex flex-col justify-between rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC] p-5 transition-all hover:-translate-y-0.5 hover:border-[#EE6200]"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <CampusTypeBadge type={campus.type} />
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6B4A33]">
                            <Newspaper className="h-3.5 w-3.5 text-[#EE6200]" />
                            {newsCount} {newsCount === 1 ? "post" : "posts"}
                          </span>
                        </div>

                        <h3 className="display mt-3 text-lg font-bold text-[#2A170B] transition-colors group-hover:text-[#EE6200]">
                          {campus.name}
                        </h3>
                        <p className="mt-1 flex items-start gap-1.5 text-xs text-[#6B4A33]">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#EE6200]" />
                          <span>{campus.address}</span>
                        </p>
                        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[#6B4A33]">
                          {campus.description}
                        </p>
                      </div>

                      <div className="mt-4 border-t border-[#EBD3AE] pt-3">
                        <div className="flex flex-wrap gap-1">
                          {campus.offeredPrograms.slice(0, 5).map((prog) => (
                            <span
                              key={prog}
                              className="rounded-[6px] bg-[#FFEFD0] px-2 py-0.5 text-[11px] font-bold text-[#2A170B]"
                            >
                              {prog}
                            </span>
                          ))}
                          {campus.offeredPrograms.length > 5 && (
                            <span className="px-1 text-[11px] font-medium text-[#6B4A33]">
                              +{campus.offeredPrograms.length - 5}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#2A170B] group-hover:text-[#EE6200]">
                          <Building2 className="h-3.5 w-3.5" />
                          View campus profile & news <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-[20px] border border-dashed border-[#EBD3AE] bg-[#FFEFD0]/60 p-10 text-center">
            <p className="display text-lg font-bold text-[#2A170B]">
              No campuses matched &ldquo;{search}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
              }}
              className="mt-3 rounded-[12px] bg-[#2A170B] px-4 py-2.5 text-xs font-bold text-[#FFF9EC] transition-colors hover:bg-[#EE6200]"
            >
              Show All 29 Campuses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
