"""
PDF Generation Service — Generate resume PDFs from HTML templates.
"""

import os
from jinja2 import Environment, FileSystemLoader

# Template directory
TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")

# Initialize Jinja2 environment
jinja_env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))


async def render_resume_html(resume_data: dict, template_id: str = "professional") -> str:
    """Render resume data into HTML using the specified template."""
    template_file = f"{template_id}.html"

    try:
        template = jinja_env.get_template(template_file)
    except Exception:
        # Fallback to professional template
        template = jinja_env.get_template("professional.html")

    return template.render(resume=resume_data)


async def generate_pdf_bytes(html_content: str) -> bytes:
    """Convert HTML string to PDF bytes using WeasyPrint."""
    try:
        # pyrefly: ignore [missing-import]
        from weasyprint import HTML

        pdf_bytes = HTML(string=html_content, base_url=TEMPLATE_DIR).write_pdf()
        return pdf_bytes
    except ImportError:
        # Fallback: if WeasyPrint is not available, return a simple error
        raise RuntimeError(
            "WeasyPrint is not installed. Install it with: pip install weasyprint"
        )


async def generate_resume_pdf(resume_data: dict, template_id: str = "professional") -> bytes:
    """Full pipeline: render HTML template with data, then convert to PDF."""
    html = await render_resume_html(resume_data, template_id)
    pdf_bytes = await generate_pdf_bytes(html)
    return pdf_bytes


def get_available_templates() -> list[dict]:
    """Return list of available resume templates."""
    return [
        {
            "id": "template_1",
            "name": "Template 1",
            "description": "Clean corporate style",
            "preview_color": "#323232",
        },
        {
            "id": "template_2",
            "name": "Template 2",
            "description": "Elegant Helvetica corporate style",
            "preview_color": "#000000",
        }
    ]
