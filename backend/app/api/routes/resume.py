"""
Resume API routes — CRUD operations and PDF generation.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response, HTMLResponse
from supabase import create_client
from app.config import settings
from app.models.schemas import ResumeCreate, ResumeUpdate, ResumeResponse
from app.services.pdf_service import render_resume_html, get_available_templates

router = APIRouter(prefix="/api/resumes", tags=["resumes"])


def get_supabase():
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)


@router.get("/templates")
async def list_templates():
    """Get available resume templates."""
    return get_available_templates()


@router.post("")
async def create_resume(resume: ResumeCreate):
    """Create a new resume."""
    supabase = get_supabase()
    data = {
        "title": resume.title,
        "personal_info": resume.personal_info.model_dump(),
        "education": [e.model_dump() for e in resume.education],
        "skills": [s.model_dump() for s in resume.skills],
        "experience": [e.model_dump() for e in resume.experience],
        "projects": [p.model_dump() for p in resume.projects],
        "certifications": [c.model_dump() for c in resume.certifications],
        "template_id": resume.template_id,
    }

    result = supabase.table("resumes").insert(data).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create resume")

    return result.data[0]


@router.get("")
async def list_resumes():
    """List all resumes."""
    supabase = get_supabase()
    result = supabase.table("resumes").select("*").order("created_at", desc=True).execute()
    return result.data


@router.get("/{resume_id}")
async def get_resume(resume_id: str):
    """Get a resume by ID."""
    supabase = get_supabase()
    result = supabase.table("resumes").select("*").eq("id", resume_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Resume not found")

    return result.data[0]


@router.put("/{resume_id}")
async def update_resume(resume_id: str, resume: ResumeUpdate):
    """Update an existing resume."""
    supabase = get_supabase()
    data = {
        "title": resume.title,
        "personal_info": resume.personal_info.model_dump(),
        "education": [e.model_dump() for e in resume.education],
        "skills": [s.model_dump() for s in resume.skills],
        "experience": [e.model_dump() for e in resume.experience],
        "projects": [p.model_dump() for p in resume.projects],
        "certifications": [c.model_dump() for c in resume.certifications],
        "template_id": resume.template_id,
    }

    result = supabase.table("resumes").update(data).eq("id", resume_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Resume not found")

    return result.data[0]


@router.delete("/{resume_id}")
async def delete_resume(resume_id: str):
    """Delete a resume."""
    supabase = get_supabase()
    result = supabase.table("resumes").delete().eq("id", resume_id).execute()
    return {"message": "Resume deleted successfully"}


@router.post("/{resume_id}/render-html")
async def render_html_by_id(resume_id: str):
    """Render resume HTML for a saved resume."""
    supabase = get_supabase()
    result = supabase.table("resumes").select("*").eq("id", resume_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume_data = result.data[0]
    template_id = resume_data.get("template_id", "professional")

    try:
        html = await render_resume_html(resume_data, template_id)
        return HTMLResponse(content=html)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"HTML rendering failed: {str(e)}")


@router.post("/render-html")
async def render_html_preview(resume: ResumeCreate):
    """Render resume HTML from data (for preview/PDF generation on client)."""
    resume_data = {
        "personal_info": resume.personal_info.model_dump(),
        "education": [e.model_dump() for e in resume.education],
        "skills": [s.model_dump() for s in resume.skills],
        "experience": [e.model_dump() for e in resume.experience],
        "projects": [p.model_dump() for p in resume.projects],
        "certifications": [c.model_dump() for c in resume.certifications],
    }

    try:
        html = await render_resume_html(resume_data, resume.template_id)
        return HTMLResponse(content=html)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"HTML rendering failed: {str(e)}")


@router.post("/generate-pdf")
async def generate_pdf(resume: ResumeCreate):
    """Generate resume PDF from data using Playwright backend."""
    resume_data = {
        "personal_info": resume.personal_info.model_dump(),
        "education": [e.model_dump() for e in resume.education],
        "skills": [s.model_dump() for s in resume.skills],
        "experience": [e.model_dump() for e in resume.experience],
        "projects": [p.model_dump() for p in resume.projects],
        "certifications": [c.model_dump() for c in resume.certifications],
    }

    try:
        from app.services.pdf_service import generate_resume_pdf
        pdf_bytes = await generate_resume_pdf(resume_data, resume.template_id)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=resume.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
