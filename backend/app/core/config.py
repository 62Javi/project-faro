import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Faro API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
        "*"
    ]
    
    # AI - Google Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    
    # Database - Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # Auth - Clerk
    CLERK_SECRET_KEY: str = os.getenv("CLERK_SECRET_KEY", "")
    CLERK_PUBLISHABLE_KEY: str = os.getenv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "")

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"

settings = Settings()
