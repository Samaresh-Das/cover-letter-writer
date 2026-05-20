'use client';

import { motion, useInView, animate } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

const stats = [
  { value: 10, suffix: ' sec', label: 'Average generation time' },
  { value: 100, suffix: '%', label: 'ATS Optimized outputs' },
  { value: 5000, suffix: '+', label: 'Documents generated' },
  { value: 50, suffix: '+', label: 'Industry templates' }
];

function Counter({ from, to, suffix, inView, delay }) {
  const nodeRef = useRef(null);
  
  useEffect(() => {
    if (!inView) return;
    
    const controls = animate(from, to, {
      duration: 1.2,
      delay: delay,
      onUpdate(value) {
        if (nodeRef.current) {
          nodeRef.current.textContent = Math.round(value).toLocaleString() + suffix;
        }
      },
    });
    
    return () => controls.stop();
  }, [from, to, suffix, inView, delay]);

  return <span ref={nodeRef} className="text-3xl md:text-4xl font-black text-amber-500">{from}{suffix}</span>;
}

export default function ResumeStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="border-y border-slate-200/60 bg-white/50 backdrop-blur-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200/60">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col items-center text-center px-4 pt-8 md:pt-0 first:pt-0"
            >
              <Counter 
                from={0} 
                to={stat.value} 
                suffix={stat.suffix} 
                inView={isInView} 
                delay={index * 0.15} 
              />
              <span className="text-sm font-semibold text-slate-500 mt-2">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
