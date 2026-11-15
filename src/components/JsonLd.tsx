import React from "react";

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

// server-safe json-ld helper for search engines and llm crawlers
export function JsonLd({ data }: JsonLdProps) {
  // escape < in json-ld so script tags dont break
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
