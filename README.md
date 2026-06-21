<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Groq-Llama_3.3-F55036?style=for-the-badge&logo=meta" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss" />
</p>

# 🚀 Drafted — AI-Powered Resume Builder & ATS Matcher

An AI-powered resume builder with ATS (Applicant Tracking System) analysis, job description matching, and resume optimization — all in one platform.

Build professional resumes from templates, get instant ATS compatibility scores, match your resume against job descriptions, and receive AI-powered optimization suggestions.

🔗 **Live Demo:** [drafted-ats.vercel.app](https://drafted-ats.vercel.app)

---

## ✨ Features

### 📝 Resume Builder
- Build resumes with an intuitive form-based interface
- Choose from **2 professional HTML/CSS templates** (rendered via Jinja2)
- **Download as PDF** — client-side (html2pdf.js) or server-side (Playwright)
- Save resumes to Supabase cloud database

### 🔍 ATS Analyzer
- Upload your resume PDF for instant **ATS compatibility scoring**
- Detects missing sections, formatting issues, and keyword gaps
- AI-powered suggestions for improvement
- Identifies technical skills, soft skills, and action verbs

### 🎯 Job Description Matcher
- Compare your resume against any job description
- Get **skill match score**, experience match, education match, and formatting score breakdown
- See matched vs missing skills at a glance
- Actionable suggestions to improve your match rate

### ⚡ Resume Optimizer
- AI-generated **rewrite suggestions** for bullet points
- Identifies missing keywords from target job descriptions
- Prioritized suggestions by impact (High / Medium / Low)
- Before/after comparisons for each suggestion

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS 4 |
| **Backend** | Python 3.11+, FastAPI 0.115, Jinja2 (HTML templates) |
| **Database** | Supabase |
| **AI** | Groq (Llama 3.3 70B) |
| **Auth** | Supabase Auth |

---

## 👤 Author

**Deepak Dayanandan**

- GitHub: [@DeepakDayanandan1](https://github.com/DeepakDayanandan1)

---

<p align="center">
  Built with ❤️ by Deepak Dayanandan
</p>
