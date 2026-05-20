"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Shared visual frame for every frontend resume route.
 *
 * Called by:
 * - app/resumes/page.js
 * - app/resumes/upload/page.js
 * - app/resumes/[id]/analysis/page.js
 * - app/resumes/[id]/templates/page.js
 * - app/resumes/preview/[id]/page.js
 *
 * Props flowing into this component:
 * - title/eyebrow/description: page-level copy owned by the route page.
 * - action: optional right-side CTA/button/link owned by the route page.
 * - children: the actual page body owned by the route page.
 *
 * This component intentionally does not fetch data and does not know about
 * resumes, generated resumes, or backend routes. It only provides layout,
 * subtle orange reflection accents, and the shared Dashboard navigation link.
 */
export default function ResumePageShell({ title, eyebrow, description, action, children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white px-4 pb-12 pt-24 text-slate-950">
      {/* Subtle glaze/reflection layer: white remains dominant; orange is only a faint ambient accent. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.10),transparent_36%),linear-gradient(180deg,rgba(255,247,237,0.62),rgba(255,255,255,0)_34%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 flex flex-col gap-5 border-b border-orange-100/80 pb-7 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-600">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">{title}</h1>
            {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">{description}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/resumes" className="rounded-lg border border-orange-100 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_30px_rgba(249,115,22,0.08)] hover:border-orange-300">
              Dashboard
            </Link>
            {action}
          </div>
        </motion.div>
        {children}
      </div>
    </main>
  );
}
