-- =====================================================
-- AI Resume Builder & ATS Matcher — Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Resumes Table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title TEXT NOT NULL DEFAULT 'Untitled Resume',
    personal_info JSONB NOT NULL DEFAULT '{}',
    education JSONB NOT NULL DEFAULT '[]',
    skills JSONB NOT NULL DEFAULT '[]',
    experience JSONB NOT NULL DEFAULT '[]',
    projects JSONB NOT NULL DEFAULT '[]',
    certifications JSONB NOT NULL DEFAULT '[]',
    template_id TEXT NOT NULL DEFAULT 'professional',
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Job Analyses Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.job_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
    job_title TEXT NOT NULL,
    job_description TEXT NOT NULL,
    match_score REAL,
    ats_score REAL,
    matched_skills JSONB DEFAULT '[]',
    missing_skills JSONB DEFAULT '[]',
    suggestions JSONB DEFAULT '[]',
    ai_analysis JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ATS Analyses Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ats_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
    uploaded_pdf_url TEXT,
    ats_score REAL,
    sections_found JSONB DEFAULT '{}',
    missing_sections JSONB DEFAULT '[]',
    keyword_density JSONB DEFAULT '{}',
    formatting_issues JSONB DEFAULT '[]',
    suggestions JSONB DEFAULT '[]',
    ai_analysis JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON public.resumes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_analyses_user_id ON public.job_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_ats_analyses_user_id ON public.ats_analyses(user_id);

-- ── Disable RLS for now (enable when auth is added) ───────────
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_analyses ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (no auth yet)
CREATE POLICY "Allow all on resumes" ON public.resumes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on job_analyses" ON public.job_analyses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on ats_analyses" ON public.ats_analyses FOR ALL USING (true) WITH CHECK (true);

-- ── Updated_at trigger ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resumes_updated_at
    BEFORE UPDATE ON public.resumes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
