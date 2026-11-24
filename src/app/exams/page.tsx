'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import { ExamTemplate } from '@/types';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileText,
  ShieldCheck,
  Loader2,
  Calendar,
  Sparkles,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export default function ExamsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ExamTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('exam_templates')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          setTemplates(data as ExamTemplate[]);
          setSelectedTemplate(data[data.length - 1] as ExamTemplate); // Default to the latest (2026/latest)
        }
      } catch (err) {
        console.error('Error fetching exam templates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExamTemplates();
  }, []);

  const handleStartExam = async (templateToStart?: ExamTemplate) => {
    const activeTemplate = templateToStart || selectedTemplate || (templates.length > 0 ? templates[0] : null);

    if (!user) {
      router.push('/login?redirect=/exams');
      return;
    }

    setStarting(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.rpc('create_test_session_secure', {
        p_mode: 'exam',
        p_topic_id: null,
        p_subtopic_id: null,
        p_question_count: activeTemplate?.total_questions || 35,
        p_difficulty: 'mixed',
        p_time_limit_minutes: activeTemplate?.duration_minutes || 150,
        p_exam_template_id: activeTemplate?.id || null,
      });

      if (error) {
        setErrorMsg(error.message);
        setStarting(false);
        return;
      }

      if (data && data.session_id) {
        router.push(`/tests/active/${data.session_id}`);
      } else {
        setErrorMsg('Imtihon seansini yaratishda xatolik yuz berdi.');
        setStarting(false);
      }
    } catch {
      setErrorMsg('Kutilmagan xatolik yuz berdi. Qaytadan urinib ko‘ring.');
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">2020–2026 Milliy Sertifikat variantlari yuklanmoqda...</p>
      </div>
    );
  }

  const tiers = [
    { grade: 'A+', score: '86 - 100 ball', perk: 'OTM ga 100% maksimal ball (kirish imtihonisiz) + 50% ustama' },
    { grade: 'A', score: '76 - 85 ball', perk: 'OTM ga proporsional yuqori ball + 20% oylik ustama' },
    { grade: 'B+', score: '68 - 75 ball', perk: 'Sertifikat taqdim etiladi' },
    { grade: 'B', score: '60 - 67 ball', perk: 'O‘tish balidan yuqori' },
    { grade: 'C+', score: '52 - 59 ball', perk: 'Qoniqarli daraja' },
    { grade: 'C', score: '46 - 51 ball', perk: 'Minimal sertifikat darajasi' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-[#6C4AB6] text-xs font-extrabold">
          <Sparkles className="w-4 h-4 text-[#6C4AB6]" />
          <span>2020 – 2026 Rasmiy Milliy Sertifikat Mock Bazasi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight">
          Matematika Milliy Sertifikat Imtihon Simulyatsiyasi
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Davlat test markazi (BMBA) standarti bo‘yicha 119 ta mavzu va barcha ishlash usullarini qamrab olgan haqiqiy 35 talik imtihon variantlari.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start space-x-3 text-red-700 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-premium p-6 text-center space-y-2 border-purple-100">
          <Clock className="w-8 h-8 text-[#6C4AB6] mx-auto" />
          <p className="text-2xl font-extrabold text-gray-900">150 daqiqa</p>
          <p className="text-xs text-gray-500">Vaqt chegarasi (2.5 soat)</p>
        </div>

        <div className="card-premium p-6 text-center space-y-2 border-purple-100">
          <FileText className="w-8 h-8 text-blue-600 mx-auto" />
          <p className="text-2xl font-extrabold text-gray-900">35 ta savol</p>
          <p className="text-xs text-gray-500">Barcha 4 ta bo‘limdan muvozanatli</p>
        </div>

        <div className="card-premium p-6 text-center space-y-2 border-purple-100">
          <ShieldCheck className="w-8 h-8 text-green-600 mx-auto" />
          <p className="text-2xl font-extrabold text-gray-900">100 ball</p>
          <p className="text-xs text-gray-500">T-shkala bo‘yicha maksimal ball</p>
        </div>
      </div>

      {/* AVAILABLE MOCK VARIANTS (2020-2026) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#1A1A2E] flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-[#6C4AB6]" />
            <span>2020–2026-yillar Imtihon Variantlari ({templates.length} ta variant)</span>
          </h2>
          <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
            Istalgan variantni tanlab topshiring
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl, idx) => {
            const isSelected = selectedTemplate?.id === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-purple-50/60 border-[#6C4AB6] shadow-md ring-2 ring-[#6C4AB6]/20'
                    : 'bg-white border-gray-100 hover:border-purple-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between space-x-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#6C4AB6]">
                        Variant #{idx + 1}
                      </span>
                      <span className="text-xs font-medium text-gray-400">150 daq • 35 savol</span>
                    </div>
                    <h3 className="font-extrabold text-base text-gray-900">{tpl.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{tpl.description}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100/80 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-400">
                    {isSelected ? 'Tanlangan variant' : 'Boshlash uchun bosing'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartExam(tpl);
                    }}
                    disabled={starting}
                    className="px-4 py-2 rounded-xl bg-[#6C4AB6] hover:bg-[#4A2F8A] text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-sm transition disabled:opacity-50"
                  >
                    <span>Topshirish</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* START SELECTED EXAM HERO CTA */}
      {selectedTemplate && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#6C4AB6] to-[#4A2F8A] text-white space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-purple-200 font-extrabold">
                Tanlangan Imtihon Simulyatsiyasi
              </span>
              <h3 className="text-2xl font-black">{selectedTemplate.title}</h3>
              <p className="text-xs text-purple-100 max-w-xl">
                Savollar takrorlanmaydi. 150 daqiqa vaqt ajratiladi. Har bir to‘g‘ri javob server darajasida xolisona hisoblanadi.
              </p>
            </div>
            <button
              onClick={() => handleStartExam(selectedTemplate)}
              disabled={starting}
              className="px-8 py-4 rounded-2xl bg-white text-[#6C4AB6] hover:bg-purple-50 font-black text-base shadow-lg transition flex items-center justify-center space-x-2 whitespace-nowrap disabled:opacity-50"
            >
              {starting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Play className="w-5 h-5 fill-[#6C4AB6]" />
                  <span>Hoziroq Boshlash</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* OFFICIAL SCORING TIERS */}
      <div className="card-premium p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Milliy Sertifikat Baholash Mezonlari (T-shkala Darajalari)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tiers.map((t, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#F8F6FC] border border-purple-100/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-base text-[#6C4AB6]">{t.grade} daraja</span>
                <span className="text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                  {t.score}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-tight">{t.perk}</p>
            </div>
          ))}
        </div>
      </div>

      {/* EXAM RULES & INSTRUCTIONS */}
      <div className="card-premium p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Imtihon qoidalari va takrorlanmaslik kafolati
        </h3>
        <ul className="space-y-2.5 text-xs text-gray-600">
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Savollar takrorlanmaydi:</strong> Tizim oldingi testlarda ishlangan savollarni eslab qoladi va har bir yangi urinishda yangi savollarni taqdim etadi.
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Test davomida istalgan savolga navigatsiya paneli orqali erkin o‘tish va javobni o‘zgartirish mumkin.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Ikkilanayotgan savollaringizni "Qayta ko‘rib chiqish" (Bayroqcha) bilan belgilab qo‘yishingiz mumkin.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Vaqt (150 daqiqa) tugaganda barcha belgilangan javoblar avtomatik serverga yuboriladi va batafsil tahlil ko‘rsatiladi.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
