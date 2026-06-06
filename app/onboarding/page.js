'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "DevOps / Cloud Engineer",
  "AI / ML Engineer",
  "Mobile App Developer"
];

const YOE_OPTIONS = [
  "0 - 1 years",
  "1 - 3 years",
  "3 - 5 years",
  "5 - 8 years",
  "8+ years"
];

const ROLE_OPTIONAL_LINKS = {
  "Frontend Engineer": ["Dribbble", "Behance", "Live Projects URL"],
  "Backend Engineer": ["API Documentation URL", "Open Source Contributions"],
  "Full Stack Engineer": ["Deployed Projects"],
  "DevOps / Cloud Engineer": ["Docker Hub", "Cloud Certifications"],
  "AI / ML Engineer": ["Kaggle", "HuggingFace", "Research Papers"],
  "Mobile App Developer": ["Play Store Apps", "App Store Apps"]
};

const COMMON_OPTIONAL_LINKS = [
  "GitHub",
  "Portfolio Website",
  "Personal Blog"
];

export default function OnboardingPage() {
  const router = useRouter();
  const [resumeLink, setResumeLink] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('0 - 1 years');
  const [isYoeOpen, setIsYoeOpen] = useState(false);
  const [jobRole, setJobRole] = useState('Frontend Engineer');
  const [optionalLinks, setOptionalLinks] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user has token or registrationToken
    const token = localStorage.getItem('token');
    const registrationToken = localStorage.getItem('registrationToken');
    if (!token && !registrationToken) {
      router.push('/auth');
      return;
    }

    // Load backup if exists
    try {
      const backupStr = localStorage.getItem('onboardingBackup');
      if (backupStr) {
        const backup = JSON.parse(backupStr);
        // Check if backup is within 1 week (7 * 24 * 60 * 60 * 1000 = 604800000 ms)
        if (Date.now() - backup.timestamp < 604800000) {
          if (backup.data.resumeLink) setResumeLink(backup.data.resumeLink);
          if (backup.data.customInstructions) setCustomInstructions(backup.data.customInstructions);
          if (backup.data.linkedInUrl) setLinkedInUrl(backup.data.linkedInUrl);
          if (backup.data.yearsOfExperience) setYearsOfExperience(backup.data.yearsOfExperience);
          if (backup.data.jobRole) setJobRole(backup.data.jobRole);
          if (backup.data.optionalLinks) setOptionalLinks(backup.data.optionalLinks);
          toast.success('Restored your previous progress.', { id: 'onboard-restore' });
        } else {
          localStorage.removeItem('onboardingBackup');
        }
      }
    } catch (e) {
      console.error('Error parsing onboarding backup', e);
    }
  }, [router]);

  // Save backup on change
  useEffect(() => {
    const data = {
      resumeLink, customInstructions, linkedInUrl, yearsOfExperience, jobRole, optionalLinks
    };
    // Only save if at least one field has been edited
    if (resumeLink || customInstructions || linkedInUrl || Object.keys(optionalLinks).length > 0) {
      localStorage.setItem('onboardingBackup', JSON.stringify({ data, timestamp: Date.now() }));
    }
  }, [resumeLink, customInstructions, linkedInUrl, yearsOfExperience, jobRole, optionalLinks]);

  // Handle beforeunload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isSubmitting) return;
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitting]);

  const handleLinkChange = (key, value) => {
    setOptionalLinks(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeLink || !customInstructions || !linkedInUrl) {
      toast.error('Please fill in all required fields to proceed.', { id: 'onboard-validate' });
      return;
    }

    // Basic LinkedIn URL validation
    if (!linkedInUrl.includes('linkedin.com')) {
      toast.error('Please enter a valid LinkedIn URL.', { id: 'onboard-linkedin' });
      return;
    }

    setLoading(true);
    setIsSubmitting(true);
    
    const registrationToken = localStorage.getItem('registrationToken');
    const token = localStorage.getItem('token');

    try {
      if (registrationToken) {
        // New user registration flow
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
          { resumeLink, customInstructions, linkedInUrl, yearsOfExperience, jobRole, optionalLinks },
          { headers: { Authorization: `Bearer ${registrationToken}` } }
        );
        
        const { token: finalToken, user } = response.data;
        
        // Save token and user, clear registration token
        localStorage.setItem('token', finalToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.removeItem('registrationToken');
        document.cookie = `token=${finalToken}; path=/; max-age=604800; SameSite=Lax`;
        document.cookie = `registrationToken=; path=/; max-age=0`; // Clear registration cookie
        
        toast.success('Registration complete!', { id: 'onboard-register' });
      } else if (token) {
        // Existing user update flow
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/onboarding`,
          { resumeLink, customInstructions, linkedInUrl, yearsOfExperience, jobRole, optionalLinks },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          Object.assign(user, { resumeLink, customInstructions, linkedInUrl, yearsOfExperience, jobRole, optionalLinks });
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        toast.success('Profile updated!', { id: 'onboard-update' });
      } else {
        throw new Error("No authentication token found.");
      }

      // Cleanup backup
      localStorage.removeItem('onboardingBackup');
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update details. Please try again.', { id: 'onboard-error' });
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const currentOptionalLinks = [...COMMON_OPTIONAL_LINKS, ...(ROLE_OPTIONAL_LINKS[jobRole] || [])];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 py-12">

      <div className="max-w-3xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] border border-gray-100">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3 font-geist-sans">Developer Profile Setup</h1>
          <p className="text-gray-500 font-inter text-lg">Help us understand your technical background to personalize your cover letters.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="linkedInUrl" className="block text-sm font-semibold text-gray-700">
                LinkedIn Profile URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="linkedInUrl"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-5 py-4 bg-[#f8fafc] border-transparent rounded-2xl text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-[inset_2px_2px_5px_#e2e8f0,inset_-2px_-2px_5px_#ffffff]"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsYoeOpen(!isYoeOpen)}
                  className="w-full px-5 py-4 bg-[#f8fafc] border-transparent rounded-2xl text-gray-800 text-left focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-[inset_2px_2px_5px_#e2e8f0,inset_-2px_-2px_5px_#ffffff] flex items-center justify-between"
                >
                  <span>{yearsOfExperience}</span>
                  <svg className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isYoeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isYoeOpen && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setIsYoeOpen(false)}></div>
                    <div className="absolute z-10 mt-2 w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {YOE_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setYearsOfExperience(opt);
                            setIsYoeOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors ${yearsOfExperience === opt ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Technical Expertise / Job Role <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ROLES.map(role => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setJobRole(role)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center text-center ${
                    jobRole === role 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-[#f8fafc] text-gray-700 hover:bg-gray-100 shadow-[inset_2px_2px_5px_#e2e8f0,inset_-2px_-2px_5px_#ffffff]'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Optional Links</h3>
              <p className="text-sm text-gray-500 mb-4">Add your portfolio, GitHub, or role-specific profiles to make your cover letter stand out.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentOptionalLinks.map(linkName => (
                  <div key={linkName} className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-600">{linkName}</label>
                    <input
                      type="url"
                      value={optionalLinks[linkName] || ''}
                      onChange={(e) => handleLinkChange(linkName, e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-[#f8fafc] border-transparent rounded-xl text-gray-800 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-[inset_2px_2px_5px_#e2e8f0,inset_-2px_-2px_5px_#ffffff]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-6">
             <div className="space-y-2">
              <label htmlFor="resumeLink" className="block text-sm font-semibold text-gray-700 flex justify-between">
                <span>Default Resume Link (Google Drive, Dropbox, etc.) <span className="text-red-500">*</span></span>
                <span className="text-xs text-gray-400 font-normal">{resumeLink?.length || 0}/500</span>
              </label>
              <input
                type="url"
                id="resumeLink"
                value={resumeLink}
                maxLength={500}
                onChange={(e) => setResumeLink(e.target.value)}
                placeholder="https://docs.google.com/document/d/..."
                className="w-full px-5 py-4 bg-[#f8fafc] border-transparent rounded-2xl text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-[inset_2px_2px_5px_#e2e8f0,inset_-2px_-2px_5px_#ffffff]"
                required
              />
              <p className="text-xs text-gray-500 ml-2">Please ensure the link is publicly accessible.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="customInstructions" className="block text-sm font-semibold text-gray-700 flex justify-between">
                <span>Default Instructions <span className="text-red-500">*</span></span>
                <span className="text-xs text-gray-400 font-normal">{customInstructions?.length || 0}/10000</span>
              </label>
              <textarea
                id="customInstructions"
                value={customInstructions}
                maxLength={10000}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g., Focus on my 5 years of React experience. Keep the tone professional but enthusiastic. Mention my leadership roles."
                rows={5}
                className="w-full px-5 py-4 bg-[#f8fafc] border-transparent rounded-2xl text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-[inset_2px_2px_5px_#e2e8f0,inset_-2px_-2px_5px_#ffffff] resize-none"
                required
              />
              <p className="text-xs text-gray-500 ml-2">These instructions will be applied to every generated letter by default.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 text-white font-bold text-lg rounded-2xl bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 shadow-[4px_4px_10px_rgba(37,99,235,0.3),-4px_-4px_10px_rgba(255,255,255,0.8)] active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.2)] disabled:opacity-70 disabled:cursor-not-allowed mt-8"
          >
            {loading ? 'Saving Profile...' : 'Complete Setup & Go to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
