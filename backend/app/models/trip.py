from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Trip(Base):
    """
    Model untuk tabel trips — merepresentasikan rencana perjalanan user.

    Columns:
    - id: Primary key
    - user_id: Foreign key ke tabel users
    - title: Judul singkat trip (contoh: "Liburan Bali 2025")
    - destination: Destinasi utama
    - description: Deskripsi opsional
    - start_date / end_date: Tanggal perjalanan
    - itinerary: Disimpan sebagai JSON — berisi hasil generate AI
    - is_deleted: Soft delete — tidak benar-benar dihapus dari DB
    - created_at / updated_at: Audit timestamps
    """

    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    # Itinerary hasil AI disimpan sebagai JSONB — fleksibel untuk struktur yang berkembang
    itinerary: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    is_deleted: Mapped[bool] = mapped_column(default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relasi ke User (lazy="noload" karena kita pakai async)
    user: Mapped["User"] = relationship("User", lazy="noload")  # type: ignore
