# ============================================
# config.py
# Application settings loaded from environment variables
# ============================================

import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Supabase
    SUPABASE_URL: str       = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str       = os.getenv("SUPABASE_SERVICE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")

    # CORS — comma-separated list of allowed origins
    ALLOWED_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:5173,http://localhost:3000"
        ).split(",")
        if origin.strip()
    ]

    # App
    APP_ENV: str    = os.getenv("APP_ENV", "development")
    DEBUG: bool     = os.getenv("DEBUG", "true").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")

settings = Settings()
