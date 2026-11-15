"use client";

import React, { useState } from "react";
import {
  Compass,
  GraduationCap,
  Layers,
  RefreshCw,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";
import { PillarItem, SEVEN_PILLARS } from "@/data/pillars";

const ACCENT_MAP: Record<
  PillarItem["accent"],
  {
    badge: string;
    border: string;
    iconBg: string;
    pill: string;
  }
> = {
  crimson: {
    badge: "bg-[#A6192E] text-[#FFF9EC]",
    border: "border-[#A6192E]/40 hover:border-[#A6192E]",
    iconBg: "bg-[#A6192E]/10 text-[#A6192E]",
    pill: "text-[#A6192E]",
  },
  gold: {
    badge: "bg-[#D98218] text-[#FFF9EC]",
    border: "border-[#D98218]/45 hover:border-[#D98218]",
    iconBg: "bg-[#F7D794]/60 text-[#9A4B00]",
    pill: "text-[#9A4B00]",
  },
  navy: {
    badge: "bg-[#0E223D] text-[#FFF9EC]",
    border: "border-[#0E223D]/40 hover:border-[#0E223D]",
    iconBg: "bg-[#0E223D]/10 text-[#0E223D]",
    pill: "text-[#0E223D]",
  },
};

function renderPillarIcon(key: PillarItem["iconKey"]) {
  const cls = "h-5 w-5";
  switch (key) {
    case "layers":
      return <Layers className={cls} />;
    case "refresh":
      return <RefreshCw className={cls} />;
    case "compass":
      return <Compass className={cls} />;
    case "smartphone":
      return <Smartphone className={cls} />;
    case "wrench":
      return <Wrench className={cls} />;
    case "sparkles":
      return <Sparkles className={cls} />;
    case "graduation":
      return <GraduationCap className={cls} />;
  }
}

export function SevenPillarsGrid() {
  const [selectedNumber, setSelectedNumber] = useState<number>(1);
  const activePillar =
    SEVEN_PILLARS.find((p) => p.number === selectedNumber) ?? SEVEN_PILLARS[0];

  return (
    <section
      id="seven-pillars"
      className="scroll-mt-24 rounded-[24px] border border-[#EBD3AE] bg-[#FFF9EC] p-6 sm:p-8"
    >
      {/* top intro explaining 7u pillars and breaking silos, building bridges */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#EBD3AE] pb-5">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#A6192E] px-2.5 py-0.5 text-[11px] font-bold tracking-[0.06em] text-[#FFF9EC] uppercase">
              7 Core Pillars
            </span>
            <span className="rounded-full bg-[#0E223D] px-2.5 py-0.5 text-[11px] font-bold tracking-[0.06em] text-[#F7D794] uppercase">
              Breaking Silos, Building Bridges
            </span>
          </div>
          <h2 className="display mt-2.5 text-[24px] font-bold tracking-[-0.01em] text-[#2A170B] sm:text-[30px]">
            Why 7U? The 7 Core Pillars
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-[#6B4A33]">
            Each number in <strong className="text-[#2A170B]">7U</strong> stands for a{" "}
            <strong className="text-[#0E223D]">“U”</strong> pillar built to break
            campus information silos and unite all 29 Cebu Technological University
            campuses in one fast student hub.
          </p>
        </div>

        {/* active spotlight badge */}
        <div className="rounded-[16px] border border-[#0E223D]/20 bg-[#0E223D] px-4 py-3 text-[#FFF9EC] sm:max-w-xs">
          <div className="text-[10px] font-bold tracking-[0.07em] text-[#F7D794] uppercase">
            Pillar 0{activePillar.number} Spotlight
          </div>
          <div className="display mt-0.5 text-base font-bold text-[#FFF9EC]">
            {activePillar.title}
          </div>
          <div className="mt-0.5 text-xs text-[#E9D7B8]">
            {activePillar.tagline}
          </div>
        </div>
      </div>

      {/* interactive 7 pillars grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SEVEN_PILLARS.map((pillar) => {
          const style = ACCENT_MAP[pillar.accent];
          const isSelected = pillar.number === selectedNumber;

          return (
            <button
              key={pillar.number}
              type="button"
              onClick={() => setSelectedNumber(pillar.number)}
              aria-pressed={isSelected}
              className={`group flex flex-col justify-between rounded-[18px] border p-4 text-left transition-all ${
                isSelected
                  ? "border-2 border-[#0E223D] bg-[#FFEFD0] shadow-sm"
                  : `bg-[#FFF9EC] ${style.border}`
              } ${pillar.number === 7 ? "sm:col-span-2 lg:col-span-2" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-[8px] text-xs font-extrabold ${style.badge}`}
                  >
                    {pillar.number}
                  </span>
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-[10px] ${style.iconBg}`}
                  >
                    {renderPillarIcon(pillar.iconKey)}
                  </span>
                </div>

                <h3 className="display mt-3 text-lg font-bold text-[#2A170B]">
                  {pillar.title}
                </h3>
                <p className={`mt-0.5 text-[11px] font-bold ${style.pill}`}>
                  {pillar.tagline}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#6B4A33]">
                  {pillar.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
