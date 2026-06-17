<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Groq-Llama_3.3-F55036?style=for-the-badge&logo=meta" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss" />
</p>

# 🚀 AI Resume Builder & ATS Matcher

An AI-powered resume builder with ATS (Applicant Tracking System) analysis, job description matching, and resume optimization — all in one platform.

Build professional resumes from templates, get instant ATS compatibility scores, match your resume against job descriptions, and receive AI-powered optimization suggestions.

---

## ✨ Features

### 📝 Resume Builder
- Build resumes with an intuitive form-based interface
- Choose from **3 professional templates** — Professional, Modern, and Minimal
- **Download as PDF** with one click (client-side generation)
- Save resumes to cloud database (Supabase)

### 🔍 ATS Analyzer
- Upload your resume PDF for instant **ATS compatibility scoring**
- Detects missing sections, formatting issues, and keyword gaps
- AI-powered suggestions for improvement
- Identifies technical skills, soft skills, and action verbs

### 🎯 Job Description Matcher
- Compare your resume against any job description
- Get **skill match score**, experience match, and education match breakdown
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
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui |
| **Backend** | Python, FastAPI, Jinja2 (HTML templates), Pydantic |
| **Database** | Supabase (PostgreSQL) |
| **AI** | Groq (Llama 3.3 70B) with Google Gemini fallback |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.11+
- **Supabase** account (free tier)
- **Groq** API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the Repository

```bash
git clone https://github.com/DeepakDayanandan1/AI-Resume-Builder-and-ATS-Matcher.git
cd AI-Resume-Builder-and-ATS-Matcher
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your keys (see Environment Variables below)

# Start the server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the dev server
npm run dev
```

### 4. Open the App

Visit **http://localhost:3000** in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/resumes/templates` | List available templates |
| `POST` | `/api/resumes` | Create a new resume |
| `GET` | `/api/resumes` | List all resumes |
| `GET` | `/api/resumes/{id}` | Get resume by ID |
| `PUT` | `/api/resumes/{id}` | Update a resume |
| `DELETE` | `/api/resumes/{id}` | Delete a resume |
| `POST` | `/api/resumes/render-html` | Render resume as HTML |
| `POST` | `/api/analyze/resume` | Analyze uploaded PDF for ATS |
| `POST` | `/api/analyze/resume-text` | Analyze resume from text |
| `POST` | `/api/match` | Match resume against job description |
| `POST` | `/api/optimize` | Get optimization suggestions |

---

## 👤 Author

**Deepak Dayanandan**

- GitHub: [@DeepakDayanandan1](https://github.com/DeepakDayanandan1)

---

<p align="center">
  Built with ❤️ by Deepak Dayanandan
</p>
