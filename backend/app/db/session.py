from sqlalchemy.ext.asyncio import AsyncAttrs, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

# ─── Async Engine ─────────────────────────────────────────────
# echo=True menampilkan query SQL di log (berguna saat development)
engine = create_async_engine(
    settings.database_url,
    echo=settings.app_env == "development",
    pool_pre_ping=True,  # Cek koneksi sebelum digunakan
)

# ─── Session Factory ──────────────────────────────────────────
# expire_on_commit=False mencegah lazy loading error setelah commit
async_session_factory = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False,
)


# ─── Base Model ───────────────────────────────────────────────
class Base(AsyncAttrs, DeclarativeBase):
    """
    Base class untuk semua SQLAlchemy model.
    AsyncAttrs memungkinkan akses async ke relasi (lazy loading async).
    """
    pass
