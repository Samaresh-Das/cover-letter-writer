import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import { Navbar } from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  manifest: "/manifest.webmanifest",
  title: "CovGen – Cover Letter Generator",
  description:
    "CovGen is your AI-powered assistant to generate personalized, professional cover letters in seconds. Paste a job description, customize your details, and get a tailored letter aligned with your skills and experience.",
  keywords: [
    "AI cover letter",
    "cover letter generator",
    "Next.js cover letter tool",
    "personalized cover letter",
    "CovGen",
    "job application",
    "resume",
    "job seeker tools"
  ],
  authors: [{ name: "Samaresh Das", url: "https://portfolio-2-tau-sable.vercel.app/" }],
  creator: "Samaresh Das",
  openGraph: {
    title: "CovGen – Create Job-Winning Cover Letters Instantly",
    description:
      "CovGen helps job seekers generate AI-powered cover letters based on real job descriptions with modern design and features.",
    url: "https://cover-letter-writer-ajmg.vercel.app/",
    siteName: "CovGen",
    images: [
      {
        url: "https://your-app.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "CovGen App Preview"
      }
    ],
    type: "website"
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
