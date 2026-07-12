from datetime import date
from typing import Any

from openai import AsyncOpenAI

from app.core.config import settings


class AIService:
    """
    Service untuk integrasi dengan OpenAI API.

    Semua interaksi dengan OpenAI ada di sini — agar jika kita
    ingin ganti provider AI (misalnya Gemini atau Claude),
    hanya file ini yang perlu diubah.
    """

    def __init__(self) -> None:
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model

    async def generate_trip_itinerary(
        self,
        destination: str,
        start_date: date | None,
        end_date: date | None,
        preferences: str | None = None,
    ) -> dict[str, Any]:
        """
        Generate rencana perjalanan (itinerary) menggunakan AI.

        Mengembalikan struktur JSON dengan rencana per hari.
        """
        # Hitung durasi trip
        duration_text = "beberapa hari"
        if start_date and end_date:
            days = (end_date - start_date).days + 1
            duration_text = f"{days} hari ({start_date} sampai {end_date})"

        # Bangun prompt yang informatif
        system_prompt = """Kamu adalah AI travel planner profesional yang berpengalaman.
Tugasmu adalah membuat itinerary perjalanan yang detail, realistis, dan menarik.
Selalu kembalikan respons dalam format JSON yang valid.
Struktur JSON yang diharapkan:
{
  "summary": "Ringkasan singkat trip",
  "total_days": number,
  "daily_plans": [
    {
      "day": 1,
      "date": "YYYY-MM-DD" atau null,
      "theme": "Tema hari ini",
      "activities": [
        {
          "time": "09:00",
          "title": "Nama aktivitas",
          "description": "Deskripsi singkat",
          "duration": "2 jam",
          "tips": "Tips opsional"
        }
      ],
      "accommodation": "Rekomendasi akomodasi (opsional)",
      "estimated_budget": "Estimasi budget hari ini dalam IDR"
    }
  ],
  "travel_tips": ["tip1", "tip2"],
  "recommended_restaurants": ["resto1", "resto2"],
  "total_estimated_budget": "Estimasi total budget"
}"""

        user_prompt = f"""Buat itinerary perjalanan ke {destination} selama {duration_text}.
{f"Preferensi perjalanan: {preferences}" if preferences else ""}
Pastikan itinerary praktis dan sesuai dengan kondisi di {destination}."""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
        )

        import json
        content = response.choices[0].message.content or "{}"
        return json.loads(content)

    async def chat(self, message: str, trip_context: str | None = None) -> str:
        """
        Menjawab pertanyaan travel dari pengguna.

        Args:
            message: Pesan dari user.
            trip_context: Informasi trip sebagai konteks tambahan (opsional).
        """
        system_prompt = """Kamu adalah TripMind AI, asisten perjalanan cerdas yang ramah dan berpengetahuan luas.
Kamu membantu pengguna merencanakan perjalanan, memberikan rekomendasi tempat wisata,
kuliner lokal, tips perjalanan, dan informasi budaya.
Jawab dengan bahasa Indonesia yang natural dan informatif.
Jika ada konteks trip spesifik, gunakan informasi tersebut untuk jawaban yang lebih relevan."""

        messages = [{"role": "system", "content": system_prompt}]

        if trip_context:
            messages.append({
                "role": "system",
                "content": f"Konteks trip pengguna: {trip_context}",
            })

        messages.append({"role": "user", "content": message})

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.8,
            max_tokens=1000,
        )

        return response.choices[0].message.content or "Maaf, saya tidak bisa memproses permintaan ini."
