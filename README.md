# Trust Me Bro - URL Shortener

A humorous URL shortener with a "downloading miner" meme page. Built as a joke app for friends, featuring a clean admin dashboard and Redis-backed performance.

## Live Demo

- **Frontend**: https://trust-me-bro.link
- **API**: https://api.trust-me-bro.link

## Features

- URL shortening with random alphanumeric codes
- "Downloading Miner" meme animation before redirect
- Admin dashboard for link management and statistics
- User authentication and authorization
- Redis caching for high performance
- PostgreSQL database with Alembic migrations
- Docker-ready deployment

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Redis, Alembic
- **Frontend**: React 18, TypeScript, Vite, React Router
- **Authentication**: JWT with bcrypt password hashing
- **Deployment**: Docker, Docker Compose, nginx
- **Code Quality**: isort, black, flake8, Prettier, ESLint

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Admin
- `POST /admin/create` - Create a new short link (requires auth)
- `GET /admin/stats` - Get all links with statistics (requires auth)

### Users (Admin only)
- `GET /users` - List all users
- `PATCH /users/{user_id}` - Update user status/role
- `DELETE /users/{user_id}` - Delete user

### Public
- `GET /redirect/{short_code}` - Get original URL and increment click count
- `GET /health` - Health check endpoint

## Deployment

The application is containerized with Docker and deployed using Docker Compose. It runs on a Raspberry Pi 5 with Cloudflare Tunnel for public HTTPS access without port forwarding.

### Architecture

- **Frontend**: React SPA served by nginx on port 3061
- **Backend**: FastAPI application on port 3062
- **Database**: PostgreSQL 15 with persistent volume
- **Cache**: Redis 7 with persistent volume
- **Proxy**: Cloudflare Tunnel for HTTPS and public access

## Development

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 3062
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Code Quality

Backend uses isort, black, and flake8. Frontend uses Prettier and ESLint.

```bash
# Backend: format and lint (isort, black, flake8)
make backend

# Frontend: format and lint (Prettier, ESLint)
# Runs on host machine, requires Node.js
make frontend

# Or run directly
docker compose run --rm backend isort .
docker compose run --rm backend black .
docker compose run --rm backend flake8 .
cd frontend && npm run format
cd frontend && npm run lint
```
