'use client';
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="relative border-t border-blue-100/50" style={{ backgroundColor: 'var(--landing-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Cov<span className="gradient-text">Gen</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              AI-powered cover letter generator. Paste a LinkedIn job link, get a personalized letter in seconds.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Product</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-blue-500 transition-colors cursor-pointer">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-500 transition-colors cursor-pointer">How it Works</a></li>
              <li><a href="#pricing" className="hover:text-blue-500 transition-colors cursor-pointer">Pricing</a></li>
              <li><Link href="/auth" className="hover:text-blue-500 transition-colors cursor-pointer">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Legal</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-blue-500 transition-colors cursor-pointer">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-500 transition-colors cursor-pointer">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-blue-500 transition-colors cursor-pointer">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-blue-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} CovGen by Samaresh Das. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/samaresh-d-ab9621212" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/samareshthedev/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://portfolio-2-tau-sable.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-purple-500 transition-colors cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
