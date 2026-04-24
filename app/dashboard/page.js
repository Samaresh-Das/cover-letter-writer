"use client";

import { useState, useRef } from "react";

import Letter from "../components/Letter";
import { Toaster } from "react-hot-toast";
import Header from "../components/Header";
import Controls from "../components/Controls";
import IntroModal from "../components/IntroModal";


export default function Dashboard() {
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
    <main className="landing-page relative min-h-screen flex flex-col items-center md:px-4 md:py-8 p-6 overflow-hidden w-full">
      {/* Background Gradient Orbs (Static) */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10 pointer-events-none" />
      <div className="gradient-orb w-[600px] h-[600px] bg-blue-400/10 -top-40 -left-40" />
      <div className="gradient-orb w-[500px] h-[500px] bg-purple-400/10 top-1/4 -right-40" />

      <div className="relative z-10 w-full max-w-7xl xl:max-w-[1400px] mx-auto flex flex-col items-center">
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
        className="btn-secondary-landing mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reset Workspace
      </button>
      {/* <JDInputSection jd={jd} setJd={setJd} /> */}

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

      <footer className="mt-8 mb-8 text-xs text-slate-400 z-10">
        &copy; {new Date().getFullYear()} CovGen
      </footer>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#a7c957',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)', // for Safari
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }
        }}
      />

      <IntroModal />

      </div>
    </main>
  );
}
