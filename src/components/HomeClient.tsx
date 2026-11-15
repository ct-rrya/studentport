"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ExternalLink,
  Laptop,
  MapPin,
  UserCheck,
} from "lucide-react";
import { CTU_CAMPUSES, getCampusBySlug, getCampusFacebookUrl } from "@/data/campuses";
import { useCampus } from "@/context/CampusContext";
import { CampusType, NewsPost } from "@/types/portal";
import { NewsCard } from "./NewsCard";
import { CampusTypeBadge } from "./CampusBadge";
import { FacebookFeedEmbed } from "./FacebookFeedEmbed";

// build deterministic 24x9 pixel mosaic once so hero stays crisp across renders
function buildMosaicColors(): string[] {
  const stops: Array<[number, [number, number, number]]> = [
    [0, [0xff, 0xf9, 0xec]],
    [0.35, [0xf7, 0xd7, 0x94]],
    [0.7, [0xfb, 0xa1, 0x7e]],
    [0.9, [0xff, 0x9a, 0x00]],
    [1, [0xee, 0x62, 0x00]],
  ];

  const mixHex = (tRaw: number): string => {
    const t = Math.max(0, Math.min(1, tRaw));
    for (let i = 0; i < stops.length - 1; i += 1) {
      const [t1, c1] = stops[i];
      const [t2, c2] = stops[i + 1];
      if (t >= t1 && t <= t2) {
        const p = (t - t1) / (t2 - t1);
        const r = Math.round(c1[0] + (c2[0] - c1[0]) * p);
        const g = Math.round(c1[1] + (c2[1] - c1[1]) * p);
        const b = Math.round(c1[2] + (c2[2] - c1[2]) * p);
        return `rgb(${r},${g},${b})`;
      }
    }
    return "rgb(238,98,0)";
  };

  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const colors: string[] = [];
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 24; col += 1) {
      colors.push(mixHex(row / 8 + (rnd() - 0.5) * 0.24));
    }
  }
  return colors;
}

const MOSAIC_COLORS = buildMosaicColors();

const QUICK_PORTALS = [
  {
    title: "CTU Enrolment",
    subtitle: "enrolment.ctu.edu.ph",
    desc: "Online registration, admission and subject load.",
    href: "https://enrolment.ctu.edu.ph/",
    external: true,
    icon: UserCheck,
    accent: "bg-[#FF9A00] text-[#2A170B]",
  },
  {
    title: "CTU Online LMS",
    subtitle: "online.ctu.edu.ph",
    desc: "Blended learning modules and course classrooms.",
    href: "https://online.ctu.edu.ph/",
    external: true,
    icon: Laptop,
    accent: "bg-[#F7D794] text-[#2A170B]",
  },
  {
    title: "Student Resources",
    subtitle: "Forms, memos and hotlines",
    desc: "Downloadable memos and campus registrar contacts.",
    href: "/resources",
    external: false,
    icon: BookOpen,
    accent: "bg-[#FBA17E] text-[#2A170B]",
  },
  {
    title: "Academic Calendar",
    subtitle: "Official CTU notices",
    desc: "Enrollment windows, holidays and university memos.",
    href: "https://www.ctu.edu.ph/category/announcements/",
    external: true,
    icon: CalendarDays,
    accent: "bg-[#EE6200] text-[#FFF9EC]",
  },
];

