from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.application import Application
from app.models.interview import Interview
from app.schemas.interview import InterviewOut, InterviewUpdate
from app.services.auth import get_current_user

router = APIRouter(prefix="/interviews", tags=["Interviews"])


@router.delete("/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a scheduled or completed interview round.
    Ensures the interview belongs to an application owned by the current user.
    """
    interview = (
        db.query(Interview)
        .join(Application)
        .filter(Interview.id == interview_id, Application.user_id == current_user.id)
        .first()
    )
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interview with ID {interview_id} not found.",
        )

    db.delete(interview)
    db.commit()
    return None


@router.put("/{interview_id}", response_model=InterviewOut, status_code=status.HTTP_200_OK)
def update_interview(
    interview_id: int,
    interview_update: InterviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update notes, result, date, or details of an existing interview round.
    """
    interview = (
        db.query(Interview)
        .join(Application)
        .filter(Interview.id == interview_id, Application.user_id == current_user.id)
        .first()
    )
    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interview with ID {interview_id} not found.",
        )

    update_data = interview_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(interview, field, value)

    db.commit()
    db.refresh(interview)
    return interview
