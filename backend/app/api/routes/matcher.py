"""
Job Description Matcher API routes.
"""

import logging

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.parser_service import extract_text_from_pdf
from app.services.ai_service import match_resume_to_job
from app.models.schemas import JobMatchRequest, JobMatchResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/match", tags=["matcher"])


@router.post("", response_model=JobMatchResponse)
async def match_resume_job(request: JobMatchRequest):
    """Match resume text against a job description."""
    resume_text = request.resume_text or ""
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is required")

    try:
        result = await match_resume_to_job(
            resume_text, request.job_title, request.job_description
        )

        return JobMatchResponse(
            match_score=result.get("match_score", 0),
            ats_score=result.get("ats_score", 0),
            matched_skills=result.get("matched_skills", []),
            missing_skills=result.get("missing_skills", []),
            suggestions=result.get("suggestions", []),
            skill_match_score=result.get("skill_match_score", 0),
            experience_match_score=result.get("experience_match_score", 0),
            education_match_score=result.get("education_match_score", 0),
            formatting_score=result.get("formatting_score", 0),
        )
    except Exception as e:
        logger.exception("Matching failed")
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")


@router.post("/upload")
async def match_uploaded_resume(
    file: UploadFile = File(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
):
    """Match an uploaded resume PDF against a job description."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file")

    try:
        pdf_bytes = await file.read()
        resume_text = await extract_text_from_pdf(pdf_bytes)

        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        result = await match_resume_to_job(resume_text, job_title, job_description)

        return JobMatchResponse(
            match_score=result.get("match_score", 0),
            ats_score=result.get("ats_score", 0),
            matched_skills=result.get("matched_skills", []),
            missing_skills=result.get("missing_skills", []),
            suggestions=result.get("suggestions", []),
            skill_match_score=result.get("skill_match_score", 0),
            experience_match_score=result.get("experience_match_score", 0),
            education_match_score=result.get("education_match_score", 0),
            formatting_score=result.get("formatting_score", 0),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Matching failed")
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")
