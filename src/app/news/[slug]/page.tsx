import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ExternalLink, Tag, User } from "lucide-react";
import { readPortalCache } from "@/lib/cache";
import { CampusTagBadge } from "@/components/CampusBadge";
import { formatDisplayDate } from "@/components/NewsCard";

export const dynamic = "force-dynamic";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cache = await readPortalCache();
  const post = cache.posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      {/* back link */}
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2A170B] transition-colors hover:text-[#EE6200]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to News Feed
      </Link>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-[#EBD3AE] bg-[#FFF9EC]">
        {post.featuredImage && (
          <div className="aspect-[16/8] w-full overflow-hidden bg-[#FFEFD0]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-10">
          {/* categories */}
          <div className="flex flex-wrap gap-2">
            {post.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-[#2A170B] px-3 py-1 text-xs font-bold text-[#FFF9EC]"
              >
                {cat}
              </span>
            ))}
          </div>

          <h1 className="display mt-4 text-2xl font-bold leading-tight tracking-tight text-[#2A170B] sm:text-3xl">
            {post.title}
          </h1>

          {/* meta strip */}
          <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-[#EBD3AE] pb-5 text-xs font-medium text-[#6B4A33]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#EE6200]" />
              {formatDisplayDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#2A170B]" />
              {post.author}
            </span>
            <span className="rounded-[8px] bg-[#FFEFD0] px-2.5 py-0.5 text-[11px] font-bold text-[#2A170B]">
              Source: {post.source === "wp-rest" ? "WP REST API" : "RSS Feed"}
            </span>
          </div>

          {/* auto-detected campus badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#6B4A33]">
              Detected Campuses:
            </span>
            {post.campusSlugs.length > 0 ? (
              post.campusSlugs.map((campusSlug) => (
                <CampusTagBadge key={campusSlug} slug={campusSlug} />
              ))
            ) : (
              <span className="rounded-full bg-[#FFEFD0] px-2.5 py-1 text-xs font-medium text-[#2A170B]">
                University-wide / Unspecified
              </span>
            )}
          </div>

          {/* mandatory view original button */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[#EBD3AE] bg-[#FFEFD0] p-4">
            <p className="text-xs text-[#6B4A33]">
              Read the verified institutional post directly on the official CTU domain.
            </p>
            <a
              href={post.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[12px] bg-[#2A170B] px-4 py-2.5 text-xs font-bold text-[#FFF9EC] transition-colors hover:bg-[#EE6200]"
            >
              View Original on ctu.edu.ph
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* sanitized wordpress html content */}
          <div
            className="ctu-prose mt-8"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* tags */}
          {post.tags.length > 0 && (
            <div className="mt-8 border-t border-[#EBD3AE] pt-5">
              <div className="flex flex-wrap items-center gap-1.5">
                <Tag className="mr-1 h-3.5 w-3.5 text-[#6B4A33]" />
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-[6px] bg-[#FFEFD0] px-2 py-0.5 text-[11px] font-bold text-[#2A170B]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* bottom original link repeat for long articles */}
          <div className="mt-8 flex justify-end border-t border-[#EBD3AE] pt-6">
            <a
              href={post.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[12px] border border-[#2A170B] px-4 py-2.5 text-xs font-bold text-[#2A170B] transition-colors hover:bg-[#2A170B] hover:text-[#FFF9EC]"
            >
              View Original on ctu.edu.ph
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
