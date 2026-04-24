'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const features = [
  {
    title: 'Tailored to each job automatically',
    desc: 'Every letter is written from scratch based on the specific job description. No recycled templates, no generic filler.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
    color: '#3B82F6',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Pick your writing style',
    desc: 'Switch between AI models for different tones — formal, conversational, technical. Find the voice that fits you.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
    ),
    color: '#8B5CF6',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'You control the output',
    desc: 'Add custom instructions — emphasize specific skills, set a tone, mention projects. The AI listens.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
    ),
    color: '#06B6D4',
    bgColor: 'bg-cyan-50',
  },
  {
    title: 'Uses your real experience',
    desc: 'Link your resume or portfolio so the AI references your actual background — not made-up qualifications.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
    ),
    color: '#F59E0B',
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Matches job requirements instantly',
    desc: 'Paste a LinkedIn URL and CovGen auto-extracts every requirement, skill, and role detail. Zero manual work.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>
    ),
    color: '#2563EB',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'From generation to application in seconds',
    desc: 'One click to copy. One click to download. No friction between "I want this job" and "I applied."',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
    ),
    color: '#10B981',
    bgColor: 'bg-emerald-50',
  },
];


export default function FeatureGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-24 sm:py-32" style={{ backgroundColor: 'var(--landing-bg-alt)' }}>
      <div className="landing-section py-0" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-sm font-medium text-blue-600 mb-4">Features</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Everything you need. <span className="gradient-text">Nothing you don&apos;t.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="clay-card p-7 group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl ${f.bgColor} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`} style={{ color: f.color }}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
