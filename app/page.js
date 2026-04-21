"use client";

import { useState, useRef } from "react";

import Letter from "./components/Letter";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Controls from "./components/Controls";
import IntroModal from "./components/IntroModal";

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
    <main className="relative min-h-screen flex flex-col items-center md:px-4 md:py-6 p-5 bg-white text-gray-900 overflow-hidden">
      <Header />

      <Controls
        manager={manager} setManager={setManager}
        resumeLink={resumeLink} setResumeLink={setResumeLink}
        model={model} setModel={setModel}
        customInstr={customInstr} setCustomInstr={setCustomInstr}
        jd={jd} setJd={setJd}
        onGenerate={onGenerate}
        loading={loading}
        error={error}
      />

      <button
        onClick={() => setLetters([])}
        disabled={letters.length === 0}
        className="bg-white text-blue-600 border border-gray-300 px-6 py-2 rounded-full hover:bg-blue-50 transition-all duration-200 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Reset
      </button>

      {/* Slider */}
      <section className="relative w-full flex-1 z-10 mt-4">
        {letters.length === 0 ? (
          <div className="w-full flex justify-center py-16">
            <p className="text-gray-400 text-base">Your generated cover letters will appear here.</p>
          </div>
        ) : (
          <Letter letters={letters} copyToClipboard={copyToClipboard} sliderRef={sliderRef} />
        )}
      </section>

      <footer className="mt-8 mb-6 text-xs text-gray-400 z-10 text-center">
        Built with Next.js + Tailwind CSS.
      </footer>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            backgroundColor: '#323232',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '14px',
            padding: '12px 24px',
          }
        }}
      />

      <IntroModal />
    </main>
  );
}
