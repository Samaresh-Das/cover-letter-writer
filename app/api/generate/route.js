import { DEFAULT_SYSTEM_INSTRUCTION } from "@/lib/prompt";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req) {

    const { jobDescription } = await req.json();

    if (!jobDescription) {
        return NextResponse.json({ error: "Missing jobDescription" }, { status: 400 });
    }

    const baseURL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
    const model = process.env.OPENROUTER_MODEL || "mistralai/mistral-7b-instruct:free";

    try {
        // console.log(DEFAULT_SYSTEM_INSTRUCTION)
        const res = await fetch(`${baseURL}/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
                "X-Title": process.env.APP_TITLE || "Cover Letter Writer",
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: "system", content: DEFAULT_SYSTEM_INSTRUCTION },
                    { role: "user", content: `Job Description:\n${jobDescription}` },
                ],
                temperature: 0.7,
                max_tokens: 600,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            return NextResponse.json({ error: err }, { status: 500 });
        }

        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content ?? "";
        return NextResponse.json({ text });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
