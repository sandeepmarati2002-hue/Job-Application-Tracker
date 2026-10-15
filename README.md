# JobTrack – Job Application Tracker

A full-stack web app to track job applications through a drag-and-drop Kanban pipeline, log interview rounds, and see how your job search is going on a dashboard.

**Live Demo:** https://frontend-six-henna-96.vercel.app/
**GitHub:** https://github.com/sandeepmarati2002-hue/Job-Application-Tracker

## Features

- Drag-and-drop Kanban board with 6 pipeline stages
- Searchable and filterable application list
- Interview-round logging for each application
- Dashboard showing interview conversion, offer and rejection rates
- CSV and JSON export of your applications
- Secure sign up and login with JWT authentication and bcrypt password hashing
- 13 Pytest integration tests covering the API

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | FastAPI, SQLAlchemy |
| Authentication | JWT, bcrypt |
| Testing | Pytest |
| Deployment | Vercel |

## Project Structure

```
Job-Application-Tracker/
├── YOUR_FRONTEND_FOLDER/   # React + Vite app
├── YOUR_BACKEND_FOLDER/    # FastAPI app, models, routes, tests
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Python 3.10 or higher

### 1. Clone the repository

```bash
git clone YOUR_REPO_URL
cd Job-Application-Tracker
```

### 2. Run the backend

```bash
cd YOUR_BACKEND_FOLDER
python -m venv venv
venv\Scripts\activate        # on macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the backend folder (see `.env.example`):

```
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

Start the server:

```bash
uvicorn main:app --reload
```

The API runs at `http://localhost:8000` and the interactive docs are at `http://localhost:8000/docs`.

### 3. Run the frontend

Open a new terminal:

```bash
cd YOUR_FRONTEND_FOLDER
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### 4. Run the tests

```bash
cd YOUR_BACKEND_FOLDER
pytest
```

## Deployment

The frontend and backend are both deployed on Vercel. Set the environment variables from `.env.example` in the Vercel project settings.

## Future Improvements

- Email reminders for upcoming interviews
- Resume and cover letter attachments per application
- Calendar integration

## Author

**Sandeep Marati**
[LinkedIn](https://linkedin.com/in/sandeep-marati) · [GitHub](https://github.com/sandeepmarati2002-hue)