'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'CS Student, IIT Delhi',
    quote: 'I used to spend an hour on each cover letter. CovGen does it in 10 seconds. Applied to 15 jobs in one evening.',
    avatar: 'PS',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    name: 'Alex Rivera',
    role: 'Full-Stack Developer',
    quote: 'The LinkedIn extraction feature is genius. Paste the link, hit generate, done. No more copy-pasting job descriptions.',
    avatar: 'AR',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Sarah Kim',
    role: 'Freelance Designer',
    quote: 'Finally a tool that doesn\'t produce generic garbage. The letters actually reference specific job requirements. Impressed.',
    avatar: 'SK',
    gradient: 'from-cyan-500 to-blue-500',
  },
];

export default function Testimonials() {
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-sm font-medium text-blue-600 mb-4">Built for job seekers</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Generated <span className="gradient-text">1,000+</span> cover letters
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
              className="clay-card p-7"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed mb-6 text-[15px]">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
