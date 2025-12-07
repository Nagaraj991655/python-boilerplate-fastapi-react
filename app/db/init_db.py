from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User, UserRole


def init_db(db: Session) -> None:
    """
    Initialize database with first superuser
    """
    # Check if superuser exists
    user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER_EMAIL).first()

    if not user:
        user = User(
            username=settings.FIRST_SUPERUSER_USERNAME,
            email=settings.FIRST_SUPERUSER_EMAIL,
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Superuser created: {user.email}")
    else:
        print(f"Superuser already exists: {user.email}")
