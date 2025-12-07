import logging
from pathlib import Path
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.api.v1.api import api_router
from app.core.config import settings
from app.core.rate_limit import limiter

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware - allow frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default dev server
        "http://localhost:3000",  # Alternative frontend port
        "http://localhost:8080",  # Alternative frontend port
        *([str(origin) for origin in settings.BACKEND_CORS_ORIGINS] if settings.BACKEND_CORS_ORIGINS else [])
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """
    Initialize application on startup
    """
    logger.info(f"Starting {settings.PROJECT_NAME} {settings.VERSION}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug mode: {settings.DEBUG}")

    # Auto-seed admin user on first startup (if users table is empty)
    try:
        from app.db.session import SessionLocal
        from app.models.user import User

        db = SessionLocal()
        user_count = db.query(User).count()
        db.close()

        if user_count == 0:
            logger.info("No users found. Auto-seeding admin user...")
            from app.db.seed import seed_admin
            seed_admin()
            logger.info("Admin user created successfully!")
    except Exception as e:
        logger.warning(f"Could not auto-seed admin user (database may not be initialized yet): {e}")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Cleanup on shutdown
    """
    logger.info("Shutting down application")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for uncaught exceptions
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )


@app.get("/")
async def root():
    """
    Root endpoint
    """
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "version": settings.VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": settings.VERSION,
    }


# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Serve static files from React build (production only)
frontend_build_path = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_build_path.exists() and not settings.DEBUG:
    app.mount("/assets", StaticFiles(directory=frontend_build_path / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve React SPA for non-API routes in production"""
        from fastapi.responses import FileResponse
        file_path = frontend_build_path / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(frontend_build_path / "index.html")
