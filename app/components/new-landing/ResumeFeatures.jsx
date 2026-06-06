'use client';

import { motion } from 'motion/react';
import { LuFileText, LuWand, LuLayers } from 'react-icons/lu';

const features = [
  {
    title: 'Technical Keyword Matching',
    desc: "See your ATS match percentage update live. Our AI ensures your stack and skills perfectly align with the job description.",
    icon: LuFileText,
  },
  {
    title: 'Engineering Impact Rewriting',
    desc: 'Describe what you shipped. AI rewrites weak bullets into impact-focused engineering achievements with the right technical phrasing.',
    icon: LuWand,
  },
  {
    title: 'Tailored For Your Stack',
    desc: 'Stop sending generic resumes. Generate React, Python, Node.js, or Fullstack tailored resumes specifically for each role in one click.',
    icon: LuLayers,
  }
];

export default function ResumeFeatures() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-950">Built for modern tech hiring.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-200 ease-out overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-amber-500" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-950 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
                
                {/* Animated bottom border sweep */}
                <div className="absolute bottom-0 left-0 h-1 w-full bg-amber-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
