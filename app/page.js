'use client';

import LandingNavbar from './components/landing/LandingNavbar';
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
import LandingFooter from './components/landing/LandingFooter';

export default function Home() {
  return (
    <div className="landing-page">
      <LandingNavbar />
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
      <LandingFooter />
    </div>
  );
}
