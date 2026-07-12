from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """Request body untuk endpoint register."""

    full_name: str = Field(..., min_length=2, max_length=255, examples=["Budi Santoso"])
    email: EmailStr = Field(..., examples=["budi@example.com"])
    password: str = Field(..., min_length=8, examples=["password123"])


class LoginRequest(BaseModel):
    """Request body untuk endpoint login."""

    email: EmailStr = Field(..., examples=["budi@example.com"])
    password: str = Field(..., examples=["password123"])


class TokenResponse(BaseModel):
    """Response setelah login berhasil."""

    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Representasi publik dari User — tidak mengekspos hashed_password."""

    id: int
    email: str
    full_name: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
