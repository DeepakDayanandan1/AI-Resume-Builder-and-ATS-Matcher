import requests

data = {
    "title": "Test",
    "personal_info": {
        "name": "John Doe",
        "email": "john@test.com",
        "phone": "123-456-7890",
        "linkedin": "https://linkedin.com/in/john",
        "github": "https://github.com/john",
        "website": "https://johndoe.com",
        "summary": "Experienced developer with 5+ years building scalable applications.",
    },
    "education": [
        {
            "institution": "MIT",
            "degree": "BS",
            "field": "CS",
            "start_date": "2018",
            "end_date": "2022",
            "gpa": "3.8",
            "description": "",
        }
    ],
    "experience": [
        {
            "company": "Google",
            "position": "Software Engineer",
            "start_date": "2022",
            "end_date": "",
            "description": "Building things",
            "highlights": ["Led team of 5", "Improved perf by 40%"],
        }
    ],
    "skills": [
        {"category": "Languages", "items": ["Python", "JavaScript", "TypeScript"]},
        {"category": "Frameworks", "items": ["React", "FastAPI", "Node.js"]},
    ],
    "projects": [
        {
            "name": "MyApp",
            "description": "Cool app",
            "tech_stack": ["React", "Node"],
            "url": "",
            "highlights": ["100 users"],
        }
    ],
    "certifications": [
        {"name": "AWS Solutions Architect", "issuer": "Amazon", "date": "2023", "url": ""}
    ],
}

for t in ["professional", "modern", "minimal"]:
    d = {**data, "template_id": t}
    r = requests.post("http://localhost:8000/api/resumes/render-html", json=d)
    status = "OK" if r.status_code == 200 else r.text[:200]
    print(f"{t}: {r.status_code} - {status}")
