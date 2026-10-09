"""
Application Entrypoint for Vercel Serverless Deployment.
Exposes the application instance `app`.
"""
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app

handler = app
__all__ = ["app", "handler"]
