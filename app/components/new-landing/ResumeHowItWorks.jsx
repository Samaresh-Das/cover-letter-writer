'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { LuUpload, LuBot, LuDownload } from 'react-icons/lu';

const steps = [
  {
    num: '01',
    title: 'Input stack & projects',
    desc: 'Upload your existing resume or pull from your past experience.',
    icon: LuUpload
  },
  {
    num: '02',
    title: 'Technical optimization',
    desc: 'AI extracts ATS keywords and optimizes engineering bullets.',
    icon: LuBot
  },
  {
    num: '03',
    title: 'Export & apply',
    desc: 'Download a recruiter-ready PDF for your next tech role.',
    icon: LuDownload
  }
];

export default function ResumeHowItWorks() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-20%" });

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-slate-950">Three steps to your next engineering role.</h2>
        </div>

        <div ref={containerRef} className="relative flex flex-col md:flex-row gap-12 md:gap-8 justify-between">
          
          {/* Animated SVG Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 z-0">
            <svg width="100%" height="2" preserveAspectRatio="none" className="text-amber-500/30">
              <line x1="0" y1="1" x2="100%" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
            </svg>
            <motion.div
              initial={{ width: '0%' }}
              animate={isInView ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 z-10"
            />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
                className="flex-1 relative z-10 flex flex-col items-center text-center group"
              >
                {/* Background Number */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-8xl md:text-[140px] font-black text-slate-900 opacity-5 select-none pointer-events-none">
                  {step.num}
                </div>
                
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-amber-500" />
                </div>
                
                <h3 className="text-lg font-bold text-slate-950 mb-2 relative z-20">{step.title}</h3>
                <p className="text-slate-500 text-sm max-w-xs relative z-20">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
