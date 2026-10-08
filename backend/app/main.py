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

# Initialize the FastAPI Application instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade REST API to track applications, interviews, and job hunting analytics.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure Cross-Origin Resource Sharing (CORS) using settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
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
    return {
        "status": "online",
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "environment": settings.ENVIRONMENT,
        "docs_url": "/docs",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"], status_code=status.HTTP_200_OK)
def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint that verifies server and database connection pool.
    """
    db_status = "connected"
    try:
        # Perform a lightweight ping query
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy",
        "database": db_status,
        "environment": settings.ENVIRONMENT,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=settings.PORT, reload=True)
