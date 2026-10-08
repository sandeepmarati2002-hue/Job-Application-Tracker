from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Literal
from datetime import date, datetime
from app.schemas.interview import InterviewOut

ApplicationStatusType = Literal["Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"]


class ApplicationBase(BaseModel):
    company: str = Field(..., min_length=1, max_length=100)
    role: str = Field(..., min_length=1, max_length=100)
    location: Optional[str] = Field(None, max_length=100)
    job_url: Optional[str] = None
    status: ApplicationStatusType = "Applied"
    application_date: date = Field(default_factory=date.today)
    salary: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company: Optional[str] = Field(None, min_length=1, max_length=100)
    role: Optional[str] = Field(None, min_length=1, max_length=100)
    location: Optional[str] = Field(None, max_length=100)
    job_url: Optional[str] = None
    status: Optional[ApplicationStatusType] = None
    application_date: Optional[date] = None
    salary: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None


class ApplicationOut(ApplicationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    interviews: List[InterviewOut] = []

    model_config = ConfigDict(from_attributes=True)
