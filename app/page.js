'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

// Common
import LandingNavbar from './components/landing/LandingNavbar';
import LandingFooter from './components/landing/LandingFooter';
import PillSwitcher from './components/new-landing/PillSwitcher';

// Cover Letter (Existing)
import HeroSection from './components/landing/HeroSection';
import ProblemSection from './components/landing/ProblemSection';
import SolutionSection from './components/landing/SolutionSection';
import LinkedInFeature from './components/landing/LinkedInFeature';
import HowItWorks from './components/landing/HowItWorks';
import FeatureGrid from './components/landing/FeatureGrid';
import ProductDemo from './components/landing/ProductDemo';
import Testimonials from './components/landing/Testimonials';
import PricingSection from './components/landing/PricingSection';
import FinalCTA from './components/landing/FinalCTA';

// Resume Builder (New)
import ResumeHero from './components/new-landing/ResumeHero';
import ResumeStats from './components/new-landing/ResumeStats';
import ResumeLiveDemo from './components/new-landing/ResumeLiveDemo';
import ResumeFeatures from './components/new-landing/ResumeFeatures';
import ResumeHowItWorks from './components/new-landing/ResumeHowItWorks';
import ResumeSocialProof from './components/new-landing/ResumeSocialProof';
import ResumePricing from './components/new-landing/ResumePricing';
import ResumeFinalCTA from './components/new-landing/ResumeFinalCTA';

function LandingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  
  // Default to 'resume' as requested
  const [mode, setModeState] = useState(modeParam === 'cover-letter' ? 'cover-letter' : 'resume');

  useEffect(() => {
    if (modeParam && ['resume', 'cover-letter'].includes(modeParam)) {
      setModeState(modeParam);
    }
  }, [modeParam]);

  const setMode = (newMode) => {
    setModeState(newMode);
    router.replace(`/?mode=${newMode}`, { scroll: false });
  };

  const isResume = mode === 'resume';

  return (
    <div className="landing-page overflow-hidden relative">
      <LandingNavbar />
      
      {/* Background Gradient Transition */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-1000 ease-in-out z-[-1]"
        style={{
          background: isResume 
            ? 'radial-gradient(circle at top center, rgba(251, 191, 36, 0.05), transparent 60%)' 
            : 'radial-gradient(circle at top center, rgba(59, 130, 246, 0.05), transparent 60%)'
        }}
      />

      <PillSwitcher mode={mode} setMode={setMode} />

      <AnimatePresence mode="wait">
        {isResume ? (
          <motion.div
            key="resume"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, delay: 0.16 }}
            className="flex flex-col gap-24"
          >
            <ResumeHero />
            <ResumeStats />
            <ResumeLiveDemo />
            <ResumeFeatures />
            <ResumeHowItWorks />
            <ResumeSocialProof />
            <ResumePricing />
            <ResumeFinalCTA />
          </motion.div>
        ) : (
          <motion.div
            key="cover-letter"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, delay: 0.16 }}
          >
            <HeroSection />
            <ProblemSection />
            <SolutionSection />
            <LinkedInFeature />
            <HowItWorks />
            <FeatureGrid />
            <ProductDemo />
            <Testimonials />
            <PricingSection />
            <FinalCTA />
          </motion.div>
        )}
      </AnimatePresence>
      
      <LandingFooter />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
