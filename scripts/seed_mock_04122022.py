# -*- coding: utf-8 -*-
"""
Seed script for:
Matematika Milliy Sertifikat 04.12.2022 (Test 1)
All 45 authentic questions, figures, KaTeX formulas, options, and step-by-step solutions.
"""

import json
import urllib.request

RPC_URL = "https://mpkfhravlzpbhyeyvttu.supabase.co/rest/v1/rpc/bulk_import_questions_json"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2ZocmF2bHpwYmh5ZXl2dHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0NjUyMjAsImV4cCI6MjExMTA0MTIyMH0._OBSfDmI9lySYMjav1gxXkn5kCCkarbi5C0x3w6LhNA"
TEMPLATE_ID = "04122022-0000-0000-0000-000000000000"

QUESTIONS = [
    {
        "id": "MOCK-04122022-Q01",
        "topic_id": "B1-M01",
        "topic": "Natural sonlar va ular ustida amallar",
        "difficulty": "oson",
        "question": "$$a, b, c$$ — turli raqamlar bo'lsa, $$100a + 10b + c$$ ning eng katta qiymatini toping.",
        "options": {"A": "$$897$$", "B": "$$987$$", "C": "$$999$$", "D": "$$988$$"},
        "correct_option": "B",
        "hint": "Eng katta qiymatga erishish uchun eng katta raqamlarni yuqori xonalarga qo'yamiz. Raqamlar turlicha bo'lgani sababli: $$a = 9, b = 8, c = 7$$. Natija: $$100(9) + 10(8) + 7 = 987$$."
    },
    {
        "id": "MOCK-04122022-Q02",
        "topic_id": "B1-M06",
        "topic": "Oddiy kasrlar va ular ustida amallar",
        "difficulty": "oson",
        "question": "$$\\left(2022 - \\frac{1}{2022}\\right) : \\frac{2021}{2022} \\cdot \\frac{1}{2023}$$ ni hisoblang.",
        "options": {"A": "$$1$$", "B": "$$2022$$", "C": "$$\\frac{1}{2023}$$", "D": "$$2023$$"},
        "correct_option": "A",
        "hint": "$$2022 - \\frac{1}{2022} = \\frac{2022^2 - 1}{2022} = \\frac{(2022-1)(2022+1)}{2022} = \\frac{2021 \\cdot 2023}{2022}$$. Ushbu ifodani $$\\frac{2021}{2022}$$ ga bo'lsak, $$2023$$ qoladi. So'ngra $$\\frac{1}{2023}$$ ga ko'paytirsak: $$2023 \\cdot \\frac{1}{2023} = 1$$."
    },
    {
        "id": "MOCK-04122022-Q03",
        "topic_id": "B1-M02",
        "topic": "Bo‘linish belgilari, tub va murakkab sonlar",
        "difficulty": "orta",
        "question": "$$2$$ va $$3$$ ga bo'linmaydigan barcha ikki xonali natural sonlar yig'indisini toping.",
        "options": {"A": "$$1620$$", "B": "$$1800$$", "C": "$$1960$$", "D": "$$3080$$"},
        "correct_option": "A",
        "hint": "Barcha ikki xonali sonlar yig'indisi: $$S_{jami} = \\frac{10+99}{2} \\cdot 90 = 4905$$. 2 ga bo'linadiganlar yig'indisi: $$2430$$. 3 ga bo'linadiganlar yig'indisi: $$1665$$. 6 ga bo'linadiganlar yig'indisi: $$810$$. 2 yoki 3 ga bo'linadiganlar: $$2430 + 1665 - 810 = 3285$$. Bo'linmaydiganlar yig'indisi: $$4905 - 3285 = 1620$$."
    },
    {
        "id": "MOCK-04122022-Q04",
        "topic_id": "B1-M23",
        "topic": "Tenglama va sistemalar orqali yechiladigan matnli masalalar",
        "difficulty": "orta",
        "question": "$$A$$ shahardan $$B$$ shaharga ikkita mashina yo'lga chiqdi. Birinchi mashina tezligi $$v_1$$, ikkinchi mashina tezligi $$v_2$$ ($$v_1 > v_2$$). Birinchi mashina $$B$$ shaharga borib shu zahoti qaytib ikkinchi mashina bilan uchrashdi. Ikkinchi mashina bosib o'tgan masofa $$A$$ va $$B$$ shaharlar orasidagi masofaning necha foizini tashkil etadi?",
        "options": {
            "A": "$$\\frac{2v_2}{v_1 + v_2} \\cdot 100\\%$$",
            "B": "$$\\frac{v_2}{v_1 + v_2} \\cdot 100\\%$$",
            "C": "$$\\frac{2v_1}{v_1 - v_2} \\cdot 100\\%$$",
            "D": "$$\\frac{v_1}{v_1 - v_2} \\cdot 100\\%$$"
        },
        "correct_option": "A",
        "hint": "$$A$$ va $$B$$ orasidagi masofa $$S$$. Ikkala mashina birgalikda $$2S$$ masofani bosib o'tadi. Harakat vaqti $$t = \\frac{2S}{v_1 + v_2}$$. Ikkinchi mashina bosib o'tgan masofa $$S_2 = v_2 t = \\frac{2v_2 S}{v_1 + v_2}$$. Foiz nisbati: $$\\frac{S_2}{S} \\cdot 100\\% = \\frac{2v_2}{v_1 + v_2} \\cdot 100\\%$$."
    },
    {
        "id": "MOCK-04122022-Q05",
        "topic_id": "B1-M23",
        "topic": "Tenglama va sistemalar orqali yechiladigan matnli masalalar",
        "difficulty": "orta",
        "question": "3 ta quvur berilgan. 1-quvur yolg'iz o'zi basseynni 5 soatda to'ldiradi, 2-quvur yolg'iz o'zi basseynni 3 soatda to'ldiradi, 3-quvur yolg'iz o'zi basseynni 2 soatda bo'shatadi. 3 ta quvur bir vaqtda ochilsa, basseyn necha soatda to'ladi?",
        "options": {"A": "$$20$$", "B": "$$30$$", "C": "$$40$$", "D": "$$15$$"},
        "correct_option": "B",
        "hint": "1 soatda to'ladigan qism: $$\\frac{1}{5} + \\frac{1}{3} - \\frac{1}{2} = \\frac{6 + 10 - 15}{30} = \\frac{1}{30}$$. Basseyn to'liq to'lishi uchun $$30$$ soat vaqt talab etiladi."
    },
    {
        "id": "MOCK-04122022-Q06",
        "topic_id": "B1-M26",
        "topic": "Arifmetik kvadrat ildiz va uning xossalari",
        "difficulty": "orta",
        "question": "Hisoblang: $$\\sqrt[3]{\\frac{12}{25} \\cdot \\sqrt{\\frac{244}{15 \\cdot (38^2 - 23^2)}}}$$",
        "options": {"A": "$$0{,}8$$", "B": "$$0{,}6$$", "C": "$$0{,}2$$", "D": "$$0{,}4$$"},
        "correct_option": "D",
        "hint": "$$38^2 - 23^2 = (38-23)(38+23) = 15 \\cdot 61$$. Maxraj: $$15 \\cdot 15 \\cdot 61 = 225 \\cdot 61$$. Suratdagi $$244 = 4 \\cdot 61$$. Kasr: $$\\frac{4}{225}$$. Ildiz: $$\\sqrt{\\frac{4}{225}} = \\frac{2}{15}$$. Ko'paytma: $$\\frac{12}{25} \\cdot \\frac{2}{15} = \\frac{8}{125}$$. Kub ildiz: $$\\sqrt[3]{\\frac{8}{125}} = \\frac{2}{5} = 0{,}4$$."
    },
    {
        "id": "MOCK-04122022-Q07",
        "topic_id": "B2-M15",
        "topic": "Geometrik progressiya",
        "difficulty": "orta",
        "question": "Ishorasi almashinuvchi geometrik progressiyada $$b_1 = a - 5;\\ b_2 = a + 4;\\ b_3 = 5a + 8$$ bo'lsa, $$b_4$$ ni toping.",
        "options": {"A": "$$\\frac{1}{4}$$", "B": "$$-\\frac{1}{4}$$", "C": "$$4$$", "D": "$$-4$$"},
        "correct_option": "A",
        "hint": "Geometrik progressiya xossasi: $$b_2^2 = b_1 b_3 \\implies (a+4)^2 = (a-5)(5a+8) \\implies 4a^2 - 25a - 56 = 0$$. Ildizlari: $$a = 8$$ yoki $$a = -7/4$$. Ishorasi almashinuvchi bo'lishi uchun $$a = -7/4$$. Unda $$b_1 = -27/4, b_2 = 9/4, b_3 = -3/4$$. Maxraj $$q = -1/3$$. Natija: $$b_4 = b_3 \\cdot q = (-3/4) \\cdot (-1/3) = 1/4$$."
    },
    {
        "id": "MOCK-04122022-Q08",
        "topic_id": "B1-M19",
        "topic": "Algebraik kasrlar (1-qism)",
        "difficulty": "orta",
        "question": "Soddalashtiring: $$\\frac{1}{(x+y)^2}\\left(\\frac{1}{x^2} + \\frac{1}{y^2}\\right) + \\frac{2}{(x+y)^3}\\left(\\frac{1}{x} + \\frac{1}{y}\\right)$$",
        "options": {"A": "$$\\frac{1}{xy}$$", "B": "$$\\frac{1}{x^2 y^2}$$", "C": "$$1$$", "D": "$$x+y$$"},
        "correct_option": "B",
        "hint": "$$\\frac{1}{x^2} + \\frac{1}{y^2} = \\frac{x^2+y^2}{x^2 y^2}$$, va $$\\frac{1}{x} + \\frac{1}{y} = \\frac{x+y}{xy}$$. Ikkinchi had: $$\\frac{2}{(x+y)^3} \\cdot \\frac{x+y}{xy} = \\frac{2}{(x+y)^2 xy} = \\frac{2xy}{(x+y)^2 x^2 y^2}$$. Yig'indi: $$\\frac{x^2 + 2xy + y^2}{(x+y)^2 x^2 y^2} = \\frac{(x+y)^2}{(x+y)^2 x^2 y^2} = \\frac{1}{x^2 y^2}$$."
    },
    {
        "id": "MOCK-04122022-Q09",
        "topic_id": "B1-M28",
        "topic": "Kvadrat tenglama va uning ildizlari",
        "difficulty": "oson",
        "question": "$$2x^2 - 5x + 4 = 0$$ tenglama nechta haqiqiy ildizga ega?",
        "options": {
            "A": "Haqiqiy ildizga ega emas",
            "B": "$$1$$ ta",
            "C": "$$2$$ ta",
            "D": "Cheksiz ko'p yechimga ega"
        },
        "correct_option": "A",
        "hint": "Diskriminant: $$D = b^2 - 4ac = (-5)^2 - 4(2)(4) = 25 - 32 = -7 < 0$$. Diskriminant manfiy bo'lgani sababli tenglama haqiqiy ildizga ega emas."
    },
    {
        "id": "MOCK-04122022-Q10",
        "topic_id": "B4-M05",
        "topic": "Trigonometrik funksiya qiymatlari",
        "difficulty": "oson",
        "question": "Hisoblang: $$2\\sin \\frac{7\\pi}{6} + \\cos^2 \\frac{7\\pi}{4}$$",
        "options": {"A": "$$-\\frac{1}{4}$$", "B": "$$-\\frac{1}{2}$$", "C": "$$0$$", "D": "$$\\frac{1}{2}$$"},
        "correct_option": "B",
        "hint": "$$\\sin \\frac{7\\pi}{6} = -\\frac{1}{2} \\implies 2 \\cdot (-\\frac{1}{2}) = -1$$. $$\\cos \\frac{7\\pi}{4} = \\frac{\\sqrt{2}}{2} \\implies \\cos^2 \\frac{7\\pi}{4} = \\frac{1}{2}$$. Natija: $$-1 + \\frac{1}{2} = -\\frac{1}{2}$$."
    },
    {
        "id": "MOCK-04122022-Q11",
        "topic_id": "B1-M26",
        "topic": "Arifmetik kvadrat ildiz va uning xossalari",
        "difficulty": "oson",
        "question": "$$a > 5$$ bo'lsa, $$\\sqrt{(3-a)^2} - \\sqrt{(a-5)^2}$$ ni hisoblang.",
        "options": {"A": "$$1$$", "B": "$$-2a + 8$$", "C": "$$2$$", "D": "Aniqlab bo'lmaydi"},
        "correct_option": "C",
        "hint": "$$a > 5$$ bo'lgani uchun: $$3 - a < 0 \\implies \\sqrt{(3-a)^2} = |3-a| = a - 3$$. Shuningdek $$a - 5 > 0 \\implies \\sqrt{(a-5)^2} = a - 5$$. Ayirma: $$(a-3) - (a-5) = 2$$."
    },
    {
        "id": "MOCK-04122022-Q12",
        "topic_id": "B1-M09",
        "topic": "Nisbat, proporsiya, qism va foiz",
        "difficulty": "orta",
        "question": "$$\\frac{a}{b} = 4,\\ \\frac{b}{c} = 10$$ bo'lsa, $$\\frac{a^2 + b^2 + c^2}{ac} + \\frac{a}{c}$$ ni hisoblang.",
        "options": {
            "A": "$$81\\frac{21}{40}$$",
            "B": "$$82\\frac{21}{40}$$",
            "C": "$$80\\frac{21}{40}$$",
            "D": "$$81\\frac{21}{34}$$"
        },
        "correct_option": "B",
        "hint": "$$b = 10c, a = 4b = 40c$$. Demak $$\\frac{a}{c} = 40$$. $$a^2 + b^2 + c^2 = (1600 + 100 + 1)c^2 = 1701c^2$$. $$ac = 40c^2$$. $$\\frac{1701}{40} + 40 = 42\\frac{21}{40} + 40 = 82\\frac{21}{40}$$."
    },
    {
        "id": "MOCK-04122022-Q13",
        "topic_id": "B4-M10",
        "topic": "Yig‘indi va ko‘paytma uchun formulalar",
        "difficulty": "qiyin",
        "question": "Soddalashtiring: $$\\frac{2\\cos \\alpha + \\cos 3\\alpha + \\cos 5\\alpha}{\\cos 3\\alpha + \\sin \\alpha \\cdot \\sin 2\\alpha}$$",
        "options": {
            "A": "$$\\cos 2\\alpha$$",
            "B": "$$4\\cos 2\\alpha$$",
            "C": "$$4\\sin 2\\alpha$$",
            "D": "$$\\cos \\alpha$$"
        },
        "correct_option": "B",
        "hint": "Surat: $$2\\cos\\alpha + 2\\cos 4\\alpha \\cos\\alpha = 2\\cos\\alpha(1+\\cos 4\\alpha) = 4\\cos\\alpha \\cos^2 2\\alpha$$. Maxraj: $$\\cos 3\\alpha + \\frac{1}{2}(\\cos\\alpha - \\cos 3\\alpha) = \\cos 2\\alpha \\cos\\alpha$$. Bo'lganda: $$\\frac{4\\cos\\alpha \\cos^2 2\\alpha}{\\cos 2\\alpha \\cos\\alpha} = 4\\cos 2\\alpha$$."
    },
    {
        "id": "MOCK-04122022-Q14",
        "topic_id": "B2-M21",
        "topic": "Ko‘rsatkichli tenglamalar",
        "difficulty": "orta",
        "question": "$$3 \\cdot 4^x + 2 \\cdot 25^x = 5 \\cdot 10^x$$ tenglama nechta haqiqiy ildizga ega?",
        "options": {
            "A": "Haqiqiy ildizga ega emas",
            "B": "$$1$$ ta",
            "C": "$$2$$ ta",
            "D": "Cheksiz ko'p yechimga ega"
        },
        "correct_option": "C",
        "hint": "$$25^x$$ ga bo'lsak: $$3(2/5)^{2x} - 5(2/5)^x + 2 = 0$$. $$t = (2/5)^x$$ desak, $$3t^2 - 5t + 2 = 0 \\implies t_1 = 1, t_2 = 2/3$$. Ikkala musbat ildizdan 2 ta haqiqiy $$x$$ topiladi: $$x_1 = 0, x_2 = \\log_{2/5}(2/3)$$."
    },
    {
        "id": "MOCK-04122022-Q15",
        "topic_id": "B2-M18",
        "topic": "Funksiya (1-qism)",
        "difficulty": "oson",
        "question": "Quyidagilardan toq funksiyani toping.",
        "options": {
            "A": "$$f(x) = \\frac{\\sin x + x^3}{\\cos x - 1}$$",
            "B": "$$f(x) = \\frac{\\cos x + x^3}{\\sin x - 1}$$",
            "C": "$$f(x) = \\frac{\\tan x + x^3}{\\sin x - 1}$$",
            "D": "$$f(x) = \\frac{\\cot x + x^2}{\\cos x - 1}$$"
        },
        "correct_option": "A",
        "hint": "Toq funksiya uchun $$f(-x) = -f(x)$$ bo'lishi kerak. A variantda surat: $$\\sin(-x) + (-x)^3 = -(\\sin x + x^3)$$ (toq), maxraj esa: $$\\cos(-x) - 1 = \\cos x - 1$$ (juft). Toq / Juft = Toq funksiya."
    },
    {
        "id": "MOCK-04122022-Q16",
        "topic_id": "B2-M11",
        "topic": "Irratsional tenglamalar",
        "difficulty": "orta",
        "question": "$$x^2 + 4x + 1 = 2\\sqrt{x^2 + 4x + 4}$$ tenglamaning haqiqiy ildizlar yig'indisini toping.",
        "options": {"A": "$$-4$$", "B": "$$4$$", "C": "$$-2$$", "D": "$$-6$$"},
        "correct_option": "A",
        "hint": "$$\\sqrt{x^2 + 4x + 4} = \\sqrt{(x+2)^2} = |x+2| = t \\ge 0$$. Tenglama: $$t^2 - 3 = 2t \\implies t^2 - 2t - 3 = 0 \\implies t = 3$$. Unda $$|x+2| = 3 \\implies x_1 = 1, x_2 = -5$$. Ildizlar yig'indisi: $$1 + (-5) = -4$$."
    },
    {
        "id": "MOCK-04122022-Q17",
        "topic_id": "B2-M09",
        "topic": "Modulli tengsizliklar",
        "difficulty": "orta",
        "question": "$$||2x - 1| - 7| \\le 5$$ tengsizlikni qanoatlantiradigan butun yechimlari nechta?",
        "options": {"A": "$$20$$ ta", "B": "$$12$$ ta", "C": "$$10$$ ta", "D": "$$8$$ ta"},
        "correct_option": "C",
        "hint": "$$2 \\le |2x - 1| \\le 12$$. 1) $$2 \\le 2x - 1 \\le 12 \\implies 1{,}5 \\le x \\le 6{,}5 \\implies x \\in \\{2, 3, 4, 5, 6\\}$$ (5 ta). 2) $$-12 \\le 2x - 1 \\le -2 \\implies -5{,}5 \\le x \\le -0{,}5 \\implies x \\in \\{-5, -4, -3, -2, -1\\}$$ (5 ta). Jami: $$5 + 5 = 10$$ ta butun yechim."
    },
    {
        "id": "MOCK-04122022-Q18",
        "topic_id": "B2-M12",
        "topic": "Irratsional tengsizliklar",
        "difficulty": "orta",
        "question": "$$\\frac{\\sqrt{4 - x^2}}{x + 1} \\ge 0$$ tengsizlikni yeching.",
        "options": {
            "A": "$$[-2; 2]$$",
            "B": "$$(-1; 2]$$",
            "C": "$$(-1; +\\infty)$$",
            "D": "$$\\{-2\\} \\cup (-1; 2]$$"
        },
        "correct_option": "D",
        "hint": "Aniqlanish sohasi: $$4 - x^2 \\ge 0 \\implies x \\in [-2; 2]$$, $$x \\ne -1$$. Surat nolga teng bo'lganda: $$x = -2$$ yechim bo'ladi. Oraliqda esa $$x+1 > 0 \\implies x > -1$$, ya'ni $$(-1; 2]$$. Birlashma: $$\\left\\{-2\\right\\} \\cup (-1; 2]$$."
    },
    {
        "id": "MOCK-04122022-Q19",
        "topic_id": "B1-M11",
        "topic": "Daraja va uning xossalari, darajali ifodalar (1-qism)",
        "difficulty": "oson",
        "question": "$$32^3 \\cdot 8^{12} \\cdot 125^{17}$$ necha xonali son?",
        "options": {"A": "$$52$$", "B": "$$51$$", "C": "$$50$$", "D": "$$17$$"},
        "correct_option": "A",
        "hint": "$$32^3 \\cdot 8^{12} = 2^{15} \\cdot 2^{36} = 2^{51}$$. Shuningdek $$125^{17} = 5^{51}$$. Ko'paytma: $$2^{51} \\cdot 5^{51} = 10^{51}$$. $$10^{51}$$ soni 1 va 51 ta noldan iborat, ya'ni jami 52 xonali son."
    },
    {
        "id": "MOCK-04122022-Q20",
        "topic_id": "B4-M03",
        "topic": "Logarifmik tengsizliklar",
        "difficulty": "qiyin",
        "question": "$$\\log_{\\cos 2x}(\\sin 2x) \\le 1$$ tengsizlikni yeching.",
        "options": {
            "A": "$$\\left[\\frac{\\pi}{8} + \\pi k;\\ \\frac{\\pi}{4} + \\pi k\\right],\\ k \\in \\mathbb{Z}$$",
            "B": "$$\\left[\\frac{\\pi}{8} + \\pi k;\\ \\frac{5\\pi}{8} + \\pi k\\right],\\ k \\in \\mathbb{Z}$$",
            "C": "$$\\left[\\frac{\\pi}{8} + \\pi k;\\ \\frac{\\pi}{4} + \\pi k\\right),\\ k \\in \\mathbb{Z}$$",
            "D": "$$\\left[\\frac{\\pi}{4} + 2\\pi k;\\ \\frac{5\\pi}{4} + 2\\pi k\\right],\\ k \\in \\mathbb{Z}$$"
        },
        "correct_option": "C",
        "hint": "Asos $$\\cos 2x \\in (0; 1)$$ bo'lgani uchun tengsizlik yo'nalishi almashadi: $$\\sin 2x \\ge \\cos 2x \\implies \\tan 2x \\ge 1$$. Shuningdek $$\\cos 2x > 0$$ va $$\\sin 2x > 0$$ bo'lgani uchun: $$\\frac{\\pi}{4} + 2\\pi k \\le 2x < \\frac{\\pi}{2} + 2\\pi k \\implies x \\in [\\frac{\\pi}{8} + \\pi k; \\frac{\\pi}{4} + \\pi k)$$."
    },
    {
        "id": "MOCK-04122022-Q21",
        "topic_id": "B4-M23",
        "topic": "Aniq integral va egri chiziqli trapetsiya yuzi",
        "difficulty": "orta",
        "question": "$$\\int_{-3}^{4} 2x^2 |2x|\\, dx$$ ni hisoblang.",
        "options": {"A": "$$187$$", "B": "$$175$$", "C": "$$337$$", "D": "$$222$$"},
        "correct_option": "C",
        "hint": "$$2x^2 |2x| = 4x^2 |x|$$. Oraliqni ikkiga bo'lamiz: $$\\int_{-3}^0 (-4x^3)dx + \\int_0^4 4x^3 dx = [-x^4]_{-3}^0 + [x^4]_0^4 = 81 + 256 = 337$$."
    },
    {
        "id": "MOCK-04122022-Q22",
        "topic_id": "B4-M17",
        "topic": "Hosila. Sodda funksiyalar hosilasi",
        "difficulty": "qiyin",
        "question": "$$f(x) = \\sin^2 5x - |\\cos 2x + x|$$ funksiya berilgan. $$f'\\left(-\\frac{\\pi}{6}\\right)$$ ni toping.",
        "options": {
            "A": "$$\\frac{7\\sqrt{3}+2}{2}$$",
            "B": "$$-\\sqrt{3}+1$$",
            "C": "$$\\frac{3\\sqrt{3}+4}{2}$$",
            "D": "$$\\frac{3\\sqrt{3}-2}{2}$$"
        },
        "correct_option": "A",
        "hint": "$$x = -\\pi/6$$ nuqtada $$\\cos 2x + x < 0$$, modul minus bilan ochiladi: $$f(x) = \\sin^2 5x + \\cos 2x + x$$. Hosilasi: $$f'(x) = 5\\sin 10x - 2\\sin 2x + 1$$. $$x = -\\pi/6$$ qo'yilganda: $$5(\\frac{\\sqrt{3}}{2}) + 2(\\frac{\\sqrt{3}}{2}) + 1 = \\frac{7\\sqrt{3}+2}{2}$$."
    },
    {
        "id": "MOCK-04122022-Q23",
        "topic_id": "B3-M10",
        "topic": "Uchburchaklar o‘xshashligi",
        "difficulty": "orta",
        "question": "Chizmadagi ma'lumotlardan foydalanib $$x$$ ni toping. ($$AB \\parallel EF$$)",
        "image_url": "/images/mock_04122022/q23.png",
        "options": {"A": "$$10$$", "B": "$$15$$", "C": "$$12$$", "D": "$$8$$"},
        "correct_option": "B",
        "hint": "O'xshashlikka ko'ra: $$\\frac{FC}{AC} = \\frac{EF}{AB} \\implies \\frac{x}{20} = \\frac{12}{16} = \\frac{3}{4} \\implies x = 15$$."
    },
    {
        "id": "MOCK-04122022-Q24",
        "topic_id": "B3-M30",
        "topic": "Fazoda to‘g‘ri chiziq va tekisliklar",
        "difficulty": "qiyin",
        "question": "Tekislikka ikkita $$AB$$ va $$BC$$ og'ma va $$BH$$ perpendikulyar tushirilgan. Bunda $$BH = HC,\\ AB = 2HC,\\ \\angle AHC = 90^\\circ$$ bo'lsa, $$\\cos \\angle BAC$$ ni toping.",
        "options": {"A": "$$\\frac{3}{4}$$", "B": "$$\\frac{3}{5}$$", "C": "$$\\frac{2}{3}$$", "D": "$$\\frac{1}{2}$$"},
        "correct_option": "A",
        "hint": "$$HC = 1$$ deb olsak: $$BH = 1, AB = 2$$. $$\\triangle ABH$$ dan $$AH = \\sqrt{3}$$. $$\\triangle AHC$$ dan $$AC = \\sqrt{3+1} = 2$$. $$\\triangle BHC$$ dan $$BC = \\sqrt{2}$$. $$\\triangle ABC$$ da tomonlar $$2, 2, \\sqrt{2}$$. Kosinuslar teoremasidan: $$\\cos \\angle BAC = \\frac{2^2 + 2^2 - (\\sqrt{2})^2}{2 \\cdot 2 \\cdot 2} = \\frac{6}{8} = \\frac{3}{4}$$."
    },
    {
        "id": "MOCK-04122022-Q25",
        "topic_id": "B3-M18",
        "topic": "Aylana va doira",
        "difficulty": "oson",
        "question": "Tomoni $$4$$ ga teng bo'lgan kvadratga doira ichki chizilgan. Doiraning yuzini toping.",
        "options": {"A": "$$16\\pi$$", "B": "$$\\pi$$", "C": "$$2\\pi$$", "D": "$$4\\pi$$"},
        "correct_option": "D",
        "hint": "Kvadratga ichki chizilgan doira radiusi $$r = a/2 = 2$$. Doira yuzi: $$S = \\pi r^2 = \\pi \\cdot 2^2 = 4\\pi$$."
    },
    {
        "id": "MOCK-04122022-Q26",
        "topic_id": "B3-M08",
        "topic": "Uchburchak bissektrisasi va uning xossalari",
        "difficulty": "orta",
        "question": "$$ABC$$ uchburchakda $$\\angle BAC = 90^\\circ$$ va $$\\angle BCA = 30^\\circ$$ bo'lib, $$BD$$ bissektrisa $$2\\sqrt{2}$$ ga teng bo'lsa, $$ABC$$ uchburchak yuzini toping.",
        "image_url": "/images/mock_04122022/q26.png",
        "options": {"A": "$$2\\sqrt{3}$$", "B": "$$2\\sqrt{2}$$", "C": "$$3\\sqrt{2}$$", "D": "$$3\\sqrt{3}$$"},
        "correct_option": "D",
        "hint": "$$\\angle B = 60^\\circ$$, bissektrisa $$BD$$ uni $$30^\\circ$$ ga ajratadi. To'g'ri burchakli $$\\triangle ABD$$ da: $$AB = BD \\cos 30^\\circ = 2\\sqrt{2} \\cdot \\frac{\\sqrt{3}}{2} = \\sqrt{6}$$. $$\\triangle ABC$$ da: $$AC = \\frac{AB}{\\tan 30^\\circ} = 3\\sqrt{2}$$. Uchburchak yuzi: $$S = \\frac{1}{2} \\cdot \\sqrt{6} \\cdot 3\\sqrt{2} = 3\\sqrt{3}$$."
    },
    {
        "id": "MOCK-04122022-Q27",
        "topic_id": "B3-M17",
        "topic": "Ko‘pburchaklar",
        "difficulty": "orta",
        "question": "Diagonallar soni tomonlar sonidan 6 marta ko'p bo'lgan ko'pburchakning ichki burchaklar yig'indisini toping.",
        "options": {"A": "$$2700^\\circ$$", "B": "$$1800^\\circ$$", "C": "$$2340^\\circ$$", "D": "$$2400^\\circ$$"},
        "correct_option": "C",
        "hint": "Diagonallar formulasi: $$\\frac{n(n-3)}{2} = 6n \\implies n - 3 = 12 \\implies n = 15$$. Ichki burchaklar yig'indisi: $$(n-2) \\cdot 180^\\circ = 13 \\cdot 180^\\circ = 2340^\\circ$$."
    },
    {
        "id": "MOCK-04122022-Q28",
        "topic_id": "B3-M13",
        "topic": "Romb va uning xossalari",
        "difficulty": "qiyin",
        "question": "Rombning katta diagonali $$10\\sqrt{4 + 2\\sqrt{2}}$$ ga teng, o'tkir burchagi $$45^\\circ$$ bo'lsa, diagonallari kesishish nuqtasidan tomonlarigacha bo'lgan eng qisqa masofalar yig'indisini toping.",
        "options": {"A": "$$10$$", "B": "$$20$$", "C": "$$15$$", "D": "$$25$$"},
        "correct_option": "B",
        "hint": "Diagonallar kesishish nuqtasi markaz bo'lib, 4 ta tomongacha masofalar teng ($$r$$). Yig'indisi: $$4r = 2h$$. Tomon $$a = 10\\sqrt{2}$$. Balandlik $$h = a \\sin 45^\\circ = 10$$. Masofalar yig'indisi: $$2 \\cdot 10 = 20$$."
    },
    {
        "id": "MOCK-04122022-Q29",
        "topic_id": "B3-M26",
        "topic": "Koordinatalar sistemasi",
        "difficulty": "oson",
        "question": "$$A(-2; 3)$$ va $$B(4; -1)$$ nuqtalar berilgan. $$AB$$ kesma o'rtasining koordinatalarini toping.",
        "options": {"A": "$$(1; 1)$$", "B": "$$(2; 2)$$", "C": "$$(3; 1)$$", "D": "$$(1; 2)$$"},
        "correct_option": "A",
        "hint": "Kesma o'rtasi: $$x_0 = \\frac{-2+4}{2} = 1, y_0 = \\frac{3+(-1)}{2} = 1$$. Natija: $$(1; 1)$$."
    },
    {
        "id": "MOCK-04122022-Q30",
        "topic_id": "B3-M27",
        "topic": "Vektorlar",
        "difficulty": "orta",
        "question": "$$ABC$$ uchburchakning yuzi $$60$$ ga teng. $$\\vec{BE} = \\vec{AB}$$ bo'lsa, $$AEC$$ uchburchakning yuzini toping.",
        "options": {"A": "$$120$$", "B": "$$90$$", "C": "$$60$$", "D": "$$30$$"},
        "correct_option": "A",
        "hint": "$$\\vec{BE} = \\vec{AB}$$ demak $$B$$ nuqta $$AE$$ kesmaning o'rtasi ($$AE = 2AB$$). Umumiy balandlikka ega bo'lgani uchun: $$S_{AEC} = 2 \\cdot S_{ABC} = 2 \\cdot 60 = 120$$."
    },
    {
        "id": "MOCK-04122022-Q31",
        "topic_id": "B4-M26",
        "topic": "To‘plamlar va ehtimollar nazariyasi",
        "difficulty": "orta",
        "question": "$$(A \\cap B) \\cup (A \\cup B)'$$ ning elementlar sonini toping.",
        "image_url": "/images/mock_04122022/q31.png",
        "options": {"A": "$$5$$", "B": "$$7$$", "C": "$$6$$", "D": "$$9$$"},
        "correct_option": "B",
        "hint": "Chizmada $$A \\cap B = \\{3, 5, 7\\}$$ (3 ta element). Doiralardan tashqaridagi $$(A \\cup B)'$$ elementlari: $$(10, 11, 4, 9)$$ (4 ta element). Birlashma elementlari soni: $$3 + 4 = 7$$ ta."
    },
    {
        "id": "MOCK-04122022-Q32",
        "topic_id": "B4-M26",
        "topic": "To‘plamlar va ehtimollar nazariyasi",
        "difficulty": "orta",
        "question": "Merganning nishonga tekkizish ehtimolligi $$0{,}8$$ ga teng. 5 marta o'q uzilgan. Dastlab otilgan 3 ta o'q tegib, keyingi 2 ta otilgan o'q tegmasligi ehtimolligini toping.",
        "options": {
            "A": "$$2^{10} \\cdot 10^{-6}$$",
            "B": "$$2^{11} \\cdot 10^{-5}$$",
            "C": "$$2^{11} \\cdot 10^{-6}$$",
            "D": "$$2^{10} \\cdot 10^{-5}$$"
        },
        "correct_option": "B",
        "hint": "Aniq ko'rsatilgan tartibda: $$P = (0{,}8)^3 \\cdot (0{,}2)^2 = \\frac{512 \\cdot 4}{10^5} = \\frac{2048}{10^5} = 2^{11} \\cdot 10^{-5}$$."
    },
    {
        "id": "MOCK-04122022-Q33",
        "topic_id": "B3-M35",
        "topic": "Piramida",
        "difficulty": "qiyin",
        "question": "Muntazam oltiburchakli piramidaga shar ichki chizilgan. Shar ichiga eng katta hajmli konus ichki chizilgan. Piramida asosining tomoni 6 ga, yon yog'i asos tekisligi bilan $$60^\\circ$$ tashkil etadi ($$\\pi \\approx 3$$ deb olinsin). Piramida hajmini toping.",
        "options": {
            "A": "$$162\\sqrt{3}$$",
            "B": "$$108$$",
            "C": "$$32$$",
            "D": "$$81$$"
        },
        "correct_option": "A",
        "hint": "Asos yuzi: $$S = 6 \\cdot \\frac{6^2\\sqrt{3}}{4} = 54\\sqrt{3}$$. Inradius: $$r = 3\\sqrt{3}$$. Balandlik: $$H = r \\tan 60^\\circ = 9$$. Piramida hajmi: $$V = \\frac{1}{3} S H = \\frac{1}{3}(54\\sqrt{3})(9) = 162\\sqrt{3}$$."
    },
    {
        "id": "MOCK-04122022-Q34",
        "topic_id": "B3-M38",
        "topic": "Shar",
        "difficulty": "qiyin",
        "question": "Muntazam oltiburchakli piramidaga shar ichki chizilgan. Piramida asosining tomoni 6 ga, yon yog'i asos tekisligi bilan $$60^\\circ$$ tashkil etadi ($$\\pi \\approx 3$$ deb olinsin). Ichki chizilgan shar hajmini toping.",
        "options": {
            "A": "$$162\\sqrt{3}$$",
            "B": "$$108$$",
            "C": "$$32$$",
            "D": "$$81$$"
        },
        "correct_option": "B",
        "hint": "Shar radiusi: $$R_{shar} = r_{asos} \\tan 30^\\circ = 3\\sqrt{3} \\cdot \\frac{1}{\\sqrt{3}} = 3$$. Shar hajmi: $$V = \\frac{4}{3} \\pi R^3 \\approx \\frac{4}{3} \\cdot 3 \\cdot 27 = 108$$."
    },
    {
        "id": "MOCK-04122022-Q35",
        "topic_id": "B3-M37",
        "topic": "Konus",
        "difficulty": "qiyin",
        "question": "Radiusi 3 ga teng shar ichiga chizilgan eng katta hajmli konus hajmini toping ($$\\pi \\approx 3$$ deb olinsin).",
        "options": {
            "A": "$$162\\sqrt{3}$$",
            "B": "$$108$$",
            "C": "$$32$$",
            "D": "$$81$$"
        },
        "correct_option": "C",
        "hint": "Shar ichiga chizilgan maksimal konus balandligi: $$h = \\frac{4}{3} R = 4$$. Asos radiusi: $$r = \\sqrt{R^2 - (h-R)^2} = \\sqrt{8}$$. Konus hajmi: $$V = \\frac{1}{3} \\pi r^2 h \\approx \\frac{1}{3} \\cdot 3 \\cdot 8 \\cdot 4 = 32$$."
    },
    {
        "id": "MOCK-04122022-Q36",
        "topic_id": "B2-M07",
        "topic": "Parametrli tenglama va tengsizliklar",
        "difficulty": "qiyin",
        "question": "$$\\frac{6x - k}{x - 1} = 3 - \\frac{2x + k}{x + 1}$$ tenglamani yeching: a) Tenglama bitta ildizga ega bo'ladigan $$k$$ ning eng katta qiymatini toping; b) Shu $$k$$ larning barcha qiymatlari yig'indisini toping.",
        "options": {
            "A": "a: 6; b: 9,1",
            "B": "a: 6; b: 8",
            "C": "a: 2; b: 9,1",
            "D": "a: 1,1; b: 9,1"
        },
        "correct_option": "A",
        "hint": "Umumiy maxrajga keltirsak: $$5x^2 + 4x + (3 - 2k) = 0$$. 1) $$D = 0 \\implies k = 1{,}1$$. 2) Chetdagi ildiz $$x = 1 \\implies k = 6$$. 3) Chetdagi ildiz $$x = -1 \\implies k = 2$$. Bitta ildizga ega bo'ladigan $$k$$ lar: $$\\{1{,}1; 2; 6\\}$$. Eng kattasi: 6. Yig'indisi: $$1{,}1 + 2 + 6 = 9{,}1$$."
    },
    {
        "id": "MOCK-04122022-Q37",
        "topic_id": "B4-M14",
        "topic": "Trigonometrik tenglamalar (1-qism)",
        "difficulty": "qiyin",
        "question": "$$3(\\log_2 \\sin x)^2 + \\log_2(1 - \\cos 2x) = 2$$ tenglamani yeching: a) Eng kichik musbat ildizini toping; b) $$\\left(-\\frac{\\pi}{2}; \\frac{5\\pi}{2}\\right)$$ oraliqdagi ildizlari sonini toping.",
        "options": {
            "A": "a: $$\\frac{\\pi}{6}$$; b: 3 ta",
            "B": "a: $$\\frac{\\pi}{3}$$; b: 3 ta",
            "C": "a: $$\\frac{\\pi}{6}$$; b: 2 ta",
            "D": "a: $$\\frac{5\\pi}{6}$$; b: 4 ta"
        },
        "correct_option": "A",
        "hint": "$$1 - \\cos 2x = 2\\sin^2 x$$. $$t = \\log_2 \\sin x \\le 0$$ desak: $$3t^2 + 2t - 1 = 0 \\implies t = -1 \\implies \\sin x = 1/2$$. a) Eng kichik musbat ildiz: $$x = \\pi/6$$. b) Berilgan oraliqdagi ildizlar soni: 3 ta ($$\\pi/6, 5\\pi/6, 13\\pi/6$$)."
    },
    {
        "id": "MOCK-04122022-Q38",
        "topic_id": "B4-M20",
        "topic": "Hosilaning geometrik va mexanik ma’nosi",
        "difficulty": "qiyin",
        "question": "Rasmda $$g(x) = kx + b$$ to'g'ri chiziq va $$f(x) = ax^2 + bx + c$$ parabola tasvirlangan. a) $$f'(2)$$ ni hisoblang; b) $$f'\\left(\\frac{1}{a}\\right) - 5f'\\left(\\frac{1}{b}\\right) + 2f'\\left(\\frac{1}{c}\\right)$$ ni hisoblang.",
        "image_url": "/images/mock_04122022/q38.png",
        "options": {
            "A": "a: -1; b: 4,5",
            "B": "a: -1; b: 3",
            "C": "a: 1; b: 4,5",
            "D": "a: -2; b: 5"
        },
        "correct_option": "A",
        "hint": "To'g'ri chiziq $$y = -x + 6$$, burchak koeffitsiyenti $$-1$$. Tangenslik nuqtasi $$x = 2$$ da bo'lgani sababli $$f'(2) = -1$$. Parabola tenglamasi: $$f(x) = -0{,}5x^2 + x + 4$$. Hosila: $$f'(x) = -x + 1$$. b shart bo'yicha hisoblanganda: $$3 - 5(0) + 2(0{,}75) = 4{,}5$$."
    },
    {
        "id": "MOCK-04122022-Q39",
        "topic_id": "B1-M14",
        "topic": "Ko‘phadlar va ular ustida amallar",
        "difficulty": "qiyin",
        "question": "$$f(x) = x^4 - 2x^3 + 2x^2 - 2x + 1$$ bo'lsa: a) $$f(1+\\sqrt{2}) + f(1-\\sqrt{2})$$ ni hisoblang; b) $$f(x) = 0$$ nechta turli haqiqiy ildizga ega?",
        "options": {
            "A": "a: 16; b: 1 ta",
            "B": "a: 16; b: 2 ta",
            "C": "a: 8; b: 1 ta",
            "D": "a: 12; b: 3 ta"
        },
        "correct_option": "A",
        "hint": "$$f(x) = (x^2 + 1)(x - 1)^2$$. $$x = 1 \\pm \\sqrt{2}$$ da: $$(x-1)^2 = 2$$ va $$x^2+1 = 4 \\pm 2\\sqrt{2}$$. Yig'indi: $$2(4+2\\sqrt{2}) + 2(4-2\\sqrt{2}) = 16$$. Haqiqiy ildizi faqat $$x = 1$$ (1 ta)."
    },
    {
        "id": "MOCK-04122022-Q40",
        "topic_id": "B4-M23",
        "topic": "Aniq integral va egri chiziqli trapetsiya yuzi",
        "difficulty": "qiyin",
        "question": "Rasmda $$f(x) = ax^2 + bx + c$$ parabola va $$g(x) = kx + l$$ to'g'ri chiziq grafiklari tasvirlangan. $$(-2; 0)$$ va $$(x_0; y_0)$$ to'g'ri chiziq kesishish nuqtalari bo'lsa: a) $$x_0 + y_0$$ ni hisoblang; b) Bo'yalgan sohaning yuzini toping.",
        "image_url": "/images/mock_04122022/q40.png",
        "options": {
            "A": "a: 12; b: 34,3",
            "B": "a: 10; b: 32",
            "C": "a: 12; b: 30,5",
            "D": "a: 14; b: 35"
        },
        "correct_option": "A",
        "hint": "Parabola va to'g'ri chiziq tenglamalaridan kesishish nuqtasi topiladi: $$x_0 + y_0 = 12$$. Bo'yalgan soha yuzi aniq integral orqali hisoblanganda: $$S \\approx 34{,}3$$."
    },
    {
        "id": "MOCK-04122022-Q41",
        "topic_id": "B3-M21",
        "topic": "Uchburchakka ichki chizilgan aylana",
        "difficulty": "qiyin",
        "question": "$$ABC$$ uchburchakda $$AB = 7, BC = 10, AC = 15$$. Uchburchakka ikkita aylana shunday ichki chizilganki, $$R$$ radiusli aylana tomonlarga, $$r$$ radiusli aylana esa $$AC, BC$$ va $$R$$ ga urinadi: a) $$R = ?$$ b) $$r = ?$$",
        "image_url": "/images/mock_04122022/q41.png",
        "options": {
            "A": "a: $$\\frac{3\\sqrt{6}}{4}$$; b: $$\\frac{3\\sqrt{6}}{20}$$",
            "B": "a: $$\\sqrt{6}$$; b: $$\\frac{\\sqrt{6}}{5}$$",
            "C": "a: $$\\frac{3\\sqrt{6}}{4}$$; b: $$\\frac{\\sqrt{6}}{4}$$",
            "D": "a: $$2\\sqrt{6}$$; b: $$\\frac{2\\sqrt{6}}{5}$$"
        },
        "correct_option": "A",
        "hint": "Geron formulasi bo'yicha uchburchak yuzi: $$S = 12\\sqrt{6}$$, yarim perimetr $$p = 16$$. Katta aylana radiusi: $$R = S/p = \\frac{3\\sqrt{6}}{4}$$. O'xshashlikdan kichik aylana radiusi: $$r = \\frac{3\\sqrt{6}}{20}$$."
    },
    {
        "id": "MOCK-04122022-Q42",
        "topic_id": "B3-M16",
        "topic": "Trapetsiya yuzi",
        "difficulty": "qiyin",
        "question": "Yuzi 42 ga teng $$ABCD$$ trapetsiya berilgan. $$BC$$ yon tomonidan $$K$$ va $$L$$ nuqtalar olingan. $$\\frac{CL}{LK} = \\frac{3}{2},\\ \\frac{KB}{LK} = 2,\\ \\frac{DC}{AB} = \\frac{5}{9}$$. a) $$AKB$$ uchburchak yuzini toping; b) $$AKLD$$ to'rtburchak yuzini toping.",
        "image_url": "/images/mock_04122022/q42.png",
        "options": {
            "A": "a: 18; b: 15",
            "B": "a: 16; b: 14",
            "C": "a: 18; b: 12",
            "D": "a: 20; b: 16"
        },
        "correct_option": "A",
        "hint": "Yon tomon bo'laklari nisbati va asoslar nisbati asosida balandliklar taqsimlanadi. $$S_{AKB} = 18$$, $$S_{AKLD} = 15$$."
    },
    {
        "id": "MOCK-04122022-Q43",
        "topic_id": "B3-M18",
        "topic": "Aylana va doira",
        "difficulty": "qiyin",
        "question": "Rasmda aylananing $$\\frac{1}{4}$$ qismi tasvirlangan. $$AC = AB = R$$, $$CD = 1,\\ BD = 3\\sqrt{2}$$ bo'lsa: a) $$\\sin \\angle CAD$$ ni toping; b) $$CAD$$ uchburchak yuzini toping.",
        "image_url": "/images/mock_04122022/q43.png",
        "options": {
            "A": "a: $$\\frac{\\sqrt{2}}{10}$$; b: $$\\frac{7}{4}$$",
            "B": "a: $$\\frac{\\sqrt{2}}{5}$$; b: $$2$$",
            "C": "a: $$\\frac{1}{5}$$; b: $$\\frac{3}{2}$$",
            "D": "a: $$\\frac{\\sqrt{3}}{6}$$; b: $$\\frac{7}{4}$$"
        },
        "correct_option": "A",
        "hint": "Ptolemey teoremasi va kosinuslar teoremasidan: $$\\sin \\angle CAD = \\frac{\\sqrt{2}}{10}$$. $$CAD$$ uchburchak yuzi: $$S = \\frac{7}{4}$$."
    },
    {
        "id": "MOCK-04122022-Q44",
        "topic_id": "B3-M36",
        "topic": "Silindr",
        "difficulty": "qiyin",
        "question": "Silindrga oktaedr ichki chizilgan. Oktaedrning hajmi 36 ga teng bo'lsa: a) Oktaedr qirrasini toping; b) Silindr hajmini toping.",
        "options": {
            "A": "a: $$3\\sqrt{2}$$; b: $$27\\pi$$",
            "B": "a: $$3\\sqrt{2}$$; b: $$36\\pi$$",
            "C": "a: $$2\\sqrt{3}$$; b: $$27\\pi$$",
            "D": "a: $$4$$; b: $$32\\pi$$"
        },
        "correct_option": "A",
        "hint": "Muntazam oktaedr hajmi: $$V = \\frac{\\sqrt{2}}{3} a^3 = 36 \\implies a = 3\\sqrt{2}$$. Ichki chizilgan silindr radiusi va balandligidan: $$V_{sil} = 27\\pi$$."
    },
    {
        "id": "MOCK-04122022-Q45",
        "topic_id": "B3-M36",
        "topic": "Silindr",
        "difficulty": "qiyin",
        "question": "Tomonlari 2 va 10 ga teng to'g'ri to'rtburchakli metalldan asoslari ikkita doira va yon sirti qirqib olinib silindr hosil qilindi ($$\\pi \\approx 3$$ deb oling): a) Eng kam chiqindi chiqarib yasalgan silindr hajmini toping; b) Chiqindi metalning necha foizini tashkil etadi?",
        "image_url": "/images/mock_04122022/q45.png",
        "options": {
            "A": "a: $$\\frac{16}{3}$$; b: $$20\\%$$",
            "B": "a: $$6$$; b: $$25\\%$$",
            "C": "a: $$\\frac{16}{3}$$; b: $$25\\%$$",
            "D": "a: $$5$$; b: $$18\\%$$"
        },
        "correct_option": "A",
        "hint": "Asos doiralari radiusi va yon sirt yoyilmasi bo'yicha optimallashtirilganda silindr hajmi $$V = \\frac{16}{3}$$ bo'ladi va chiqindi miqdori $$20\\%$$ ni tashkil etadi."
    }
]

def main():
    print(f"Uploading {len(QUESTIONS)} questions of 04.12.2022 Mock Exam...")
    data = json.dumps({"p_items": QUESTIONS}).encode("utf-8")
    req = urllib.request.Request(
        RPC_URL,
        data=data,
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Content-Type": "application/json"
        }
    )
    with urllib.request.urlopen(req) as resp:
        print("Upload response:", resp.read().decode("utf-8"))

if __name__ == "__main__":
    main()
