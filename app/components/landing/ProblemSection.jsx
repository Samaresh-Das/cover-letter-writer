'use client';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { useInView } from 'motion/react';

const painPoints = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: '30+ minutes per letter',
    description: 'Writing a cover letter from scratch takes forever. Multiply that by 20 applications and you\'ve lost an entire week.',
    color: '#EF4444',
    bgColor: 'bg-red-50',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: 'Templates feel generic',
    description: 'Copy-paste templates don\'t work. Recruiters read dozens daily and can spot a template instantly. You blend in instead of standing out.',
    color: '#F59E0B',
    bgColor: 'bg-amber-50',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    title: 'Tailoring is exhausting',
    description: 'Reading job descriptions, matching keywords, adjusting tone — it\'s mentally draining work that steals energy from actual interview prep.',
    color: '#8B5CF6',
    bgColor: 'bg-purple-50',
  },
];

export default function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-24 sm:py-32" style={{ backgroundColor: 'var(--landing-bg-alt)' }}>
      <div className="landing-section py-0">
        <div ref={ref}>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 border border-red-200/60 text-sm font-medium text-red-600 mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              The Problem
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Cover letters shouldn&apos;t take{' '}
              <span className="text-red-500">30 minutes</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Yet most job seekers spend hours writing, rewriting, and second-guessing every sentence. Sound familiar?
            </p>
          </motion.div>

          {/* Pain Point Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {painPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className="clay-card p-7 sm:p-8 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${point.bgColor} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
                  style={{ color: point.color }}
                >
                  {point.icon}
                </div>
                <h3
                  className="text-lg font-bold text-slate-900 mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {point.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-[15px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
