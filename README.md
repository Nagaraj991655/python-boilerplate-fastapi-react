# FastAPI Production-Ready Boilerplate

A complete, scalable, and production-ready FastAPI boilerplate with JWT authentication, role-based access control, MySQL database, Docker support, and comprehensive testing.

## Features

- **FastAPI Framework**: Modern, fast, and async-capable web framework
- **JWT Authentication**: Access and refresh tokens with PyJWT
- **Role-Based Access Control**: Separate user and admin endpoints
- **MySQL Database**: SQLAlchemy ORM with Alembic migrations
- **Password Security**: Passlib with bcrypt hashing
- **Rate Limiting**: Built-in rate limiting with SlowAPI
- **CORS Middleware**: Configurable cross-origin resource sharing
- **Docker Support**: Complete Docker and docker-compose setup
- **Comprehensive Testing**: Pytest with 90%+ code coverage
- **Email Verification**: Stub implementation ready for production
- **Async Support**: Built for high-performance async operations
- **API Documentation**: Auto-generated with Swagger UI and ReDoc
- **Type Hints**: Full Python type hints for better IDE support
- **Error Handling**: Global exception handling with proper logging

## Project Structure

```
boilerplate/
├── alembic/                    # Database migrations
│   ├── versions/               # Migration files
│   ├── env.py                  # Alembic environment
│   └── script.py.mako          # Migration template
├── app/
│   ├── api/
│   │   ├── deps.py             # Dependencies (auth, db)
│   │   └── v1/
│   │       ├── api.py          # API router
│   │       └── endpoints/
│   │           ├── auth.py     # Authentication endpoints
│   │           ├── users.py    # User endpoints
│   │           └── admin.py    # Admin endpoints
│   ├── core/
│   │   ├── config.py           # Application settings
│   │   ├── security.py         # JWT & password hashing
│   │   └── rate_limit.py       # Rate limiting config
│   ├── db/
│   │   ├── base.py             # SQLAlchemy base
│   │   ├── session.py          # Database session
│   │   └── init_db.py          # Initialize database
│   ├── models/
│   │   ├── user.py             # User model
│   │   └── post.py             # Post model
│   ├── schemas/
│   │   ├── user.py             # User schemas
│   │   ├── token.py            # Token schemas
│   │   └── post.py             # Post schemas
│   ├── utils/
│   │   └── email.py            # Email utilities
│   └── main.py                 # FastAPI application
├── scripts/
│   └── init_db.py              # Database initialization script
├── tests/
│   ├── conftest.py             # Test configuration
│   ├── test_auth.py            # Authentication tests
│   ├── test_users.py           # User endpoint tests
│   └── test_admin.py           # Admin endpoint tests
├── .env.example                # Environment variables template
├── .gitignore
├── alembic.ini                 # Alembic configuration
├── docker-compose.yml          # Docker compose configuration
├── Dockerfile                  # Docker image configuration
├── main.py                     # Application entry point
├── README.md
└── requirements.txt            # Python dependencies
```

## 🚀 First-Time Setup (Windows)

**Quick setup for Windows with MySQL Workbench:**

### Step 1: Create Database in MySQL Workbench

```sql
CREATE DATABASE boilerplate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Connection details:**
- Host: `localhost:3306`
- User: `root`
- Password: `root` (or your MySQL root password)

### Step 2: Setup Python Environment

```cmd
REM Navigate to project
cd C:\Users\AwaisAsad\Projects\boilerplate

REM Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

REM Install dependencies
pip install -r requirements.txt

REM Critical: Install correct bcrypt version (fixes password hashing issues)
pip install "bcrypt==4.1.3" "passlib[bcrypt]==1.7.4" --force-reinstall

REM Copy environment file
copy .env.example .env
```

### Step 3: Apply Database Migrations

```cmd
REM Create database tables
alembic upgrade head
```

### Step 4: Create Admin User

```cmd
REM Create first admin user
python -c "from app.db.seed import seed_admin; seed_admin()"
```

**Default admin credentials:**
- Email: `admin@example.com`
- Password: `admin123`

### Step 5: Start the Application

```cmd
REM Start backend
uvicorn app.main:app --reload
```

**Access the application:**
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### Test Admin Login

Go to http://localhost:8000/docs and test `/api/v1/auth/admin/login`:
- username: `admin@example.com`
- password: `admin123`

---

## Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd boilerplate
```

2. **Create environment file**
```bash
cp .env.example .env
# Edit .env file with your configuration
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

This will:
- Start MySQL database on port 3306
- Run database migrations
- Initialize admin user
- Start the FastAPI application on port 8000

4. **Access the application**
- API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Option 2: Local Development (Linux/Mac)

1. **Prerequisites**
   - Python 3.11+
   - MySQL 8.0+

2. **Install MySQL and create database**
```bash
# Using MySQL command line
mysql -u root -p
CREATE DATABASE boilerplate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Clone and setup**
```bash
git clone <your-repo-url>
cd boilerplate
```

4. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate
```

5. **Install dependencies**
```bash
pip install -r requirements.txt
```

6. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

7. **Run migrations and seed admin**
```bash
alembic upgrade head
python -c "from app.db.seed import seed_admin; seed_admin()"
```

8. **Start the application**
```bash
uvicorn app.main:app --reload
```

## Database Migrations

### Create a new migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply migrations
```bash
alembic upgrade head
```

### Rollback last migration
```bash
alembic downgrade -1
```

### View migration history
```bash
alembic history
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/login` | User login (returns JWT tokens) | No |
| POST | `/api/v1/auth/admin/login` | Admin login (requires admin role) | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | No |
| GET | `/api/v1/auth/me` | Get current user info | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/users/register` | Register new user | No |
| GET | `/api/v1/users/profile` | Get user profile | Yes (User) |
| PUT | `/api/v1/users/profile` | Update user profile | Yes (User) |
| DELETE | `/api/v1/users/profile` | Delete user account | Yes (User) |
| POST | `/api/v1/users/posts` | Create post | Yes (User) |
| GET | `/api/v1/users/posts` | Get user's posts | Yes (User) |
| GET | `/api/v1/users/posts/{id}` | Get specific post | Yes (User) |
| PUT | `/api/v1/users/posts/{id}` | Update post | Yes (User) |
| DELETE | `/api/v1/users/posts/{id}` | Delete post | Yes (User) |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/admin/dashboard` | Get dashboard statistics | Yes (Admin) |
| GET | `/api/v1/admin/users` | List all users | Yes (Admin) |
| GET | `/api/v1/admin/users/{id}` | Get user by ID | Yes (Admin) |
| PUT | `/api/v1/admin/users/{id}/role` | Update user role | Yes (Admin) |
| PUT | `/api/v1/admin/users/{id}/activate` | Activate user | Yes (Admin) |
| PUT | `/api/v1/admin/users/{id}/deactivate` | Deactivate user | Yes (Admin) |
| DELETE | `/api/v1/admin/users/{id}` | Delete user | Yes (Admin) |
| GET | `/api/v1/admin/posts` | List all posts | Yes (Admin) |
| DELETE | `/api/v1/admin/posts/{id}` | Delete any post | Yes (Admin) |

## Authentication

### User Login Example

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=yourpassword"
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### Using the Access Token

```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer eyJhbGc..."
```

### Admin Login Example

```bash
curl -X POST "http://localhost:8000/api/v1/auth/admin/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=changethis123"
```

## Default Admin Credentials

After running `scripts/init_db.py`, the following admin account will be created:

- **Email**: admin@example.com
- **Password**: changethis123
- **Username**: admin

**Important**: Change these credentials in production by updating the `.env` file before initialization.

## Testing

### Run all tests
```bash
pytest
```

### Run with coverage
```bash
pytest --cov=app --cov-report=html
```

### Run specific test file
```bash
pytest tests/test_auth.py -v
```

### Run specific test
```bash
pytest tests/test_auth.py::test_user_login_success -v
```

## Configuration

All configuration is managed through environment variables in the `.env` file:

```bash
# Application
PROJECT_NAME=FastAPI Boilerplate
VERSION=1.0.0
API_V1_STR=/api/v1
DEBUG=True
ENVIRONMENT=development

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
DATABASE_URL=mysql://root:root@localhost:3306/boilerplate_db

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

## Production Deployment

### Security Checklist

1. **Generate a secure SECRET_KEY**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

2. **Update admin credentials** in `.env`

3. **Set DEBUG=False** in production

4. **Configure CORS** properly for your frontend domain

5. **Use strong database passwords**

6. **Enable HTTPS** (use nginx/traefik as reverse proxy)

7. **Set up proper logging** and monitoring

8. **Configure email service** (replace stub implementation)

9. **Set up database backups**

10. **Use environment-specific settings**

### Docker Production Build

```dockerfile
# Use multi-stage build for smaller image
FROM python:3.11-slim as builder
# ... build steps ...

FROM python:3.11-slim
# ... runtime steps ...
```

### Scaling Considerations

This boilerplate is designed to scale:

- **Horizontal scaling**: Stateless application, scales with load balancers
- **Database connection pooling**: Configured in `db/session.py`
- **Async support**: Ready for async database drivers (e.g., asyncpg)
- **Caching**: Easy to add Redis for session/data caching
- **Message queues**: Ready for Celery/RQ integration
- **Microservices**: Clean architecture allows easy service extraction

## Future Enhancements

The boilerplate is ready for:

- **Vector Database Integration**: Pinecone, Weaviate, or Qdrant for LLM/RAG applications
- **LLM Integration**: OpenAI, Anthropic, or local models
- **WebSocket Support**: Real-time features
- **Background Tasks**: Celery or FastAPI BackgroundTasks
- **File Upload**: S3/MinIO integration
- **Social Auth**: OAuth2 with Google/GitHub
- **Two-Factor Authentication**: TOTP implementation
- **API Versioning**: Multiple API versions support
- **Monitoring**: Prometheus/Grafana integration
- **Caching**: Redis integration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- FastAPI framework by Sebastián Ramírez
- SQLAlchemy ORM
- Alembic migrations
- Python community

---

Made with ❤️ for the FastAPI community
