"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Info } from "lucide-react";

interface FacebookFeedEmbedProps {
  facebookUrl: string;
  campusName: string;
  compact?: boolean;
}

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M13.5 22v-8.2h2.75l.41-3.2H13.5V8.55c0-.93.26-1.56 1.59-1.56h1.7V4.12c-.3-.04-1.31-.12-2.49-.12-2.46 0-4.15 1.5-4.15 4.26v2.34H7.4v3.2h2.75V22h3.35z" />
    </svg>
  );
}

// meta page plugin iframe embed — zero api keys needed and stays compliant
export function FacebookFeedEmbed({
  facebookUrl,
  campusName,
  compact = false,
}: FacebookFeedEmbedProps) {
  const [showEmbed, setShowEmbed] = useState(!compact);

  // fb page plugin caps width at 500px so dont make container wider than that
  const embedSrc = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    facebookUrl
  )}&tabs=timeline&width=500&height=650&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`;

  if (compact) {
    return (
      <section className="rounded-[20px] bg-[#F7D794] p-5 text-[#2A170B]">
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#2A170B] text-[#FFF9EC]">
            <FacebookGlyph className="h-4 w-4" />
          </div>
          <div className="display text-[15px] font-bold leading-snug">
            Facebook updates from {campusName}
          </div>
        </div>

        <p className="mt-2.5 text-[13px] leading-[1.5]">
          The live feed loads on the portal. If it stays blank, an ad blocker may be hiding it.
        </p>

        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-[12px] bg-[#2A170B] px-3.5 text-[13px] font-bold text-[#FFF9EC] transition-colors hover:bg-[#EE6200]"
          >
            Open on Facebook
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setShowEmbed((prev) => !prev)}
            className="inline-flex h-10 items-center gap-1 rounded-[12px] border border-[#2A170B]/40 bg-[#FFF9EC] px-3 text-[12px] font-bold text-[#2A170B] transition-colors hover:bg-[#FFEFD0]"
          >
            {showEmbed ? "Hide feed" : "Load live feed"}
            {showEmbed ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {showEmbed && (
          <div className="mt-4 overflow-hidden rounded-[14px] border border-[#EBD3AE] bg-[#FFF9EC]">
            {/* lazy load iframe so it doesnt tank initial page speed */}
            <iframe
              key={facebookUrl}
              title={`Official Facebook Feed for ${campusName}`}
              src={embedSrc}
              width={500}
              height={520}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              className="h-[520px] w-full max-w-[500px] border-0 bg-[#FFF9EC]"
            />
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC]">
      {/* card header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBD3AE] bg-[#F7D794]/65 px-5 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#2A170B] text-[#FFF9EC]">
            <FacebookGlyph className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="display truncate text-[15px] font-bold text-[#2A170B] sm:text-base">
              Live Facebook Updates — {campusName}
            </h3>
            <p className="text-[12px] text-[#6B4A33]">
              Loaded directly via Facebook&apos;s official Page Plugin
            </p>
          </div>
        </div>

        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-1.5 rounded-[12px] bg-[#2A170B] px-4 text-[13px] font-bold text-[#FFF9EC] transition-colors hover:bg-[#EE6200]"
        >
          Open on Facebook
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* iframe wrapper capped at 500px per meta page plugin docs */}
      <div className="p-4 sm:p-5">
        <div className="mx-auto w-full max-w-[500px] overflow-hidden rounded-[16px] border border-[#EBD3AE] bg-[#FFEFD0]">
          {/* lazy load iframe so it doesnt tank initial page speed */}
          <iframe
            key={facebookUrl}
            title={`Official Facebook Feed for ${campusName}`}
            src={embedSrc}
            width={500}
            height={650}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            className="h-[650px] w-full overflow-hidden border-0 bg-[#FFF9EC]"
          />
        </div>

        {/* fallback note for tracking blockers */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-[14px] bg-[#FFEFD0] px-3.5 py-2.5 text-xs text-[#6B4A33]">
          <span className="inline-flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0 text-[#EE6200]" />
            Blank feed? Ad blockers or strict tracking protection may block Facebook embeds.
          </span>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-[#2A170B] underline underline-offset-2 hover:text-[#EE6200]"
          >
            View Page on Facebook <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
