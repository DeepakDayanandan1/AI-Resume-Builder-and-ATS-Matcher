import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drafted — Build. Match. Get Hired.",
  description:
    "Build professional resumes, analyze ATS compatibility, match against job descriptions, and get AI-powered optimization suggestions.",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Drafted — Build. Match. Get Hired.",
    description:
      "Build professional resumes, analyze ATS compatibility, match against job descriptions, and get AI-powered optimization suggestions.",
    url: "https://drafted-ats.vercel.app",
    siteName: "Drafted",
    images: [
      {
        url: "https://drafted-ats.vercel.app/frame.png",
        width: 1200,
        height: 630,
        alt: "Drafted — AI-Powered Resume Builder & ATS Matcher",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drafted — Build. Match. Get Hired.",
    description:
      "Build professional resumes, analyze ATS compatibility, match against job descriptions, and get AI-powered optimization suggestions.",
    images: ["https://drafted-ats.vercel.app/frame.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
