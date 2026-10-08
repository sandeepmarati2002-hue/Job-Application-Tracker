"""
Application Entrypoint for Production & Vercel Serverless Deployment.
Exposes the application instance `app`.
"""
import sys
from pathlib import Path

# Add backend directory to sys.path so 'app' is importable
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
