'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const steps = [
  {
    num: '01',
    title: 'Paste LinkedIn URL',
    desc: 'Drop any LinkedIn job posting URL into CovGen. That\'s literally it.',
    color: '#3B82F6',
    bgColor: 'bg-blue-50',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'AI Extracts & Analyzes',
    desc: 'CovGen scrapes the job description, identifies key requirements, skills, and role specifics automatically.',
    color: '#8B5CF6',
    bgColor: 'bg-purple-50',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-500">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Cover Letter Ready',
    desc: 'A personalized, role-specific cover letter is generated. Copy it, tweak it, send it. Done.',
    color: '#06B6D4',
    bgColor: 'bg-cyan-50',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-500">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polyline points="16 13 12 17 8 13" className="text-cyan-500" />
      </svg>
    ),
  },
];

export default function LinkedInFeature() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative py-24 sm:py-32" style={{ backgroundColor: 'var(--landing-bg-alt)' }}>
      <div className="landing-section py-0" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 text-sm font-medium text-blue-600 mb-4">
            Key Feature
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            LinkedIn link in.{' '}
            <span className="gradient-text">Cover letter out.</span>
          </h2>
          <p className="text-lg text-slate-900 max-w-2xl mx-auto font-semibold mb-2">
            No copy-pasting. No scrolling. No formatting.
          </p>
          <p className="text-base text-slate-500 max-w-2xl mx-auto">
            Just drop the LinkedIn job URL — we extract everything and write a letter that references the exact role.
          </p>
        </motion.div>

        {/* Pipeline Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Flow Container */}
          <div className="clay-card p-6 sm:p-10 relative overflow-hidden">
            {/* Background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent" style={{ animation: 'shimmer 3s infinite', backgroundSize: '200% 100%' }} />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
              {steps.map((step, i) => (
                <div key={step.num} className="relative flex flex-col items-center text-center">
                  {/* Step Card */}
                  <div className={`w-full p-6 rounded-2xl ${step.bgColor} border border-white/80 relative`}>
                    <div className="text-xs font-bold text-slate-300 mb-3 tracking-wider">{step.num}</div>
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>

                  {/* Connector Arrow (desktop only) */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-20">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Input/Output Demo Below */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Input */}
          <div className="clay-card p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Input</div>
            <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
              <svg className="w-8 h-8 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <div>
                <code className="text-sm text-blue-700 font-semibold">linkedin.com/jobs/view/3847291...</code>
                <div className="text-xs text-blue-400 mt-0.5">Frontend Developer • Acme Corp</div>
              </div>
            </div>
          </div>
          {/* Output */}
          <div className="clay-card p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Output</div>
            <div className="bg-green-50 rounded-xl px-4 py-3 border border-green-100 text-sm text-green-800">
              &quot;...With <span className="font-bold bg-green-200/50 px-1 rounded">3 years of React experience</span> and proficiency in <span className="font-bold bg-green-200/50 px-1 rounded">TypeScript</span>, I&apos;m a strong match for the Frontend Developer role at <span className="font-bold bg-green-200/50 px-1 rounded">Acme Corp</span>...&quot;
            </div>
            <p className="text-xs text-slate-400 mt-2 italic">Notice how the letter references exact skills from the job description.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
