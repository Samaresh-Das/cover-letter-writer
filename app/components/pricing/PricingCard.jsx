import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

export const PricingCard = ({ 
    title, 
    price, 
    credits, 
    features, 
    badge, 
    buttonText, 
    onAction, 
    isPopular,
    isSubscription = false,
    isLoading = false,
    isCurrentPlan = false
}) => {
    return (
        <motion.div 
            whileHover={{ y: -8 }}
            className={`relative p-8 rounded-3xl border flex flex-col h-full bg-white transition-all duration-300 ${
                isPopular 
                ? 'border-blue-500 shadow-[0_20px_40px_rgba(59,130,246,0.15)] ring-1 ring-blue-500' 
                : 'border-slate-200 shadow-lg hover:border-blue-200 hover:shadow-xl'
            }`}
        >
            {badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        {badge}
                    </span>
                </div>
            )}
            
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-black text-slate-900">
                        {price === 0 ? 'Free' : `₹${price}`}
                    </span>
                    {isSubscription && price > 0 && <span className="text-slate-500 mb-1">/month</span>}
                </div>
                <div className="mt-4 inline-block bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                    {credits} Credits {isSubscription ? (price === 0 ? '/day' : '/month') : ''}
                </div>
            </div>

            <div className="flex-grow">
                <ul className="space-y-3 mb-8">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-600">
                            <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={onAction}
                disabled={isLoading || isCurrentPlan}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer flex justify-center items-center ${
                    isCurrentPlan
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : isPopular
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : buttonText}
            </button>
        </motion.div>
    );
};
