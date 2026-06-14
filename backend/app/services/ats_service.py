"""
ATS Scoring Service — Rule-based ATS analysis.
"""

import re


def calculate_ats_score(
    skill_match: float = 0,
    experience_match: float = 0,
    education_match: float = 0,
    formatting_score: float = 0,
) -> float:
    """
    Calculate ATS score using the weighted formula:
    40% Skill Match + 30% Experience Match + 20% Education Match + 10% Formatting
    """
    score = (
        0.40 * skill_match
        + 0.30 * experience_match
        + 0.20 * education_match
        + 0.10 * formatting_score
    )
    return round(min(max(score, 0), 100), 1)


def check_formatting(text: str) -> dict:
    """Check resume formatting for ATS compatibility."""
    issues = []
    score = 100

    # Check for email
    if not re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text):
        issues.append("Missing email address")
        score -= 15

    # Check for phone number
    if not re.search(
        r"[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}", text
    ):
        issues.append("Missing phone number")
        score -= 10

    # Check for common section headings
    text_lower = text.lower()
    required_sections = ["education", "experience", "skills"]
    for section in required_sections:
        if section not in text_lower:
            issues.append(f"Missing '{section.title()}' section heading")
            score -= 10

    # Check for action verbs
    action_verbs = [
        "developed",
        "managed",
        "created",
        "designed",
        "implemented",
        "led",
        "built",
        "improved",
        "achieved",
        "delivered",
        "analyzed",
        "coordinated",
        "established",
        "executed",
        "generated",
        "increased",
        "launched",
        "optimized",
        "reduced",
        "resolved",
        "streamlined",
    ]
    found_verbs = [v for v in action_verbs if v in text_lower]
    if len(found_verbs) < 3:
        issues.append("Consider adding more action verbs (e.g., developed, implemented, achieved)")
        score -= 10

    # Check resume length
    word_count = len(text.split())
    if word_count < 150:
        issues.append("Resume appears too short — aim for at least 300 words")
        score -= 15
    elif word_count > 1500:
        issues.append("Resume may be too long — consider condensing to 1-2 pages")
        score -= 5

    return {
        "score": max(score, 0),
        "issues": issues,
        "word_count": word_count,
        "action_verbs_found": found_verbs,
    }


def extract_skills_from_text(text: str) -> list[str]:
    """Extract potential skills from resume text."""
    # Common tech skills to look for
    tech_skills = [
        "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
        "ruby", "php", "swift", "kotlin", "scala", "r", "matlab",
        "react", "angular", "vue", "next.js", "node.js", "express", "django",
        "flask", "fastapi", "spring", "rails",
        "html", "css", "tailwind", "bootstrap", "sass",
        "sql", "mysql", "postgresql", "mongodb", "redis", "firebase", "supabase",
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
        "git", "github", "gitlab", "ci/cd", "jenkins",
        "rest api", "graphql", "microservices", "agile", "scrum",
        "machine learning", "deep learning", "nlp", "computer vision",
        "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn",
        "figma", "adobe", "photoshop", "illustrator",
        "linux", "windows", "macos",
        "jira", "confluence", "slack", "trello",
        "excel", "powerpoint", "word",
    ]

    text_lower = text.lower()
    found_skills = []

    for skill in tech_skills:
        if skill in text_lower:
            found_skills.append(skill.title() if len(skill) > 2 else skill.upper())

    return found_skills
