'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '0 INR',
    period: 'forever',
    desc: 'Perfect for getting started',
    features: [
      '5 cover letters per day',
      'LinkedIn job extraction',
      'Basic AI model',
      'Copy to clipboard',
    ],
    cta: 'Start Free',
    popular: false,
    gradient: '',
  },
  {
    name: 'Pro',
    price: '300 INR',
    period: '/month',
    desc: 'For serious job seekers',
    features: [
      'Unlimited cover letters',
      'LinkedIn job extraction',
      'All AI models (GPT-4, Claude, etc.)',
      'Custom instructions',
      'Resume/portfolio link support',
      'Priority generation speed',
      'Download as PDF',
    ],
    cta: 'Go Pro',
    popular: true,
    gradient: 'from-blue-500 to-purple-500',
  },
];

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="gradient-orb w-[500px] h-[500px] bg-blue-200/15 top-0 -right-40" />
      <div className="landing-section py-0 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-sm font-medium text-blue-600 mb-4">Pricing</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Simple, <span className="gradient-text">honest</span> pricing
          </h2>
          <p className="text-lg text-slate-500">Start free. Upgrade when you need more.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className={`relative ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              <div className={`clay-card p-8 h-full flex flex-col ${plan.popular ? 'ring-2 ring-blue-400/30' : ''}`}>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{plan.name}</h3>
                  <p className="text-sm text-slate-400">{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <button className={`w-full py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 ${plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                    {plan.cta}
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
