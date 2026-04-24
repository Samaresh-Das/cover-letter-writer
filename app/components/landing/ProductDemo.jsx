'use client';
import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

const sampleInput = `https://www.linkedin.com/jobs/view/3847291056

Frontend Developer at Acme Corp

Requirements:
• 3+ years React/Next.js experience
• TypeScript proficiency
• Experience with REST APIs
• Strong problem-solving skills
• Team collaboration`;

const sampleOutput = `Dear Hiring Team at Acme Corp,

I'm writing to express my strong interest in the Frontend Developer position. With over 3 years of hands-on experience building production applications using React and Next.js, I'm confident I'd be a great fit for your team.

In my current role, I've led the development of several TypeScript-based web applications, integrating complex REST API architectures and improving load times by 40%. I thrive in collaborative environments and have a track record of translating design specs into pixel-perfect, accessible interfaces.

I'm particularly excited about Acme Corp's mission and would love the opportunity to contribute to your frontend engineering team.

Best regards,
Alex Chen`;

export default function ProductDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [showOutput, setShowOutput] = useState(false);
  const [displayedOutput, setDisplayedOutput] = useState('');

  useEffect(() => {
    if (!isInView) return;
    const showTimer = setTimeout(() => setShowOutput(true), 1200);
    return () => clearTimeout(showTimer);
  }, [isInView]);

  useEffect(() => {
    if (!showOutput) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx += 3;
      if (idx >= sampleOutput.length) {
        setDisplayedOutput(sampleOutput);
        clearInterval(interval);
      } else {
        setDisplayedOutput(sampleOutput.slice(0, idx));
      }
    }, 8);
    return () => clearInterval(interval);
  }, [showOutput]);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="landing-section py-0" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-sm font-medium text-blue-600 mb-4">Demo</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            See it <span className="gradient-text">in action</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="clay-card p-1 overflow-hidden">
            <div className="rounded-[16px] bg-gradient-to-br from-slate-50 to-blue-50/30">
              {/* Top Bar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-slate-400 font-mono">covgen.app — Demo</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {/* Input */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Input</span>
                  </div>
                  <pre className="text-[13px] text-slate-600 whitespace-pre-wrap leading-relaxed font-mono bg-white/60 rounded-xl p-4 border border-blue-50">{sampleInput}</pre>
                </div>

                {/* Output */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Output</span>
                    {showOutput && displayedOutput.length < sampleOutput.length && (
                      <span className="ml-auto text-xs text-blue-500 animate-pulse">Generating...</span>
                    )}
                  </div>
                  <div className="text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed bg-white/60 rounded-xl p-4 border border-green-50 min-h-[240px]">
                    {showOutput ? (
                      <>
                        {displayedOutput}
                        {displayedOutput.length < sampleOutput.length && (
                          <span className="inline-block w-0.5 h-4 bg-blue-500 animate-pulse ml-0.5 align-text-bottom" />
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[200px]">
                        <div className="flex items-center gap-3 text-slate-400">
                          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 11-6.219-8.56" />
                          </svg>
                          <span className="text-sm">Analyzing job description...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-200/10 via-purple-200/10 to-cyan-200/10 rounded-3xl blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
