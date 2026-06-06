'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

export default function ResumeFinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden border-t border-amber-100/50">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-orange-100/30 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-400/10 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-black text-slate-950 mb-6 tracking-tight"
        >
          Your next big engineering role <br className="hidden md:block"/> shouldn't be blocked by a PDF.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium"
        >
          Let AI handle the ATS keyword matching and impact formatting. You focus on system design and algorithms.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Shimmer Button Container */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes shimmer {
              100% {
                transform: translateX(100%);
              }
            }
            .btn-shimmer:hover .shimmer-element {
              animation: shimmer 1.5s infinite;
            }
          `}} />
          
          <Link href="/auth" className="btn-shimmer inline-block relative overflow-hidden px-10 py-4 bg-slate-950 text-white font-bold rounded-2xl text-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.2)] transition-all hover:scale-105 active:scale-95 group">
              
              <span className="relative z-10">Optimize your engineering resume</span>
              
              {/* Shimmer Effect overlay */}
              <div className="shimmer-element absolute top-0 left-0 h-full w-[200%] -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              
          </Link>
        </motion.div>
        
      </div>
    </section>
  );
}
