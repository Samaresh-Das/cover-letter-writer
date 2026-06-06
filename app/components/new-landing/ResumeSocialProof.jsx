'use client';

import { motion } from 'motion/react';
import { LuStar } from 'react-icons/lu';

const testimonials = [
  {
    quote: "I was struggling to get past the ATS for months. Covgen automatically extracted the tech stack from the JD and optimized my project bullets. I got a callback for a Senior Backend role the next day.",
    name: "Sarah J.",
    role: "Backend Engineer",
    company: "Series B Startup",
    avatarColor: "#f59e0b" // amber-500
  },
  {
    quote: "It saved me hours of writing bullet points. The AI knew exactly how to phrase my React and Node.js experience to sound like high-impact engineering achievements rather than just listing tools.",
    name: "David K.",
    role: "Fullstack Developer",
    company: "Fintech Co.",
    avatarColor: "#ec4899" // pink-500
  },
  {
    quote: "The ability to generate multiple versions tailored for different stacks without manually copying and pasting is incredible. I've seen a 3x increase in my engineering interview rate.",
    name: "Elena M.",
    role: "DevOps Engineer",
    company: "Cloud Infrastructure",
    avatarColor: "#3b82f6" // blue-500
  }
];

// Generates a simple abstract SVG blob avatar
const AbstractAvatar = ({ color }) => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 rounded-full shadow-sm" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`grad-${color.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor={`${color}88`} />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="#f8fafc" />
    <path fill={`url(#grad-${color.replace('#','')})`} d="M45,20 C60,15 80,30 85,50 C90,75 70,90 50,85 C25,80 15,65 20,40 C25,20 30,25 45,20 Z" />
    <circle cx="65" cy="40" r="8" fill="#ffffff" opacity="0.6" />
    <circle cx="35" cy="60" r="15" fill={color} opacity="0.3" />
  </svg>
);

export default function ResumeSocialProof() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-950">From developers who got the interview.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => {
            // Fan-in animation variants based on index
            let initial = { opacity: 0, y: 50 };
            if (index === 0) initial = { opacity: 0, x: -50, y: 30, rotate: -5 };
            if (index === 2) initial = { opacity: 0, x: 50, y: 30, rotate: 5 };

            return (
              <motion.div
                key={index}
                initial={initial}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: index * 0.15, type: 'spring', bounce: 0.4 }}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-8 relative flex flex-col justify-between hover:shadow-xl transition-shadow"
              >
                {/* Large Background Quote Icon */}
                <div className="absolute top-6 left-6 text-9xl text-amber-500 opacity-[0.05] font-serif leading-none select-none pointer-events-none">
                  &ldquo;
                </div>

                <div className="relative z-10 mb-8">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(i => <LuStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">"{t.quote}"</p>
                </div>

                <div className="flex items-center gap-4 relative z-10 border-t border-slate-200/60 pt-4">
                  <AbstractAvatar color={t.avatarColor} />
                  <div>
                    <h4 className="font-bold text-slate-950 text-sm">{t.name}</h4>
                    <p className="text-xs text-slate-500">{t.role}, {t.company}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
