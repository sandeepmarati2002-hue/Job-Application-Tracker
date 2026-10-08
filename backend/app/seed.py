from datetime import date, datetime, timezone
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.application import Application
from app.models.interview import Interview
from app.services.auth import hash_password


def seed_database(db: Session = None):
    """
    Seeds the database with initial demo data if empty.
    """
    should_close = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        should_close = True

    try:
        # Check or create demo user
        demo_email = "sandeep.dev@example.com"
        user = db.query(User).filter(User.email == demo_email).first()
        if not user:
            user = User(
                name="Sandeep Kumar",
                email=demo_email,
                password_hash=hash_password("demo12345"),
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Check existing applications
        existing_apps_count = db.query(Application).filter(Application.user_id == user.id).count()
        if existing_apps_count == 0:
            app1 = Application(
                user_id=user.id,
                company="Google",
                role="Software Engineer Intern",
                location="Bangalore, India (Hybrid)",
                salary="₹1,00,000/month",
                job_url="https://careers.google.com",
                status="Interview",
                application_date=date(2026, 9, 15),
                description="Applied via employee referral. Resume shortlisted for SWE Winter/Summer 2027.",
            )
            db.add(app1)
            db.flush()

            db.add_all([
                Interview(
                    application_id=app1.id,
                    interview_type="Online Assessment (OA)",
                    interview_date=datetime(2026, 9, 22, 10, 0, 0, tzinfo=timezone.utc),
                    interviewer="Automated Platform",
                    notes="2 DSA problems (Graphs and Dynamic Programming). Both test suites passed.",
                    result="Passed",
                ),
                Interview(
                    application_id=app1.id,
                    interview_type="Technical Round 1 (DSA)",
                    interview_date=datetime(2026, 10, 5, 14, 30, 0, tzinfo=timezone.utc),
                    interviewer="Senior Staff SDE",
                    notes="Upcoming: Binary Trees, Dijkstra algorithm, and time complexity tradeoffs.",
                    result="Pending",
                ),
            ])

            app2 = Application(
                user_id=user.id,
                company="Microsoft",
                role="SDE-1 (Full Stack)",
                location="Hyderabad, India",
                salary="₹18,00,000/year",
                job_url="https://careers.microsoft.com",
                status="Assessment",
                application_date=date(2026, 9, 18),
                description="Codility online coding test link received. 3 algorithmic tasks.",
            )
            db.add(app2)
            db.flush()

            db.add(
                Interview(
                    application_id=app2.id,
                    interview_type="Online Assessment (OA)",
                    interview_date=datetime(2026, 10, 2, 18, 0, 0, tzinfo=timezone.utc),
                    interviewer="Codility",
                    notes="Preparing sliding window and prefix sum patterns.",
                    result="Pending",
                )
            )

            app3 = Application(
                user_id=user.id,
                company="Razorpay",
                role="Backend Engineering Intern",
                location="Bangalore, India",
                salary="₹45,000/month",
                job_url="https://razorpay.com/jobs",
                status="Offer",
                application_date=date(2026, 8, 28),
                description="Selected! Offer letter received for Python/FastAPI payment gateway engineering team.",
            )
            db.add(app3)
            db.flush()

            db.add_all([
                Interview(
                    application_id=app3.id,
                    interview_type="Technical Round 1 (DSA)",
                    interview_date=datetime(2026, 9, 5, 11, 0, 0, tzinfo=timezone.utc),
                    interviewer="Priya Sharma (Tech Lead)",
                    notes="API rate limiter design, caching with Redis, Python concurrency.",
                    result="Passed",
                ),
                Interview(
                    application_id=app3.id,
                    interview_type="Managerial & Culture",
                    interview_date=datetime(2026, 9, 12, 16, 0, 0, tzinfo=timezone.utc),
                    interviewer="Engineering Manager",
                    notes="Discussed past projects, internship expectations, team values.",
                    result="Passed",
                ),
            ])

            app4 = Application(
                user_id=user.id,
                company="Amazon",
                role="Software Development Engineer",
                location="Hyderabad, India",
                salary="₹16,50,000/year",
                job_url="https://amazon.jobs",
                status="Rejected",
                application_date=date(2026, 8, 10),
                description="OA completed. Received automated rejection email after 2 weeks.",
            )
            db.add(app4)
            db.flush()

            db.add(
                Interview(
                    application_id=app4.id,
                    interview_type="Online Assessment (OA)",
                    interview_date=datetime(2026, 8, 18, 9, 0, 0, tzinfo=timezone.utc),
                    interviewer="HackerRank",
                    notes="Array manipulation and debugging section.",
                    result="Failed",
                )
            )

            app5 = Application(
                user_id=user.id,
                company="Atlassian",
                role="Graduate Software Developer",
                location="Remote, India",
                salary="₹22,00,000/year",
                job_url="https://atlassian.com/careers",
                status="Applied",
                application_date=date(2026, 9, 28),
                description="Submitted application on careers portal with customized resume.",
            )
            db.add(app5)

            db.commit()
            print("Successfully seeded demo data!")
    finally:
        if should_close:
            db.close()


if __name__ == "__main__":
    seed_database()
