from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# ─── Password Hashing ─────────────────────────────────────────
# bcrypt adalah algoritma hashing yang aman untuk password.
# "deprecated='auto'" berarti hash lama akan otomatis di-upgrade.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Mengubah plain text password menjadi hash yang aman."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Memverifikasi apakah plain password cocok dengan hash-nya."""
    return pwd_context.verify(plain_password, hashed_password)


# ─── JWT Token ────────────────────────────────────────────────

def create_access_token(subject: Any) -> str:
    """
    Membuat JWT access token.

    Args:
        subject: Data yang akan di-encode ke dalam token (biasanya user ID).

    Returns:
        JWT token sebagai string.
    """
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {"sub": str(subject), "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_access_token(token: str) -> str | None:
    """
    Mendekode JWT token dan mengembalikan subject (user ID).

    Returns:
        User ID sebagai string, atau None jika token tidak valid.
    """
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        return payload.get("sub")
    except JWTError:
        return None
