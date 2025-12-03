from fastapi import FastAPI

from routes.admin.routes import router as admin_router
from routes.auth.routes import router as auth_router
from routes.redirect.routes import router as redirect_router
from routes.users.routes import router as users_router


def include_routers(app: FastAPI) -> None:
    """Include all routers to the FastAPI app."""
    app.include_router(auth_router)
    app.include_router(admin_router)
    app.include_router(users_router)
    app.include_router(redirect_router)
