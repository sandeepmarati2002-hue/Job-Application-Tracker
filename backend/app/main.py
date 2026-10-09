from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import settings
from app.database import engine, Base, get_db
import app.models  # Ensures all ORM models are registered with Base metadata

# Automatically create database tables on startup if they do not exist
try:
    Base.metadata.create_all(bind=engine)
    # Seed demo data if database is fresh
    from app.seed import seed_database
    seed_database()
except Exception as e:
    print(f"Database initialization warning (safe to ignore if using existing DB): {e}")

from contextlib import asynccontextmanager

# Define lifespan event handler for startup table creation
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        from app.seed import seed_database
        seed_database()
    except Exception as e:
        print(f"Startup database initialization warning: {e}")
    yield

# Initialize the FastAPI Application instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade REST API to track applications, interviews, and job hunting analytics.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure Cross-Origin Resource Sharing (CORS)
# Ensure local and production frontend origins are explicitly allowed (never use wildcard with credentials)
cors_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://frontend-six-henna-96.vercel.app",
]
for origin in settings.cors_origins:
    if origin != "*" and origin not in cors_origins:
        cors_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
from app.routes import auth_router, applications_router, interviews_router, dashboard_router
app.include_router(auth_router)
app.include_router(applications_router)
app.include_router(interviews_router)
app.include_router(dashboard_router)



@app.get("/", tags=["Health"], status_code=status.HTTP_200_OK)
def root():
    """
    Root endpoint to verify the API server is online.
    """
    return {"status": "ok"}


@app.get("/health", tags=["Health"], status_code=status.HTTP_200_OK)
def health_check():
    """
    Health check endpoint to verify server is online.
    """
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=settings.PORT, reload=True)
