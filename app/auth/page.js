'use client';

import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`, {
        credential: credentialResponse.credential,
      });

      const { token, onboardingComplete, user, requiresRegistration } = response.data;

      if (requiresRegistration) {
        // New user: do not save user data, save registration token and redirect to onboarding
        localStorage.setItem('registrationToken', token);
        // Set cookie so middleware allows /onboarding access
        document.cookie = `registrationToken=${token}; path=/; max-age=3600; SameSite=Lax`; // 1 hour
        toast.success('Google verification successful. Please complete your profile.', { id: 'auth-register' });
        router.push('/onboarding');
      } else {
        // Existing user
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`; // 7 days

        toast.success('Successfully logged in!', { id: 'auth-login' });

        if (!onboardingComplete) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Authentication failed. Please try again.', { id: 'auth-error' });
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    toast.error('Google Sign In was unsuccessful. Try again later.');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">


      {/* Animated Background */}
      <div className="absolute inset-0 bg-slate-50" />

      {/* Mesh gradient blobs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-200/30 blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, -20, 30, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.95, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-200/25 blur-[100px]"
      />
      <motion.div
        animate={{
          x: [0, 15, -15, 0],
          y: [0, -15, 15, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full bg-orange-200/20 blur-[80px]"
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors group"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to home
          </Link>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-slate-200/60 shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 md:p-10">

          {/* Logo + Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-2xl overflow-hidden ring-1 ring-slate-200/50 shadow-lg mb-5"
            >
              <Image
                src="/logo.jpg"
                alt="CovGen Logo"
                width={64}
                height={64}
                quality={100}
                unoptimized={true}
                className="object-cover w-full h-full"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-2xl font-bold text-slate-950 tracking-tight mb-2"
            >
              Welcome to CovGen
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-sm text-slate-500 max-w-xs leading-relaxed"
            >
              Sign in to build ATS-optimized resumes and generate tailored cover letters with AI.
            </motion.p>
          </div>

          {/* Free Credits Card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 border border-amber-200/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">10 Free Credits Every Month</h3>
                <p className="text-xs text-slate-500 mt-0.5">No credit card required to get started.</p>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative mb-8 mx-auto"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/80 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Continue with</span>
            </div>
          </motion.div>

          {/* Google Login */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-200" />
                  <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                </div>
                <span className="ml-3 text-sm font-medium text-slate-600">Signing you in...</span>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  theme="filled_black"
                  size="large"
                  shape="pill"
                  text="continue_with"
                  logo_alignment="center"
                />
              </div>
            )}
          </motion.div>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-6 text-center text-[11px] text-slate-400 leading-relaxed"
          >
            By continuing, you agree to our{' '}
            <Link href="/terms-and-conditions" className="underline hover:text-slate-600 transition-colors">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy-policy" className="underline hover:text-slate-600 transition-colors">Privacy Policy</Link>.
          </motion.p>
        </div>

        {/* Trusted by badge below card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-slate-400 font-medium">
            Trusted by <span className="text-slate-600 font-semibold">5,000+</span> job seekers worldwide
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
