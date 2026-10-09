from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator
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
    
    # Database Configuration (PostgreSQL in production, SQLite as local fallback)
    DATABASE_URL: str = "sqlite:///./job_tracker.db"
    
    # CORS Allowed Origins (Comma-separated string)
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000,https://frontend-six-henna-96.vercel.app"

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE) if ENV_FILE.exists() else ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @model_validator(mode="after")
    def normalize_database_url(self) -> "Settings":
        # Convert legacy postgres:// URI scheme to postgresql:// required by SQLAlchemy 2.0+
        if self.DATABASE_URL.startswith("postgres://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        # On Vercel serverless read-only filesystem, if using local SQLite fallback, redirect to /tmp
        elif os.environ.get("VERCEL") and (self.DATABASE_URL.startswith("sqlite:///.") or self.DATABASE_URL == "sqlite:///./job_tracker.db"):
            self.DATABASE_URL = "sqlite:////tmp/job_tracker.db"
        return self

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

# Global Singleton Instance
settings = Settings()
