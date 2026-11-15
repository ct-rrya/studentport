import type { Metadata } from "next";
import { CampusProvider } from "@/context/CampusContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CtuChatbot } from "@/components/CtuChatbot";
import { JsonLd } from "@/components/JsonLd";
import { readPortalCache } from "@/lib/cache";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const siteUrl = getSiteUrl();

// set metadataBase so og images and canonical urls dont break on vercel
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CTU Student & Campus Portal",
    template: "%s | CTU Portal",
  },
  description:
    "Fast, mobile-first student portal for Cebu Technological University (CTU). Browse campus-filtered announcements, all 29 CTU campuses, academic programs, and official student portals.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: "CTU Student & Campus Portal",
    url: "/",
    title: "CTU Student & Campus Portal",
    description:
      "Announcements, academic programs, and all 29 campuses of Cebu Technological University filtered to your campus.",
    images: [
      {
        url: "/logo.png",
        alt: "CTU Student & Campus Portal Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CTU Student & Campus Portal",
    description:
      "Campus-filtered announcements, 29 CTU campuses directory, degree programs, and student portals.",
    images: ["/logo.png"],
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
  try {
    const cache = await readPortalCache();
    lastSyncedAt = cache.syncStatus.lastSyncedAt ?? undefined;
  } catch {
    // fallback if cache isnt readable during build
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CTU Student & Campus Portal",
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
          <main className="flex-1">{children}</main>
          <Footer lastSyncedAt={lastSyncedAt} />
          <CtuChatbot />
        </CampusProvider>
      </body>
    </html>
  );
}
