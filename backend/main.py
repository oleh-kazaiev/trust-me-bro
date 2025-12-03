from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.routes import include_routers
from settings import APP_DESCRIPTION, APP_TITLE, APP_VERSION, CORS_ORIGINS

app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
include_routers(app)


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}
