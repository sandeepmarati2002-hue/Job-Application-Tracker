from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import date
from backend.app.database import Base


class Application(Base):
    """
    Application entity representing a job/internship application.
    """
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company = Column(String(100), nullable=False, index=True)
    role = Column(String(100), nullable=False)
    location = Column(String(100), nullable=True)
    job_url = Column(Text, nullable=True)
    status = Column(String(30), nullable=False, default="Applied", index=True)
    application_date = Column(Date, nullable=False, default=date.today)
    salary = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="applications")
    interviews = relationship(
        "Interview",
        back_populates="application",
        cascade="all, delete-orphan",
        order_by="asc(Interview.interview_date)",
    )

    def __repr__(self):
        return f"<Application id={self.id} company='{self.company}' status='{self.status}'>"
