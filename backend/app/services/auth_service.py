from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse


class AuthService:
    """
    Business logic untuk autentikasi.

    Arsitektur: Router → Service → Repository → DB
    Service ini tidak langsung menyentuh database.
    Semua query didelasikan ke UserRepository.
    """

    def __init__(self, db: AsyncSession) -> None:
        self.user_repo = UserRepository(db)

    async def register(self, request: RegisterRequest) -> User:
        """
        Mendaftarkan user baru.

        Langkah:
        1. Cek apakah email sudah terdaftar.
        2. Hash password.
        3. Simpan user ke database.

        Raises:
            HTTPException 409: Jika email sudah digunakan.
        """
        if await self.user_repo.email_exists(request.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Email '{request.email}' sudah terdaftar",
            )

        hashed = hash_password(request.password)
        return await self.user_repo.create(
            email=request.email,
            hashed_password=hashed,
            full_name=request.full_name,
        )

    async def login(self, request: LoginRequest) -> TokenResponse:
        """
        Login user dan mengembalikan JWT access token.

        Langkah:
        1. Cari user berdasarkan email.
        2. Verifikasi password.
        3. Buat dan kembalikan JWT token.

        Raises:
            HTTPException 401: Jika email/password salah.
        """
        user = await self.user_repo.get_by_email(request.email)

        # Pesan error sengaja dibuat generik agar tidak membocorkan info
        # (apakah email terdaftar atau passwordnya yang salah)
        invalid_credentials = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password tidak valid",
        )

        if not user:
            raise invalid_credentials

        if not verify_password(request.password, user.hashed_password):
            raise invalid_credentials

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Akun tidak aktif",
            )

        token = create_access_token(subject=user.id)
        return TokenResponse(access_token=token)
