'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import Link from 'next/link';

export default function ResumePricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 bg-slate-50 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 mb-6">One plan. Everything included.</h2>
          
          {/* Cosmetic Toggle */}
          <div className="inline-flex items-center p-1 bg-slate-200/50 rounded-full border border-slate-200">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${!isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Yearly <span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 max-w-4xl mx-auto items-center">
          
          {/* Free Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col h-full md:h-[90%]"
          >
            <h3 className="text-xl font-black text-slate-900 mb-2">Free</h3>
            <div className="mb-4">
              <span className="text-4xl font-black text-slate-950">$0</span>
              <span className="text-slate-500 font-medium"> / forever</span>
            </div>
            <p className="text-slate-600 text-sm mb-8 font-medium">Build a baseline technical resume and test the waters.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['1 standard tech resume', 'Basic ATS scoring', 'Standard templates', 'PDF Export'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <LuCheck className="w-5 h-5 text-slate-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Link href="/auth" className="block w-full py-3.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-slate-300 hover:bg-slate-50 transition-colors text-center">
              Start for free
            </Link>
          </motion.div>

          {/* Pro Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.2 }}
            className="bg-slate-950 rounded-3xl border-2 border-amber-500 p-8 shadow-2xl shadow-amber-500/10 flex flex-col relative z-10"
          >
            {/* Badge */}
            <div className="absolute -top-4 right-8 bg-amber-500 text-amber-950 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
              Most Popular
            </div>

            <h3 className="text-xl font-black text-white mb-2">Pro</h3>
            <div className="mb-4">
              <span className="text-5xl font-black text-white">{isAnnual ? '$12' : '$15'}</span>
              <span className="text-slate-400 font-medium"> / month</span>
            </div>
            <p className="text-amber-200/80 text-sm mb-8 font-medium">The ultimate edge for securing top-tier engineering interviews.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Unlimited tailored resumes',
                'Advanced real-time ATS scoring',
                'AI bullet point rewriting',
                'Unlimited cover letters',
                'Priority support'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-medium">
                  <LuCheck className="w-5 h-5 text-amber-500 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Link href="/auth" className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-400 hover:to-orange-400 shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] transition-all hover:scale-[1.02] active:scale-[0.98] text-center">
              Upgrade to Pro
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
