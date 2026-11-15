"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { CTU_CAMPUSES, getCampusBySlug } from "@/data/campuses";
import {
  PROGRAM_CATEGORY_FILTERS,
  ProgramCategoryFilter,
  ProgramMatchRecord,
} from "@/data/programs";
import { useCampus } from "@/context/CampusContext";
import { Campus, CampusType } from "@/types/portal";

const TYPE_STYLE: Record<CampusType, { label: string; short: string; chip: string }> = {
  main: {
    label: "Main",
    short: "Main",
    chip: "border-[#EE6200] bg-[#EE6200]/15 text-[#9A3A00]",
  },
  satellite: {
    label: "Satellite",
    short: "Sat",
    chip: "border-[#EBD3AE] bg-[#FFEFD0] text-[#2A170B]",
  },
  extension: {
    label: "Extension",
    short: "Ext",
    chip: "border-[#EBD3AE] bg-[#FFF4DF] text-[#6B4A33]",
  },
};

export function ProgramsClient({ programs }: { programs: ProgramMatchRecord[] }) {
  const { selectedCampus, setSelectedCampus, openChatWithPrompt } = useCampus();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<ProgramCategoryFilter>("All");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [campusTypeFilter, setCampusTypeFilter] = useState<"all" | CampusType>("all");
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // build campus counts per category pill so students see distribution at a glance
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: programs.length };
    for (const prog of programs) {
      counts[prog.category] = (counts[prog.category] ?? 0) + 1;
    }
    return counts;
  }, [programs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return programs.filter((prog) => {
      if (categoryFilter !== "All" && prog.category !== categoryFilter) {
        return false;
      }

      if (
        selectedCampus !== "all" &&
        !prog.campusSlugs.includes(selectedCampus)
      ) {
        return false;
      }

      if (levelFilter !== "all" && prog.level !== levelFilter) {
        return false;
      }

      const offeringCampuses = prog.campusSlugs
        .map((slug) => getCampusBySlug(slug))
        .filter((c): c is Campus => Boolean(c));

      if (
        campusTypeFilter !== "all" &&
        !offeringCampuses.some((c) => c.type === campusTypeFilter)
      ) {
        return false;
      }

      if (q) {
        const campusText = offeringCampuses
          .map((c) => `${c.name} ${c.location}`)
          .join(" ");
        const hay = `${prog.code} ${prog.name} ${prog.college} ${prog.category} ${prog.description} ${campusText}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [
    programs,
    categoryFilter,
    selectedCampus,
    levelFilter,
    campusTypeFilter,
    search,
  ]);

  const activeCampus =
    selectedCampus !== "all" ? getCampusBySlug(selectedCampus) : undefined;

  const hasFilters =
    categoryFilter !== "All" ||
    levelFilter !== "all" ||
    campusTypeFilter !== "all" ||
    selectedCampus !== "all" ||
    search.trim() !== "";

  function toggleExpanded(progId: string) {
    setExpandedCards((prev) => ({ ...prev, [progId]: !prev[progId] }));
  }

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#EBD3AE] pb-3.5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEFD0] px-2.5 py-0.5 text-[11px] font-bold tracking-[0.04em] text-[#9A3A00] uppercase">
            <Building2 className="h-3 w-3 text-[#EE6200]" />
            Cross-Campus Program Matcher
          </span>
          <h1 className="display mt-1.5 text-[24px] font-bold leading-tight tracking-[-0.01em] text-[#2A170B] sm:text-[28px]">
            Academic Programs Across All 29 Campuses
          </h1>
          <p className="mt-0.5 text-[13px] text-[#6B4A33]">
            Search any degree program to compare which CTU Main, Satellite, and Extension campuses offer it across Cebu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B4A33]">
          <span>
            Showing <strong className="text-[#2A170B]">{filtered.length}</strong> of{" "}
            {programs.length}
          </span>
          {activeCampus && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#2A170B] px-2.5 py-0.5 font-bold text-[#FFF9EC]">
              {activeCampus.shortName}
              <button
                type="button"
                onClick={() => setSelectedCampus("all")}
                className="rounded-full p-0.5 hover:bg-[#5A3A22]"
                aria-label="Clear campus filter"
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
                setCategoryFilter("All");
                setLevelFilter("all");
                setCampusTypeFilter("all");
                setSelectedCampus("all");
              }}
              className="font-bold text-[#EE6200] hover:text-[#2A170B] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* category filter pills */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {PROGRAM_CATEGORY_FILTERS.map((cat) => {
          const active = categoryFilter === cat;
          const count = categoryCounts[cat] ?? 0;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                active
                  ? "border-[#2A170B] bg-[#2A170B] text-[#FFF9EC]"
                  : "border-[#EBD3AE] bg-[#FFF9EC] text-[#2A170B] hover:border-[#EE6200] hover:bg-[#FFEFD0]"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* compact search + dropdown bar */}
      <div className="mt-3 flex flex-col gap-2 rounded-[14px] border border-[#EBD3AE] bg-[#FFEFD0]/65 p-2.5 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B4A33]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search BSIT, BSHM, BEEd, Engineering, or municipality..."
            className="h-9 w-full rounded-[10px] border border-[#EBD3AE] bg-[#FFF9EC] pl-9 pr-3 text-[13px] text-[#2A170B] placeholder:text-[#6B4A33]/70 focus:border-[#EE6200] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by campus classification"
            value={campusTypeFilter}
            onChange={(e) =>
              setCampusTypeFilter(e.target.value as "all" | CampusType)
            }
            className="h-9 rounded-[10px] border border-[#EBD3AE] bg-[#FFF9EC] px-3 text-[13px] font-bold text-[#2A170B]"
          >
            <option value="all">All Campus Types</option>
            <option value="main">Main Campus</option>
            <option value="satellite">Satellite Campuses</option>
            <option value="extension">Extension Campuses</option>
          </select>

          <select
            aria-label="Filter by degree level"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="h-9 rounded-[10px] border border-[#EBD3AE] bg-[#FFF9EC] px-3 text-[13px] font-bold text-[#2A170B]"
          >
            <option value="all">All Levels</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate">Graduate</option>
            <option value="Diploma / Tech-Voc">Diploma / Tech-Voc</option>
          </select>

          <select
            aria-label="Filter programs by campus"
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="h-9 rounded-[10px] border border-[#EBD3AE] bg-[#FFF9EC] px-3 text-[13px] font-bold text-[#2A170B]"
          >
            <option value="all">All 29 Campuses</option>
            {CTU_CAMPUSES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* catalog grid */}
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC] p-8 text-center">
          <p className="display text-base font-bold text-[#2A170B]">
            No matching CTU programs found
          </p>
          <p className="mt-1 text-xs text-[#6B4A33]">
            Try clearing your campus or category filter to compare programs across all 29 CTU campuses.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((prog) => {
            const offeringCampuses = prog.campusSlugs
              .map((slug) => getCampusBySlug(slug))
              .filter((c): c is Campus => Boolean(c));

            const visibleCampuses =
              campusTypeFilter === "all"
                ? offeringCampuses
                : offeringCampuses.filter((c) => c.type === campusTypeFilter);

            const mainCount = offeringCampuses.filter((c) => c.type === "main").length;
            const satCount = offeringCampuses.filter((c) => c.type === "satellite").length;
            const extCount = offeringCampuses.filter((c) => c.type === "extension").length;
            const isExpanded = Boolean(expandedCards[prog.id]);
            const displayedCampuses = isExpanded
              ? visibleCampuses
              : visibleCampuses.slice(0, 6);

            const aiQuestion = `Which CTU campuses offer ${prog.code} (${prog.name}) and how do I apply?`;

            return (
              <div
                key={prog.id}
                className="flex flex-col justify-between rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC] p-5"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#FF9A00] px-2.5 py-1 text-xs font-bold text-[#2A170B]">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {prog.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full border border-[#EBD3AE] bg-[#FFF4DF] px-2 py-0.5 text-[10px] font-bold text-[#9A3A00]">
                        {prog.category}
                      </span>
                      <span className="rounded-full bg-[#FFEFD0] px-2.5 py-0.5 text-[11px] font-bold text-[#6B4A33]">
                        {prog.level}
                      </span>
                    </div>
                  </div>

                  <h2 className="display mt-3 text-base font-bold leading-snug text-[#2A170B]">
                    {prog.name}
                  </h2>
                  <p className="mt-1 text-xs font-bold text-[#EE6200]">
                    {prog.college}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#6B4A33]">
                    {prog.description}
                  </p>
                </div>

                <div className="mt-4 border-t border-[#EBD3AE] pt-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#2A170B]">
                      Offering Campuses ({offeringCampuses.length})
                    </span>
                    <span className="text-[10px] font-medium text-[#6B4A33]">
                      {mainCount} Main · {satCount} Sat · {extCount} Ext
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {displayedCampuses.map((c) => {
                      const style = TYPE_STYLE[c.type];
                      return (
                        <Link
                          key={c.slug}
                          href={`/campuses/${c.slug}`}
                          title={`${c.name} — ${c.location} (${style.label})`}
                          className={`inline-flex items-center gap-1 rounded-[7px] border px-2 py-0.5 text-[11px] font-bold transition-colors hover:border-[#EE6200] hover:bg-[#F7D794] ${style.chip}`}
                        >
                          <MapPin className="h-2.5 w-2.5 shrink-0 opacity-75" />
                          <span>{c.shortName.replace("CTU ", "")}</span>
                          <span className="text-[9px] font-semibold uppercase opacity-70">
                            {style.short}
                          </span>
                        </Link>
                      );
                    })}

                    {visibleCampuses.length > 6 && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(prog.id)}
                        className="rounded-[7px] px-2 py-0.5 text-[11px] font-bold text-[#EE6200] hover:bg-[#FFEFD0] hover:text-[#2A170B]"
                      >
                        {isExpanded
                          ? "Show fewer"
                          : `+${visibleCampuses.length - 6} more campuses`}
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => openChatWithPrompt(aiQuestion)}
                    className="mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-[#2A170B] bg-[#2A170B] px-3 py-2 text-xs font-bold text-[#FFF9EC] transition-colors hover:border-[#EE6200] hover:bg-[#EE6200]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#FF9A00]" />
                    Ask CTU AI about {prog.code}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
