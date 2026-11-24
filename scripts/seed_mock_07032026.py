# -*- coding: utf-8 -*-
"""
Seed script for:
Matematika Milliy Sertifikat 07.03.2026 (1-variant)
All 35 authentic questions, figures, KaTeX formulas, options, and step-by-step solutions.
"""

import json
import urllib.request

RPC_URL = "https://mpkfhravlzpbhyeyvttu.supabase.co/rest/v1/rpc/bulk_import_questions_json"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2ZocmF2bHpwYmh5ZXl2dHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0NjUyMjAsImV4cCI6MjExMTA0MTIyMH0._OBSfDmI9lySYMjav1gxXkn5kCCkarbi5C0x3w6LhNA"
TEMPLATE_ID = "07032026-0000-0000-0000-000000000000"

QUESTIONS = [
    {
        "id": "MOCK-07032026-Q01",
        "topic_id": "B1-M02",
        "topic": "Bo‘linish belgilari, tub va murakkab sonlar",
        "difficulty": "orta",
        "question": "Agar $$m = 24^3 \\cdot 6^{12} \\cdot 20^3$$ bo'lsa, $$\\frac{m^2}{2^n}$$ kasrning qiymati natural son bo'ladigan $$n$$ ning eng katta qiymatini toping.",
        "options": {"A": "$$54$$", "B": "$$48$$", "C": "$$27$$", "D": "$$60$$"},
        "correct_option": "A",
        "hint": "$$m$$ sonidagi 2 ning darajasini hisoblaymiz: $$24^3 = (2^3 \\cdot 3)^3 = 2^9 \\cdot 3^3$$, $$6^{12} = (2 \\cdot 3)^{12} = 2^{12} \\cdot 3^{12}$$, $$20^3 = (2^2 \\cdot 5)^3 = 2^6 \\cdot 5^3$$. Jami 2 ning darajasi: $$9 + 12 + 6 = 27$$. Demak, $$m^2$$ tarkibida 2 ning darajasi $$27 \\times 2 = 54$$ bo'ladi. Kasr natural son bo'lishi uchun $$n \\le 54$$, eng katta qiymat $$n = 54$$."
    },
    {
        "id": "MOCK-07032026-Q02",
        "topic_id": "B1-M09",
        "topic": "Haqiqiy sonlar va sonli oraliqlar",
        "difficulty": "orta",
        "question": "Agar $$a = \\lg 3, b = \\cos 3, c = \\ln 3$$ bo'lsa, $$\\frac{|a-b| + |b-c| - |a-c|}{|a+b| + |b-c| - |c+a|}$$ ifodani soddalashtiring.",
        "options": {
            "A": "$$\\frac{b+a}{b}$$",
            "B": "$$\\frac{b-a}{b+a}$$",
            "C": "$$\\frac{a-b}{a}$$",
            "D": "$$-\\frac{b-a}{b+a}$$"
        },
        "correct_option": "B",
        "hint": "$$3$$ radian II chorakda yotadi, shuning uchun $$b = \\cos 3 < 0$$. $$a = \\lg 3 \\approx 0.477 > 0$$ va $$c = \\ln 3 \\approx 1.098 > 0$$. Demak, $$b < 0 < a < c$$. Shuningdek, $$|a+b| = -(a+b)$$ chunki $$|\\cos 3| \\approx 0.99 > 0.477$$. Surat: $$(a-b) + (c-b) - (c-a) = 2(a-b)$$. Maxraj: $$-(a+b) + (c-b) - (c+a) = -2(a+b)$$. Natija: $$\\frac{2(a-b)}{-2(a+b)} = \\frac{b-a}{b+a}$$."
    },
    {
        "id": "MOCK-07032026-Q03",
        "topic_id": "B1-M23",
        "topic": "Tenglama va sistemalar orqali yechiladigan matnli masalalar",
        "difficulty": "orta",
        "question": "Mug'ombir soddadilga ushbu ko'prikdan har bir o'tishingda cho'ntagingdagi pulni 2 barobar oshirib beraman deydi. Lekin sen menga har safar o'tganingda 36 000 so'm berasan. Agar soddadil 3 marta ko'prik ustidan o'tgandan so'ng puli tugagan bo'lsa, boshida soddadilda necha so'm pul bo'lgan?",
        "options": {"A": "$$45\\,000$$", "B": "$$36\\,000$$", "C": "$$32\\,000$$", "D": "$$31\\,500$$"},
        "correct_option": "D",
        "hint": "Boshlang'ich pul $$x$$. 1-o'tishdan so'ng: $$2x - 36000$$. 2-o'tishdan so'ng: $$2(2x - 36000) - 36000 = 4x - 108000$$. 3-o'tishdan so'ng: $$2(4x - 108000) - 36000 = 8x - 252000$$. Shartga ko'ra: $$8x - 252000 = 0 \\implies 8x = 252000 \\implies x = 31\\,500$$ so'm."
    },
    {
        "id": "MOCK-07032026-Q04",
        "topic_id": "B1-M15",
        "topic": "Foizlar, aralashma va qotishmalarga doir masalalar",
        "difficulty": "orta",
        "question": "Tarkibida 60 litr suv bo'lgan suv va neft aralashmasi tarkibidan 15 litr neft ajratib olindi. Qolgan birikma tarkibida 4% neft qoldi. 60 litr aralashmaning tarkibida necha % neft bo'lgan?",
        "options": {"A": "$$28\\%$$", "B": "$$20\\%$$", "C": "$$24\\%$$", "D": "$$26\\%$$"},
        "correct_option": "A",
        "hint": "Dastlabki 60 litr aralashmadan 15 litr neft olingach, 45 litr qoladi. Qolgan aralashmada neft: $$45 \\times 0.04 = 1.8$$ litr. Dastlabki neft miqdori: $$1.8 + 15 = 16.8$$ litr. Foizi: $$\\frac{16.8}{60} \\times 100\\% = 28\\%$$."
    },
    {
        "id": "MOCK-07032026-Q05",
        "topic_id": "B1-M11",
        "topic": "Darajalar va ularning xossalari",
        "difficulty": "oson",
        "question": "Hisoblang: $$\\frac{(a^2)^{-3} \\cdot (-a^2)^7}{(-a^3)^2}$$.",
        "options": {"A": "$$-a^2$$", "B": "$$a^2$$", "C": "$$a^3$$", "D": "$$a^{-3}$$"},
        "correct_option": "A",
        "hint": "Surat: $$(a^2)^{-3} = a^{-6}$$, $$(-a^2)^7 = -(a^2)^7 = -a^{14}$$. Surat ko'paytmasi: $$a^{-6} \\cdot (-a^{14}) = -a^8$$. Maxraj: $$(-a^3)^2 = a^6$$. Natija: $$\\frac{-a^8}{a^6} = -a^2$$."
    },
    {
        "id": "MOCK-07032026-Q06",
        "topic_id": "B1-M12",
        "topic": "Kvadrat ildizlar va irrasional ifodalar",
        "difficulty": "oson",
        "question": "Hisoblang: $$\\frac{1}{\\sqrt{2}+2} - \\frac{1}{2-\\sqrt{2}} - \\sqrt{2}$$.",
        "options": {"A": "$$-\\sqrt{2}$$", "B": "$$-2\\sqrt{2}$$", "C": "$$2\\sqrt{2}$$", "D": "$$\\sqrt{2}$$"},
        "correct_option": "B",
        "hint": "Kasrlarni irratsionallikdan qutqaramiz: $$\\frac{1}{2+\\sqrt{2}} = \\frac{2-\\sqrt{2}}{4-2} = 1 - \\frac{\\sqrt{2}}{2}$$, $$\\frac{1}{2-\\sqrt{2}} = \\frac{2+\\sqrt{2}}{2} = 1 + \\frac{\\sqrt{2}}{2}$$. Ayirma: $$\\left(1 - \\frac{\\sqrt{2}}{2}\\right) - \\left(1 + \\frac{\\sqrt{2}}{2}\\right) - \\sqrt{2} = -\\sqrt{2} - \\sqrt{2} = -2\\sqrt{2}$$."
    },
    {
        "id": "MOCK-07032026-Q07",
        "topic_id": "B1-M12",
        "topic": "Kvadrat ildizlar va irrasional ifodalar",
        "difficulty": "qiyin",
        "question": "Hisoblang: $$\\frac{8(\\sqrt{3}-\\sqrt{15})}{\\sqrt{3}+\\sqrt{7}+\\sqrt{11}+\\sqrt{15}} + \\frac{8(\\sqrt{3}-\\sqrt{15})}{\\sqrt{3}-\\sqrt{7}-\\sqrt{11}+\\sqrt{15}}$$.",
        "options": {
            "A": "$$1$$",
            "B": "$$-9\\sqrt{5}-3\\sqrt{11}$$",
            "C": "$$-9\\sqrt{5}+2\\sqrt{11}$$",
            "D": "$$9\\sqrt{5}+3\\sqrt{77}$$"
        },
        "correct_option": "D",
        "hint": "$$u = \\sqrt{3}+\\sqrt{15}$$, $$v = \\sqrt{7}+\\sqrt{11}$$ deb olamiz. Kasrlar yig'indisi: $$N \\cdot \\frac{2u}{u^2 - v^2}$$. Bu yerda $$u^2 - v^2 = (18+6\\sqrt{5}) - (18+2\\sqrt{77}) = 2(3\\sqrt{5}-\\sqrt{77})$$. Surat ko'paytmasi: $$8(\\sqrt{3}-\\sqrt{15}) \\cdot 2(\\sqrt{3}+\\sqrt{15}) = 16(3-15) = -192$$. Kasr: $$\\frac{-192}{2(3\\sqrt{5}-\\sqrt{77})} = \\frac{96}{\\sqrt{77}-3\\sqrt{5}} = \\frac{96(\\sqrt{77}+3\\sqrt{5})}{77-45} = 3(\\sqrt{77}+3\\sqrt{5}) = 9\\sqrt{5}+3\\sqrt{77}$$."
    },
    {
        "id": "MOCK-07032026-Q08",
        "topic_id": "B2-M12",
        "topic": "Logarifmik funksiyalar va xossalari",
        "difficulty": "orta",
        "question": "$$\\log_{12} 162, \\log_{12} x, \\log_{12} y, \\log_{12} z, \\log_{12} 1250$$ sonlari arifmetik progressiyaning ketma-ket hadlari bo'lsa, $$z - x - y$$ ning qiymatini toping.",
        "options": {"A": "$$-30$$", "B": "$$20$$", "C": "$$30$$", "D": "$$570$$"},
        "correct_option": "C",
        "hint": "Logarifmlar arifmetik progressiya hosil qilsa, ularning argumentlari geometrik progressiya tashkil etadi: $$b_1 = 162, b_5 = 1250$$. $$q^4 = \\frac{1250}{162} = \\frac{625}{81} \\implies q = \\frac{5}{3}$$. Demak: $$x = 162 \\cdot \\frac{5}{3} = 270$$, $$y = 270 \\cdot \\frac{5}{3} = 450$$, $$z = 450 \\cdot \\frac{5}{3} = 750$$. Natija: $$z - x - y = 750 - 270 - 450 = 30$$."
    },
    {
        "id": "MOCK-07032026-Q09",
        "topic_id": "B1-M30",
        "topic": "Geometrik progressiya",
        "difficulty": "orta",
        "question": "Agar $$q < 1$$ bo'lgan geometrik progressiyada $$b_1 + b_2 + b_3 = 21$$ va $$b_1 \\cdot b_2 \\cdot b_3 = 216$$ bo'lsa, geometrik progressiyada $$S_5$$ ni toping.",
        "options": {"A": "$$23\\frac{1}{4}$$", "B": "$$93$$", "C": "$$22\\frac{1}{2}$$", "D": "$$45$$"},
        "correct_option": "A",
        "hint": "$$b_1 \\cdot b_2 \\cdot b_3 = b_2^3 = 216 \\implies b_2 = 6$$. $$b_1 + b_3 = 21 - 6 = 15$$. $$\\frac{6}{q} + 6q = 15 \\implies 2q^2 - 5q + 2 = 0$$. $$q < 1$$ bo'lgani sababli $$q = \\frac{1}{2}$$. Unda $$b_1 = 12$$. $$S_5 = \\frac{12(1 - (1/2)^5)}{1 - 1/2} = 24 \\cdot \\frac{31}{32} = \\frac{93}{4} = 23\\frac{1}{4}$$."
    },
    {
        "id": "MOCK-07032026-Q10",
        "topic_id": "B1-M10",
        "topic": "Qisqa ko‘paytirish formulalari",
        "difficulty": "oson",
        "question": "Soddalashtiring: $$\\frac{a^3 - b^3}{(2a+b)^2 - 3a(a+b)} + \\frac{(a^2+b)\\cdot(b^2+a) - ab\\cdot(ab+1)}{a^2 - ab + b^2}$$.",
        "options": {"A": "$$2b$$", "B": "$$2a$$", "C": "$$2a + 2b$$", "D": "$$2a - 2b$$"},
        "correct_option": "B",
        "hint": "Birinchi maxraj: $$(2a+b)^2 - 3a(a+b) = 4a^2 + 4ab + b^2 - 3a^2 - 3ab = a^2 + ab + b^2$$. Birinchi kasr: $$\\frac{a^3-b^3}{a^2+ab+b^2} = a - b$$. Ikkinchi surat: $$(a^2+b)(b^2+a) - ab(ab+1) = a^3 + b^3$$. Ikkinchi kasr: $$\\frac{a^3+b^3}{a^2-ab+b^2} = a + b$$. Yig'indi: $$(a - b) + (a + b) = 2a$$."
    },
    {
        "id": "MOCK-07032026-Q11",
        "topic_id": "B1-M12",
        "topic": "Kvadrat ildizlar va irrasional ifodalar",
        "difficulty": "orta",
        "question": "Soddalashtiring ($$a \\ge 3$$): $$\\left(\\frac{a + \\sqrt{a^2-3a}}{a - \\sqrt{a^2-3a}} - \\frac{a - \\sqrt{a^2-3a}}{a + \\sqrt{a^2-3a}}\\right) \\cdot \\frac{3}{4}$$.",
        "options": {
            "A": "$$\\sqrt{a^2 - 3a}$$",
            "B": "$$a^2 - 3a$$",
            "C": "$$a^2 + 3a$$",
            "D": "$$\\sqrt{a^2 + 3a}$$"
        },
        "correct_option": "A",
        "hint": "$$u = a, v = \\sqrt{a^2-3a}$$. Qavs ichi: $$\\frac{(u+v)^2 - (u-v)^2}{u^2 - v^2} = \\frac{4uv}{u^2 - v^2} = \\frac{4a\\sqrt{a^2-3a}}{a^2 - (a^2-3a)} = \\frac{4a\\sqrt{a^2-3a}}{3a} = \\frac{4}{3}\\sqrt{a^2-3a}$$. $$\\frac{3}{4}$$ ga ko'paytirilganda: $$\\frac{4}{3}\\sqrt{a^2-3a} \\cdot \\frac{3}{4} = \\sqrt{a^2-3a}$$."
    },
    {
        "id": "MOCK-07032026-Q12",
        "topic_id": "B2-M15",
        "topic": "Trigonometrik funksiyalar va ularning xossalari",
        "difficulty": "oson",
        "question": "Sonlarni kamayish tartibida joylashtiring: $$a = \\sin 17^\\circ, b = \\sin 167^\\circ, c = \\sin 375^\\circ$$.",
        "options": {
            "A": "$$a > c > b$$",
            "B": "$$b > a > c$$",
            "C": "$$c > b > a$$",
            "D": "$$c > a > b$$"
        },
        "correct_option": "A",
        "hint": "$$b = \\sin 167^\\circ = \\sin(180^\\circ - 13^\\circ) = \\sin 13^\\circ$$. $$c = \\sin 375^\\circ = \\sin(360^\\circ + 15^\\circ) = \\sin 15^\\circ$$. I chorakda sinus funksiyasi qat'iy o'suvchi: $$\\sin 13^\\circ < \\sin 15^\\circ < \\sin 17^\\circ \\implies b < c < a$$. Kamayish tartibida: $$a > c > b$$."
    },
    {
        "id": "MOCK-07032026-Q13",
        "topic_id": "B2-M20",
        "topic": "Trigonometrik tenglamalar",
        "difficulty": "qiyin",
        "question": "$$2(\\sin^2 x + \\text{tg}^2 x) + 3 = 4\\text{tg } x + 2\\sqrt{2}\\sin x$$ tenglamaning $$[0; 4\\pi]$$ oraliqdagi ildizlari yig'indisini toping.",
        "options": {
            "A": "$$\\frac{5\\pi}{2}$$",
            "B": "$$\\frac{9\\pi}{2}$$",
            "C": "$$5\\pi$$",
            "D": "$$9\\pi$$"
        },
        "correct_option": "A",
        "hint": "Tenglamani guruhlaymiz: $$2(\\text{tg } x - 1)^2 + (\\sqrt{2}\\sin x - 1)^2 = 0$$. Kvadratlar yig'indisi 0 bo'lishi uchun: $$\\text{tg } x = 1$$ va $$\\sin x = \\frac{\\sqrt{2}}{2}$$. Ikkala shart $$x = \\frac{\\pi}{4} + 2\\pi k$$ da bajariladi. $$[0; 4\\pi]$$ oraliqdagi ildizlar: $$x_1 = \\frac{\\pi}{4}$$, $$x_2 = \\frac{9\\pi}{4}$$. Yig'indi: $$\\frac{\\pi}{4} + \\frac{9\\pi}{4} = \\frac{5\\pi}{2}$$."
    },
    {
        "id": "MOCK-07032026-Q14",
        "topic_id": "B2-M07",
        "topic": "Ko‘rsatkichli tenglamalar",
        "difficulty": "orta",
        "question": "Tenglamaning haqiqiy ildizlari yig'indisini toping: $$(\\sqrt{7+4\\sqrt{3}})^x + (\\sqrt{7-4\\sqrt{3}})^x = 14$$.",
        "options": {"A": "$$-2$$", "B": "$$2$$", "C": "$$-4$$", "D": "$$0$$"},
        "correct_option": "D",
        "hint": "$$7 \\pm 4\\sqrt{3} = (2 \\pm \\sqrt{3})^2$$. Tenglama: $$(2+\\sqrt{3})^x + (2-\\sqrt{3})^x = 14$$. $$(2+\\sqrt{3})(2-\\sqrt{3}) = 1$$. $$t = (2+\\sqrt{3})^x$$ deb belgilasak: $$t + \\frac{1}{t} = 14 \\implies t = 7 \\pm 4\\sqrt{3} = (2+\\sqrt{3})^{\\pm 2}$$. Demak, $$x_1 = 2, x_2 = -2$$. Ildizlar yig'indisi: $$2 + (-2) = 0$$."
    },
    {
        "id": "MOCK-07032026-Q15",
        "topic_id": "B2-M13",
        "topic": "Logarifmik tenglamalar",
        "difficulty": "orta",
        "question": "Tenglamani yeching: $$\\left(\\frac{2}{3}\\right)^{\\log_3(x+1)} \\cdot \\left(\\frac{4}{9}\\right)^{\\log_{\\frac{1}{9}}(x-1)} = \\frac{2}{3}$$.",
        "options": {"A": "$$2$$", "B": "$$4$$", "C": "$$6$$", "D": "$$0$$"},
        "correct_option": "A",
        "hint": "$$\\frac{4}{9} = (2/3)^2$$ va $$\\log_{1/9}(x-1) = -\\frac{1}{2}\\log_3(x-1)$$. Darajadagi ifoda: $$\\log_3(x+1) - \\log_3(x-1) = \\log_3\\left(\\frac{x+1}{x-1}\\right)$$. Asoslar tengligidan: $$\\log_3\\left(\\frac{x+1}{x-1}\\right) = 1 \\implies \\frac{x+1}{x-1} = 3 \\implies 2x = 4 \\implies x = 2$$."
    },
    {
        "id": "MOCK-07032026-Q16",
        "topic_id": "B1-M22",
        "topic": "Tenglamalar sistemasi",
        "difficulty": "orta",
        "question": "Tenglamalar sistemasining yechimlari $$(x_1; y_1); (x_2; y_2); \\dots; (x_n; y_n)$$ bo'lsa, $$x_1 + x_2 + \\dots + x_n$$ ni toping:\n$$\\begin{cases} x^2 + y^2 = 34 \\\\ x + xy + y = 7 \\end{cases}$$",
        "options": {"A": "$$0$$", "B": "$$6$$", "C": "$$-2$$", "D": "$$-8$$"},
        "correct_option": "C",
        "hint": "$$s = x+y, p = xy$$. $$s^2 - 2p = 34$$ va $$s + p = 7 \\implies p = 7 - s$$. O'rniga qo'ysak: $$s^2 + 2s - 48 = 0 \\implies s_1 = 6, s_2 = -8$$. 1) $$s = 6, p = 1$$ bo'lsa, $$x_1 + x_2 = 6$$. 2) $$s = -8, p = 15$$ bo'lsa, $$t^2 + 8t + 15 = 0 \\implies t = -3, -5$$, ya'ni $$x_3 + x_4 = -8$$. Barcha $$x_i$$ yig'indisi: $$6 + (-8) = -2$$."
    },
    {
        "id": "MOCK-07032026-Q17",
        "topic_id": "B1-M20",
        "topic": "Irrasional tenglamalar",
        "difficulty": "orta",
        "question": "Tenglamaning haqiqiy ildizlari yig'indisini toping: $$(x^2 - 8x + 12)\\cdot\\sqrt{10 + 3x - x^2} = 0$$.",
        "options": {"A": "$$5$$", "B": "$$-2$$", "C": "$$3$$", "D": "$$11$$"},
        "correct_option": "A",
        "hint": "Aniqlanish sohasi: $$10 + 3x - x^2 \\ge 0 \\implies (x-5)(x+2) \\le 0 \\implies x \\in [-2; 5]$$. Ildizlar: $$10+3x-x^2 = 0 \\implies x = -2, 5$$. $$x^2 - 8x + 12 = 0 \\implies x = 2, 6$$. Lekin $$x = 6 \\notin [-2; 5]$$ yotmaydi. Haqiqiy ildizlar: $$-2, 2, 5$$. Yig'indi: $$-2 + 2 + 5 = 5$$."
    },
    {
        "id": "MOCK-07032026-Q18",
        "topic_id": "B1-M25",
        "topic": "Tengsizliklar sistemasi",
        "difficulty": "qiyin",
        "question": "Tengsizliklar sistemasini yeching:\n$$\\begin{cases} \\frac{36}{x} - x \\le 0 \\\\ \\frac{|12 - 2x|\\cdot(x^2 + 5x + 25)}{|x| - 3} \\le 0 \\end{cases}$$",
        "options": {
            "A": "$$(-3; 3) \\cup \\{6\\}$$",
            "B": "$$(-3; 0) \\cup (0; 6)$$",
            "C": "$$(-3; 0) \\cup \\{6\\}$$",
            "D": "$$(-\\infty; 6) \\cup (6; \\infty)$$"
        },
        "correct_option": "C",
        "hint": "1) $$\\frac{36-x^2}{x} \\le 0 \\implies \\frac{(x-6)(x+6)}{x} \\ge 0 \\implies x \\in [-6; 0) \\cup [6; \\infty)$$. 2) $$x^2+5x+25 > 0$$. $$|12-2x| = 0 \\implies x = 6$$ da tengsizlik bajariladi. $$x \\ne 6$$ da surat musbat, demak maxraj $$|x| - 3 < 0 \\implies x \\in (-3; 3)$$. Ikkala tengsizlik kesishmasi: $$([-6; 0) \\cup [6; \\infty)) \\cap ((-3; 3) \\cup \\{6\\}) = (-3; 0) \\cup \\{6\\}$$."
    },
    {
        "id": "MOCK-07032026-Q19",
        "topic_id": "B1-M27",
        "topic": "Irrasional tengsizliklar",
        "difficulty": "oson",
        "question": "Tengsizlikni yeching: $$\\sqrt{x-11} + \\sqrt{12-x} > 0$$.",
        "options": {
            "A": "$$(11; 12)$$",
            "B": "$$[11; 12]$$",
            "C": "$$\\{11; 12\\}$$",
            "D": "$$(-\\infty; \\infty)$$"
        },
        "correct_option": "B",
        "hint": "Aniqlanish sohasi: $$x \\ge 11$$ va $$x \\le 12$$, ya'ni $$x \\in [11; 12]$$. Ushbu sohada ikkala ildiz bir vaqtda nolga teng bo'la olmaydi ($$x = 11$$ da $$\\sqrt{1} > 0$$, $$x = 12$$ da $$\\sqrt{1} > 0$$). Demak, aniqlanish sohasidagi barcha $$x$$ lar uchun yig'indi musbat bo'ladi: $$[11; 12]$$."
    },
    {
        "id": "MOCK-07032026-Q20",
        "topic_id": "B2-M03",
        "topic": "Funksiya grafigi va murakkab funksiyalar",
        "difficulty": "oson",
        "question": "Agar $$f(x) = \\begin{cases} 8 + x, & \\text{agar } x < 0 \\\\ 2 - x, & \\text{agar } x \\ge 0 \\end{cases}$$ bo'lsa, $$f(f(f(-5)))$$ ni toping.",
        "options": {"A": "$$3$$", "B": "$$7$$", "C": "$$5$$", "D": "$$9$$"},
        "correct_option": "B",
        "hint": "1) $$f(-5) = 8 + (-5) = 3$$. 2) $$f(3) = 2 - 3 = -1$$. 3) $$f(-1) = 8 + (-1) = 7$$. Demak, $$f(f(f(-5))) = 7$$."
    },
    {
        "id": "MOCK-07032026-Q21",
        "topic_id": "B2-M26",
        "topic": "Aniq integral va yuzalarni hisoblash",
        "difficulty": "orta",
        "question": "Aniq integralni hisoblang: $$\\int_3^6 \\frac{x+1}{x^2 + x - 6} dx$$.",
        "options": {
            "A": "$$\\frac{2}{5}\\ln 6$$",
            "B": "$$\\frac{4}{5}\\ln 6$$",
            "C": "$$\\frac{4}{5}\\ln 12$$",
            "D": "$$\\frac{2}{5}\\ln 12$$"
        },
        "correct_option": "D",
        "hint": "Oddiy kasrlarga ajratamiz: $$\\frac{x+1}{(x+3)(x-2)} = \\frac{2/5}{x+3} + \\frac{3/5}{x-2}$$. Boshlang'ich funksiya: $$\\left[\\frac{2}{5}\\ln|x+3| + \\frac{3}{5}\\ln|x-2|\\right]_3^6$$. Yuqori chegara (6): $$\\frac{2}{5}\\ln 9 + \\frac{3}{5}\\ln 4 = \\frac{4}{5}\\ln 3 + \\frac{6}{5}\\ln 2$$. Quyi chegara (3): $$\\frac{2}{5}\\ln 6 + 0 = \\frac{2}{5}\\ln 3 + \\frac{2}{5}\\ln 2$$. Ayirma: $$\\frac{2}{5}\\ln 3 + \\frac{4}{5}\\ln 2 = \\frac{2}{5}(\\ln 3 + \\ln 4) = \\frac{2}{5}\\ln 12$$."
    },
    {
        "id": "MOCK-07032026-Q22",
        "topic_id": "B2-M22",
        "topic": "Hosilaning ta’rifi va hisoblash qoidalari",
        "difficulty": "orta",
        "question": "Agar $$f(x) = \\frac{x + x^2 + x^3 + \\dots + x^{2024}}{x + x^2 + x^3 + \\dots + x^{1012}}$$ bo'lsa, $$f'(1)$$ ni toping.",
        "options": {"A": "$$1$$", "B": "$$-1$$", "C": "$$-1012$$", "D": "$$1012$$"},
        "correct_option": "D",
        "hint": "Suratni guruhlaymiz: $$(x + \\dots + x^{1012}) + x^{1012}(x + \\dots + x^{1012}) = (x + \\dots + x^{1012})(1 + x^{1012})$$. Maxraj bilan qisqarganda: $$f(x) = 1 + x^{1012}$$. Hosila: $$f'(x) = 1012 x^{1011}$$. Nuqtada: $$f'(1) = 1012 \\cdot 1 = 1012$$."
    },
    {
        "id": "MOCK-07032026-Q23",
        "topic_id": "B3-M20",
        "topic": "Aylana va to‘g‘ri chiziqning o‘zaro vaziyati, urinma",
        "difficulty": "orta",
        "question": "Agar $$O_1$$ aylana radiusi 5 ga, $$O_2$$ aylana radiusi 2 ga teng bo'lsa, umumiy urinma $$AB$$ kesma uzunligini toping.",
        "image_url": "/images/mock_07032026/q23.png",
        "options": {"A": "$$4\\sqrt{7}$$", "B": "$$\\sqrt{117}$$", "C": "$$\\sqrt{130}$$", "D": "$$3\\sqrt{7}$$"},
        "correct_option": "A",
        "hint": "Aylana markazlarining gorizontal masofasi 11, radiuslar ayirmasi: $$R_1 - R_2 = 5 - 2 = 3$$. Tashqi umumiy urinma uzunligi to'g'ri burchakli uchburchakdan: $$AB = \\sqrt{11^2 - (5-2)^2} = \\sqrt{121 - 9} = \\sqrt{112} = \\sqrt{16 \\times 7} = 4\\sqrt{7}$$."
    },
    {
        "id": "MOCK-07032026-Q24",
        "topic_id": "B2-M05",
        "topic": "Kvadratik funksiya va uning grafigi (parabola)",
        "difficulty": "orta",
        "question": "$$f(x) = x^2 - 2ax - a - 6$$ funksiya $$Ox$$ o'qini kesib o'tuvchi nuqtalar orasidagi masofa 10 ga teng bo'lsa, $$a$$ ning qiymatlari yig'indisini toping. (Agar u bitta bo'lsa shu sonni toping.)",
        "options": {"A": "$$-1$$", "B": "$$4$$", "C": "$$-6$$", "D": "$$10$$"},
        "correct_option": "A",
        "hint": "Ildizlar ayirmasi: $$|x_1 - x_2| = 10 \\implies (x_1 - x_2)^2 = (x_1 + x_2)^2 - 4x_1 x_2 = 100$$. Viyet teoremasidan: $$(2a)^2 - 4(-a-6) = 100 \\implies 4a^2 + 4a + 24 = 100 \\implies a^2 + a - 19 = 0$$. Viyet teoremasiga ko'ra $$a_1 + a_2 = -1$$."
    },
    {
        "id": "MOCK-07032026-Q25",
        "topic_id": "B3-M06",
        "topic": "Uchburchak burchaklari yig‘indisi va tashqi burchak",
        "difficulty": "qiyin",
        "question": "$$ABC$$ uchburchak berilgan. $$BDC$$ bir to'g'ri chiziqda yotadi va $$|AC| = |AD|$$, $$|AE| = |DE|$$ tengliklar o'rinli bo'lsa, $$\\angle FLB = \\beta$$ ni toping.",
        "image_url": "/images/mock_07032026/q25.png",
        "options": {"A": "$$90^\\circ$$", "B": "$$99^\\circ$$", "C": "$$100^\\circ$$", "D": "$$108^\\circ$$"},
        "correct_option": "B",
        "hint": "$$|AE| = |DE| \\implies \\angle DAE = \\angle ADE = \\alpha$$. $$DE$$ bissektrisa bo'lgani uchun $$\\angle CDE = \\alpha$$, demak $$\\angle ADC = 2\\alpha$$. $$|AC| = |AD| \\implies \\angle C = 2\\alpha$$. $$\\triangle ACD$$ da: $$\\alpha + 2\\alpha + 2\\alpha = 180^\\circ \\implies \\alpha = 36^\\circ$$. $$\\triangle ABC$$ da: $$\\angle A = 72^\\circ, \\angle C = 72^\\circ \\implies \\angle B = 36^\\circ$$. $$\\angle BDA = 180^\\circ - 72^\\circ = 108^\\circ$$. $$DF$$ bissektrisa bo'lgani uchun $$\\angle BDF = 54^\\circ$$. $$\\triangle BDF$$ da: $$\\angle BFD = 180^\\circ - (36^\\circ + 54^\\circ) = 90^\\circ$$. $$FL$$ bissektrisa bo'lgani uchun $$\\angle BFL = 45^\\circ$$. $$\\triangle BFL$$ da: $$\\angle FLB = \\beta = 180^\\circ - (36^\\circ + 45^\\circ) = 99^\\circ$$."
    },
    {
        "id": "MOCK-07032026-Q26",
        "topic_id": "B3-M10",
        "topic": "Teng tomonli (muntazam) uchburchak",
        "difficulty": "qiyin",
        "question": "$$ABC$$ muntazam uchburchakning tomoni 8 ga teng. $$AD$$ kesma asosini 5 va 3 ga teng kesmalarga ajratadi. $$ADC$$ va $$ABD$$ uchburchakka ichki chizilgan doira yuzalari yig'indisini toping.",
        "image_url": "/images/mock_07032026/q26.png",
        "options": {"A": "$$\\frac{14\\pi}{3}$$", "B": "$$14\\pi$$", "C": "$$\\frac{13\\pi}{3}$$", "D": "$$6\\pi$$"},
        "correct_option": "C",
        "hint": "Kosinuslar teoremasidan $$AD = 7$$. $$\\triangle ABD$$ da tomonlar: 8, 3, 7. Yarim perimetr $$p_1 = 9$$, yuzi $$S_1 = 6\\sqrt{3}$$, ichki radius $$r_1 = \\frac{2\\sqrt{3}}{3}$$, doira yuzi $$S_{d1} = \\frac{4\\pi}{3}$$. $$\\triangle ADC$$ da tomonlar: 8, 5, 7. Yarim perimetr $$p_2 = 10$$, yuzi $$S_2 = 10\\sqrt{3}$$, ichki radius $$r_2 = \\sqrt{3}$$, doira yuzi $$S_{d2} = 3\\pi$$. Doiralar yuzalari yig'indisi: $$\\frac{4\\pi}{3} + 3\\pi = \\frac{13\\pi}{3}$$."
    },
    {
        "id": "MOCK-07032026-Q27",
        "topic_id": "B3-M17",
        "topic": "Trapetsiya va uning elementlari",
        "difficulty": "orta",
        "question": "$$ABCD$$ trapetsiyaning diagonallari $$O$$ nuqtada kesishadi. $$BOC$$ uchburchak yuzasi 3 ga teng. Agar $$\\frac{S_{BOC}}{S_{COD}} = \\frac{1}{3}$$ bo'lsa, $$AOB$$ uchburchak yuzini toping.",
        "image_url": "/images/mock_07032026/q27.png",
        "options": {"A": "$$12$$", "B": "$$27$$", "C": "$$9$$", "D": "$$15$$"},
        "correct_option": "C",
        "hint": "Ixtiyoriy trapetsiyada diagonallar kesishishidan hosil bo'lgan yon uchburchaklar yuzalari teng: $$S_{AOB} = S_{COD}$$. Shartdan: $$S_{COD} = 3 \\cdot S_{BOC} = 3 \\cdot 3 = 9$$. Demak, $$S_{AOB} = 9$$."
    },
    {
        "id": "MOCK-07032026-Q28",
        "topic_id": "B3-M18",
        "topic": "Ko‘pburchaklar va muntazam ko‘pburchaklar",
        "difficulty": "orta",
        "question": "Muntazam oltiburchakning tomoni 1 ga teng. Uning tomonlari o'rtalari tutashtirilib yana oltiburchak hosil qilindi. Hosil bo'lgan oltiburchakka yana shunday tomonlari tutashtirildi va bu jarayon cheksiz davom etdi. Barcha hosil bo'lgan oltiburchaklar yuzalari yig'indisini toping.",
        "options": {"A": "$$10$$", "B": "$$15$$", "C": "$$6\\sqrt{3}$$", "D": "$$9\\sqrt{3}$$"},
        "correct_option": "C",
        "hint": "Dastlabki oltiburchak yuzi: $$S_1 = 6 \\cdot \\frac{\\sqrt{3}}{4} \\cdot 1^2 = \\frac{3\\sqrt{3}}{2}$$. Tomonlar o'rtalarini tutashtirganda hosil bo'lgan oltiburchak tomoni kosinuslar teoremasidan $$a_2^2 = \\frac{3}{4}$$, ya'ni yuzalar nisbati $$q = \\frac{3}{4}$$. Cheksiz kamayuvchi geometrik progressiya yig'indisi: $$S = \\frac{S_1}{1 - q} = \\frac{\\frac{3\\sqrt{3}}{2}}{1 - 3/4} = 6\\sqrt{3}$$."
    },
    {
        "id": "MOCK-07032026-Q29",
        "topic_id": "B3-M43",
        "topic": "Vektorlar va ular ustida amallar (tekislikda va fazoda)",
        "difficulty": "oson",
        "question": "$$A(6; 4; -2)$$, $$B(x; y; 0)$$ va $$\\vec{CD}(4; -3; 1)$$ vektor berilgan. $$\\vec{AB}$$ va $$\\vec{CD}$$ vektor kollinear bo'lsa, $$\\vec{AB}$$ ning koordinatalari yig'indisini toping.",
        "options": {"A": "$$4$$", "B": "$$12$$", "C": "$$-12$$", "D": "$$-4$$"},
        "correct_option": "A",
        "hint": "$$\\vec{AB} = (x - 6; y - 4; 0 - (-2)) = (x - 6; y - 4; 2)$$. $$\\vec{AB}$$ va $$\\vec{CD}$$ kollinear bo'lgani uchun: $$\\vec{AB} = k \\cdot \\vec{CD}$$. Uchinchi koordinatadan: $$2 = k \\cdot 1 \\implies k = 2$$. Demak, $$\\vec{AB} = (2 \\cdot 4; 2 \\cdot (-3); 2 \\cdot 1) = (8; -6; 2)$$. Koordinatalar yig'indisi: $$8 + (-6) + 2 = 4$$."
    },
    {
        "id": "MOCK-07032026-Q30",
        "topic_id": "B3-M31",
        "topic": "Fazoda to‘g‘ri chiziq va tekisliklar perpendikulyarligi",
        "difficulty": "orta",
        "question": "Rombning 60 va 80 ga teng diagonallari va unga romb tekisligiga tegishli bo'lmagan $$P$$ nuqtasidan rombning diagonallari kesishgan nuqtasiga uzunligi 45 ga teng perpendikulyar tushirildi. Shu $$P$$ nuqtadan rombning tomonigacha bo'lgan eng yaqin masofani toping.",
        "options": {"A": "$$51$$", "B": "$$24$$", "C": "$$36$$", "D": "$$40$$"},
        "correct_option": "A",
        "hint": "Romb tomoni: $$a = \\sqrt{30^2 + 40^2} = 50$$. Diagonallar kesishgan markazdan romb tomonigacha masofa (ichki radius): $$r = \\frac{30 \\cdot 40}{50} = 24$$. Uch perpendikulyar teoremasiga ko'ra $$P$$ nuqtadan romb tomonigacha masofa: $$d = \\sqrt{PO^2 + r^2} = \\sqrt{45^2 + 24^2} = \\sqrt{2025 + 576} = \\sqrt{2601} = 51$$."
    },
    {
        "id": "MOCK-07032026-Q31",
        "topic_id": "B1-M03",
        "topic": "To‘plamlar va ular ustida amallar",
        "difficulty": "orta",
        "question": "$$A = \\{1, 2, 3, 4, 5, 6\\}$$ to'plam berilgan. To'plamning nechta qism to'plamida 3 yoki 5 dan kamida bittasi qatnashadi?",
        "options": {"A": "$$64$$", "B": "$$48$$", "C": "$$32$$", "D": "$$16$$"},
        "correct_option": "B",
        "hint": "Barcha qism to'plamlar soni: $$2^6 = 64$$. 3 ham, 5 ham qatnashmagan (ya'ni faqat $$\\{1, 2, 4, 6\\}$$ elementlaridan tuzilgan) qism to'plamlar soni: $$2^4 = 16$$. Kamida bittasi qatnashganlari: $$64 - 16 = 48$$."
    },
    {
        "id": "MOCK-07032026-Q32",
        "topic_id": "B1-M31",
        "topic": "Kombinatorika elementlari",
        "difficulty": "orta",
        "question": "$$C_n^4 - C_n^3 = 14$$ bo'lsa, $$C_n^2$$ ni toping.",
        "options": {"A": "$$14$$", "B": "$$21$$", "C": "$$24$$", "D": "$$28$$"},
        "correct_option": "D",
        "hint": "$$C_n^4 - C_n^3 = \\frac{n(n-1)(n-2)(n-7)}{24} = 14 \\implies n(n-1)(n-2)(n-7) = 336$$. $$n = 8$$ da: $$8 \\cdot 7 \\cdot 6 \\cdot 1 = 336$$. Demak, $$n = 8$$. $$C_8^2 = \\frac{8 \\cdot 7}{2} = 28$$."
    },
    {
        "id": "MOCK-07032026-Q33",
        "topic_id": "B3-M36",
        "topic": "Silindr",
        "difficulty": "qiyin",
        "question": "Topshiriq (33-35): Silindr balandligi 8 ga, to'la sirti $$232.5\\pi$$ ga teng bo'lsa:\n33. 10 cm kesma silindrning har xil asosida yotsa, silindr o'qidan shu kesmagacha eng qisqa masofa qanday?",
        "options": {
            "A": "$$\\frac{\\sqrt{161}}{2}$$",
            "B": "$$\\frac{\\sqrt{161}}{4}$$",
            "C": "$$\\frac{17}{2}$$",
            "D": "$$\\frac{3\\sqrt{21}}{2}$$",
            "E": "$$\\frac{3\\sqrt{21}}{4}$$",
            "F": "$$\\frac{19}{2}$$"
        },
        "correct_option": "D",
        "hint": "Silindr to'la sirti: $$2\\pi R(R+8) = 232.5\\pi \\implies 4R^2 + 32R - 465 = 0 \\implies R = 7.5 = \\frac{15}{2}$$. 10 sm kesmaning asos tekisligidagi proyeksiyasi vatar bo'lib, uning uzunligi: $$d = \\sqrt{10^2 - 8^2} = 6$$. O'qdan vatargacha masofa: $$\\sqrt{R^2 - (d/2)^2} = \\sqrt{(15/2)^2 - 3^2} = \\sqrt{\\frac{225-36}{4}} = \\frac{3\\sqrt{21}}{2}$$."
    },
    {
        "id": "MOCK-07032026-Q34",
        "topic_id": "B3-M36",
        "topic": "Silindr",
        "difficulty": "qiyin",
        "question": "Topshiriq (33-35): Silindr balandligi 8 ga, to'la sirti $$232.5\\pi$$ ga teng bo'lsa:\n34. Silindr o'qiga parallel kesim o'tkazilgan. U kvadrat bo'lsa, shu kesimgacha eng qisqa masofani toping.",
        "options": {
            "A": "$$\\frac{\\sqrt{161}}{2}$$",
            "B": "$$\\frac{\\sqrt{161}}{4}$$",
            "C": "$$\\frac{17}{2}$$",
            "D": "$$\\frac{3\\sqrt{21}}{2}$$",
            "E": "$$\\frac{3\\sqrt{21}}{4}$$",
            "F": "$$\\frac{19}{2}$$"
        },
        "correct_option": "A",
        "hint": "Kesim kvadrat bo'lsa, uning asosdagi vatari silindr balandligiga teng, ya'ni $$w = H = 8$$. O'qdan ushbu kesimgacha masofa asos markazidan vatargacha bo'lgan masofadir: $$d = \\sqrt{R^2 - (w/2)^2} = \\sqrt{(15/2)^2 - 4^2} = \\sqrt{\\frac{225-64}{4}} = \\frac{\\sqrt{161}}{2}$$."
    },
    {
        "id": "MOCK-07032026-Q35",
        "topic_id": "B3-M36",
        "topic": "Silindr",
        "difficulty": "qiyin",
        "question": "Topshiriq (33-35): Silindr balandligi 8 ga, to'la sirti $$232.5\\pi$$ ga teng bo'lsa:\n35. Silindrga tashqi chizilgan shar radiusini toping.",
        "options": {
            "A": "$$\\frac{\\sqrt{161}}{2}$$",
            "B": "$$\\frac{\\sqrt{161}}{4}$$",
            "C": "$$\\frac{17}{2}$$",
            "D": "$$\\frac{3\\sqrt{21}}{2}$$",
            "E": "$$\\frac{3\\sqrt{21}}{4}$$",
            "F": "$$\\frac{19}{2}$$"
        },
        "correct_option": "C",
        "hint": "Silindrga tashqi chizilgan shar radiusi: $$R_{shar} = \\sqrt{R^2 + (H/2)^2} = \\sqrt{(15/2)^2 + 4^2} = \\sqrt{\\frac{225 + 64}{4}} = \\sqrt{\\frac{289}{4}} = \\frac{17}{2}$$."
    }
]

def main():
    print(f"Uploading {len(QUESTIONS)} questions of 07.03.2026 Mock Exam...")
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
