from pydantic import BaseModel, Field


class ChatMessageRequest(BaseModel):
    """Request body untuk mengirim pesan ke AI."""

    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        examples=["Rekomendasikan tempat wisata terbaik di Bali untuk keluarga dengan anak kecil"],
    )
    # Konteks opsional — misalnya sedang merencanakan trip tertentu
    trip_id: int | None = Field(
        None,
        description="ID trip sebagai konteks percakapan (opsional)",
    )


class ChatMessageResponse(BaseModel):
    """Response dari AI."""

    reply: str
    model_used: str
