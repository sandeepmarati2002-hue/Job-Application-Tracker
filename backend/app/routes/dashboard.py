from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.application import Application
from backend.app.schemas.dashboard import DashboardSummaryOut
from backend.app.services.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummaryOut, status_code=status.HTTP_200_OK)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Computes real-time key metrics and conversion rates for the candidate's pipeline.
    """
    # Group counts by status for this user
    counts = dict(
        db.query(Application.status, func.count(Application.id))
        .filter(Application.user_id == current_user.id)
        .group_by(Application.status)
        .all()
    )

    applied = counts.get("Applied", 0)
    assessment = counts.get("Assessment", 0)
    interview = counts.get("Interview", 0)
    offer = counts.get("Offer", 0)
    rejected = counts.get("Rejected", 0)
    withdrawn = counts.get("Withdrawn", 0)

    total = sum(counts.values())

    interview_count = interview + offer
    interview_rate = round((interview_count / total) * 100, 1) if total > 0 else 0.0
    offer_rate = round((offer / total) * 100, 1) if total > 0 else 0.0
    rejection_rate = round((rejected / total) * 100, 1) if total > 0 else 0.0

    return DashboardSummaryOut(
        total=total,
        applied=applied,
        assessment=assessment,
        interview=interview,
        offer=offer,
        rejected=rejected,
        withdrawn=withdrawn,
        interview_rate=interview_rate,
        offer_rate=offer_rate,
        rejection_rate=rejection_rate,
    )
