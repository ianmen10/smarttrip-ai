"""
Alembic Environment Configuration.

File ini mengatur bagaimana Alembic terhubung ke database.
Menggunakan async engine agar konsisten dengan SQLAlchemy async di aplikasi.
"""

import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

# Import Base dan semua model agar Alembic bisa mendeteksinya
from app.db.base import Base  # noqa: F401
from app.core.config import settings

# ─── Alembic Config ───────────────────────────────────────────
config = context.config

# Setup logging dari alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Override sqlalchemy.url dengan nilai dari settings (dibaca dari .env)
config.set_main_option("sqlalchemy.url", settings.database_url)

# Metadata dari semua model — digunakan untuk autogenerate migration
target_metadata = Base.metadata


# ─── Offline Migration (tanpa koneksi DB aktif) ───────────────
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


# ─── Online Migration (dengan koneksi DB aktif) ───────────────
def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


# ─── Entry Point ──────────────────────────────────────────────
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
