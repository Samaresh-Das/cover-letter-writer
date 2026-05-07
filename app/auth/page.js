'use client';

import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`, {
        credential: credentialResponse.credential,
      });

      const { token, onboardingComplete, user } = response.data;
      
      // Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      // Also set a cookie so Next.js middleware can read it for server-side redirects
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`; // 7 days
      
      toast.success('Successfully logged in!');

      if (!onboardingComplete) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    toast.error('Google Sign In was unsuccessful. Try again later.');
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] border border-gray-100 flex flex-col items-center text-center">
        
        <div className="w-32 h-32 rounded-3xl overflow-hidden mb-6 shadow-xl">
          <Image 
            src="/logo.jpg" 
            alt="CovGen Logo" 
            width={120} 
            height={120} 
            quality={100}
            unoptimized={true}
            className="object-cover w-full h-full"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2 font-geist-sans">Welcome to CovGen</h1>
        <p className="text-gray-500 mb-8 font-inter">Sign in to start creating job-winning cover letters instantly.</p>

        <div className="w-full bg-[#f8fafc] rounded-2xl p-6 mb-8 shadow-[inset_4px_4px_8px_#e2e8f0,inset_-4px_-4px_8px_#ffffff] border border-gray-100">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-yellow-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </span>
            <h3 className="text-xl font-semibold text-gray-800">10 Free Credits / Month</h3>
          </div>
          <p className="text-sm text-gray-600 font-medium">Your 10 free credits reset every month. No credit card required!</p>
        </div>

        {loading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        ) : (
          <div className="w-full flex justify-center hover:scale-105 transition-transform duration-300">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              theme="outline"
              size="large"
              shape="pill"
            />
          </div>
        )}
      </div>
    </div>
  );
}
