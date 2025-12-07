from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, admin

api_router = APIRouter()

# Auth routes (no prefix needed as they'll be under /api/v1)
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])

# User routes
api_router.include_router(users.router, prefix="/users", tags=["users"])

# Admin routes
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
