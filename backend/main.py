from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Lifespan context manager untuk startup dan shutdown event.
    Lebih modern dibanding @app.on_event("startup") yang sudah deprecated.
    """
    # Startup: bisa digunakan untuk koneksi pool, cache warming, dll
    print(f"🚀 {settings.app_name} starting up... (env: {settings.app_env})")
    yield
    # Shutdown: cleanup resources
    print(f"🛑 {settings.app_name} shutting down...")


app = FastAPI(
    title=settings.app_name,
    description="AI-powered Travel Companion API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ─── CORS Middleware ───────────────────────────────────────────
# Mengizinkan frontend (Next.js) mengakses API dari origin yang berbeda
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routers ──────────────────────────────────────────
app.include_router(api_router)


# ─── Health Check ─────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check() -> dict:
    """Endpoint sederhana untuk mengecek apakah API berjalan."""
    return {"status": "ok", "app": settings.app_name, "env": settings.app_env}
