// app/page.jsx
"use client";

import { useState, useRef } from "react";
import { DEFAULT_SYSTEM_INSTRUCTION } from "@/lib/prompt";

export default function Home() {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [letters, setLetters] = useState([]);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  const onGenerate = async () => {
    if (!jd.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jd }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      const newLetter = { id: crypto.randomUUID(), text: data.text, createdAt: Date.now() };
      setLetters(prev => [newLetter, ...prev]);

      // Scroll slider to start
      setTimeout(() => {
        sliderRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
      }, 100);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = text => navigator.clipboard.writeText(text);

  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-8 bg-bg text-text overflow-hidden">
      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.35),transparent)] blur-3xl" />
        <div className="absolute top-0 -right-40 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.25),transparent)] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.25),transparent)] blur-3xl" />
      </div>

      {/* Header */}
      <header className="max-w-3xl w-full mb-10 z-10 text-center">
        <h1 className="text-3xl font-bold text-primaryLight mb-2">Cover Letter Writer</h1>
        <p className="text-muted">
          Paste a job description, and I’ll craft a 3-paragraph cover letter tailored to your skills.
        </p>
      </header>

      {/* Input Form */}
      <section className="max-w-3xl w-full mb-12 z-20">
        <label className="block text-sm text-muted mb-2">Job Description</label>
        <textarea
          className="w-full h-48 p-4 rounded-lg bg-surface/70 backdrop-blur-md text-inherit focus:outline-none focus:ring-2 focus:ring-primary placeholder-muted"
          placeholder="Paste JD here..."
          value={jd}
          onChange={e => setJd(e.target.value)}
        />
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={onGenerate}
            disabled={loading || !jd.trim()}
            className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:scale-105 transition-transform duration-200 disabled:opacity-50 shadow-card"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          <details className="ml-auto">
            <summary className="cursor-pointer text-sm text-muted hover:text-primary transition-colors">
              Default instruction
            </summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs bg-surface/70 backdrop-blur p-3 rounded-lg border border-primary/20">
              {DEFAULT_SYSTEM_INSTRUCTION}
            </pre>
          </details>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </section>

      {/* Slider */}
      <section className="relative w-full flex-1 z-10">
        <div
          ref={sliderRef}
          className="w-full overflow-x-auto scrollbar-hide flex space-x-6 snap-x snap-mandatory px-4 py-6 mx-auto"
        >
          {letters.length === 0 && (
            <div className="flex-shrink-0 w-full text-center text-muted">
              Your generated cover letters will appear here.
            </div>
          )}


          {letters.map((letter, idx) => (
            <div key={letter.id} className="flex-shrink-0 snap-center w-full max-w-3xl mx-auto">
              <article className="h-96 bg-surface/70 backdrop-blur-lg border border-primary/20 rounded-2xl p-6 shadow-card hover:shadow-primaryLight/50 transition-shadow duration-200">
                <header className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Cover Letter #{letters.length - idx}</h2>
                  <button
                    onClick={() => copyToClipboard(letter.text)}
                    className="text-sm px-3 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 hover:scale-110 transition-transform duration-150"
                  >
                    Copy
                  </button>
                </header>
                <div className="whitespace-pre-wrap text-sm leading-6 mb-4 h-56 overflow-y-auto">
                  {letter.text}
                </div>
                <footer className="text-xs text-muted">
                  Generated {new Date(letter.createdAt).toLocaleTimeString()}
                </footer>
              </article>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-8 mb-8 text-xs text-muted z-10">
        Built with Next.js + Tailwind CSS. Theme: dark bluish with violet tones.
      </footer>
    </main>
  );
}

