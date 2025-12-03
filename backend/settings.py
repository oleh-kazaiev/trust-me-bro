import os

# ===================
# Database Settings
# ===================
POSTGRES_USER = os.environ["POSTGRES_USER"]
POSTGRES_PASSWORD = os.environ["POSTGRES_PASSWORD"]
POSTGRES_DB = os.environ["POSTGRES_DB"]
POSTGRES_HOST = os.environ.get("POSTGRES_HOST", "db")
POSTGRES_PORT = int(os.environ.get("POSTGRES_PORT", "5432"))

DATABASE_URL = (
    f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}"
    f"@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
)

# ===================
# Redis Settings
# ===================
REDIS_URL = os.environ["REDIS_URL"]

# ===================
# JWT Authentication
# ===================
JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_DAYS = int(os.environ.get("JWT_EXPIRE_DAYS", "7"))

# ===================
# CORS Settings
# ===================
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")

# ===================
# Application Settings
# ===================
APP_TITLE = "Trust Me Bro"
APP_DESCRIPTION = "A humorous URL shortener with a 'downloading miner' meme page"
APP_VERSION = "1.0.0"
