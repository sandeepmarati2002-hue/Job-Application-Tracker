"""
Application Entrypoint for Production & Vercel Serverless Deployment.
Exposes the application instance `app`.
"""
import sys
from pathlib import Path

# Add project root directory to sys.path so 'backend' is importable
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
