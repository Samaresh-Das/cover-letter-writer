/**
 * Single source of truth for controlled resume templates.
 *
 * Called by:
 * - app/resumes/[id]/templates/page.js to render the selectable template list.
 * - Any future editor/preview controls should import from here instead of
 *   hard-coding template IDs.
 *
 * Important product rule:
 * - AI is allowed to tailor resume content, but it never creates layouts.
 * - These IDs must match backend enum values in:
 *   covgen-server/models/generated-resume.js
 */
export const resumeTemplates = [
  {
    id: "ats-classic",
    name: "ATS Classic",
    description: "Single-column, semantic, print-safe resume for ATS parsing.",
    badge: "ATS-safe",
    roles: ["software engineer", "developer", "technical", "engineer"],
  },
  {
    id: "modern-startup",
    name: "Modern Startup",
    description: "Compact profile header with controlled two-zone content.",
    badge: "Balanced",
    roles: ["startup", "product", "focused", "team"],
  },
  {
    id: "executive-minimal",
    name: "Executive Minimal",
    description: "Restrained executive layout for senior and leadership roles.",
    badge: "Leadership",
    roles: ["executive", "director", "vp", "c-level", "strategy"],
  },
  {
    id: "designer-ux",
    name: "UX Designer",
    description: "Portfolio-oriented editorial resume with refined hierarchy for UX and product design.",
    badge: "UX",
    roles: ["ux designer", "ui ux", "interaction designer", "product designer", "user research"],
  },
  {
    id: "designer-product",
    name: "Product Designer",
    description: "Strategic product storytelling with outcome-focused project blocks.",
    badge: "Product",
    roles: ["product designer", "product", "ux", "service designer", "design lead"],
  },
  {
    id: "executive-elite",
    name: "Executive Elite",
    description: "Premium leadership layout tuned for MBA and corporate strategy roles.",
    badge: "Executive",
    roles: ["mba", "corporate executive", "general manager", "strategy", "operations", "cfo", "coo"],
  },
  {
    id: "data-ai",
    name: "Data & AI",
    description: "Analytical, dashboard-style structure for AI, data science, and ML roles.",
    badge: "Technical",
    roles: ["data scientist", "ai engineer", "machine learning", "analytics", "ml engineer"],
  },
  {
    id: "marketing-studio",
    name: "Marketing Studio",
    description: "Editorial storytelling with campaign metrics and brand-focused rhythm.",
    badge: "Marketing",
    roles: ["marketing", "content strategist", "brand", "growth", "communications"],
  },
  {
    id: "fresher-launch",
    name: "Fresh Grad Launch",
    description: "Bright, modern starter layout for recent grads, interns, and first jobs.",
    badge: "Entry",
    roles: ["intern", "graduate", "student", "entry level", "fresher"],
  },
  {
    id: "creative-cinematic",
    name: "Creative Cinematic",
    description: "Bold visual framing for video editors, motion designers, and content creatives.",
    badge: "Creative",
    roles: ["video editor", "creative", "motion", "media", "film", "post production"],
  },
];

/**
 * Resolves a template by ID and falls back to ATS Classic.
 *
 * Currently available for future callers; the template selection page maps the
 * full resumeTemplates array directly because it needs badge/description data.
 */
export const templateById = (id) => resumeTemplates.find((template) => template.id === id) || resumeTemplates[0];
