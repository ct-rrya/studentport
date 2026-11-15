import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink, Info, Server, ShieldCheck } from "lucide-react";
import { readPortalCache } from "@/lib/cache";
import { SyncPanelClient } from "@/components/SyncPanelClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About & Sync Status",
  description:
    "Independent student-built CTU portal disclaimer, architecture overview, and live sync status.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const cache = await readPortalCache();
  const secretRequired = Boolean(process.env.SYNC_SECRET);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EBD3AE] pb-6">
        <div>
          <span className="text-[12px] font-bold tracking-[0.07em] text-[#6B4A33] uppercase">
            Portal Information
          </span>
          <h1 className="display mt-1 text-[32px] font-bold tracking-[-0.01em] text-[#2A170B] sm:text-[38px]">
            About & Sync Status
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#6B4A33]">
            Transparency notice, server-side caching architecture, and live data
            synchronization controls.
          </p>
        </div>

        <Image
          src="/logo.png"
          alt="CTU Student Portal Emblem"
          width={153}
          height={64}
          className="h-14 w-auto shrink-0 object-contain sm:h-16"
        />
      </div>

      {/* disclaimer */}
      <div className="mt-6 rounded-[22px] border border-[#EBD3AE] bg-[#F7D794] p-6 text-[#2A170B]">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#EE6200]" />
          <div>
            <h2 className="display text-base font-bold text-[#2A170B]">
              Independent Student-Built Portal Disclaimer
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#2A170B]">
              This application is an <strong>independent, student-built portal</strong>{" "}
              and is not an official website of the Cebu Technological University
              administration. All institutional announcements, academic details,
              and media are automatically aggregated from publicly available feeds
              on{" "}
              <a
                href="https://www.ctu.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline underline-offset-2"
              >
                ctu.edu.ph
              </a>{" "}
              and always link back to their original source.
            </p>
          </div>
        </div>
      </div>

      {/* live sync panel */}
      <div className="mt-8">
        <SyncPanelClient
          initialStatus={cache.syncStatus}
          secretRequired={secretRequired}
        />
      </div>

      {/* architecture cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC] p-6">
          <div className="flex items-center gap-2 text-[#2A170B]">
            <Server className="h-5 w-5 text-[#EE6200]" />
            <h3 className="display text-base font-bold">Server-Side Sync Only</h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#6B4A33]">
            Browser clients never fetch <code>ctu.edu.ph</code> directly—preventing
            CORS errors and avoiding excessive traffic on the university server.
            The sync pipeline fetches WordPress REST API posts (falling back to
            the official RSS feed), sanitizes HTML, auto-tags all 29 CTU campuses,
            and stores results in our local JSON cache or Supabase PostgreSQL.
          </p>
        </div>

        <div className="rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC] p-6">
          <div className="flex items-center gap-2 text-[#2A170B]">
            <ShieldCheck className="h-5 w-5 text-[#EE6200]" />
            <h3 className="display text-base font-bold">API Endpoint & CLI Script</h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#6B4A33]">
            Trigger synchronization from CLI via{" "}
            <code className="rounded bg-[#FFEFD0] px-1.5 py-0.5 font-mono text-[#2A170B]">
              npm run sync
            </code>{" "}
            or schedule{" "}
            <code className="rounded bg-[#FFEFD0] px-1.5 py-0.5 font-mono text-[#2A170B]">
              POST /api/sync
            </code>{" "}
            with the{" "}
            <code className="rounded bg-[#FFEFD0] px-1.5 py-0.5 font-mono text-[#2A170B]">
              x-sync-secret
            </code>{" "}
            header matching{" "}
            <code className="rounded bg-[#FFEFD0] px-1.5 py-0.5 font-mono text-[#2A170B]">
              SYNC_SECRET
            </code>
            .
          </p>
          <a
            href="https://www.ctu.edu.ph/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#EE6200] hover:underline"
          >
            Visit official ctu.edu.ph <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
