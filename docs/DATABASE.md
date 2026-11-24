# MATEMATIKA MILLIY SERTIFIKAT PLATFORMASI — BAZA HUJJATI (DATABASE.MD)

Ushbu loyiha Supabase PostgreSQL 17 ma’lumotlar bazasiga tayangan bo‘lib, to‘liq Row Level Security (RLS) va maxsus server-side protseduralar (RPC) bilan himoyalangan.

---

## 1. JADVALLAR TUZILISHI (TABLES)

1. **`public.profiles`**: Foydalanuvchi profillari (`auth.users` ga ulangan).
   - `id`: UUID (Primary Key, references `auth.users(id) ON DELETE CASCADE`)
   - `full_name`: Matn
   - `email`: Matn
   - `role`: `student`, `admin`, `moderator` (default: `student`, birinchi ro‘yxatdan o‘tgan shaxs avtomatik `admin` bo‘ladi)
   - `target_score`: Maqsadli ball (default: 80)
   - `daily_goal_questions`: Kunlik maqsad (default: 20)
   - `current_streak`: Uzluksiz kunlik faollik streak hisobi
   - `last_active_at`: Oxirgi faol bo‘lgan vaqt

2. **`public.topics`**: Matematika mavzulari (119 ta mavzu).
   - `id`: UUID
   - `code`: Noyob kod (masalan: `B1-M01`)
   - `title`: Mavzu nomi
   - `section`: Bo‘lim nomi (Arifmetika, Tenglamalar, Geometriya, Analiz)
   - `order_num`: Tartib raqami
   - `is_active`: Faollik holati

3. **`public.subtopics`**: Mavzular ichidagi kichik mavzular.
   - `id`: UUID
   - `topic_id`: `topics(id)` ga bog‘langan
   - `title`: Nomi
   - `is_active`: Faol/Nofaol

4. **`public.questions`**: Savollar bazasi (9,520+ savollar sig‘imi).
   - `id`: UUID
   - `custom_id`: Barqaror noyob identifikator (masalan: `B1-M01-Q01`)
   - `topic_id`: `topics(id)`
   - `difficulty`: `easy`, `medium`, `hard`
   - `type`: `single_choice`, `multiple_choice`, `numeric`, `text`
   - `question`: LaTeX qo‘llab-quvvatlanuvchi savol matni
   - `correct_answer`: To‘g‘ri javob kaliti (o‘quvchilardan yashirin)
   - `explanation`: Tushuntirish / yechim yo‘nalishi
   - `is_active`: Holati

5. **`public.question_options`**: Test variantlari (A, B, C, D, E).
   - `id`: UUID
   - `question_id`: `questions(id)`
   - `key`: `A`, `B`, `C`, `D`, `E`
   - `text`: Variant matni (LaTeX)

6. **`public.test_sessions`**: Topshirilgan test urinishlari.
   - `id`: UUID
   - `user_id`: `auth.users(id)`
   - `mode`: `topic`, `mixed`, `exam`
   - `title`: Seans nomi
   - `total_questions`, `time_limit_seconds`, `time_spent_seconds`
   - `score`, `accuracy_percent`, `correct_count`, `incorrect_count`, `unanswered_count`
   - `status`: `in_progress`, `completed`, `abandoned`

7. **`public.test_answers`**: Har bir savolga berilgan javoblar.
   - `session_id`, `question_id`, `question_order`
   - `user_answer`, `is_correct`, `is_marked_for_review`, `time_spent_seconds`

8. **`public.mistakes`**: Xatolar daftari (xato javob berilgan savollar).
   - `user_id`, `question_id`, `session_id`
   - `user_answer`, `is_reviewed`, `review_count`
   - `CONSTRAINT uq_user_mistake UNIQUE(user_id, question_id)`

9. **`public.bookmarks`**: Saqlangan (yulduzcha qo‘yilgan) savollar.
   - `user_id`, `question_id`, `note`

10. **`public.formulas`**: Matematik formulalar spravochnigi.
    - `category`, `title`, `formula_latex`, `description`, `examples`

11. **`public.exam_templates`**: Milliy sertifikat rasmiy imtihon shablonlari.
    - `title`, `duration_minutes` (150 daq), `total_questions` (35 ta), `passing_score` (60), `rules`

12. **`public.daily_stats`**: Kunlik tahlillar (streak va haftalik grafik uchun).
    - `user_id`, `stat_date`, `questions_answered`, `correct_answers`, `time_spent_seconds`

13. **`public.import_history`**: JSON import jurnali.
    - `admin_id`, `file_name`, `total_questions`, `imported_questions`, `failed_questions`, `status`, `errors_log`

14. **`public.admin_activity_logs`**: Administratorlar harakatlar jurnali.

---

## 2. SERVER-SIDE XAVFSIZLIK VA PROTSEDURALAR (RPC)

1. `create_test_session_secure(...)`:
   - Mavzu yoki aralash mezonlar bo‘yicha tasodifiy savollar to‘playdi.
   - O‘quvchi brauzeriga savol matni va variantlarini beradi, ammo **`correct_answer` va `explanation` maydonlarini yashiradi**.

2. `submit_test_session_secure(...)`:
   - Talabaning javoblarini serverda `questions.correct_answer` bilan taqqoslaydi.
   - Ball va aniqlik foizini xolis hisoblaydi.
   - Noto‘g‘ri javob berilgan savollarni avtomatik `mistakes` jadvaliga kiritadi.
   - `daily_stats` va talabaning kunlik streak hisoblagichini oshiradi.
   - Testning to‘liq tahlilini (yechimlari bilan) qaytaradi.

3. `import_questions_batch(...)`:
   - Administratorlar uchun JSON savollar to‘plamini 50-100 tadan xavfsiz qabul qilib, bazaga joylaydi.
