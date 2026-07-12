# Import semua model di sini agar Alembic bisa mendeteksinya saat autogenerate migration
from app.db.session import Base  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.trip import Trip  # noqa: F401

__all__ = ["Base", "User", "Trip"]
