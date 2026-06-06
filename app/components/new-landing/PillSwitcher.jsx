'use client';

import { motion } from 'motion/react';

export default function PillSwitcher({ mode, setMode }) {
  const isResume = mode === 'resume';

  return (
    <div className="flex justify-center pt-32 pb-8 bg-transparent relative z-50">
      <div className="relative inline-flex items-center rounded-full p-1.5 bg-slate-100/50 backdrop-blur-md border border-slate-200/50 shadow-inner">
        {/* Pulsing border effect around the container */}
        <div className="absolute inset-0 rounded-full border border-orange-300/30 animate-[pulse_2s_ease-in-out_infinite]" style={{ pointerEvents: 'none' }} />

        <button
          onClick={() => setMode('resume')}
          className={`relative px-6 py-2.5 text-sm font-bold rounded-full transition-colors z-10 ${
            isResume ? 'text-orange-950' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {isResume && (
            <motion.div
              layoutId="pill-indicator"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-200 to-orange-300 shadow-sm"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.3,
              }}
            />
          )}
          <span className="relative z-20">Resume Builder</span>
        </button>

        <button
          onClick={() => setMode('cover-letter')}
          className={`relative px-6 py-2.5 text-sm font-bold rounded-full transition-colors z-10 ${
            !isResume ? 'text-blue-950' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {!isResume && (
            <motion.div
              layoutId="pill-indicator"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-200 to-indigo-300 shadow-sm"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.3,
              }}
            />
          )}
          <span className="relative z-20">Cover Letters</span>
        </button>
      </div>
    </div>
  );
}
