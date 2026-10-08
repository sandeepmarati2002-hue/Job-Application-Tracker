from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from backend.app.config import settings

# If using SQLite, check_same_thread must be False because FastAPI handles requests across multiple threads
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

# Initialize SQLAlchemy Engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,  # Test connections for liveness before vending them from the pool
)

# Session factory bound to our database engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base for ORM entity models
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that provides a request-scoped database session.
    Yields the session to the route handler, and guarantees closure in finally block.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
