import type { Metadata } from "next";
import { OFFICIAL_RESOURCES, STUDENT_FAQS } from "@/data/resources-seed";
import { readPortalCache } from "@/lib/cache";
import { ResourcesClient } from "@/components/ResourcesClient";
import { JsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Student Resources & Hotlines",
  description:
    "Official CTU web portals (enrolment.ctu.edu.ph, online.ctu.edu.ph), downloadable memoranda, campus hotlines, and student FAQ.",
  alternates: { canonical: "/resources" },
};

export default async function ResourcesPage() {
  const cache = await readPortalCache();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: STUDENT_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <ResourcesClient
        officialResources={OFFICIAL_RESOURCES}
        scrapedResources={cache.scrapedResources}
      />
    </>
  );
}
