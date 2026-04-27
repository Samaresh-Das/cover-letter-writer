import React from 'react';
import { Navbar } from '../components/Navbar';

export const metadata = {
  title: 'About Us | CovGen',
  description: 'Learn more about CovGen, the AI-powered cover letter generator designed to simplify your job application process.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans pb-24">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            About CovGen
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            CovGen was born out of a simple observation: writing personalized cover letters is one of the most time-consuming and daunting parts of the job search process.
          </p>
        </div>

        <section className="space-y-8 text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Our Mission</h2>
            <p>
              Our mission is to empower job seekers by simplifying the application process. We believe that every candidate deserves a chance to stand out, and our AI-powered tool is designed to help you do exactly that—without the hours of manual writing.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>What is CovGen?</h2>
            <p>
              CovGen is an AI-powered cover letter generator that uses advanced language models to craft tailored, professional cover letters in seconds. By analyzing job descriptions and your unique skills, we generate content that aligns perfectly with what recruiters are looking for.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Who We Serve</h2>
            <p>
              Whether you&apos;re a student applying for your first internship, a professional looking to make a career pivot, or an experienced executive, CovGen is built for you. We cater to users across all industries and experience levels.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>The Founder</h2>
            <p className="mb-4">
              CovGen was founded and is operated by <strong>Samaresh Das</strong> (Individual/Sole Proprietor), a developer passionate about building tools that solve real-world problems. With a background in software engineering and a deep interest in AI, Samaresh created CovGen to help fellow professionals navigate the competitive job market more effectively.
            </p>
            <p className="text-sm text-slate-500 italic">
              &quot;I wanted to build something that actually helps people get closer to their dream jobs by removing the friction of writing cover letters.&quot; — Samaresh Das
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
