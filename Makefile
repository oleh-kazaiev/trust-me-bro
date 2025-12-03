.PHONY: up stop restart rebuild migrate createsuperuser backend frontend

# Start all containers
up:
	docker compose up -d

# Stop all containers
stop:
	docker compose down

# Restart all containers
restart:
	docker compose restart

# Rebuild and restart all containers
rebuild:
	docker compose down
	docker compose build
	docker compose up -d

# Run database migrations
migrate:
	docker compose exec backend alembic upgrade head

# Create a superuser
# Usage: make createsuperuser USER=email@example.com PASS=yourpassword
createsuperuser:
ifndef USER
	$(error USER is required. Usage: make createsuperuser USER=email@example.com PASS=yourpassword)
endif
ifndef PASS
	$(error PASS is required. Usage: make createsuperuser USER=email@example.com PASS=yourpassword)
endif
	docker compose exec backend python -m management.commands.createsuperuser $(USER) '$(PASS)'

# Backend: format and lint (isort, black, flake8)
# Installs dev dependencies on-the-fly, then runs tools
backend:
	@echo "Installing dev dependencies..."
	@docker compose exec backend poetry install --with dev --no-interaction
	@echo "Running isort..."
	@docker compose exec backend isort .
	@echo "Running black..."
	@docker compose exec backend black .
	@echo "Running flake8..."
	@docker compose exec backend flake8 .

# Frontend: format and lint (Prettier, ESLint)
# Installs dependencies on-the-fly, then runs tools
frontend:
	@docker compose exec frontend sh -c "npm install && npm run format && npm run lint"
