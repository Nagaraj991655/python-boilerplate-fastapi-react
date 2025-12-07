from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# NOTE: Model imports moved to alembic/env.py to avoid circular imports
# Alembic imports models directly in alembic/env.py (lines 29-30)
