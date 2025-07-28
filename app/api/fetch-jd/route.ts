import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

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

    // Try multiple selectors depending on site
    const jd =
      $(".description").text().trim() ||
      $("[class*=jobDescription]").text().trim() ||
      $("article").text().trim() ||
      $("body").text().slice(0, 2000).trim();

    if (!jd) {
      return NextResponse.json(
        { error: "Could not extract JD" },
        { status: 500 }
      );
    }

    return NextResponse.json({ jd });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
