'use client';
import React, { useState, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { toast } from 'react-hot-toast';

// ─────────────────────────────────────────────
// Top-20 disposable domain blocklist (client-side pre-check)
// ─────────────────────────────────────────────
const BLOCKED_DOMAINS_CLIENT = new Set([
  'mailinator.com', 'guerrillamail.com', 'temp-mail.org', 'tempmail.com',
  'yopmail.com', 'throwam.com', 'trashmail.com', 'fakeinbox.com',
  'maildrop.cc', 'mailnesia.com', 'mailsac.com', 'getnada.com',
  '10minutemail.com', '20minutemail.com', 'burnermail.io',
  'dispostable.com', 'discard.email', 'tempr.email',
  'mohmal.com', 'sharklasers.com',
]);

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Billing & Payments',
  'Bug Report',
  'Feature Request',
  'Other',
];

const RATE_LIMIT_KEY = 'covgen_contact_timestamps';
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isClientRateLimited() {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const timestamps = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    return recent.length >= RATE_LIMIT_MAX;
  } catch {
    return false;
  }
}

function recordClientSubmission() {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const timestamps = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    recent.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
  } catch {
    // silently ignore localStorage failures
  }
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
    website: '', // honeypot — must stay empty
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitCooldown = useRef(false); // debounce double-clicks

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debounce
    if (submitCooldown.current) return;
    submitCooldown.current = true;
    setTimeout(() => { submitCooldown.current = false; }, 2000);

    // Client-side rate limit check
    if (isClientRateLimited()) {
      toast.error('You\'ve sent too many messages. Please wait 15 minutes before trying again.');
      return;
    }

    // Client-side domain blocklist check
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    if (emailDomain && BLOCKED_DOMAINS_CLIENT.has(emailDomain)) {
      toast.error('Disposable or anonymous email addresses are not accepted. Please use a real email.');
      return;
    }

    // Min message length
    if (formData.message.trim().length < 10) {
      toast.error('Message must be at least 10 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
          website: formData.website, // honeypot
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Something went wrong. Please try again.');
        return;
      }

      recordClientSubmission();
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '', website: '' });
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32">
        <div className="text-center mb-16">
          <h1
            className="text-4xl font-black text-slate-900 mb-6 tracking-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions, feedback, or need support? We&apos;re here to help. Our team typically responds within 24–48 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* ── Sidebar info ── */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Support Email</h3>
              <p className="text-lg font-semibold text-slate-900">
                <a href="mailto:covgen.support@gmail.com" className="hover:text-blue-600 transition-colors">
                  covgen.support@gmail.com
                </a>
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
              <p className="text-sm text-slate-500">We aim to respond to all inquiries within 1–2 business days.</p>
            </div>
          </div>

          {/* ── Contact form ── */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">

              {/* Honeypot — hidden from real users, filled by bots */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <label htmlFor="website">Leave this field empty</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                  <span>Full Name</span>
                  <span className="text-xs text-slate-500 font-normal">{formData.name?.length || 0}/100</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                  <span>Email Address</span>
                  <span className="text-xs text-slate-500 font-normal">{formData.email?.length || 0}/254</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-slate-700 cursor-pointer"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  {SUBJECT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                  <span>Message</span>
                  <span className={`text-xs font-normal ${formData.message?.length < 10 && formData.message?.length > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                    {formData.message?.length || 0}/2000 {formData.message?.length > 0 && formData.message?.length < 10 ? '(min 10)' : ''}
                  </span>
                </label>
                <textarea
                  name="message"
                  required
                  maxLength={2000}
                  minLength={10}
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                />
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
