from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    """
    User entity representing registered job seekers.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # 1:N Relationship with Applications (Cascades deletes on user removal)
    applications = relationship(
        "Application",
        back_populates="user",
        cascade="all, delete-orphan",
        order_by="desc(Application.application_date)",
    )

    def __repr__(self):
        return f"<User id={self.id} email='{self.email}'>"
