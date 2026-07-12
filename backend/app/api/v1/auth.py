from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register user baru",
)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """
    Mendaftarkan user baru ke sistem.

    - **full_name**: Nama lengkap (min 2 karakter)
    - **email**: Email unik, digunakan untuk login
    - **password**: Minimal 8 karakter
    """
    service = AuthService(db)
    user = await service.register(request)
    return UserResponse.model_validate(user)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login dan dapatkan JWT token",
)
async def login(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """
    Login dengan email dan password.

    Mengembalikan **JWT access token** yang digunakan untuk mengakses endpoint yang dilindungi.
    Sertakan token di header: `Authorization: Bearer <token>`
    """
    service = AuthService(db)
    return await service.login(request)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Profil user yang sedang login",
)
async def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Mengembalikan data profil user yang sedang terautentikasi."""
    return UserResponse.model_validate(current_user)
