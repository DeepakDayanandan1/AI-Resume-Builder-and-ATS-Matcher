"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Search,
  GitCompare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  BarChart3,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Build professional resumes with our intuitive form. Choose from beautiful templates and download as PDF instantly.",
    href: "/builder",
    gradient: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/20",
  },
  {
    icon: Search,
    title: "ATS Analyzer",
    description:
      "Upload your resume and get an instant ATS compatibility score. Identify missing sections, keywords, and formatting issues.",
    href: "/analyzer",
    gradient: "from-purple-500 to-pink-600",
    shadow: "shadow-purple-500/20",
  },
  {
    icon: GitCompare,
    title: "JD Match Score",
    description:
      "Compare your resume against any job description. See matched & missing skills with a detailed breakdown.",
    href: "/matcher",
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
  },
  {
    icon: Sparkles,
    title: "Resume Optimizer",
    description:
      "Get AI-powered suggestions to boost your resume score. Rewrite bullet points and add missing keywords.",
    href: "/optimizer",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
];

const steps = [
  {
    step: "01",
    title: "Build Your Resume",
    description: "Enter your details and choose a template",
    icon: FileText,
  },
  {
    step: "02",
    title: "Analyze & Score",
    description: "Get your ATS compatibility score",
    icon: BarChart3,
  },
  {
    step: "03",
    title: "Match with Jobs",
    description: "Compare against job descriptions",
    icon: Target,
  },
  {
    step: "04",
    title: "Optimize & Apply",
    description: "Implement AI suggestions and apply",
    icon: Zap,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function HomePage() {
  return (
    <div className="relative">
      {/* Animated gradient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[128px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400">
              <Zap className="h-3.5 w-3.5" />
              Build. Match. Get Hired.
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Build Resumes That{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Beat the ATS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Create professional resumes, analyze ATS compatibility, match
            against job descriptions, and get AI-powered optimization
            suggestions — all in one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/builder">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all px-8 text-base gap-2"
              >
                Start Building
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/analyzer">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 hover:bg-white/5 px-8 text-base gap-2"
              >
                <Search className="h-4 w-4" />
                Analyze Resume
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-16"
          >
            {[
              { value: "82%", label: "Avg ATS Score Improvement" },
              { value: "2", label: "Professional Templates" },
              { value: "AI", label: "Powered by Groq" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-24 sm:px-6 lg:px-8" id="features">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Land the Job
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Four powerful tools working together to give you the best chance
              at getting past ATS filters and impressing recruiters.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                >
                  <Link href={feature.href}>
                    <Card className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/8 hover:border-white/20 transition-all duration-300 cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div
                          className={`mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg ${feature.shadow}`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3
                          className="text-xl font-semibold mb-2"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-sm text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Get started <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground">
              Four simple steps to a job-winning resume
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                    <Icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="text-xs font-bold text-cyan-400 mb-1">
                    STEP {step.step}
                  </div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ATS Score Preview */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-cyan-950/50 to-purple-950/50 backdrop-blur-sm">
              <CardContent className="p-8 sm:p-12">
                <div className="grid gap-8 sm:grid-cols-2 items-center">
                  <div>
                    <h2
                      className="text-2xl font-bold sm:text-3xl mb-4"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      See Your ATS Score{" "}
                      <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Instantly
                      </span>
                    </h2>
                    <div className="space-y-3 text-sm">
                      {[
                        "Contact Information",
                        "Education & Skills",
                        "Experience with Action Verbs",
                        "Keyword Optimization",
                        "ATS-Friendly Formatting",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <Link href="/analyzer" className="mt-6 inline-block">
                      <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white gap-2">
                        Try ATS Analyzer
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Score Circle */}
                  <div className="flex justify-center">
                    <div className="relative h-48 w-48">
                      <svg className="h-48 w-48 -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50" cy="50" r="42"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="6"
                          className="text-white/10"
                        />
                        <circle
                          cx="50" cy="50" r="42"
                          fill="none"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${82 * 2.64} ${100 * 2.64}`}
                          className="text-cyan-500"
                          stroke="url(#scoreGradient)"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06B6D4" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                          82%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ATS Score
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl font-bold sm:text-4xl mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start building your ATS-optimized resume today. It&apos;s free and
              takes less than 5 minutes.
            </p>
            <Link href="/builder">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-xl shadow-cyan-500/25 px-10 text-base gap-2"
              >
                Get Started Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
