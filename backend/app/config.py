import os
# pyrefly: ignore [missing-import]
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory and workspace root
_backend_dir = Path(__file__).resolve().parent.parent
load_dotenv(_backend_dir / ".env")
load_dotenv(_backend_dir.parent / ".env")
load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    # Google Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    # Groq (faster, higher free tier limits)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "groq/compound-mini")

    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # App
    APP_NAME: str = "AI Resume Builder & ATS Matcher"
    APP_VERSION: str = "1.0.0"


settings = Settings()
