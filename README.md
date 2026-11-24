# 🎓 O'zbekiston Matematika Milliy Sertifikati Tayyorgarlik Platformasi

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Production%20Ready-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

O'zbekiston Respublikasi Matematika fani bo'yicha Milliy Sertifikat imtihonlariga tayyorlanish uchun ishlab chiqilgan to'liq funksional, zamonaviy va professional onlayn ta'lim platformasi.

---

## 🌟 Asosiy Imkoniyatlar

1. **3 Ta Asosiy Test Rejimi:**
   - **Mavzulashtirilgan testlar:** 119 ta matematika mavzusi bo'yicha alohida bilimni mustahkamlash (10, 20, 30, 50, 100 ta savol).
   - **Aralash testlar (Mix):** Tanlangan yoki barcha mavzulardan adolatli taqsimlangan testlar.
   - **Davlat Milliy Sertifikati Simulyatsiyasi:** 35 talik rasmiy format, 150 daqiqalik vaqt hisobi, navigatsiya paneli va server darajasidagi xavfsiz ball hisoblash.

2. **Mukammal Matematik Formula Renderi:**
   - KaTeX orqali barcha formulalar, tenglamalar, integrallar va geometriya ifodalari bir zumda tiniq ko'rinishda ochiladi.

3. **O'quvchi Shaxsiy Kabineti & Tahlil:**
   - Testlar tarixi, yechilgan savollar, umumiy aniqlik (accuracy %).
   - Haftalik faollik grafigi va o'quvchining eng kuchsiz matematik mavzulari tahlili.
   - Xatolar daftari (Mistakes Notebook) va saqlangan savollar (Bookmarks).
   - Foydali formulalar ma'lumotnomasi (Formula Library).
   - Butun respublika o'quvchilari reytingi (Leaderboard).

4. **Xavfsiz va Keng Qamrovli Admin Panel:**
   - Yangi savollar qo'shish, tahrirlash va filtrlash.
   - **Katta hajmdagi JSON Import tizimi:** Minglab savollarni validatsiya va dublikatlarni aniqlash orqali to'g'ridan-to'g'ri Supabase bazasiga yuklash.
   - 119 ta mavzuni boshqarish, faollashtirish/o'chirish.
   - Foydalanuvchilar va imtihon shablonlarini boshqarish.

---

## 🛠 Texnologiyalar Steki

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI:** Tailwind CSS, Lucide Icons, Framer Motion
- **Matematik Formulalar:** KaTeX (`katex`)
- **Grafiklar & Statistika:** Recharts, Canvas Confetti
- **Backend & Baza:** Supabase PostgreSQL (Row Level Security & Stored Procedures / RPC)
- **Autentifikatsiya:** Supabase Auth (Email / Parol)
- **Deploy:** Vercel

---

## ⚡️ Tezkor Ishga Tushirish

### 1. Repozitoriyani yuklab olish
```bash
git clone https://github.com/bunyotbeksapayev58-lgtm/https-github.com-bunyodbek31121231-MATEMATIKA-MILLIY-SERTIFIKAT-TAYYORGARLIK-PLATFORMASI.git
cd https-github.com-bunyodbek31121231-MATEMATIKA-MILLIY-SERTIFIKAT-TAYYORGARLIK-PLATFORMASI
```

### 2. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 3. Muhit o'zgaruvchilari (`.env.local`)
Loyihaning ildiz papkasida `.env.local` faylini yarating va Supabase ma'lumotlarini kiriting:
```env
NEXT_PUBLIC_SUPABASE_URL=https://mpkfhravlzpbhyeyvttu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2ZocmF2bHpwYmh5ZXl2dHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0NjUyMjAsImV4cCI6MjExMTA0MTIyMH0._OBSfDmI9lySYMjav1gxXkn5kCCkarbi5C0x3w6LhNA
```

### 4. Mahalliy serverni ishga tushirish
```bash
npm run dev
```
Brauzerda [http://localhost:3000](http://localhost:3000) manziliga kiring.

### 5. Production Build tekshirish
```bash
npm run build
```

---

## 🚀 Vercel'ga Joylash (Deploy)

Loyiha Vercel uchun 100% optimallashtirilgan:
1. [Vercel Dashboard](https://vercel.com/new)'ga kiring.
2. Ushbu GitHub repozitoriyani tanlang (`bunyotbeksapayev58-lgtm/...`).
3. **Environment Variables** bo'limida quyidagi ikkita o'zgaruvchini qo'shing:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://mpkfhravlzpbhyeyvttu.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2ZocmF2bHpwYmh5ZXl2dHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0NjUyMjAsImV4cCI6MjExMTA0MTIyMH0._OBSfDmI9lySYMjav1gxXkn5kCCkarbi5C0x3w6LhNA`
4. **Deploy** tugmasini bosing! 2 daqiqada platformangiz butun dunyoga ochiq bo'ladi.

---

## 🗄 Ma'lumotlar Bazasi (Supabase)

Loyiha bazasida quyidagi 16 ta jadval va xavfsiz RPC protseduralari mavjud:
- `topics` (119 ta matematika mavzulari kiritilgan)
- `questions` (714+ ta saralangan test savollari)
- `question_options` (Variantlar)
- `exam_templates` (Davlat milliy sertifikat shabloni)
- `test_sessions` & `test_answers` (O'quvchi natijalari)
- `mistakes` & `bookmarks` (Xatolar daftari va xatcho'plar)
- `formulas` & `achievements` (Formulalar kutubxonasi)
- `import_history` & `admin_activity_logs` (Admin harakatlari jurnali)

---

## 📄 Litsenziya
Ushbu loyiha O'zbekiston Milliy Sertifikat imtihonlariga tayyorlanuvchi barcha abituriyent va o'quvchilar uchun mo'ljallangan.
