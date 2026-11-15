import * as cheerio from "cheerio";

const CTU_ORIGIN = "https://www.ctu.edu.ph";

// quick fix for weird html entities in title/excerpt strings from wordpress
export function decodeHtmlEntities(input: string): string {
  if (!input) return "";
  const $ = cheerio.load(`<div>${input}</div>`);
  return $("div").text().replace(/\s+/g, " ").trim();
}

export function stripHtmlToText(html: string, maxLength = 240): string {
  if (!html) return "";
  const $ = cheerio.load(html);
  $("script, style, noscript").remove();
  const text = $.root().text().replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

// strips dangerous tags & inline event handlers before rendering scraped wp html
// also fixes relative /wp-content paths so images actually load
export function sanitizeCtuHtml(rawHtml: string): string {
  if (!rawHtml) return "";
  const $ = cheerio.load(rawHtml, null, false);

  // nuke anything executable or sketchy
  $("script, style, iframe, object, embed, form, input, button, textarea, select, meta, link").remove();

  $("*").each((_, el) => {
    const attribs = (el as unknown as { attribs?: Record<string, string> }).attribs;
    if (!attribs) return;

    for (const attr of Object.keys(attribs)) {
      const lowerAttr = attr.toLowerCase();
      const val = attribs[attr] ?? "";

      // strip inline js handlers like onclick, onerror, etc
      if (lowerAttr.startsWith("on")) {
        $(el).removeAttr(attr);
        continue;
      }

      // block javascript: or data: urls in links/media
      if (lowerAttr === "href" || lowerAttr === "src") {
        const trimmed = val.trim();
        if (/^(javascript|vbscript|data:text\/html):/i.test(trimmed)) {
          $(el).removeAttr(attr);
          continue;
        }
        // normalize relative wordpress paths to ctu.edu.ph
        if (trimmed.startsWith("/")) {
          $(el).attr(attr, `${CTU_ORIGIN}${trimmed}`);
        }
      }
    }

    // make external links open safely in a new tab
    if ("tagName" in el && el.tagName === "a") {
      $(el).attr("target", "_blank");
      $(el).attr("rel", "noopener noreferrer");
    }

    // lazy load images and strip fixed width/height attrs that break mobile layouts
    if ("tagName" in el && el.tagName === "img") {
      $(el).attr("loading", "lazy");
      $(el).removeAttr("width");
      $(el).removeAttr("height");
      $(el).removeAttr("srcset");
    }
  });

  return $.html();
}
