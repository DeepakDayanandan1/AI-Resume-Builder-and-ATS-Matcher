"""
PDF Generation Service — Generate resume PDFs from HTML templates.
"""

import os
from jinja2 import Environment, FileSystemLoader

# Template directory
TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")

# Initialize Jinja2 environment
jinja_env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))


async def render_resume_html(resume_data: dict, template_id: str = "template_1") -> str:
    """Render resume data into HTML using the specified template."""
    template_file = f"{template_id}.html"

    try:
        template = jinja_env.get_template(template_file)
    except Exception:
        # Fallback to template_1 template
        template = jinja_env.get_template("template_1.html")

    return template.render(resume=resume_data)


async def generate_pdf_bytes(html_content: str) -> bytes:
    """Convert HTML string to PDF bytes using headless Chromium (Playwright)."""
    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Load the HTML content directly
        await page.set_content(html_content)
        
        # Wait for all resources and web fonts to finish loading
        await page.wait_for_load_state("networkidle")
        
        # Print to A4 PDF with 0 margins to respect the template design margins
        pdf_bytes = await page.pdf(
            format="A4",
            print_background=True,
            margin={"top": "0px", "bottom": "0px", "left": "0px", "right": "0px"}
        )
        await browser.close()
        return pdf_bytes


async def generate_resume_pdf(resume_data: dict, template_id: str = "template_1") -> bytes:
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
