"""
Database seeding functions
Run with: python -c "from app.db.seed import seed_admin; seed_admin()"
"""
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole


def seed_admin():
    """
    Create the first admin user if it doesn't exist.
    Credentials: admin@example.com / admin123
    """
    db: Session = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.email == "admin@example.com").first()

        if existing_admin:
            print(f"[OK] Admin user already exists: {existing_admin.email}")
            return

        # Create admin user
        admin_user = User(
            username="admin",
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )

        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        print("[OK] Admin user created successfully!")
        print(f"  Email: {admin_user.email}")
        print(f"  Password: admin123")
        print(f"  Role: {admin_user.role}")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error creating admin user: {e}")
        raise
    finally:
        db.close()


def seed_all():
    """
    Run all seeding functions
    """
    print("Starting database seeding...")
    seed_admin()
    print("Database seeding completed!")


if __name__ == "__main__":
    seed_all()
