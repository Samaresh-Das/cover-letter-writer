import "./globals.css";
import Footer from "./components/Footer";
import { Navbar } from "./components/Navbar";

export const metadata = {
  metadataBase: new URL("https://covgen-ai.vercel.app"),
  manifest: "/manifest.json",
  title: "AI Resume Builder & Cover Letter Generator — ATS Optimized | CovGen",
  description: "Build ATS-optimized resumes and generate personalized cover letters with AI in seconds. Paste a job description, get a tailored application. Used by 5,000+ job seekers.",
  keywords: [
    "AI resume builder",
    "AI cover letter generator",
    "ATS optimized resume",
    "cover letter generator free",
    "AI cover letter from job description",
    "resume builder AI",
    "LinkedIn job cover letter",
    "free cover letter generator",
    "ATS resume checker",
    "job application AI tool",
    "cover letter from LinkedIn",
    "AI resume writer",
    "best cover letter generator 2026",
    "resume builder ATS friendly",
    "CovGen",
    "Next.js cover letter tool"
  ],
  authors: [{ name: "Samaresh Das", url: "https://portfolio-2-tau-sable.vercel.app/" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "AI Resume Builder & Cover Letter Generator",
    description: "Generate ATS-optimized resumes and personalized cover letters in seconds.",
    url: "https://covgen-ai.vercel.app/",
    siteName: "CovGen",
    images: [
      {
        url: "https://covgen-ai.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "CovGen App Preview"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume Builder & Cover Letter Generator",
    description: "Generate ATS-optimized resumes and cover letters in seconds. Free to start.",
    images: ["https://covgen-ai.vercel.app/og-image.png"]
  },
  verification: {
    google: "H3Nzgw2aM8kSSZm3bnMKtygZ9lDBUapHc3pkBWeFb0Y",
  },
};


import GoogleProviderWrapper from "./components/GoogleProviderWrapper";

import AuthGuard from "./components/AuthGuard";
import V2FeaturesModal from "./components/V2FeaturesModal";
import { Toaster } from "react-hot-toast";

export default async function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "CovGen",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        <GoogleProviderWrapper>
          <AuthGuard>
            <Navbar />
            {children}
            <Footer />
            <V2FeaturesModal />
            <Toaster position="bottom-center" />
          </AuthGuard>
        </GoogleProviderWrapper>
      </body>
    </html>
  );
}
