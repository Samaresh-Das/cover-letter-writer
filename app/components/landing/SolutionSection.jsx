'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export default function SolutionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: '< 10s', label: 'Generation time' },
    { value: '3+', label: 'AI models' },
    { value: '100%', label: 'Free to start' },
  ];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="gradient-orb w-[600px] h-[600px] bg-blue-200/20 -top-60 -left-40" />
      <div className="gradient-orb w-[400px] h-[400px] bg-purple-200/20 bottom-0 right-0" />

      <div className="landing-section py-0 relative z-10" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-sm font-medium text-blue-600 mb-6">The Solution</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Meet <span className="gradient-text">CovGen</span>
            </h2>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              CovGen reads the job description so you don&apos;t have to. Paste a LinkedIn job link, and our AI extracts the requirements, matches them to your profile, and writes a letter that sounds like you.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl sm:text-3xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.value}</div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="clay-card p-1">
              <div className="rounded-[16px] bg-gradient-to-br from-blue-50 to-purple-50 p-6 sm:p-8">
                {/* Window Chrome */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-auto text-xs text-slate-400 font-mono">cover-letter.md</span>
                </div>

                {/* Animated Letter Content */}
                <div className="space-y-3 text-sm text-slate-600">
                  {/* Greeting - fades in first */}
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="font-semibold text-slate-800"
                  >
                    Dear Hiring Manager,
                  </motion.p>

                  {/* Paragraph 1 - lines write in sequentially */}
                  <div className="space-y-2">
                    {[
                      { w: 'w-full', color: 'bg-slate-200/60', delay: 0.9 },
                      { w: 'w-11/12', color: 'bg-slate-200/60', delay: 1.1 },
                      { w: 'w-9/12', color: 'bg-blue-300/50', delay: 1.3 },
                    ].map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: line.delay, ease: [0.22, 1, 0.36, 1] }}
                        style={{ originX: 0 }}
                        className={`h-3 ${line.color} rounded-full ${line.w}`}
                      />
                    ))}
                  </div>

                  {/* Paragraph 2 - lines write in with more delay */}
                  <div className="space-y-2 mt-4">
                    {[
                      { w: 'w-full', color: 'bg-slate-200/60', delay: 1.6 },
                      { w: 'w-10/12', color: 'bg-purple-300/50', delay: 1.8 },
                      { w: 'w-8/12', color: 'bg-slate-200/60', delay: 2.0 },
                    ].map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: line.delay, ease: [0.22, 1, 0.36, 1] }}
                        style={{ originX: 0 }}
                        className={`h-3 ${line.color} rounded-full ${line.w}`}
                      />
                    ))}
                  </div>

                  {/* Closing - appears last */}
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 2.3 }}
                    className="font-semibold text-slate-800 pt-3"
                  >
                    Best regards,<br />Your Name
                  </motion.p>
                </div>

                {/* AI Badge - pops in at the end */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 2.6, type: 'spring', stiffness: 200 }}
                  className="mt-5 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-blue-100 w-fit"
                >
                  <motion.svg
                    animate={isInView ? { rotate: [0, 15, -15, 0] } : {}}
                    transition={{ duration: 0.5, delay: 2.8 }}
                    className="w-4 h-4 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </motion.svg>
                  <span className="text-xs font-medium text-blue-600">Generated by AI in 6.2s</span>
                </motion.div>
              </div>
            </div>
            <div className="absolute -inset-6 bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-cyan-200/20 rounded-3xl blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
