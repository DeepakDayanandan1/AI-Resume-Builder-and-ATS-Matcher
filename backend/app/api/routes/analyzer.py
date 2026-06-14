"""
ATS Analyzer API routes.
"""

import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.parser_service import extract_text_from_pdf, extract_sections_from_text
from app.services.ats_service import check_formatting, extract_skills_from_text
from app.services.ai_service import analyze_resume_ats
from app.models.schemas import ATSAnalysisResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/analyze", tags=["analyzer"])


@router.post("/resume", response_model=ATSAnalysisResponse)
async def analyze_resume(file: UploadFile = File(...)):
    """Analyze an uploaded resume PDF for ATS compatibility."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file")

    try:
        pdf_bytes = await file.read()
        resume_text = await extract_text_from_pdf(pdf_bytes)

        if not resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF. The file may be image-based.",
            )

        # Rule-based analysis
        sections = await extract_sections_from_text(resume_text)
        formatting = check_formatting(resume_text)
        skills = extract_skills_from_text(resume_text)

        # AI-enhanced analysis
        ai_result = await analyze_resume_ats(resume_text)

        # Merge results
        missing_sections = [
            section.replace("_", " ").title()
            for section, found in sections.items()
            if not found
        ]

        return ATSAnalysisResponse(
            ats_score=ai_result.get("ats_score", formatting["score"]),
            sections_found=ai_result.get("sections_found", sections),
            missing_sections=ai_result.get("missing_sections", missing_sections),
            keyword_density=ai_result.get("keyword_density", {"technical_skills": skills}),
            formatting_issues=ai_result.get("formatting_issues", formatting["issues"]),
            suggestions=ai_result.get("suggestions", []),
            ai_analysis={
                "strengths": ai_result.get("strengths", []),
                "word_count": formatting["word_count"],
                "action_verbs_found": formatting["action_verbs_found"],
            },
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Analysis failed")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/resume-text", response_model=ATSAnalysisResponse)
async def analyze_resume_text(data: dict):
    """Analyze resume from raw text."""
    resume_text = data.get("resume_text", "")
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is required")

    sections = await extract_sections_from_text(resume_text)
    formatting = check_formatting(resume_text)
    skills = extract_skills_from_text(resume_text)
    ai_result = await analyze_resume_ats(resume_text)

    missing_sections = [
        section.replace("_", " ").title()
        for section, found in sections.items()
        if not found
    ]

    return ATSAnalysisResponse(
        ats_score=ai_result.get("ats_score", formatting["score"]),
        sections_found=ai_result.get("sections_found", sections),
        missing_sections=ai_result.get("missing_sections", missing_sections),
        keyword_density=ai_result.get("keyword_density", {"technical_skills": skills}),
        formatting_issues=ai_result.get("formatting_issues", formatting["issues"]),
        suggestions=ai_result.get("suggestions", []),
        ai_analysis={
            "strengths": ai_result.get("strengths", []),
            "word_count": formatting["word_count"],
            "action_verbs_found": formatting["action_verbs_found"],
        },
    )
