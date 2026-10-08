from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from pathlib import Path

# Find backend/.env path reliably regardless of current working directory
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BACKEND_DIR / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "Job Application Tracker API"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    
    # JWT Configuration
    SECRET_KEY: str = "supersecretjwtkeyforjobapplicationtracker2026developmentenvironment"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 Hours
    
    # Database Configuration (PostgreSQL or SQLite fallback)
    DATABASE_URL: str = "sqlite:///./job_tracker.db"
    
    # CORS Allowed Origins (Comma-separated string)
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE) if ENV_FILE.exists() else ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

# Global Singleton Instance
settings = Settings()
