from backend.app.routes.auth import router as auth_router
from backend.app.routes.applications import router as applications_router
from backend.app.routes.interviews import router as interviews_router
from backend.app.routes.dashboard import router as dashboard_router

__all__ = [
    "auth_router",
    "applications_router",
    "interviews_router",
    "dashboard_router",
]
