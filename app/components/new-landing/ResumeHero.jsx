'use client';

import { motion } from 'motion/react';
import { LuFileText } from 'react-icons/lu';
import Link from 'next/link';

export default function ResumeHero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 mt-[-80px] pt-[80px]">
      
      <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-50/50 backdrop-blur-sm mb-8"
        >
          <div className="absolute inset-0 rounded-full border border-amber-400 animate-[pulse_2s_ease-in-out_infinite]" style={{ pointerEvents: 'none' }} />
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-bold text-amber-900 tracking-wide uppercase">v2.0 — Built for Software Engineers</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-950 tracking-tight leading-[1.1]">
            Build engineering resumes that <br />
            pass <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400">
              ATS filters.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-amber-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" />
              </svg>
            </span>
            <br />
            Without the boilerplate.
          </h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Turn your tech stack, projects, and system design experience into recruiter-ready resumes. Our AI extracts technical requirements from job descriptions and optimizes your bullets for maximum engineering impact.
        </motion.p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/auth"
              className="inline-block px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-[0_8px_20px_-6px_rgba(245,158,11,0.5)] transition-all hover:scale-105 active:scale-95"
            >
              Optimize your resume
            </Link>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            onClick={() => {
              document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-all hover:text-slate-900 border border-slate-200"
          >
            See how it works
          </motion.button>
        </div>
      </div>

      {/* Product Preview Mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
        className="relative w-full max-w-5xl mx-auto"
      >
        {/* Ambient Glow */}
        <div className="absolute -inset-4 bg-amber-500/20 blur-[80px] rounded-full z-0" />

        {/* Card UI */}
        <div className="relative z-10 bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row aspect-[16/10] md:aspect-[21/9]">
          
          {/* Top Bar for Mobile / Left Sidebar for Desktop */}
          <div className="w-full md:w-64 bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>

            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {['Contact', 'Experience', 'Education', 'Skills'].map((item, i) => (
                <div key={item} className={`px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0 ${i === 1 ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-300'}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 p-6 md:p-8 relative bg-[#0f172a]">
            {/* ATS Score Badge */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-700 shadow-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-amber-500 flex items-center justify-center">
                <span className="text-amber-500 font-bold text-sm">87</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">ATS Match</p>
                <p className="text-amber-500 text-xs">Excellent</p>
              </div>
            </div>

            {/* Mock Content */}
            <div className="max-w-2xl mt-4">
              <div className="h-6 w-48 bg-slate-800 rounded mb-8" />
              
              <div className="space-y-6">
                {[1, 2, 3].map((block) => (
                  <div key={block} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-32 bg-slate-700 rounded" />
                      <div className="h-3 w-24 bg-slate-800 rounded" />
                    </div>
                    <div className="h-3 w-64 bg-slate-800 rounded" />
                    <div className="pl-4 space-y-2 border-l-2 border-amber-500/30">
                      <div className="h-2 w-full max-w-[90%] bg-slate-800 rounded" />
                      <div className="h-2 w-full max-w-[85%] bg-slate-800 rounded" />
                      <div className="h-2 w-full max-w-[95%] bg-slate-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* AI Generation overlay effect (optional subtle pulse) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
