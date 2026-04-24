'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const steps = [
  {
    num: '1',
    title: 'Paste the job link',
    desc: 'Drop a LinkedIn job URL or paste the job description directly. CovGen handles both.',
    gradient: 'from-blue-500 to-blue-600',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    num: '2',
    title: 'AI does the heavy lifting',
    desc: 'Our AI reads the JD, identifies key skills and requirements, then writes a tailored cover letter.',
    gradient: 'from-purple-500 to-purple-600',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    num: '3',
    title: 'Copy, tweak, apply',
    desc: 'Get a polished letter instantly. Edit if needed, copy to clipboard, and submit your application.',
    gradient: 'from-cyan-500 to-cyan-600',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="landing-section py-0" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-sm font-medium text-blue-600 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Three steps. <span className="gradient-text">That&apos;s it.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">No accounts, no complicated setup. Just results.</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line (desktop) */}
          <div className="hidden md:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-cyan-200" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number Circle */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg mb-6 relative z-10`}>
                  {step.icon}
                </div>
                <div className="clay-card p-6 w-full">
                  <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
