from fastapi import FastAPI

from routes.auth.routes import router as auth_router
from routes.links.routes import router as links_router
from routes.redirect.routes import router as redirect_router
from routes.users.routes import router as users_router


def include_routers(app: FastAPI) -> None:
    """Include all routers to the FastAPI app."""
    app.include_router(auth_router)
    app.include_router(links_router)
    app.include_router(users_router)
    app.include_router(redirect_router)
