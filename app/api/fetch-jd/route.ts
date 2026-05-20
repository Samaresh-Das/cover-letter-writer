import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

const normalizeSpaces = (value = "") =>
  value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const textFromFirst = ($, selectors) => {
  for (const selector of selectors) {
    const value = normalizeSpaces($(selector).first().text());
    if (value) return value;
  }
  return "";
};

const linkedInDescriptionText = ($) => {
  const selectors = [
    ".description__text",
    ".show-more-less-html__markup",
    ".jobs-description__content",
    ".jobs-box__html-content",
    "[class*=description__text]",
    "[class*=show-more-less-html]",
    ".description",
  ];

  for (const selector of selectors) {
    const node = $(selector).first();
    if (!node.length) continue;

    // Add line breaks around common block elements before reading text. Cheerio's
    // .text() otherwise glues LinkedIn labels together, producing strings like
    // "DeveloperFunction: FrontendLocation: Remote".
    node.find("br").replaceWith("\n");
    node.find("li").each((_, element) => {
      const item = normalizeSpaces($(element).text());
      if (item) $(element).replaceWith(`\n- ${item}\n`);
    });
    node.find("p, div, section, h2, h3").each((_, element) => {
      const current = $(element).html();
      if (current) $(element).html(`\n${current}\n`);
    });

    const value = normalizeSpaces(node.text());
    if (value) return value;
  }

  return normalizeSpaces($("article").text() || $("body").text().slice(0, 5000));
};

const formatLinkedInJobText = (raw = "") => {
  let text = normalizeSpaces(raw);

  const labelPatterns = [
    "Role",
    "Function",
    "Location",
    "Type",
    "Industry",
    "About Company",
    "About the Company",
    "Responsibilities",
    "Requirements",
    "Qualifications",
    "Skills",
    "Experience",
    "Benefits",
    "About the job",
    "Seniority level",
    "Employment type",
    "Job function",
    "Industries",
  ];

  for (const label of labelPatterns) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`\\s*${escaped}\\s*:`, "gi"), `\n${label}: `);
  }

  text = text
    .replace(/([a-z0-9)])(About Company|About the Company|Responsibilities|Requirements|Qualifications|Benefits|Skills):/gi, "$1\n$2:")
    .replace(/([.!?])\s+(?=(Responsibilities|Requirements|Qualifications|Benefits|About the job)\b)/gi, "$1\n\n")
    .replace(/\n\s*-\s*/g, "\n- ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text;
};

export async function POST(req) {
  const { url } = await req.json();

  if (!url || !url.startsWith("http")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${res.status}` },
        { status: res.status }
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const title = textFromFirst($, [
      "h1.top-card-layout__title",
      ".topcard__title",
      ".job-details-jobs-unified-top-card__job-title",
      "h1",
      "meta[property='og:title']",
    ]).replace(/\s+\|\s+LinkedIn.*$/i, "");

    const company = textFromFirst($, [
      ".topcard__org-name-link",
      ".top-card-layout__card .topcard__flavor",
      ".job-details-jobs-unified-top-card__company-name",
      "[class*=company-name]",
    ]);

    // Try multiple LinkedIn/public job selectors, then format label-heavy text.
    const jd = formatLinkedInJobText(linkedInDescriptionText($));

    if (!jd) {
      return NextResponse.json(
        { error: "Could not extract JD" },
        { status: 500 }
      );
    }

    return NextResponse.json({ jd, title, company });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
