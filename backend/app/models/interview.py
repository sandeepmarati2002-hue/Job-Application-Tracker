from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Interview(Base):
    """
    Interview entity representing an individual interview or assessment round.
    """
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    interview_date = Column(DateTime(timezone=True), nullable=False, index=True)
    interview_type = Column(String(50), nullable=False)
    interviewer = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    result = Column(String(30), nullable=False, default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    application = relationship("Application", back_populates="interviews")

    def __repr__(self):
        return f"<Interview id={self.id} type='{self.interview_type}' result='{self.result}'>"
