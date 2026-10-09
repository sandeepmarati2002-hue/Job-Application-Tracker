"""
Vercel Serverless Function entrypoint.
Exposes the application instance `app` and `handler`.
"""
import os
import sys
from pathlib import Path

# Resolve directory paths
FILE_PATH = Path(__file__).resolve()
API_DIR = FILE_PATH.parent
ROOT_DIR = API_DIR.parent
BACKEND_DIR = ROOT_DIR / "backend"

# Ensure all candidate paths are registered in sys.path
for candidate in [
    BACKEND_DIR,
    ROOT_DIR,
    API_DIR,
    Path("/var/task/backend"),
    Path("/var/task"),
    Path.cwd() / "backend",
    Path.cwd(),
]:
    c_str = str(candidate)
    if candidate.exists() and c_str not in sys.path:
        sys.path.insert(0, c_str)

# Ensure SQLite uses /tmp on Vercel's read-only serverless filesystem if no external DB provided
if os.environ.get("VERCEL") and not os.environ.get("DATABASE_URL"):
    os.environ["DATABASE_URL"] = "sqlite:////tmp/job_tracker.db"

try:
    from app.main import app
except Exception as e1:
    try:
        from backend.app.main import app
    except Exception as e2:
        import json
        import traceback

        err_detail = {
            "error": "Failed to import FastAPI application on Vercel",
            "error_app": str(e1),
            "error_backend_app": str(e2),
            "traceback": traceback.format_exc(),
            "sys_path": sys.path,
            "cwd": str(Path.cwd()),
        }

        # Fallback ASGI application returning diagnostic info instead of crashing runtime
        async def fallback_app(scope, receive, send):
            if scope["type"] == "http":
                body = json.dumps(err_detail, indent=2).encode("utf-8")
                await send({
                    "type": "http.response.start",
                    "status": 500,
                    "headers": [
                        [b"content-type", b"application/json"],
                        [b"content-length", str(len(body)).encode("utf-8")],
                    ],
                })
                await send({
                    "type": "http.response.body",
                    "body": body,
                })

        app = fallback_app

# Export both app and handler for Vercel Serverless runtimes
handler = app
__all__ = ["app", "handler"]
