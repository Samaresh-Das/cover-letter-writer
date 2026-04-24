'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import WaveCanvas from './WaveCanvas';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* WebGL Wave Background */}
      <WaveCanvas />

      {/* Gradient Orbs */}
      <div className="gradient-orb w-[500px] h-[500px] bg-blue-400/30 -top-40 -right-40" style={{ animation: 'float 8s ease-in-out infinite' }} />
      <div className="gradient-orb w-[400px] h-[400px] bg-purple-400/20 -bottom-20 -left-20" style={{ animation: 'float 10s ease-in-out infinite 2s' }} />
      <div className="gradient-orb w-[300px] h-[300px] bg-cyan-300/20 top-1/3 right-1/4" style={{ animation: 'float 12s ease-in-out infinite 4s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200/60 mb-8"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-sm font-medium text-blue-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            LinkedIn Auto-Extract — Paste a link, get a letter
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Turn LinkedIn job posts into{' '}
          <br className="hidden sm:block" />
          <span className="gradient-text">cover letters — instantly.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Drop a job link. Our AI extracts the description, matches your skills,
          <br className="hidden sm:block" />
          and writes a cover letter that actually gets read.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <button className="btn-primary-landing text-base px-8 py-4 cursor-pointer group">
              Try CovGen Now
              <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </Link>
          <a href="#how-it-works">
            <button className="btn-secondary-landing text-base px-8 py-4 cursor-pointer group">
              See How It Works
              <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </a>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Instant results
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            LinkedIn auto-extract
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            AI-powered
          </div>
        </motion.div>

        {/* Hero Visual - Floating Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 relative max-w-3xl mx-auto"
        >
          <div className="clay-card p-1 overflow-hidden">
            <div className="rounded-[16px] bg-gradient-to-br from-slate-50 to-blue-50/50 p-5 sm:p-6">
              {/* Window Chrome */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-slate-400 font-mono">covgen.app/dashboard</span>
              </div>
              {/* App Preview - Split Pane */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left - Job Description */}
                <div className="bg-white rounded-xl p-4 border border-blue-100/80">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Description</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 bg-slate-100 rounded-full w-full" />
                    <div className="h-2.5 bg-slate-100 rounded-full w-10/12" />
                    <div className="h-2.5 bg-blue-100/60 rounded-full w-8/12" />
                    <div className="h-2.5 bg-slate-100 rounded-full w-11/12" />
                    <div className="h-2.5 bg-slate-100 rounded-full w-6/12" />
                  </div>
                </div>
                {/* Right - Generated Letter */}
                <div className="bg-white rounded-xl p-4 border border-green-100/80">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cover Letter</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 bg-slate-100 rounded-full w-full" />
                    <div className="h-2.5 bg-slate-100 rounded-full w-11/12" />
                    <div className="h-2.5 bg-purple-100/50 rounded-full w-9/12" />
                    <div className="h-2.5 bg-slate-100 rounded-full w-full" />
                    <div className="h-2.5 bg-slate-100 rounded-full w-7/12" />
                  </div>
                </div>
              </div>
              {/* Bottom Status Bar */}
              <div className="mt-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-[11px] text-slate-400">AI-powered generation</span>
                </div>
                <span className="text-[11px] text-slate-300">Try it on the dashboard →</span>
              </div>
            </div>
          </div>

          {/* Glow Effect Behind Card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-200/30 via-purple-200/30 to-cyan-200/30 rounded-3xl blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
