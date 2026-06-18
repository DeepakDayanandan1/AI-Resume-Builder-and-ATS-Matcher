"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/40 backdrop-blur-sm py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-cyan-500 fill-cyan-500/20" />
              <span className="text-2xl font-bold text-white tracking-tight">
                Drafted
              </span>
            </div>
            <p className="text-sm font-semibold text-white/90">
              Build. Match. Get Hired.
            </p>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              Build professional resumes, analyze ATS compatibility, match against job descriptions, and get AI-powered optimization suggestions. Tailor your resume for every opportunity to beat the ATS systems and impress recruiters.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/builder" className="text-muted-foreground hover:text-white transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link href="/analyzer" className="text-muted-foreground hover:text-white transition-colors">
                  ATS Analyzer
                </Link>
              </li>
              <li>
                <Link href="/matcher" className="text-muted-foreground hover:text-white transition-colors">
                  JD Matcher
                </Link>
              </li>
              <li>
                <Link href="/optimizer" className="text-muted-foreground hover:text-white transition-colors">
                  Optimizer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-white/5 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="text-center md:text-left">
            © {new Date().getFullYear()} Drafted. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <a href="#" className="hover:text-white transition-colors duration-200">Terms & Conditions</a>
            <span className="text-white/10 select-none hidden sm:inline">|</span>
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <span className="text-white/10 select-none hidden sm:inline">|</span>
            <a href="#" className="hover:text-white transition-colors duration-200">Cookie Policy</a>
            <span className="text-white/10 select-none hidden sm:inline">|</span>
            <a href="#" className="hover:text-white transition-colors duration-200">Contact us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
