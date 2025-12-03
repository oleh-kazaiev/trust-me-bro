FROM python:3.13-slim

WORKDIR /app

# Install curl for healthcheck and build dependencies for asyncpg/pydantic
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install poetry
RUN pip install --no-cache-dir poetry

# Copy only dependency files first for better caching
COPY pyproject.toml poetry.lock* ./

# Configure poetry to not create virtual env (we're in container)
# Install only production dependencies
RUN poetry config virtualenvs.create false && \
    poetry install --only main --no-interaction --no-ansi

COPY . .

# Run migrations then start server
CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 3062"]
