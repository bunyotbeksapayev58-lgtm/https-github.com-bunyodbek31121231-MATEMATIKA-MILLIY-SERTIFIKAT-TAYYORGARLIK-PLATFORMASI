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
  Sparkles
} from 'lucide-react';

export default function ExamsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [template, setTemplate] = useState<ExamTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchExamTemplate = async () => {
      try {
        const { data, error } = await supabase
          .from('exam_templates')
          .select('*')
          .eq('is_active', true)
          .limit(1)
          .single();

        if (!error && data) {
          setTemplate(data as ExamTemplate);
        }
      } catch (err) {
        console.error('Error fetching exam template:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExamTemplate();
  }, []);

  const handleStartExam = async () => {
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
        p_question_count: template?.total_questions || 35,
        p_difficulty: 'mixed',
        p_time_limit_minutes: template?.duration_minutes || 150,
        p_exam_template_id: template?.id || null,
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
        <p className="text-sm font-semibold text-gray-500">Imtihon ma’lumotlari yuklanmoqda...</p>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Rasmiy Simulyatsiya</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight">
          Matematika Milliy Sertifikat Imtihoni
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Davlat test markazi standarti asosida to‘liq kompyuterlashtirilgan milliy sertifikat imtihon simulyatori.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start space-x-3 text-red-700 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* EXAM INFO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-premium p-6 text-center space-y-2">
          <Clock className="w-8 h-8 text-[#6C4AB6] mx-auto" />
          <p className="text-2xl font-extrabold text-gray-900">{template?.duration_minutes || 150} daqiqa</p>
          <p className="text-xs text-gray-500">Vaqt chegarasi (2.5 soat)</p>
        </div>

        <div className="card-premium p-6 text-center space-y-2">
          <FileText className="w-8 h-8 text-blue-600 mx-auto" />
          <p className="text-2xl font-extrabold text-gray-900">{template?.total_questions || 35} ta savol</p>
          <p className="text-xs text-gray-500">Barcha mavzulardan</p>
        </div>

        <div className="card-premium p-6 text-center space-y-2">
          <ShieldCheck className="w-8 h-8 text-green-600 mx-auto" />
          <p className="text-2xl font-extrabold text-gray-900">100 ball</p>
          <p className="text-xs text-gray-500">Maksimal umumiy ball</p>
        </div>
      </div>

      {/* OFFICIAL SCORING TIERS */}
      <div className="card-premium p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Milliy Sertifikat Baholash Mezonlari (Darajalar)
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
          Imtihon qoidalari va ko‘rsatmalar
        </h3>
        <ul className="space-y-2.5 text-xs text-gray-600">
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Test davomida istalgan savolga erkin o‘tish va javobni o‘zgartirish mumkin.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Ikkilanayotgan savollaringizni "Qayta ko‘rib chiqish" (Bayroqcha) bilan belgilab qo‘yishingiz mumkin.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Vaqt tugaganda barcha belgilangan javoblar avtomatik serverga yuboriladi va natija hisoblanadi.</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Noto‘g‘ri javoblar uchun jarima balli ayrilmaydi.</span>
          </li>
        </ul>

        {/* START BUTTON */}
        <div className="pt-4">
          <button
            onClick={handleStartExam}
            disabled={starting}
            className="w-full py-4 rounded-2xl bg-[#6C4AB6] hover:bg-[#4A2F8A] text-white font-extrabold text-base shadow-xl shadow-purple-200 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {starting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Imtihon simulyatsiyasini boshlash</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
