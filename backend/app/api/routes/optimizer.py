"""
Resume Optimizer API routes.
"""

import logging

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.parser_service import extract_text_from_pdf
from app.services.ai_service import optimize_resume
from app.models.schemas import OptimizeRequest, OptimizeResponse, OptimizeSuggestion

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/optimize", tags=["optimizer"])


@router.post("", response_model=OptimizeResponse)
async def optimize_resume_endpoint(request: OptimizeRequest):
    """Get optimization suggestions for a resume."""
    resume_text = request.resume_text or ""
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is required")

    try:
        result = await optimize_resume(
            resume_text, request.job_title, request.job_description
        )

        suggestions = []
        for s in result.get("suggestions", []):
            suggestions.append(
                OptimizeSuggestion(
                    category=s.get("category", "General"),
                    current=s.get("current", ""),
                    suggested=s.get("suggested", ""),
                    impact=s.get("impact", "Medium"),
                )
            )

        return OptimizeResponse(
            current_score=result.get("current_score", 0),
            potential_score=result.get("potential_score", 0),
            suggestions=suggestions,
            missing_skills=result.get("missing_skills", []),
            rewrite_suggestions=result.get("rewrite_suggestions", []),
        )
    except Exception as e:
        logger.exception("Optimization failed")
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")


@router.post("/upload")
async def optimize_uploaded_resume(
    file: UploadFile = File(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
):
    """Optimize an uploaded resume PDF for a job description."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file")

    try:
        pdf_bytes = await file.read()
        resume_text = await extract_text_from_pdf(pdf_bytes)

        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        result = await optimize_resume(resume_text, job_title, job_description)

        suggestions = []
        for s in result.get("suggestions", []):
            suggestions.append(
                OptimizeSuggestion(
                    category=s.get("category", "General"),
                    current=s.get("current", ""),
                    suggested=s.get("suggested", ""),
                    impact=s.get("impact", "Medium"),
                )
            )

        return OptimizeResponse(
            current_score=result.get("current_score", 0),
            potential_score=result.get("potential_score", 0),
            suggestions=suggestions,
            missing_skills=result.get("missing_skills", []),
            rewrite_suggestions=result.get("rewrite_suggestions", []),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Optimization failed")
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")
