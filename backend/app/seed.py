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
            db.flush()

            app6 = Application(
                user_id=user.id,
                company="Uber",
                role="Software Development Engineer (Backend)",
                location="Bangalore, India",
                salary="₹24,00,000/year",
                job_url="https://uber.com/careers",
                status="Interview",
                application_date=date(2026, 9, 20),
                description="Referred by Tech Lead for Core Services team (Go / Kafka / Microservices).",
            )
            db.add(app6)
            db.flush()

            db.add_all([
                Interview(
                    application_id=app6.id,
                    interview_type="Online Assessment (OA)",
                    interview_date=datetime(2026, 9, 25, 14, 0, 0, tzinfo=timezone.utc),
                    interviewer="HackerRank",
                    notes="3 Algorithmic problems on graphs, heaps, and string manipulation. All test cases passed.",
                    result="Passed",
                ),
                Interview(
                    application_id=app6.id,
                    interview_type="Technical Round 1 (DSA)",
                    interview_date=datetime(2026, 10, 6, 11, 0, 0, tzinfo=timezone.utc),
                    interviewer="Arjun Nair (Senior SDE)",
                    notes="Concurrency problem on rate limiter and LRU cache with TTL.",
                    result="Passed",
                ),
                Interview(
                    application_id=app6.id,
                    interview_type="System Design Round",
                    interview_date=datetime(2026, 10, 15, 15, 0, 0, tzinfo=timezone.utc),
                    interviewer="Staff Engineer",
                    notes="Design Uber Ride Matching service with real-time geospatial indexing.",
                    result="Pending",
                ),
            ])

            app7 = Application(
                user_id=user.id,
                company="Stripe",
                role="Full Stack Engineer - Developer Infrastructure",
                location="Remote, India",
                salary="₹28,00,000/year",
                job_url="https://stripe.com/jobs",
                status="Assessment",
                application_date=date(2026, 10, 1),
                description="Applied directly through Stripe jobs page. Resume screened.",
            )
            db.add(app7)
            db.flush()

            db.add(
                Interview(
                    application_id=app7.id,
                    interview_type="Take-home Technical Assessment",
                    interview_date=datetime(2026, 10, 10, 16, 0, 0, tzinfo=timezone.utc),
                    interviewer="Stripe Automated Suite",
                    notes="Building an idempotent webhook event consumer with retry backoff.",
                    result="Pending",
                )
            )

            app8 = Application(
                user_id=user.id,
                company="Swiggy",
                role="SDE-2 (Platform Engineering)",
                location="Bangalore, India",
                salary="₹26,00,000/year",
                job_url="https://swiggy.com/careers",
                status="Offer",
                application_date=date(2026, 8, 15),
                description="Official offer letter received for the Delivery Fulfillment Platform team.",
            )
            db.add(app8)
            db.flush()

            db.add_all([
                Interview(
                    application_id=app8.id,
                    interview_type="Online Assessment (OA)",
                    interview_date=datetime(2026, 8, 20, 10, 0, 0, tzinfo=timezone.utc),
                    interviewer="Mettl",
                    notes="DP and Segment Trees. 100% score.",
                    result="Passed",
                ),
                Interview(
                    application_id=app8.id,
                    interview_type="Technical Round 1 (DSA & Low-Level Design)",
                    interview_date=datetime(2026, 8, 28, 14, 0, 0, tzinfo=timezone.utc),
                    interviewer="Vikram Shenoy",
                    notes="Designed Splitwise application with clean SOLID principles.",
                    result="Passed",
                ),
                Interview(
                    application_id=app8.id,
                    interview_type="Technical Round 2 (High-Level System Design)",
                    interview_date=datetime(2026, 9, 4, 16, 0, 0, tzinfo=timezone.utc),
                    interviewer="Principal Architect",
                    notes="Real-time order tracking architecture with WebSockets & Redis Pub/Sub.",
                    result="Passed",
                ),
                Interview(
                    application_id=app8.id,
                    interview_type="Bar Raiser / Culture Fit",
                    interview_date=datetime(2026, 9, 10, 11, 30, 0, tzinfo=timezone.utc),
                    interviewer="VP of Engineering",
                    notes="Discussion on mentorship, leadership, and operational incident resolution.",
                    result="Passed",
                ),
            ])

            app9 = Application(
                user_id=user.id,
                company="Flipkart",
                role="Software Development Engineer - I",
                location="Bangalore, India",
                salary="₹17,50,000/year",
                job_url="https://flipkartcareers.com",
                status="Applied",
                application_date=date(2026, 10, 4),
                description="Applied via campus recruitment drive for Big Billion Days scaling operations.",
            )
            db.add(app9)

            app10 = Application(
                user_id=user.id,
                company="Oracle",
                role="Cloud Software Engineer",
                location="Hyderabad, India",
                salary="₹15,00,000/year",
                job_url="https://oracle.com/careers",
                status="Withdrawn",
                application_date=date(2026, 9, 1),
                description="Decided to withdraw after receiving competing offers with better alignment.",
            )
            db.add(app10)
            db.flush()

            db.add(
                Interview(
                    application_id=app10.id,
                    interview_type="Online Assessment (OA)",
                    interview_date=datetime(2026, 9, 8, 11, 0, 0, tzinfo=timezone.utc),
                    interviewer="HackerRank",
                    notes="SQL queries and Java fundamentals.",
                    result="Passed",
                )
            )

            app11 = Application(
                user_id=user.id,
                company="Zomato",
                role="Backend Engineer (Python / Go)",
                location="Gurgaon, India (Hybrid)",
                salary="₹20,00,000/year",
                job_url="https://zomato.com/careers",
                status="Applied",
                application_date=date(2026, 10, 7),
                description="Applied for Dineline and Live events backend microservices.",
            )
            db.add(app11)

            db.commit()
            print("Successfully seeded demo data!")
    finally:
        if should_close:
            db.close()


if __name__ == "__main__":
    seed_database()
