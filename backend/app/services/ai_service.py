"""
AI Service — Google Gemini integration for resume analysis.
"""

import json
import asyncio
import logging
import google.generativeai as genai
from app.config import settings

logger = logging.getLogger(__name__)


def _get_model():
    """Initialize and return the Gemini model."""
    genai.configure(api_key=settings.GEMINI_API_KEY)
    return genai.GenerativeModel("gemini-2.0-flash")


async def _call_gemini_with_retry(prompt: str, max_retries: int = 3) -> str:
    """Call Gemini API with exponential backoff retry for rate limits."""
    model = _get_model()

    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
            text = response.text.strip()

            # Clean up response - remove markdown code blocks if present
            if text.startswith("```"):
                text = text.split("\n", 1)[1]
                if text.endswith("```"):
                    text = text[:-3]
                text = text.strip()

            return text
        except Exception as e:
            error_msg = str(e)
            logger.warning(f"Gemini API attempt {attempt + 1}/{max_retries} failed: {error_msg}")

            # Check if it's a rate limit (429) error
            if "429" in error_msg or "quota" in error_msg.lower() or "rate" in error_msg.lower():
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) * 3  # 3s, 6s, 12s
                    logger.info(f"Rate limited. Waiting {wait_time}s before retry...")
                    await asyncio.sleep(wait_time)
                    continue

            # For non-rate-limit errors or final attempt, raise
            raise

    raise Exception("Max retries exceeded for Gemini API call")


def _parse_json_response(text: str, fallback: dict) -> dict:
    """Parse JSON response from Gemini, return fallback on failure."""
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        logger.error(f"Failed to parse Gemini response as JSON: {text[:200]}")
        return fallback


async def analyze_resume_ats(resume_text: str) -> dict:
    """Analyze a resume for ATS compatibility using Gemini."""

    prompt = f"""You are an expert ATS (Applicant Tracking System) scanner and HR professional.
Analyze the following resume text and provide a detailed ATS analysis.

Resume Text:
---
{resume_text}
---

Return a JSON object with EXACTLY this structure (no markdown, no code blocks, just raw JSON):
{{
    "ats_score": <number 0-100>,
    "sections_found": {{
        "contact_information": <boolean>,
        "summary": <boolean>,
        "education": <boolean>,
        "skills": <boolean>,
        "experience": <boolean>,
        "projects": <boolean>,
        "certifications": <boolean>
    }},
    "missing_sections": [<list of missing section names>],
    "keyword_density": {{
        "technical_skills": [<list of technical skills found>],
        "soft_skills": [<list of soft skills found>],
        "action_verbs": [<list of action verbs found>]
    }},
    "formatting_issues": [<list of formatting issues found>],
    "suggestions": [<list of specific, actionable improvement suggestions>],
    "strengths": [<list of resume strengths>]
}}

Score criteria:
- Contact Information completeness: 10%
- Standard section headings: 10%
- Skills section with relevant keywords: 25%
- Experience with action verbs and metrics: 25%
- Education details: 15%
- Overall formatting and readability: 15%
"""

    text = await _call_gemini_with_retry(prompt)

    return _parse_json_response(text, {
        "ats_score": 0,
        "sections_found": {},
        "missing_sections": [],
        "keyword_density": {},
        "formatting_issues": ["Could not parse AI analysis"],
        "suggestions": ["Please try again"],
        "strengths": [],
    })


async def match_resume_to_job(
    resume_text: str, job_title: str, job_description: str
) -> dict:
    """Compare a resume against a job description using Gemini."""

    prompt = f"""You are an expert ATS scanner and recruiter.
Compare the following resume against the job description and provide a detailed match analysis.

Resume Text:
---
{resume_text}
---

Job Title: {job_title}

Job Description:
---
{job_description}
---

Return a JSON object with EXACTLY this structure (no markdown, no code blocks, just raw JSON):
{{
    "match_score": <number 0-100>,
    "skill_match_score": <number 0-100>,
    "experience_match_score": <number 0-100>,
    "education_match_score": <number 0-100>,
    "formatting_score": <number 0-100>,
    "matched_skills": [<list of skills found in both resume and JD>],
    "missing_skills": [<list of skills in JD but not in resume>],
    "suggestions": [<list of specific suggestions to improve match>],
    "ats_score": <number 0-100 calculated as: 0.4*skill_match + 0.3*experience_match + 0.2*education_match + 0.1*formatting>
}}
"""

    text = await _call_gemini_with_retry(prompt)

    return _parse_json_response(text, {
        "match_score": 0,
        "skill_match_score": 0,
        "experience_match_score": 0,
        "education_match_score": 0,
        "formatting_score": 0,
        "matched_skills": [],
        "missing_skills": [],
        "suggestions": ["Could not parse AI analysis. Please try again."],
        "ats_score": 0,
    })


async def optimize_resume(
    resume_text: str, job_title: str, job_description: str
) -> dict:
    """Generate optimization suggestions using Gemini."""

    prompt = f"""You are an expert resume optimizer and career coach.
Analyze the following resume in context of the job description and provide optimization suggestions.

Resume Text:
---
{resume_text}
---

Job Title: {job_title}

Job Description:
---
{job_description}
---

Return a JSON object with EXACTLY this structure (no markdown, no code blocks, just raw JSON):
{{
    "current_score": <number 0-100>,
    "potential_score": <number 0-100 after implementing suggestions>,
    "missing_skills": [<list of skills to add>],
    "suggestions": [
        {{
            "category": "<Skills|Experience|Projects|Education|Formatting>",
            "current": "<what the resume currently has or is missing>",
            "suggested": "<specific text or action to add/change>",
            "impact": "<High|Medium|Low>"
        }}
    ],
    "rewrite_suggestions": [
        {{
            "section": "<section name>",
            "original": "<original text from resume>",
            "rewritten": "<improved version of the text>",
            "reason": "<why this rewrite is better>"
        }}
    ]
}}

Provide at least 5 specific, actionable suggestions.
Focus on:
1. Missing keywords from the job description
2. Weak bullet points that need action verbs and metrics
3. Missing sections or information
4. Skills alignment with the job requirements
5. Project descriptions that could highlight relevant technologies
"""

    text = await _call_gemini_with_retry(prompt)

    return _parse_json_response(text, {
        "current_score": 0,
        "potential_score": 0,
        "missing_skills": [],
        "suggestions": [],
        "rewrite_suggestions": [],
    })
