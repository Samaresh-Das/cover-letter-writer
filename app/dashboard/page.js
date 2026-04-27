"use client";

import { useState, useRef, useEffect } from "react";

import Letter from "../components/Letter";
import Header from "../components/Header";
import Controls from "../components/Controls";


export default function Dashboard() {
  const [jd, setJd] = useState("");
  const [manager, setManager] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [model, setModel] = useState(process.env.NEXT_PUBLIC_DEFAULT_MODEL);
  const [customInstr, setCustomInstr] = useState("");
  const [defaultUserInstr, setDefaultUserInstr] = useState("");
  const [loading, setLoading] = useState(false);
  const [letters, setLetters] = useState([]);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const generationTimestamps = useRef([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.resumeLink) setResumeLink(user.resumeLink);
        if (user.customInstructions) setDefaultUserInstr(user.customInstructions);
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  /**
   * Triggers the AI cover letter generation via the backend API.
   * Handles authentication, credit updates, and result state.
   */
  const onGenerate = async () => {
    if (!jd.trim()) return;
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
        setError("You must be logged in to generate.");
        setLoading(false);
        return;
    }

    // Rate Limit Check (2 per minute)
    const now = Date.now();
    generationTimestamps.current = generationTimestamps.current.filter(t => now - t < 60000);
    if (generationTimestamps.current.length >= 2) {
        setError("Rate limit reached. Please wait a minute before generating again.");
        setLoading(false);
        return;
    }

    // Credit Check
    const savedUser = localStorage.getItem('user');
    let currentCredits = 0;
    if (savedUser) {
        try {
            currentCredits = JSON.parse(savedUser).credits || 0;
        } catch(e) {}
    }

    const PREMIUM_MODELS = ["llama-3.1-70b-versatile", "llama-3.2-90b-vision-preview"];
    const requiredCredits = PREMIUM_MODELS.includes(model) ? 2 : 1;

    if (currentCredits < requiredCredits) {
        setError(`You've run out of credits or need more. This action requires ${requiredCredits} credits.`);
        setLoading(false);
        return;
    }

    generationTimestamps.current.push(now);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ jobDescription: jd, model, manager, resumeLink, customInstr }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Generation failed");

      const newLetter = { id: crypto.randomUUID(), text: data.text, createdAt: Date.now() };
      setLetters(prev => [newLetter, ...prev]);

      // Update credits in local storage
      const savedUser = localStorage.getItem('user');
      if (savedUser && data.creditsRemaining !== undefined) {
          const userObj = JSON.parse(savedUser);
          userObj.credits = data.creditsRemaining;
          localStorage.setItem('user', JSON.stringify(userObj));
          // Notify other components (Header, Navbar) to update
          window.dispatchEvent(new Event("userUpdated"));
      }

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
    <main className="landing-page relative min-h-screen flex flex-col items-center md:px-4 md:py-8 p-6 pt-20 md:pt-24 overflow-hidden w-full">
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
        defaultUserInstr={defaultUserInstr}
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
          {letters.length === 0 && (
            <div className="w-full text-center text-muted px-4 py-6">
              Your generated cover letters will appear here.
            </div>
          )}

          {letters.length > 0 && (
            <Letter letters={letters} copyToClipboard={copyToClipboard} sliderRef={sliderRef} />
          )}
      </section>

      <footer className="mt-8 mb-8 text-xs text-slate-400 z-10">
        &copy; {new Date().getFullYear()} CovGen
      </footer>
      </div>
    </main>
  );
}