function formatCompactMonthDay(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export function HomeClient({
  posts,
}: {
  posts: NewsPost[];
}) {
  const { selectedCampus, setSelectedCampus } = useCampus();
  const [explorerTab, setExplorerTab] = useState<CampusType | "all">("all");

  const activeCampusObj =
    selectedCampus !== "all" ? getCampusBySlug(selectedCampus) : undefined;

  const filteredPosts = useMemo(() => {
    if (selectedCampus === "all") return posts;
    return posts.filter((p) => p.campusSlugs.includes(selectedCampus));
  }, [posts, selectedCampus]);

  const displayedPosts = filteredPosts.slice(0, 4);
  const recentSidebarPosts = posts.slice(0, 5);

  const explorerCampuses = useMemo(() => {
    if (explorerTab === "all") {
      // pin active campus up front so students see their selection right away
      if (activeCampusObj) {
        const rest = CTU_CAMPUSES.filter((c) => c.slug !== activeCampusObj.slug);
        return [activeCampusObj, ...rest].slice(0, 12);
      }
      return CTU_CAMPUSES.slice(0, 12);
    }
    return CTU_CAMPUSES.filter((c) => c.type === explorerTab);
  }, [explorerTab, activeCampusObj]);

  return (
    <div>
      {/* hero with warm pixel mosaic */}
      <section className="relative overflow-hidden bg-[#FFF9EC] pb-[112px] pt-10 sm:pb-[136px] sm:pt-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 grid grid-cols-[repeat(24,1fr)] grid-rows-[repeat(9,1fr)]"
        >
          {MOSAIC_COLORS.map((color, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: color,
                boxShadow: `0 0 0 1px ${color}`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex max-w-[1240px] flex-col justify-between gap-10 px-4 sm:px-8 lg:flex-row lg:items-center">
          <div className="max-w-[590px]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF9EC] px-3.5 py-1.5 text-[13px] font-bold text-[#2A170B]">
              <span className="h-2 w-2 rounded-full bg-[#EE6200]" />
              <span>Breaking Silos, Building Bridges</span>
            </div>

            <h1 className="display mt-4 text-[42px] font-bold leading-[1.03] tracking-[-0.02em] text-[#2A170B] sm:text-[56px] lg:text-[68px]">
              Your CTU campus hub
            </h1>

            <p className="mt-4 max-w-[520px] text-[17px] leading-[1.55] text-[#2A170B] sm:text-[19px]">
              Announcements, programs and student systems from Cebu Technological University,
              filtered to the campus you pick.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/news"
                className="inline-flex min-h-[52px] items-center gap-2.5 rounded-[14px] bg-[#2A170B] px-6 text-[15px] font-bold text-[#FFF9EC] transition-colors hover:bg-[#EE6200]"
              >
                <span>Browse announcements</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/campuses"
                className="inline-flex min-h-[52px] items-center rounded-[14px] border-2 border-[#2A170B] bg-[#FFF9EC]/55 px-6 text-[15px] font-bold text-[#2A170B] transition-colors hover:bg-[#FFF9EC]"
              >
                Explore all 29 campuses
              </Link>
            </div>
          </div>

          {/* right hero campus card */}
          <div className="w-full max-w-[440px] rounded-[24px] border border-[#EBD3AE]/80 bg-[#FFF9EC] p-6 sm:p-7">
            <div className="text-[11px] font-bold tracking-[0.07em] text-[#6B4A33] uppercase">
              Your campus
            </div>

            {activeCampusObj ? (
              <>
                <h2 className="display mt-1.5 text-[28px] font-bold leading-[1.1] text-[#2A170B] sm:text-[30px]">
                  {activeCampusObj.shortName}
                </h2>
                <p className="mt-2 flex items-center gap-1.5 text-[14px] text-[#6B4A33]">
                  <MapPin className="h-4 w-4 shrink-0 text-[#EE6200]" />
                  <span>{activeCampusObj.address}</span>
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <div className="rounded-[14px] bg-[#FFEFD0] p-3.5">
                    <div className="display text-[26px] font-bold leading-none text-[#2A170B]">
                      {activeCampusObj.offeredPrograms.length}
                    </div>
                    <div className="mt-1 text-[13px] text-[#6B4A33]">programs</div>
                  </div>
                  <div className="rounded-[14px] bg-[#FFEFD0] p-3.5">
                    <div className="display text-[26px] font-bold leading-none text-[#2A170B]">
                      {filteredPosts.length}
                    </div>
                    <div className="mt-1 text-[13px] text-[#6B4A33]">updates for you</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Link
                    href={`/campuses/${activeCampusObj.slug}`}
                    className="inline-flex h-11 flex-1 items-center justify-center rounded-[12px] bg-[#FF9A00] px-4 text-[14px] font-bold text-[#2A170B] transition-colors hover:bg-[#EE6200] hover:text-[#FFF9EC]"
                  >
                    Campus details
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedCampus("all")}
                    className="inline-flex h-11 items-center justify-center rounded-[12px] border border-[#2A170B] px-4 text-[14px] font-medium text-[#2A170B] transition-colors hover:bg-[#FFEFD0]"
                  >
                    Switch to all campuses
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="display mt-1.5 text-[28px] font-bold leading-[1.1] text-[#2A170B] sm:text-[30px]">
                  All 29 Campuses
                </h2>
                <p className="mt-2 flex items-center gap-1.5 text-[14px] text-[#6B4A33]">
                  <MapPin className="h-4 w-4 shrink-0 text-[#EE6200]" />
                  <span>University-wide feed across Cebu province</span>
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <div className="rounded-[14px] bg-[#FFEFD0] p-3.5">
                    <div className="display text-[26px] font-bold leading-none text-[#2A170B]">
                      29
                    </div>
                    <div className="mt-1 text-[13px] text-[#6B4A33]">campuses</div>
                  </div>
                  <div className="rounded-[14px] bg-[#FFEFD0] p-3.5">
                    <div className="display text-[26px] font-bold leading-none text-[#2A170B]">
                      {posts.length}
                    </div>
                    <div className="mt-1 text-[13px] text-[#6B4A33]">updates cached</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["main", "daanbantayan", "danao", "argao"].map((slug) => {
                    const c = getCampusBySlug(slug);
                    if (!c) return null;
                    return (
                      <button
                        key={slug}
                        type="button"
                        onClick={() => setSelectedCampus(slug)}
                        className="rounded-full bg-[#FFEFD0] px-3 py-1.5 text-[12px] font-bold text-[#2A170B] transition-colors hover:bg-[#F7D794]"
                      >
                        {c.shortName}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* overlapping quick-access portal cards */}
      <section className="relative z-20 mx-auto -mt-[64px] max-w-[1240px] px-4 sm:-mt-[72px] sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_PORTALS.map((card) => {
            const Icon = card.icon;
            const inner = (
              <div className="flex h-full flex-col justify-between rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC] p-[22px] text-[#2A170B] transition-all hover:-translate-y-0.5 hover:border-[#EE6200]">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${card.accent}`}
                  >
                    <Icon className="h-[22px] w-[22px]" />
                  </div>
                  {card.external ? (
                    <ExternalLink className="h-[18px] w-[18px] text-[#6B4A33]" />
                  ) : (
                    <ArrowRight className="h-[18px] w-[18px] text-[#6B4A33]" />
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="display text-[17px] font-bold text-[#2A170B]">
                    {card.title}
                  </h3>
                  <p className="mt-0.5 text-[13px] font-medium text-[#6B4A33]">
                    {card.subtitle}
                  </p>
                  <p className="mt-2.5 text-[13px] leading-[1.45] text-[#6B4A33]">
                    {card.desc}
                  </p>
                </div>
              </div>
            );

            return card.external ? (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                {inner}
              </a>
            ) : (
              <Link key={card.title} href={card.href} className="block h-full">
                {inner}
              </Link>
            );
          })}
        </div>
      </section>

      {/* main content split: latest announcements + right sidebar */}
      <section className="mx-auto mt-14 max-w-[1240px] px-4 sm:mt-16 sm:px-8">
        <div className="grid gap-7 lg:grid-cols-[1fr_360px] lg:items-start">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-[12px] font-bold tracking-[0.07em] text-[#6B4A33] uppercase">
                  Latest feed
                </div>
                <h2 className="display mt-1 text-[28px] font-bold leading-[1.12] tracking-[-0.01em] text-[#2A170B] sm:text-[34px]">
                  {activeCampusObj
                    ? `Updates mentioning ${activeCampusObj.shortName}`
                    : "Latest CTU news and updates"}
                </h2>
              </div>

              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 pb-1 text-[14px] font-bold text-[#2A170B] transition-colors hover:text-[#EE6200]"
              >
                <span>View all {filteredPosts.length} updates</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {displayedPosts.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {displayedPosts.map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[20px] border border-dashed border-[#EBD3AE] bg-[#FFEFD0]/60 p-8 text-center">
                <p className="display text-lg font-bold text-[#2A170B]">
                  No recent announcements specifically mentioned{" "}
                  {activeCampusObj?.shortName || "this campus"} in the latest cached updates.
                </p>
                <p className="mt-1.5 text-sm text-[#6B4A33]">
                  Many university-wide advisories apply across all 29 CTU campuses.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCampus("all")}
                    className="rounded-[12px] bg-[#2A170B] px-4 py-2.5 text-xs font-bold text-[#FFF9EC] transition-colors hover:bg-[#EE6200]"
                  >
                    Show all university news
                  </button>
                  {activeCampusObj && (
                    <Link
                      href={`/campuses/${activeCampusObj.slug}`}
                      className="rounded-[12px] border border-[#2A170B] bg-[#FFF9EC] px-4 py-2.5 text-xs font-bold text-[#2A170B] hover:bg-[#FFEFD0]"
                    >
                      Open {activeCampusObj.shortName} page
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* right sidebar: systemwide list + compact facebook card */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC] p-[22px]">
              <h3 className="display text-[17px] font-bold text-[#2A170B]">
                Latest from all CTU campuses
              </h3>
              <ul className="mt-4 divide-y divide-[#EBD3AE]">
                {recentSidebarPosts.map((post) => (
                  <li key={post.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="text-[12px] text-[#6B4A33]">
                      {formatCompactMonthDay(post.date)}
                      {post.categories[0] ? ` · ${post.categories[0]}` : ""}
                    </div>
                    <Link
                      href={`/news/${post.slug}`}
                      className="mt-1 block text-[15px] font-bold leading-[1.35] text-[#2A170B] transition-colors hover:text-[#EE6200]"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <FacebookFeedEmbed
              compact
              facebookUrl={getCampusFacebookUrl(activeCampusObj)}
              campusName={activeCampusObj ? activeCampusObj.shortName : "CTU Official"}
            />
          </aside>
        </div>
      </section>

      {/* warm full-bleed campus explorer band */}
      <section className="mt-[88px] bg-[#FFEFD0] py-16 sm:py-[72px]">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[12px] font-bold tracking-[0.07em] text-[#6B4A33] uppercase">
                29 campuses across Cebu
              </div>
              <h2 className="display mt-1 text-[28px] font-bold leading-[1.12] tracking-[-0.01em] text-[#2A170B] sm:text-[34px]">
                Find your campus
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: "all", label: "Featured (12)" },
                  { id: "main", label: "Main (1)" },
                  { id: "satellite", label: "Satellite (16)" },
                  { id: "extension", label: "Extension (12)" },
                ] as const
              ).map((tab) => {
                const isSelected = explorerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setExplorerTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${isSelected
                      ? "bg-[#2A170B] text-[#FFF9EC]"
                      : "border border-[#EBD3AE] bg-[#FFF9EC] text-[#2A170B] hover:border-[#EE6200]"
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {explorerCampuses.map((campus) => {
              const isCurrent = selectedCampus === campus.slug;
              return (
                <Link
                  key={campus.slug}
                  href={`/campuses/${campus.slug}`}
                  className={`group flex flex-col justify-between rounded-[18px] bg-[#FFF9EC] p-[18px] transition-all hover:-translate-y-0.5 ${isCurrent
                    ? "border-2 border-[#EE6200]"
                    : "border border-[#EBD3AE] hover:border-[#EE6200]"
                    }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <CampusTypeBadge type={campus.type} />
                        {isCurrent && (
                          <span className="inline-flex items-center rounded-full bg-[#2A170B] px-2.5 py-0.5 text-[10px] font-bold tracking-[0.04em] text-[#FFF9EC] uppercase">
                            Your campus
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-[12px] text-[#6B4A33]">
                        {campus.offeredPrograms.length} programs
                      </span>
                    </div>

                    <h3 className="display mt-3 text-[18px] font-bold text-[#2A170B] transition-colors group-hover:text-[#EE6200]">
                      {campus.shortName}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-[13px] text-[#6B4A33]">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#EE6200]" />
                      <span className="truncate">{campus.location}</span>
                    </p>
                  </div>

                  <div className="mt-3.5 flex flex-wrap gap-1 border-t border-[#EBD3AE] pt-3">
                    {campus.offeredPrograms.slice(0, 4).map((prog) => (
                      <span
                        key={prog}
                        className="rounded-[6px] bg-[#FFEFD0] px-2 py-0.5 text-[11px] font-bold text-[#2A170B]"
                      >
                        {prog}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/campuses"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-[14px] bg-[#2A170B] px-6 text-[15px] font-bold text-[#FFF9EC] transition-colors hover:bg-[#EE6200]"
            >
              <span>View the complete 29-campus directory</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* compact 7u 7 pillars teaser linking to /about#seven-pillars */}
      <section className="mx-auto my-12 max-w-[1240px] px-4 sm:px-8">
        <div className="flex flex-col justify-between gap-5 rounded-[24px] border border-[#0E223D]/25 bg-[#0E223D] p-6 text-[#FFF9EC] sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#A6192E] px-2.5 py-0.5 text-[11px] font-bold tracking-[0.06em] text-[#FFF9EC] uppercase">
                Why 7U? · 7 Core Pillars
              </span>
              <span className="text-[11px] font-bold tracking-[0.05em] text-[#F7D794] uppercase">
                Breaking Silos, Building Bridges
              </span>
            </div>
            <h2 className="display mt-2 text-[22px] font-bold leading-snug text-[#FFF9EC] sm:text-[26px]">
              7 Pillars Uniting 29 CTU Campuses Across Cebu
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#E9D7B8]">
              Unified · Updated · University-Wide · User-Centered · Utility-Driven · Understandable · Uplifting
            </p>
          </div>

          <Link
            href="/about#seven-pillars"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#F7D794] px-5 py-3 text-sm font-bold text-[#0E223D] transition-colors hover:bg-[#FF9A00]"
          >
            <span>Explore the 7 Pillars</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
