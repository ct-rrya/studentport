"use client";

import React, { useMemo } from "react";
import {
  ExternalLink,
  FileText,
  Globe,
  PhoneCall,
} from "lucide-react";
import { getCampusBySlug } from "@/data/campuses";
import { useCampus } from "@/context/CampusContext";
import { ResourceItem } from "@/types/portal";
import { CampusTagBadge } from "./CampusBadge";

export function ResourcesClient({
  officialResources,
  scrapedResources,
}: {
  officialResources: ResourceItem[];
  scrapedResources: ResourceItem[];
}) {
  const { selectedCampus, setSelectedCampus } = useCampus();

  const allItems = useMemo(
    () => [...officialResources, ...scrapedResources],
    [officialResources, scrapedResources]
  );

  // show university-wide resources (campusSlugs.length === 0) plus campus-specific ones
  const filtered = useMemo(() => {
    if (selectedCampus === "all") return allItems;
    return allItems.filter(
      (item) =>
        item.campusSlugs.length === 0 ||
        item.campusSlugs.includes(selectedCampus)
    );
  }, [allItems, selectedCampus]);

  const portals = filtered.filter((r) => r.category === "Official Portal");
  const memos = filtered.filter(
    (r) => r.category === "Downloadable Form / Memo"
  );
  const hotlines = filtered.filter((r) => r.category === "Campus Hotline");

  const activeCampus =
    selectedCampus !== "all" ? getCampusBySlug(selectedCampus) : undefined;

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-8 sm:py-7">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#EBD3AE] pb-3.5">
        <div>
          <h1 className="display text-[24px] font-bold leading-tight tracking-[-0.01em] text-[#2A170B] sm:text-[28px]">
            Student Resources & Portals
          </h1>
          <p className="mt-0.5 text-[13px] text-[#6B4A33]">
            Official CTU web systems, downloadable memoranda extracted from synced posts, and campus hotlines.
          </p>
        </div>

        {activeCampus && (
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-[#2A170B] px-3 py-1 font-bold text-[#FFF9EC]">
              Filtered: {activeCampus.shortName}
            </span>
            <button
              type="button"
              onClick={() => setSelectedCampus("all")}
              className="font-bold text-[#EE6200] hover:underline"
            >
              Show all
            </button>
          </div>
        )}
      </div>

      {/* official ctu systems */}
      <section className="mt-5">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[#EE6200]" />
          <h2 className="display text-xl font-bold text-[#2A170B]">
            Official CTU Web Systems
          </h2>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portals.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC] p-5 transition-all hover:-translate-y-0.5 hover:border-[#EE6200]"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="display text-base font-bold text-[#2A170B] group-hover:text-[#EE6200]">
                    {item.title}
                  </h3>
                  <ExternalLink className="h-4 w-4 shrink-0 text-[#6B4A33] group-hover:text-[#EE6200]" />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#6B4A33]">
                  {item.description}
                </p>
              </div>
              <span className="mt-4 inline-block truncate text-xs font-bold text-[#EE6200]">
                {item.url}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* downloadable forms / memos scraped from posts */}
      <section className="mt-12">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#EE6200]" />
          <h2 className="display text-xl font-bold text-[#2A170B]">
            Scraped Forms, Memoranda & Attachments ({memos.length})
          </h2>
        </div>

        {memos.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {memos.map((memo) => (
              <a
                key={memo.id}
                href={memo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 rounded-[18px] border border-[#EBD3AE] bg-[#FFF9EC] p-4 transition-colors hover:border-[#EE6200]"
              >
                <div>
                  <h3 className="text-sm font-bold text-[#2A170B]">{memo.title}</h3>
                  <p className="mt-1 text-xs text-[#6B4A33]">{memo.description}</p>
                  {memo.campusSlugs.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {memo.campusSlugs.map((slug) => (
                        <CampusTagBadge key={slug} slug={slug} clickable={false} />
                      ))}
                    </div>
                  )}
                </div>
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-[#EE6200]" />
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[18px] border border-dashed border-[#EBD3AE] bg-[#FFEFD0]/60 p-6 text-sm text-[#6B4A33]">
            No direct PDF/document attachment links were found inside the latest 30
            synced news posts. Check{" "}
            <a
              href="https://www.ctu.edu.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#EE6200] underline"
            >
              ctu.edu.ph
            </a>{" "}
            or run a fresh sync from the About page.
          </div>
        )}
      </section>

      {/* campus & emergency hotlines */}
      <section className="mt-12">
        <div className="flex items-center gap-2">
          <PhoneCall className="h-5 w-5 text-[#EE6200]" />
          <h2 className="display text-xl font-bold text-[#2A170B]">
            Campus & Emergency Hotlines
          </h2>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hotlines.map((hotline) => (
            <div
              key={hotline.id}
              className="rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC] p-5"
            >
              <h3 className="text-sm font-bold text-[#2A170B]">
                {hotline.title}
              </h3>
              <p className="display mt-2 text-lg font-bold tracking-tight text-[#EE6200]">
                {hotline.phone}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[#6B4A33]">
                {hotline.description}
              </p>
              {hotline.campusSlugs.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {hotline.campusSlugs.map((slug) => (
                    <CampusTagBadge key={slug} slug={slug} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
