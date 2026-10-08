from pydantic import BaseModel


class DashboardSummaryOut(BaseModel):
    total: int
    applied: int
    assessment: int
    interview: int
    offer: int
    rejected: int
    withdrawn: int
    interview_rate: float
    offer_rate: float
    rejection_rate: float
