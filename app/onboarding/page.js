'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const [resumeLink, setResumeLink] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeLink || !customInstructions) {
      toast.error('Both fields are required to proceed.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/onboarding`,
        { resumeLink, customInstructions },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local storage user data
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        user.resumeLink = resumeLink;
        user.customInstructions = customInstructions;
        localStorage.setItem('user', JSON.stringify(user));
      }

      toast.success('Onboarding complete!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update details. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] border border-gray-100">
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3 font-geist-sans">Just one more step...</h1>
          <p className="text-gray-500 font-inter text-lg">We need a few details to personalize your cover letters perfectly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="resumeLink" className="block text-sm font-semibold text-gray-700">
              Default Resume Link (Google Drive, Dropbox, etc.) <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="resumeLink"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              placeholder="https://docs.google.com/document/d/..."
              className="w-full px-5 py-4 bg-[#f8fafc] border-transparent rounded-2xl text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-[inset_2px_2px_5px_#e2e8f0,inset_-2px_-2px_5px_#ffffff]"
              required
            />
            <p className="text-xs text-gray-500 ml-2">Please ensure the link is publicly accessible.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="customInstructions" className="block text-sm font-semibold text-gray-700">
              Default Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              id="customInstructions"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g., Focus on my 5 years of React experience. Keep the tone professional but enthusiastic. Mention my leadership roles."
              rows={5}
              className="w-full px-5 py-4 bg-[#f8fafc] border-transparent rounded-2xl text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-[inset_2px_2px_5px_#e2e8f0,inset_-2px_-2px_5px_#ffffff] resize-none"
              required
            />
            <p className="text-xs text-gray-500 ml-2">These instructions will be applied to every generated letter by default.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 text-white font-bold text-lg rounded-2xl bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 shadow-[4px_4px_10px_rgba(37,99,235,0.3),-4px_-4px_10px_rgba(255,255,255,0.8)] active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Complete Setup & Go to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
