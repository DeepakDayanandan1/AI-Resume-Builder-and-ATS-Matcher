from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ── Personal Info ──────────────────────────────────────────────
class PersonalInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    website: str = ""
    summary: str = ""


# ── Education ──────────────────────────────────────────────────
class Education(BaseModel):
    institution: str = ""
    degree: str = ""
    field: str = ""
    start_date: str = ""
    end_date: str = ""
    gpa: str = ""
    description: str = ""


# ── Experience ─────────────────────────────────────────────────
class Experience(BaseModel):
    company: str = ""
    position: str = ""
    start_date: str = ""
    end_date: str = ""
    description: str = ""
    highlights: list[str] = []


# ── Project ────────────────────────────────────────────────────
class Project(BaseModel):
    name: str = ""
    description: str = ""
    tech_stack: list[str] = []
    url: str = ""
    highlights: list[str] = []


# ── Skill Category ─────────────────────────────────────────────
class SkillCategory(BaseModel):
    category: str = ""
    items: list[str] = []


# ── Certification ──────────────────────────────────────────────
class Certification(BaseModel):
    name: str = ""
    issuer: str = ""
    date: str = ""
    url: str = ""


# ── Resume ─────────────────────────────────────────────────────
class ResumeData(BaseModel):
    title: str = ""
    personal_info: PersonalInfo = PersonalInfo()
    education: list[Education] = []
    skills: list[SkillCategory] = []
    experience: list[Experience] = []
    projects: list[Project] = []
    certifications: list[Certification] = []
    template_id: str = "professional"


class ResumeCreate(ResumeData):
    pass


class ResumeUpdate(ResumeData):
    pass


class ResumeResponse(ResumeData):
    id: str
    user_id: str
    pdf_url: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


# ── ATS Analysis ───────────────────────────────────────────────
class ATSAnalysisRequest(BaseModel):
    resume_text: Optional[str] = None
    resume_id: Optional[str] = None


class ATSAnalysisResponse(BaseModel):
    ats_score: float
    sections_found: dict = {}
    missing_sections: list[str] = []
    keyword_density: dict = {}
    formatting_issues: list[str] = []
    suggestions: list[str] = []
    ai_analysis: dict = {}


# ── Job Match ──────────────────────────────────────────────────
class JobMatchRequest(BaseModel):
    resume_text: Optional[str] = None
    resume_id: Optional[str] = None
    job_title: str
    job_description: str


class JobMatchResponse(BaseModel):
    match_score: float
    ats_score: float
    matched_skills: list[str] = []
    missing_skills: list[str] = []
    suggestions: list[str] = []
    skill_match_score: float = 0
    experience_match_score: float = 0
    education_match_score: float = 0
    formatting_score: float = 0


# ── Optimizer ──────────────────────────────────────────────────
class OptimizeRequest(BaseModel):
    resume_text: Optional[str] = None
    resume_id: Optional[str] = None
    job_title: str
    job_description: str


class OptimizeSuggestion(BaseModel):
    category: str
    current: str = ""
    suggested: str = ""
    impact: str = ""


class OptimizeResponse(BaseModel):
    current_score: float
    potential_score: float
    suggestions: list[OptimizeSuggestion] = []
    missing_skills: list[str] = []
    rewrite_suggestions: list[dict] = []
