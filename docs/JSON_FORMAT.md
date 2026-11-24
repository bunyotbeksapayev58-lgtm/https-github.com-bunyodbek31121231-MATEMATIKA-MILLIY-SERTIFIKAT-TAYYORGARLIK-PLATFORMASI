# MATEMATIKA MILLIY SERTIFIKAT PLATFORMASI — JSON IMPORT HUJJATI

Ushbu qo‘llanma Matematika Milliy Sertifikat Platformasida savollarni JSON formatida ommaviy yuklash (import qilish) jarayonini tushuntiradi.

---

## 1. QO‘LLAB-QUVVATLANADIGAN JSON FORMATLARI

Tizim savollarni 2 xil standart formatda qabul qiladi va avtomatik aniqlaydi:

### FORMAT 1: STANDART TO‘PLAM FORMATI (NESTED FORMAT)

Ushbu formatda fayl `version`, `subject` va `questions` massividan iborat:

```json
{
  "version": "1.0",
  "subject": "Mathematics",
  "questions": [
    {
      "id": "math_0001",
      "topic_id": "B1-M01",
      "topic": "Natural sonlar va ular ustida amallar",
      "section": "Arifmetika va algebra asoslari",
      "difficulty": "medium",
      "type": "single_choice",
      "question": "Hisoblang: $$\\log_2 8 + 5^2$$.",
      "image_url": null,
      "options": {
        "A": "$$25$$",
        "B": "$$28$$",
        "C": "$$30$$",
        "D": "$$32$$"
      },
      "correct_option": "B",
      "hint": "Chunki $$\\log_2 8 = 3$$ va $$5^2 = 25$$, yig‘indi $$3 + 25 = 28$$.",
      "source": "Amaliy to‘plam",
      "tags": ["logarifm", "daraja"]
    }
  ]
}
```

---

### FORMAT 2: TO‘LIQ BANK FORMATI (MASSIV KO‘RINISHIDAGI FORMAT)

Ushbu formatda to‘g‘ridan-to‘g‘ri savollar massivi beriladi (`toliq_9520.json`, `yangi_5950.json`, `testlar.json`):

```json
[
  {
    "id": "B1-M01-Q01",
    "section": "Arifmetika va algebra asoslari",
    "topic_id": "B1-M01",
    "topic": "Natural sonlar va ular ustida amallar",
    "difficulty": "oson",
    "question": "Hisoblang: $$17+10\\cdot 4$$.",
    "options": {
      "A": "$$60$$",
      "B": "$$57$$",
      "C": "$$114$$",
      "D": "$$61$$"
    },
    "correct_option": "B",
    "answer": "$$57$$",
    "hint": "Avval ko‘paytirish bajariladi: $$10\\cdot 4 = 40$$, so‘ngra $$17+40 = 57$$."
  }
]
```

---

## 2. MAYDONLAR TAVSIFI

| Maydon | Turi | Majburiy | Tavsif |
| :--- | :--- | :--- | :--- |
| `id` | Matn (string) | Ha | Savolning takrorlanmas noyob kodi (masalan: `B1-M01-Q01` yoki `math_0001`). Idempotentlikni ta’minlaydi. |
| `topic_id` | Matn (string) | Ha | Mavzu kodi (masalan: `B1-M01`, `B2-M15`, `B3-M05`, `B4-M20`). Tizimdagi 119 ta mavzuga avtomatik bog‘lanadi. |
| `topic` | Matn (string) | Ixtiyoriy | Mavzu nomi (masalan: `Natural sonlar va ular ustida amallar`). |
| `section` | Matn (string) | Ixtiyoriy | Bo‘lim nomi (masalan: `Arifmetika va algebra asoslari`, `Geometriya`). |
| `difficulty` | Matn (string) | Ha | Qiyinlik darajasi. `oson` / `easy`, `orta` / `medium`, `qiyin` / `hard`. |
| `type` | Matn (string) | Ixtiyoriy | Savol turi: `single_choice`, `multiple_choice`, `numeric`, `text`. Default: `single_choice`. |
| `question` | Matn (string) | Ha | Savol matni. LaTeX formulalari `$$...$$` yoki `$...$` belgilarida beriladi. |
| `image_url` | Matn (string) | Ixtiyoriy | Chizma yoki rasm havolasi (agar mavjud bo‘lsa). Aks holda `null`. |
| `options` | Obyekt / Massiv | Ha | Variantlar. Obyekt: `{"A": "...", "B": "..."}` yoki massiv: `[{"key": "A", "text": "..."}]`. |
| `correct_option` / `correct_answer` | Matn (string) | Ha | To‘g‘ri javob harfi (masalan: `A`, `B`, `C`, `D`). |
| `hint` / `explanation` | Matn (string) | Ixtiyoriy | Yechim tushuntirishi yoki ishora. Faqat test yakunlanganidan so‘ng o‘quvchiga ko‘rsatiladi. |
| `source` | Matn (string) | Ixtiyoriy | Savol manbasi (masalan: `Milliy Sertifikat 2026`). |

---

## 3. IMPORT QOIDALARI VA XAVFSIZLIK

1. **Idempotentlik (Takrorlanishning oldini olish):** Savol `id` maydoni orqali `public.questions` jadvalida tekshiriladi (`ON CONFLICT (custom_id) DO UPDATE`). Bir xil faylni qayta yuklasangiz, nusxalar ko‘paymaydi, mavjud yozuv yangilanadi.
2. **Variantlar xavfsizligi:** Talabalar faol test davomida to‘g‘ri javob kalitini ko‘ra olmaydi. Barcha kalitlar va tushuntirishlar serverda saqlanadi.
3. **Mavzular bilan avtomatik bog‘lanish:** `topic_id` kodi (`B1-M01` .. `B4-M26`) orqali savollar avtomatik tegishli mavzu UUID kalitiga ulanadi.
4. **Paketlab yuklash (Batching):** Katta hajmdagi fayllar (5,950 yoki 9,520 ta savol) 50-100 tadan paketlarda xavfsiz va tez yuklanadi.
