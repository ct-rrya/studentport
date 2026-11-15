"use client";

import React, { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, BellRing, X } from "lucide-react";
import type { UrgentAdvisory } from "@/lib/advisories";

const DISMISS_EVENT = "ctu-advisory-dismiss";

function subscribeDismiss(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(DISMISS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(DISMISS_EVENT, callback);
  };
}

function getStorageKey(postId: string) {
  return `ctu-dismissed-advisory:${postId}`;
}

export function UrgentAdvisoryBanner({
  advisory,
}: {
  advisory: UrgentAdvisory | null;
}) {
  const postId = advisory?.post.id ?? "";

  const isDismissed = useSyncExternalStore(
    subscribeDismiss,
    () => {
      if (!postId) return true;
      try {
        return window.sessionStorage.getItem(getStorageKey(postId)) === "1";
      } catch {
        return false;
      }
    },
    () => false
  );

  const handleDismiss = useCallback(() => {
    if (!postId) return;
    try {
      window.sessionStorage.setItem(getStorageKey(postId), "1");
      window.dispatchEvent(new Event(DISMISS_EVENT));
    } catch {
      // ignore storage failure in strict privacy modes
    }
  }, [postId]);

  if (!advisory || isDismissed) {
    return null;
  }

  const isUrgent = advisory.severity === "urgent";
  const prefixLabel = isUrgent ? "URGENT" : "ADVISORY";

  return (
    <div
      role="region"
      aria-label="Cross-campus urgent advisory banner"
      className={
        isUrgent
          ? "border-b border-[#EE6200] bg-[#7A1D0C] text-[#FFF9EC]"
          : "border-b border-[#5A3A22] bg-[#2A170B] text-[#FFF9EC]"
      }
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-2.5 px-4 py-2 sm:flex-nowrap sm:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span
            className={
              isUrgent
                ? "inline-flex shrink-0 items-center gap-1 rounded-full bg-[#FF9A00] px-2.5 py-0.5 text-[11px] font-extrabold tracking-wide text-[#2A170B]"
                : "inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F7D794] px-2.5 py-0.5 text-[11px] font-extrabold tracking-wide text-[#2A170B]"
            }
          >
            {isUrgent ? (
              <AlertTriangle className="h-3 w-3 shrink-0" />
            ) : (
              <BellRing className="h-3 w-3 shrink-0" />
            )}
            <span>
              {prefixLabel} • {advisory.campusLabel}
            </span>
          </span>

          <p className="truncate text-xs font-semibold text-[#FFF9EC] sm:text-[13px]">
            {advisory.post.title}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={`/news/${advisory.post.slug}`}
            className="inline-flex items-center gap-1 rounded-[8px] bg-[#EE6200] px-2.5 py-1 text-[11px] font-bold text-[#FFF9EC] transition-colors hover:bg-[#FF9A00] hover:text-[#2A170B]"
          >
            Read Memo <ArrowRight className="h-3 w-3" />
          </Link>

          <Link
            href="/news?filter=advisories"
            className="text-[11px] font-bold text-[#F7D794] underline decoration-[#F7D794]/60 underline-offset-2 transition-colors hover:text-[#FFF9EC]"
          >
            View All Advisories
          </Link>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss urgent advisory banner"
            className="rounded-md p-1 text-[#EBD3AE] transition-colors hover:bg-white/10 hover:text-[#FFF9EC]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
