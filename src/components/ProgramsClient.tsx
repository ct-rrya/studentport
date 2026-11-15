"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { GraduationCap, Search, X } from "lucide-react";
import { CTU_CAMPUSES, getCampusBySlug } from "@/data/campuses";
import { useCampus } from "@/context/CampusContext";
import { AcademicProgram } from "@/types/portal";

export function ProgramsClient({ programs }: { programs: AcademicProgram[] }) {
  const { selectedCampus, setSelectedCampus } = useCampus();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return programs.filter((prog) => {
      if (
        selectedCampus !== "all" &&
        !prog.campusSlugs.includes(selectedCampus)
      ) {
        return false;
      }
      if (levelFilter !== "all" && prog.level !== levelFilter) {
        return false;
      }
      if (q) {
        const hay = `${prog.code} ${prog.name} ${prog.college} ${prog.description}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [programs, selectedCampus, levelFilter, search]);

  const activeCampus =
    selectedCampus !== "all" ? getCampusBySlug(selectedCampus) : undefined;

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#EBD3AE] pb-3.5">
        <div>
          <h1 className="display text-[24px] font-bold leading-tight tracking-[-0.01em] text-[#2A170B] sm:text-[28px]">
            Academic Programs Catalog
          </h1>
          <p className="mt-0.5 text-[13px] text-[#6B4A33]">
            Undergraduate and graduate degree programs mapped across CTU Main, Satellite, and Extension campuses.
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
        </div>
      </div>

      {/* compact single-row filter bar */}
      <div className="mt-4 flex flex-col gap-2 rounded-[14px] border border-[#EBD3AE] bg-[#FFEFD0]/65 p-2.5 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B4A33]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search BSIT, BSHM, Engineering, Education..."
            className="h-9 w-full rounded-[10px] border border-[#EBD3AE] bg-[#FFF9EC] pl-9 pr-3 text-[13px] text-[#2A170B] placeholder:text-[#6B4A33]/70 focus:border-[#EE6200] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
            <option value="all">All Campuses</option>
            {CTU_CAMPUSES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* catalog grid */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((prog) => (
          <div
            key={prog.id}
            className="flex flex-col justify-between rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC] p-5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#FF9A00] px-2.5 py-1 text-xs font-bold text-[#2A170B]">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {prog.code}
                </span>
                <span className="rounded-full bg-[#FFEFD0] px-2.5 py-0.5 text-[11px] font-bold text-[#6B4A33]">
                  {prog.level}
                </span>
              </div>

              <h2 className="display mt-3 text-base font-bold leading-snug text-[#2A170B]">
                {prog.name}
              </h2>
              <p className="mt-1 text-xs font-bold text-[#EE6200]">
                {prog.college}
              </p>
              <p className="mt-2.5 text-xs leading-relaxed text-[#6B4A33]">
                {prog.description}
              </p>
            </div>

            <div className="mt-4 border-t border-[#EBD3AE] pt-3">
              <span className="block text-[11px] font-bold text-[#6B4A33]">
                Offered at ({prog.campusSlugs.length} campuses):
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {prog.campusSlugs.slice(0, 5).map((slug) => {
                  const c = getCampusBySlug(slug);
                  if (!c) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/campuses/${slug}`}
                      className="rounded-[6px] bg-[#FFEFD0] px-2 py-0.5 text-[11px] font-bold text-[#2A170B] transition-colors hover:bg-[#F7D794]"
                    >
                      {c.shortName.replace("CTU ", "")}
                    </Link>
                  );
                })}
                {prog.campusSlugs.length > 5 && (
                  <span className="px-1 text-[11px] text-[#6B4A33]">
                    +{prog.campusSlugs.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
