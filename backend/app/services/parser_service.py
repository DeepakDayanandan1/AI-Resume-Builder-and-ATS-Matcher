"""
PDF Parser Service — Extract text from uploaded PDF resumes.
"""

import fitz  # PyMuPDF
import io


async def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text content from a PDF file."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text_parts = []

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text_parts.append(page.get_text())

    doc.close()
    return "\n".join(text_parts).strip()


async def extract_sections_from_text(text: str) -> dict:
    """Try to identify common resume sections from extracted text."""
    sections = {
        "contact_information": False,
        "summary": False,
        "education": False,
        "skills": False,
        "experience": False,
        "projects": False,
        "certifications": False,
    }

    text_lower = text.lower()

    # Contact info detection
    import re

    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    phone_pattern = r"[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}"

    if re.search(email_pattern, text) or re.search(phone_pattern, text):
        sections["contact_information"] = True

    # Section heading detection
    section_keywords = {
        "summary": ["summary", "objective", "about me", "profile", "about"],
        "education": ["education", "academic", "university", "degree", "college"],
        "skills": ["skills", "technical skills", "technologies", "competencies", "tools"],
        "experience": [
            "experience",
            "work experience",
            "employment",
            "work history",
            "professional experience",
        ],
        "projects": ["projects", "personal projects", "portfolio", "academic projects"],
        "certifications": [
            "certifications",
            "certificates",
            "licenses",
            "credentials",
        ],
    }

    for section, keywords in section_keywords.items():
        for keyword in keywords:
            if keyword in text_lower:
                sections[section] = True
                break

    return sections
