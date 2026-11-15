"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Database,
  KeyRound,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { SyncStatus } from "@/types/portal";

export function SyncPanelClient({
  initialStatus,
  secretRequired,
}: {
  initialStatus: SyncStatus;
  secretRequired: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<SyncStatus>(initialStatus);
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // dont hit ctu directly from client or cors will yell at us — call our own /api/sync route
  async function handleManualSync(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(secret.trim() ? { "x-sync-secret": secret.trim() } : {}),
        },
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setFeedback({
          type: "error",
          text: data.error || `Sync failed with HTTP ${res.status}`,
        });
      } else {
        setStatus(data.syncStatus);
        setFeedback({
          type: "success",
          text: `Synced ${data.syncStatus.postCount} posts via ${data.syncStatus.sourceUsed}.`,
        });
        router.refresh();
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Network error triggering sync",
      });
    } finally {
      setLoading(false);
    }
  }

  const formattedLastSync = status.lastSyncedAt
    ? new Intl.DateTimeFormat("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(status.lastSyncedAt))
    : "Never synced yet";

  return (
    <div className="rounded-[24px] border border-[#EBD3AE] bg-[#FFF9EC] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#EE6200] text-[#2A170B]">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="display text-lg font-bold text-[#2A170B]">
              Live Sync & Cache Status
            </h2>
            <p className="text-xs text-[#6B4A33]">
              Server-side WordPress REST + RSS aggregator
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            status.status === "ok"
              ? "bg-[#F7D794] text-[#2A170B]"
              : status.status === "error"
              ? "bg-[#FBA17E] text-[#2A170B]"
              : "bg-[#FFEFD0] text-[#6B4A33]"
          }`}
        >
          {status.status === "ok" ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-[#EE6200]" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5 text-[#EE6200]" />
          )}
          {status.status === "ok"
            ? "Cache Healthy"
            : status.status === "error"
            ? "Last Sync Error"
            : "Awaiting Initial Sync"}
        </span>
      </div>

      {/* metrics */}
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <div className="rounded-[16px] bg-[#FFEFD0] p-4">
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#6B4A33] uppercase">
            <Clock className="h-3.5 w-3.5 text-[#EE6200]" /> Last Synced
          </span>
          <p className="mt-1 text-sm font-bold text-[#2A170B]">
            {formattedLastSync}
          </p>
        </div>

        <div className="rounded-[16px] bg-[#FFEFD0] p-4">
          <span className="text-[11px] font-bold text-[#6B4A33] uppercase">
            Feed Source
          </span>
          <p className="mt-1 text-sm font-bold text-[#2A170B]">
            {status.sourceUsed === "wp-rest"
              ? "WP REST API v2"
              : status.sourceUsed === "rss"
              ? "RSS Feed Fallback"
              : "Not synced"}
          </p>
        </div>

        <div className="rounded-[16px] bg-[#FFEFD0] p-4">
          <span className="text-[11px] font-bold text-[#6B4A33] uppercase">
            Cached Posts
          </span>
          <p className="mt-1 text-sm font-bold text-[#2A170B]">
            {status.postCount} articles
          </p>
        </div>

        <div className="rounded-[16px] bg-[#FFEFD0] p-4">
          <span className="text-[11px] font-bold text-[#6B4A33] uppercase">
            Catalog & Memos
          </span>
          <p className="mt-1 text-sm font-bold text-[#2A170B]">
            {status.programCount} programs · {status.resourceCount} memos
          </p>
        </div>
      </div>

      {/* manual sync form */}
      <form
        onSubmit={handleManualSync}
        className="mt-6 flex flex-col gap-3 border-t border-[#EBD3AE] pt-5 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B4A33]" />
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder={
              secretRequired
                ? "Enter SYNC_SECRET key to trigger sync..."
                : "Optional SYNC_SECRET (dev mode open when unset)"
            }
            className="h-11 w-full rounded-[12px] border border-[#EBD3AE] bg-[#FFEFD0] pl-10 pr-3 text-sm text-[#2A170B] placeholder:text-[#6B4A33]/70 focus:border-[#EE6200] focus:bg-[#FFF9EC] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#2A170B] px-5 text-sm font-bold text-[#FFF9EC] transition-colors hover:bg-[#EE6200] disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Syncing ctu.edu.ph..." : "Trigger Manual Sync"}
        </button>
      </form>

      {feedback && (
        <div
          className={`mt-4 rounded-[14px] px-4 py-3 text-xs font-bold ${
            feedback.type === "success"
              ? "border border-[#EBD3AE] bg-[#F7D794] text-[#2A170B]"
              : "border border-[#EE6200]/40 bg-[#FBA17E]/40 text-[#2A170B]"
          }`}
        >
          {feedback.text}
        </div>
      )}
    </div>
  );
}
