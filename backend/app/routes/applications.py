from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, desc, asc
from typing import List, Optional
import csv
import io

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.application import Application
from backend.app.models.interview import Interview
from backend.app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationOut
from backend.app.schemas.interview import InterviewCreate, InterviewOut
from backend.app.services.auth import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])



@router.get("", response_model=List[ApplicationOut], status_code=status.HTTP_200_OK)
def list_applications(
    search: Optional[str] = Query(None, description="Search company, role, or location"),
    status: Optional[str] = Query(None, description="Filter by status (Applied, Interview, etc.)"),
    sort_by: Optional[str] = Query("date-desc", description="Sort by date-desc, date-asc, or company-asc"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    List all job applications belonging to the current user with optional filtering, search, and sorting.
    """
    query = (
        db.query(Application)
        .options(joinedload(Application.interviews))
        .filter(Application.user_id == current_user.id)
    )

    # Status filter
    if status and status.upper() != "ALL":
        query = query.filter(Application.status == status)

    # Search filter across company, role, and location
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Application.company.ilike(term),
                Application.role.ilike(term),
                Application.location.ilike(term),
            )
        )

    # Sorting
    if sort_by == "date-asc":
        query = query.order_by(asc(Application.application_date), asc(Application.id))
    elif sort_by == "company-asc":
        query = query.order_by(asc(Application.company), desc(Application.application_date))
    else:  # default: date-desc
        query = query.order_by(desc(Application.application_date), desc(Application.id))

    return query.all()


@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    app_in: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Record a new job application for the current user.
    """
    application = Application(
        user_id=current_user.id,
        company=app_in.company.strip(),
        role=app_in.role.strip(),
        location=app_in.location.strip() if app_in.location else None,
        job_url=str(app_in.job_url).strip() if app_in.job_url else None,
        status=app_in.status,
        application_date=app_in.application_date,
        salary=app_in.salary.strip() if app_in.salary else None,
        description=app_in.description.strip() if app_in.description else None,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/export/csv", status_code=status.HTTP_200_OK)
def export_applications_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Export all job applications for the authenticated user as a downloadable CSV spreadsheet.
    """
    applications = (
        db.query(Application)
        .options(joinedload(Application.interviews))
        .filter(Application.user_id == current_user.id)
        .order_by(desc(Application.application_date))
        .all()
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "ID",
        "Company",
        "Role",
        "Location",
        "Status",
        "Application Date",
        "Salary",
        "Job URL",
        "Interviews Count",
        "Description",
    ])

    for app in applications:
        writer.writerow([
            app.id,
            app.company,
            app.role,
            app.location or "",
            app.status,
            str(app.application_date),
            app.salary or "",
            app.job_url or "",
            len(app.interviews) if app.interviews else 0,
            app.description or "",
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=job_applications_export.csv"},
    )


@router.get("/{application_id}", response_model=ApplicationOut, status_code=status.HTTP_200_OK)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get a single application by ID with full interview history.
    """
    application = (
        db.query(Application)
        .options(joinedload(Application.interviews))
        .filter(Application.id == application_id, Application.user_id == current_user.id)
        .first()
    )
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID {application_id} not found.",
        )
    return application


@router.put("/{application_id}", response_model=ApplicationOut, status_code=status.HTTP_200_OK)
def update_application(
    application_id: int,
    app_update: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update an existing job application.
    """
    application = (
        db.query(Application)
        .filter(Application.id == application_id, Application.user_id == current_user.id)
        .first()
    )
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID {application_id} not found.",
        )

    update_data = app_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if isinstance(value, str):
            value = value.strip()
        setattr(application, field, value)

    db.commit()
    db.refresh(application)
    return application


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a job application and cascade delete all associated interviews.
    """
    application = (
        db.query(Application)
        .filter(Application.id == application_id, Application.user_id == current_user.id)
        .first()
    )
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID {application_id} not found.",
        )

    db.delete(application)
    db.commit()
    return None


@router.post("/{application_id}/interviews", response_model=InterviewOut, status_code=status.HTTP_201_CREATED)
def add_interview_to_application(
    application_id: int,
    interview_in: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Schedule or log an interview / assessment round for this application.
    """
    application = (
        db.query(Application)
        .filter(Application.id == application_id, Application.user_id == current_user.id)
        .first()
    )
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID {application_id} not found.",
        )

    interview = Interview(
        application_id=application.id,
        interview_date=interview_in.interview_date,
        interview_type=interview_in.interview_type.strip(),
        interviewer=interview_in.interviewer.strip() if interview_in.interviewer else None,
        notes=interview_in.notes.strip() if interview_in.notes else None,
        result=interview_in.result,
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview
