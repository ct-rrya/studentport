import type { Metadata } from "next";
import { CampusProvider } from "@/context/CampusContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CtuChatbot } from "@/components/CtuChatbot";
import { UrgentAdvisoryBanner } from "@/components/UrgentAdvisoryBanner";
import { JsonLd } from "@/components/JsonLd";
import { getLatestBannerAdvisory, type UrgentAdvisory } from "@/lib/advisories";
import { readPortalCache } from "@/lib/cache";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const siteUrl = getSiteUrl();

// keep json-ld and metadata synced with the new 7u brand name
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "7U — CTU Student & Campus Portal",
    template: "%s | 7U Portal",
  },
  description:
    "7U is a fast, mobile-first student portal bridging Cebu Technological University's 29 campuses. Browse announcements, degree programs, and official portals.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: "7U — CTU Student & Campus Portal",
    url: "/",
    title: "7U — CTU Student & Campus Portal",
    description:
      "Announcements, academic programs, and all 29 campuses of Cebu Technological University filtered to your campus.",
    images: [
      {
        url: "/logo2.jpg",
        alt: "7U CTU Student & Campus Portal Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "7U — CTU Student & Campus Portal",
    description:
      "7U: campus-filtered announcements, 29 CTU campuses directory, degree programs, and student portals.",
    images: ["/logo2.jpg"],
  },
  // google search console ownership tag so gsc can verify the home page
  verification: {
    google: "lJkPlMVl7ZzNzwUGn_mGviHcf6DmXWZt9UIG-uC4BLU",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let lastSyncedAt: string | undefined;
  let latestAdvisory: UrgentAdvisory | null = null;
  try {
    const cache = await readPortalCache();
    lastSyncedAt = cache.syncStatus.lastSyncedAt ?? undefined;
    // eslint-disable-next-line react-hooks/purity
    latestAdvisory = getLatestBannerAdvisory(cache.posts, Date.now());
  } catch {
    // fallback if cache isnt readable during build
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "7U — CTU Student & Campus Portal",
    alternateName: ["7U", "7U Portal", "CTU Portal"],
    url: siteUrl,
    description:
      "Student-built portal organizing public announcements, degree programs, and campus directories from Cebu Technological University (ctu.edu.ph).",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/news?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const universitySchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Cebu Technological University",
    alternateName: "CTU",
    url: "https://www.ctu.edu.ph/",
    sameAs: [
      "https://www.ctu.edu.ph/",
      "https://www.facebook.com/ctuofficial",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Corner M.J. Cuenco Ave. & R. Palma St.",
      addressLocality: "Cebu City",
      addressRegion: "Cebu",
      postalCode: "6000",
      addressCountry: "PH",
    },
  };

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#FFF9EC] text-[#2A170B]">
        <JsonLd data={websiteSchema} />
        <JsonLd data={universitySchema} />
        <CampusProvider>
          <Navbar />
          <UrgentAdvisoryBanner advisory={latestAdvisory} />
          <main className="flex-1">{children}</main>
          <Footer lastSyncedAt={lastSyncedAt} />
          <CtuChatbot />
        </CampusProvider>
      </body>
    </html>
  );
}
