import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { NewsPost } from "@/types/portal";
import { CampusTagBadge } from "./CampusBadge";

export function formatDisplayDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

// deterministic warm backdrop when post has no featured image
function getFallbackTone(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 997;
  }
  const tones = ["bg-[#F7D794]", "bg-[#FBA17E]", "bg-[#FFEFD0]"];
  return tones[hash % tones.length];
}

export function NewsCard({ post }: { post: NewsPost }) {
  const fallbackBg = getFallbackTone(post.slug);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC] transition-all hover:-translate-y-0.5 hover:border-[#EE6200]">
      {/* thumbnail or warm geometric cover */}
      <Link
        href={`/news/${post.slug}`}
        className={`relative block h-[176px] w-full overflow-hidden ${fallbackBg}`}
      >
        {post.featuredImage ? (
          // using regular img tag here since wp media urls come from dynamic ctu uploads
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featuredImage}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="relative h-full w-full">
            <div className="absolute -right-7 -top-9 h-[140px] w-[140px] rounded-full bg-[#FFF9EC] opacity-55" />
          </div>
        )}

        {post.categories[0] && (
          <span className="absolute left-4 top-4 rounded-full bg-[#2A170B] px-3 py-1.5 text-[12px] font-bold text-[#FFF9EC]">
            {post.categories[0]}
          </span>
        )}
      </Link>

      {/* card body */}
      <div className="flex flex-1 flex-col p-[22px]">
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B4A33]">
          <Calendar className="h-[14px] w-[14px] text-[#EE6200]" />
          <time dateTime={post.date}>{formatDisplayDate(post.date)}</time>
        </div>

        <Link href={`/news/${post.slug}`} className="mt-2 block">
          <h3 className="display line-clamp-2 text-[20px] font-bold leading-[1.25] tracking-[-0.01em] text-[#2A170B] transition-colors group-hover:text-[#EE6200]">
            {post.title}
          </h3>
        </Link>

        <p className="mt-2.5 line-clamp-3 flex-1 text-[14px] leading-[1.55] text-[#6B4A33]">
          {post.excerpt}
        </p>

        {/* auto-detected campus badges */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {post.campusSlugs.length > 0 ? (
            post.campusSlugs.slice(0, 3).map((slug) => (
              <CampusTagBadge key={slug} slug={slug} />
            ))
          ) : (
            <span className="inline-flex items-center rounded-full bg-[#FFEFD0] px-2.5 py-1 text-[12px] font-medium text-[#2A170B]">
              University-wide
            </span>
          )}
          {post.campusSlugs.length > 3 && (
            <span className="text-[12px] font-medium text-[#6B4A33]">
              +{post.campusSlugs.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-4 border-t border-[#EBD3AE] pt-3.5">
          <Link
            href={`/news/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#2A170B] transition-colors hover:text-[#EE6200]"
          >
            Read full update <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
