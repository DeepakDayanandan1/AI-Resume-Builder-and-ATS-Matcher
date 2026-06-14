// ── Types for the AI Resume Builder & ATS Matcher ──

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  gpa: string;
  description: string;
}

export interface Experience {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  highlights: string[];
}

export interface Project {
  name: string;
  description: string;
  tech_stack: string[];
  url: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface ResumeData {
  id?: string;
  title: string;
  personal_info: PersonalInfo;
  education: Education[];
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  template_id: string;
  pdf_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview_color: string;
}

// ATS Analysis
export interface ATSAnalysis {
  ats_score: number;
  sections_found: Record<string, boolean>;
  missing_sections: string[];
  keyword_density: {
    technical_skills?: string[];
    soft_skills?: string[];
    action_verbs?: string[];
  };
  formatting_issues: string[];
  suggestions: string[];
  ai_analysis: {
    strengths?: string[];
    word_count?: number;
    action_verbs_found?: string[];
  };
}

// Job Match
export interface JobMatchResult {
  match_score: number;
  ats_score: number;
  matched_skills: string[];
  missing_skills: string[];
  suggestions: string[];
  skill_match_score: number;
  experience_match_score: number;
  education_match_score: number;
  formatting_score: number;
}

// Optimizer
export interface OptimizeSuggestion {
  category: string;
  current: string;
  suggested: string;
  impact: string;
}

export interface RewriteSuggestion {
  section: string;
  original: string;
  rewritten: string;
  reason: string;
}

export interface OptimizeResult {
  current_score: number;
  potential_score: number;
  suggestions: OptimizeSuggestion[];
  missing_skills: string[];
  rewrite_suggestions: RewriteSuggestion[];
}

// Default empty resume
export const defaultResume: ResumeData = {
  title: "Untitled Resume",
  personal_info: {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
  },
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  template_id: "professional",
};
