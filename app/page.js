// app/page.jsx
"use client";

import { useState, useRef } from "react";
import { DEFAULT_SYSTEM_INSTRUCTION } from "@/lib/prompt";
import Letter from "./components/Letter";
import CustomDropdown from "./components/ModelDropdown";
import { Toaster } from "react-hot-toast";



export default function Home() {
  const [jd, setJd] = useState("");
  const [manager, setManager] = useState("");
  const [resumeLink, setResumeLink] = useState("https://drive.google.com/file/d/19y5PIUIQ7SPwk4sLbPlE3z2DGRrUmEMn/view?usp=sharing");
  const [model, setModel] = useState(process.env.NEXT_PUBLIC_DEFAULT_MODEL);
  const [customInstr, setCustomInstr] = useState("");
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
        body: JSON.stringify({ jobDescription: jd, model, manager, resumeLink, customInstr }),
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

      {/* Controls */}
      {/* Controls */}
      <section className="max-w-5xl w-full mb-12 z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: options */}
          <div className="flex-1 space-y-4">
            <label className="block">
              <span className="text-sm text-muted">Hiring Manager Name (optional)</span>
              <input
                type="text"
                value={manager}
                onChange={e => setManager(e.target.value)}
                className="mt-1 block w-full rounded bg-surface/70 text-text p-2"
                placeholder="e.g. John Doe"
              />
            </label>

            <label className="block">
              <span className="text-sm text-muted">Resume Link</span>
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/19y5PIUIQ7SPwk4sLbPlE3z2DGRrUmEMn/view?usp=sharing"
                onChange={e => setResumeLink(e.target.value)}
                className="mt-1 block w-full rounded bg-surface/70 text-text p-2"
              />
            </label>

            <CustomDropdown model={model} setModel={setModel} />



            {/* Custom Instruction */}
            <label className="block">
              <span className="text-sm text-muted">Custom Instruction (optional)</span>
              <textarea
                rows={3}
                value={customInstr}
                onChange={e => setCustomInstr(e.target.value)}
                placeholder="Override the default prompt…"
                className="mt-1 block w-full rounded-lg bg-surface/70 text-text p-2 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary transition"
              />
            </label>


          </div>

          {/* Right column: JD + actions */}
          <div className="flex-1 space-y-4">
            <label className="block">
              <span className="text-sm text-muted">Job Description</span>
              <textarea
                rows={6}
                value={jd}
                onChange={e => setJd(e.target.value)}
                className="mt-1 block w-full rounded bg-surface/70 text-text p-4"
                placeholder="Paste JD here…"
              />
            </label>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onGenerate}
                disabled={loading || !jd.trim()}
                className={`bg-primary ${loading ? "text-gray-400" : "text-white"} px-6 py-2 rounded hover:scale-105 transition`}
              >
                {loading ? "Generating…" : "Generate"}
              </button>
              <button
                onClick={() => { setManager(""); setCustomInstr(""); setJd("") }}
                disabled={loading && !jd.trim()}
                className="bg-muted text-text px-6 py-2 rounded hover:scale-105 transition"
              >
                Clear
              </button>
            </div>
            {/* Default Instruction Viewer */}

            {error && <p className="text-red-400">{error}</p>}
            <details className="group bg-surface/70 backdrop-blur rounded-lg border border-primary/20">
              <summary className="px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-surface/80 transition">
                <span className="text-sm text-text font-medium">View Default Instruction</span>
                <svg className="w-4 h-4 text-muted group-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <pre className="px-4 py-3 text-xs text-text whitespace-pre-wrap border-t border-primary/20">
                {DEFAULT_SYSTEM_INSTRUCTION}
              </pre>
            </details>
          </div>
        </div>
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

          {letters.length > 0 && (
            <Letter letters={letters} copyToClipboard={copyToClipboard} />
          )}

        </div>
      </section>

      <footer className="mt-8 mb-8 text-xs text-muted z-10">
        Built with Next.js + Tailwind CSS. Theme: dark bluish with violet tones.
      </footer>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // translucent white
            color: '#a7c957',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)', // for Safari
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }
        }}
      />

    </main>
  );
}

