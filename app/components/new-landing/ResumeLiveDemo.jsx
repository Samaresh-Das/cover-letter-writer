'use client';

import { motion } from 'motion/react';
import { LuArrowRight } from 'react-icons/lu';
import Link from 'next/link';

export default function ResumeLiveDemo() {
  return (
    <section id="demo-section" className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-950 mb-4">See it work in real time.</h2>
          <p className="text-lg text-slate-500 font-medium">No signup needed to watch.</p>
        </div>

        {/* Demo Card */}
        <div className="max-w-5xl mx-auto relative">
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative z-10">
            
            {/* LEFT PANEL */}
            <div className="flex-1 p-8 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded text-xs font-bold uppercase tracking-wider">Input</div>
                <span className="text-sm font-semibold text-slate-500">Paste job link or description.</span>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 h-64 relative shadow-sm">
                <p className="text-sm text-slate-600 font-mono leading-relaxed">
                  We are looking for a Senior Frontend Engineer with 5+ years of experience in React and Next.js. You should have a deep understanding of modern web aesthetics, performance optimization, and accessible UI development.
                </p>
                <div className="absolute bottom-4 left-4 flex items-center gap-1">
                  <div className="w-1.5 h-4 bg-amber-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* ANIMATED ARROW CONNECTING THE PANELS (desktop only) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center w-16 h-16 bg-white rounded-full border border-slate-200 shadow-sm">
              <svg className="w-8 h-8 text-amber-500 rotate-90 md:rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="2" y1="12" x2="20" y2="12" className="animate-[dash_1s_linear_infinite]" strokeDasharray="4 4" />
                <polyline points="15 5 22 12 15 19" />
              </svg>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 p-8 bg-slate-900 text-slate-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2.5 py-1 bg-amber-500/20 text-amber-500 rounded text-xs font-bold uppercase tracking-wider border border-amber-500/30">Output</div>
                <span className="text-sm font-semibold text-slate-400">ATS-Optimized Result</span>
              </div>
              
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 h-64 relative overflow-hidden shadow-inner">
                {/* CSS stream animation container */}
                <div className="relative">
                  <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes streamText {
                      0% { clip-path: inset(0 100% 0 0); opacity: 1; }
                      60% { clip-path: inset(0 0 0 0); opacity: 1; }
                      90% { clip-path: inset(0 0 0 0); opacity: 1; }
                      95% { opacity: 0; }
                      100% { clip-path: inset(0 100% 0 0); opacity: 0; }
                    }
                    .animate-stream {
                      animation: streamText 7s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                      display: inline-block;
                    }
                  `}} />
                  <div className="animate-stream text-sm font-mono leading-relaxed text-amber-100/90 whitespace-pre-wrap">
                    <span className="text-amber-400 font-bold">PROFESSIONAL SUMMARY</span><br/><br/>
                    Senior Frontend Engineer with 5+ years specializing in React and Next.js ecosystems. Proven track record in delivering high-performance, accessible web applications with modern aesthetics. <br/><br/>
                    <span className="text-amber-400 font-bold">KEY SKILLS</span><br/>
                    • Next.js / React (5+ years)<br/>
                    • Performance Optimization<br/>
                    • UI/UX Implementation
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-8 text-center">
            <Link href="/auth" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors">
              This is what your output looks like. Start free <LuArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
