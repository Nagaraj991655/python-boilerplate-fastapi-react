# Makefile for FastAPI Boilerplate

.PHONY: help install dev test clean migrate init-db docker-up docker-down docker-logs

help:
	@echo "FastAPI Boilerplate - Available Commands"
	@echo "========================================"
	@echo "make install      - Install dependencies"
	@echo "make dev          - Run development server"
	@echo "make test         - Run tests"
	@echo "make test-cov     - Run tests with coverage"
	@echo "make migrate      - Create new migration"
	@echo "make upgrade      - Apply migrations"
	@echo "make init-db      - Initialize database with admin user"
	@echo "make docker-up    - Start Docker containers"
	@echo "make docker-down  - Stop Docker containers"
	@echo "make docker-logs  - View Docker logs"
	@echo "make clean        - Clean up cache and temp files"
	@echo "make lint         - Run code linting"
	@echo "make format       - Format code with black"

install:
	pip install -r requirements.txt

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	pytest

test-cov:
	pytest --cov=app --cov-report=html --cov-report=term

migrate:
	@read -p "Enter migration message: " msg; \
	alembic revision --autogenerate -m "$$msg"

upgrade:
	alembic upgrade head

downgrade:
	alembic downgrade -1

init-db:
	python scripts/init_db.py

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f app

docker-clean:
	docker-compose down -v

clean:
	find . -type d -name "__pycache__" -exec rm -r {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.db" -delete
	rm -rf .pytest_cache
	rm -rf .coverage
	rm -rf htmlcov
	rm -rf dist
	rm -rf build
	rm -rf *.egg-info

lint:
	flake8 app tests

format:
	black app tests

# Database commands
db-shell:
	mysql -u root -p boilerplate_db

# Create new admin user
create-admin:
	python scripts/init_db.py

# Seed database with sample data
seed:
	@echo "TODO: Implement seed script"
