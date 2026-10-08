from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal
from datetime import datetime

InterviewResultType = Literal["Pending", "Passed", "Failed", "Cancelled"]


class InterviewBase(BaseModel):
    interview_date: datetime
    interview_type: str = Field(..., min_length=2, max_length=50)
    interviewer: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None
    result: InterviewResultType = "Pending"


class InterviewCreate(InterviewBase):
    pass


class InterviewUpdate(BaseModel):
    interview_date: Optional[datetime] = None
    interview_type: Optional[str] = Field(None, min_length=2, max_length=50)
    interviewer: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None
    result: Optional[InterviewResultType] = None


class InterviewOut(InterviewBase):
    id: int
    application_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
