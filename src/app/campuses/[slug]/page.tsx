import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Newspaper,
  Phone,
} from "lucide-react";
import { getCampusBySlug, getCampusFacebookUrl } from "@/data/campuses";
import { BASELINE_PROGRAMS } from "@/data/programs-seed";
import { readPortalCache } from "@/lib/cache";
import { getSiteUrl } from "@/lib/seo";
import { CampusTypeBadge } from "@/components/CampusBadge";
import { NewsCard, formatDisplayDate } from "@/components/NewsCard";
import { FacebookFeedEmbed } from "@/components/FacebookFeedEmbed";
import { JsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

function formatClassification(type: "main" | "satellite" | "extension"): string {
  if (type === "main") return "Main Campus";
  if (type === "satellite") return "Satellite Campus";
  return "Extension Campus";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const campus = getCampusBySlug(slug);
  if (!campus) {
    return { title: "Campus Not Found" };
  }

  const label = formatClassification(campus.type);
  const description = `${campus.name} is a Cebu Technological University ${label.toLowerCase()} in ${campus.location}. View offered degree programs, synced CTU announcements, and official contact links.`;

  return {
    title: campus.name,
    description,
    alternates: { canonical: `/campuses/${campus.slug}` },
    openGraph: {
      type: "website",
      url: `/campuses/${campus.slug}`,
      title: campus.name,
      description,
    },
  };
}

export default async function CampusDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campus = getCampusBySlug(slug);

  if (!campus) {
    notFound();
  }

  const cache = await readPortalCache();
  const campusPosts = cache.posts.filter((p) =>
    p.campusSlugs.includes(campus.slug)
  );

  const allPrograms = [...BASELINE_PROGRAMS, ...cache.scrapedPrograms];
  const campusPrograms = allPrograms.filter(
    (prog) =>
      campus.offeredPrograms.includes(prog.code) ||
      prog.campusSlugs.includes(campus.slug)
  );

  const siteUrl = getSiteUrl();
  const classification = formatClassification(campus.type);
  const websiteUrl = campus.websiteUrl || `https://www.ctu.edu.ph/${campus.slug}/`;
  const facebookUrl = getCampusFacebookUrl(campus);

  const campusSchema = {
    "@context": "https://schema.org",
    "@type": ["CollegeOrUniversity", "EducationalOrganization"],
    name: campus.name,
    url: `${siteUrl}/campuses/${campus.slug}`,
    description: campus.description,
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "Cebu Technological University",
      url: "https://www.ctu.edu.ph/",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: campus.address,
      addressLocality: campus.location,
      addressRegion: "Cebu",
      addressCountry: "PH",
    },
    sameAs: [websiteUrl, facebookUrl],
  };

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-8">
      <JsonLd data={campusSchema} />
      <Link
        href="/campuses"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2A170B] transition-colors hover:text-[#EE6200]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to All 29 Campuses
      </Link>

      {/* campus header */}
      <div className="mt-5 rounded-[24px] border border-[#EBD3AE] bg-[#FFF9EC] p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <CampusTypeBadge type={campus.type} />
          <span className="text-xs font-bold text-[#6B4A33]">
            {campus.location}
          </span>
        </div>

        <h1 className="display mt-3 text-[30px] font-bold tracking-[-0.01em] text-[#2A170B] sm:text-[36px]">
          {campus.name}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#6B4A33] sm:text-base">
          {campus.description}
        </p>

        {/* answer-first 50-word aeo & geo summary card */}
        <div className="mt-5 rounded-[16px] border border-[#EBD3AE] bg-[#FFEFD0] p-4 text-[13px] leading-relaxed text-[#2A170B]">
          <p>
            <strong>{campus.name}</strong> is a public{" "}
            <strong>{classification}</strong> of Cebu Technological University located at{" "}
            {campus.address}.{" "}
            {campus.type === "extension"
              ? "As an extension unit under the CTU Cebu university system, it expands higher education access in its municipality. "
              : campus.type === "satellite"
              ? "As an autonomous regional satellite campus in the CTU system, it delivers full degree instruction and research. "
              : "It serves as the flagship main seat of Cebu Technological University. "}
            Explore {campusPrograms.length} degree programs, official resources via{" "}
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#EE6200] underline underline-offset-2"
            >
              Original Source ({websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")})
            </a>
            , or campus updates on{" "}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#EE6200] underline underline-offset-2"
            >
              Facebook
            </a>
            .
          </p>
          {cache.syncStatus.lastSyncedAt && (
            <p className="mt-1.5 text-[12px] text-[#6B4A33]">
              Last Synced from ctu.edu.ph:{" "}
              <time dateTime={cache.syncStatus.lastSyncedAt}>
                {formatDisplayDate(cache.syncStatus.lastSyncedAt)}
              </time>
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-4 border-t border-[#EBD3AE] pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-2.5 text-xs text-[#6B4A33]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#EE6200]" />
            <div>
              <span className="block font-bold text-[#2A170B]">Address</span>
              <span>{campus.address}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-[#6B4A33]">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#EE6200]" />
            <div>
              <span className="block font-bold text-[#2A170B]">Hotline / Trunkline</span>
              <span>{campus.hotline || "Contact Main Trunkline: (032) 402-4060"}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-[#6B4A33]">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#EE6200]" />
            <div>
              <span className="block font-bold text-[#2A170B]">Email</span>
              <span>{campus.email || "information@ctu.edu.ph"}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-[#6B4A33]">
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-[#EE6200]" />
            <div>
              <span className="block font-bold text-[#2A170B]">Official Subsite</span>
              <a
                href={campus.websiteUrl || `https://www.ctu.edu.ph/${campus.slug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-[#EE6200] hover:underline"
              >
                ctu.edu.ph/{campus.slug} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* offered programs */}
      <section className="mt-10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#EE6200]" />
            <h2 className="display text-xl font-bold text-[#2A170B]">
              Offered Academic Programs ({campusPrograms.length})
            </h2>
          </div>
          <Link
            href="/programs"
            className="text-xs font-bold text-[#EE6200] hover:underline"
          >
            Browse full program catalog
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campusPrograms.map((prog) => (
            <div
              key={prog.id}
              className="rounded-[20px] border border-[#EBD3AE] bg-[#FFF9EC] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-[8px] bg-[#FF9A00] px-2.5 py-1 text-xs font-bold text-[#2A170B]">
                  {prog.code}
                </span>
                <span className="rounded-full bg-[#FFEFD0] px-2.5 py-0.5 text-[11px] font-bold text-[#6B4A33]">
                  {prog.level}
                </span>
              </div>
              <h3 className="display mt-2.5 text-sm font-bold text-[#2A170B]">
                {prog.name}
              </h3>
              <p className="mt-1 text-xs font-medium text-[#EE6200]">{prog.college}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#6B4A33]">
                {prog.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* two-column split: synced ctu.edu.ph news + live official facebook page plugin */}
      <section className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-[#EE6200]" />
              <h2 className="display text-xl font-bold text-[#2A170B]">
                Synced Website News ({campusPosts.length})
              </h2>
            </div>
            <Link
              href="/news"
              className="text-xs font-bold text-[#EE6200] hover:underline"
            >
              All CTU news
            </Link>
          </div>

          {campusPosts.length > 0 ? (
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {campusPosts.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[20px] border border-dashed border-[#EBD3AE] bg-[#FFEFD0]/60 p-8 text-center">
              <p className="display text-base font-bold text-[#2A170B]">
                No recent synced posts explicitly mention {campus.shortName}.
              </p>
              <p className="mt-1 text-xs text-[#6B4A33]">
                Check the university-wide news feed for systemwide advisories and memos, or view live Facebook updates alongside.
              </p>
              <Link
                href="/news"
                className="mt-4 inline-block rounded-[12px] bg-[#2A170B] px-4 py-2.5 text-xs font-bold text-[#FFF9EC] transition-colors hover:bg-[#EE6200]"
              >
                View All Announcements
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <FacebookFeedEmbed
            facebookUrl={getCampusFacebookUrl(campus)}
            campusName={campus.shortName}
          />
        </div>
      </section>
    </div>
  );
}
