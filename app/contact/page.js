'use client';
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions, feedback, or need support? We&apos;re here to help. Our team typically responds within 24–48 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Support Email</h3>
              <p className="text-lg font-semibold text-slate-900">
                <a href="mailto:covgen.support@gmail.com" className="hover:text-blue-600 transition-colors">covgen.support@gmail.com</a>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Our Office</h3>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                Uttar Fatak Raj Bari, B.C.ROAD.<br />
                Burdwan, West Bengal, INDIA
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Socials</h3>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/in/samaresh-d-ab9621212/" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">LinkedIn</a>
                <a href="https://www.instagram.com/samareshthedev/" className="text-slate-500 hover:text-pink-500 transition-colors font-medium">Instagram</a>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">Response Time</h4>
              <p className="text-sm text-slate-500">We aim to respond to all inquiries within 1-2 business days.</p>
            </div>
          </div>

          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all transform active:scale-95 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
