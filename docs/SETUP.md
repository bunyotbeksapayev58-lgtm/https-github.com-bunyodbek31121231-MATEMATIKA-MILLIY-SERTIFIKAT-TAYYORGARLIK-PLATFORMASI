# MATEMATIKA MILLIY SERTIFIKAT PLATFORMASI — O‘RNATISH VA ISHGA TUSHIRISH (SETUP.MD)

Ushbu hujjat loyihani lokal kompyuterda ishga tushirish, Supabase ma’lumotlar bazasini ulash, administrator huquqini olish va Vercel platformasiga joylash (deploy) bo‘yicha to‘liq ko‘rsatmalarni o‘z ichiga oladi.

---

## 1. TEXNOLOGIK ASOSLAR (TECH STACK)

- **Freymvork:** Next.js (App Router, TypeScript)
- **Stil va UI:** Tailwind CSS, Lucide Icons, Framer Motion, Recharts
- **Matematik formulalar:** KaTeX (LaTeX renderlash)
- **Ma’lumotlar bazasi & Auth:** Supabase PostgreSQL 17, Supabase Auth
- **Xavfsizlik:** Row Level Security (RLS) va PostgreSQL RPC Security Definer

---

## 2. ATROF-MUHIT O‘ZGARUVCHILARI (.ENV.LOCAL)

Loyiha ildizida (`math-certificate/.env.local`) quyidagi o‘zgaruvchilar o‘rnatilgan:

```env
# Supabase loyihangiz ma’lumotlari
NEXT_PUBLIC_SUPABASE_URL=https://mpkfhravlzpbhyeyvttu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2ZocmF2bHpwYmh5ZXl2dHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0NjUyMjAsImV4cCI6MjExMTA0MTIyMH0._OBSfDmI9lySYMjav1gxXkn5kCCkarbi5C0x3w6LhNA

# Sayt domeni (Lokalda http://localhost:3000, production'da o‘z domeningiz)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 3. LOKAL ISHGA TUSHIRISH (LOCAL DEVELOPMENT)

Loyiha papkasiga kiring va buyruqlarni bajaring:

```bash
cd math-certificate

# Paketlarni o‘rnatish (agar o‘rnatilmagan bo‘lsa)
npm install

# Loyihani lokal serverda ishga tushirish
npm run dev
```

Brauzerda oching: `http://localhost:3000`

---

## 4. ADMINISTRATOR HUQUQINI OLISH

Tizimda avtomatik qoida o‘rnatilgan:
1. `/register` sahifasiga o‘tib, birinchi ro‘yxatdan o‘tgan hisob avtomatik ravishda **`admin`** maqomini oladi.
2. Shuningdek, Supabase SQL muharririda istalgan foydalanuvchini admin qilish mumkin:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'sizning_emailingiz@domain.uz';
   ```
3. Admin hisobi bilan kirganda, menyuda **"Admin Panel"** tugmasi ochiladi (`/admin`).

---

## 5. SAVOLLARNI YUKLASH (JSON IMPORT)

Platforma 119 ta matematik mavzu va 714 ta boshlang‘ich namunaviy savollar bilan oldindan ta’minlangan.
Qolgan barcha 9,520 ta savolni yuklash uchun:
1. Admin Panelga kiring (`/admin/import`).
2. `public/datasets/toliq_9520.json` (yoki `yangi_5950.json`) faylini tanlang.
3. Tizim avtomatik ravishda barcha savollarni tekshiradi va qiyinlik darajalari bo‘yicha taqsimlaydi.
4. "Importni tasdiqlash" tugmasini bosing — savollar 50 tadan paketlarda Supabase bazasiga joylanadi.

---

## 6. GITHUB VA VERCEL DEPLOY QILISH

### GitHub'ga yuklash:

```bash
cd math-certificate
git init
git add .
git commit -m "feat: complete Mathematics National Certificate platform"
git branch -M main
git remote add origin https://github.com/SIZNING_PROFILINGIZ/matematika-milliy-sertifikat.git
git push -u origin main
```

### Vercel'ga deploy qilish:

1. [vercel.com](https://vercel.com) saytiga kiring.
2. "Add New Project" tugmasini bosing va GitHub dagi repozitoriyni tanlang.
3. **Environment Variables** bo‘limiga quyidagi 3 ta kalitni kiriting:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://mpkfhravlzpbhyeyvttu.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - `NEXT_PUBLIC_SITE_URL` = `https://sizning-loyiha-nomi.vercel.app`
4. "Deploy" tugmasini bosing. 1 daqiqa ichida sayt jonli ishga tushadi!
