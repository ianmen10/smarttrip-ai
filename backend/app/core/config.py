from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Konfigurasi aplikasi dibaca dari environment variables (.env).
    Pydantic-settings otomatis melakukan validasi type dan parsing.
    """

    model_config = SettingsConfigDict(
        env_file="../.env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ─── Application ──────────────────────────────────────────
    app_name: str = "TripMind AI"
    app_env: str = "development"

    # ─── Database ─────────────────────────────────────────────
    database_url: str

    # ─── JWT ──────────────────────────────────────────────────
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # ─── OpenAI ───────────────────────────────────────────────
    openai_api_key: str
    openai_model: str = "gpt-4o"

    # ─── CORS ─────────────────────────────────────────────────
    backend_cors_origins: List[str] = ["http://localhost:3000"]


# Singleton — digunakan di seluruh aplikasi via import
settings = Settings()
