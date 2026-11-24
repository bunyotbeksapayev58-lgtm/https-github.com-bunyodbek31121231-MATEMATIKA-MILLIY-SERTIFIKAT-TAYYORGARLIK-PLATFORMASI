'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import { ExamTemplate } from '@/types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileText,
  ShieldCheck,
  Loader2,
  ChevronRight,
  Flame,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export default function MockTestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ExamTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchMockTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('exam_templates')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          // Sort to prioritize 07.03.2026 and 04.12.2022 at the very top
          const sorted = [...data].sort((a: any, b: any) => {
            if (a.id === '07032026-0000-0000-0000-000000000000') return -1;
            if (b.id === '07032026-0000-0000-0000-000000000000') return 1;
            if (a.id === '04122022-0000-0000-0000-000000000000') return -1;
            if (b.id === '04122022-0000-0000-0000-000000000000') return 1;
            return 0;
          });

          setTemplates(sorted as ExamTemplate[]);
          setSelectedTemplate(sorted[0] as ExamTemplate);
        }
      } catch (err) {
        console.error('Error fetching mock templates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMockTemplates();
  }, []);

  const handleStartMock = async (templateToStart?: ExamTemplate) => {
    const activeTemplate = templateToStart || selectedTemplate;

    if (!user) {
      router.push('/login?redirect=/mock');
      return;
    }

    if (!activeTemplate) return;

    setStarting(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.rpc('create_test_session_secure', {
        p_mode: 'exam',
        p_topic_id: null,
        p_subtopic_id: null,
        p_question_count: activeTemplate.total_questions || 35,
        p_difficulty: 'mixed',
        p_time_limit_minutes: activeTemplate.duration_minutes || 150,
        p_exam_template_id: activeTemplate.id,
      });

      if (error) {
        setErrorMsg(error.message);
        setStarting(false);
        return;
      }

      if (data && data.session_id) {
        router.push(`/tests/active/${data.session_id}`);
      } else {
        setErrorMsg('Mock test seansini yaratishda xatolik yuz berdi.');
        setStarting(false);
      }
    } catch {
      setErrorMsg('Kutilmagan xatolik yuz berdi. Qaytadan urinib ko‘ring.');
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">Mock testlar yuklanmoqda...</p>
      </div>
    );
  }

  const mock0703 = templates.find((t) => t.id === '07032026-0000-0000-0000-000000000000');
  const mock0412 = templates.find((t) => t.id === '04122022-0000-0000-0000-000000000000');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-[#6C4AB6] text-xs font-extrabold shadow-sm">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Haqiqiy Milliy Sertifikat Mock Testlari</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight">
          Matematika Milliy Sertifikat Mock Test Bo‘limi
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Davlat test markazining rasmiy imtihon qog‘ozlari va chizmalari asosida tuzilgan to‘liq 2 soat 30 daqiqalik (150 daqiqa) sinov testi.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start space-x-3 text-red-700 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TOP FEATURED HERO CARDS: 07.03.2026 & 04.12.2022 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HERO 1: 07.03.2026 */}
        {mock0703 && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#351F66] via-[#6C4AB6] to-[#8E5FD9] p-6 sm:p-8 text-white shadow-xl shadow-purple-200/50 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>YANGI • 07.03.2026 (1-variant)</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/30 text-xs font-bold flex items-center space-x-1 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>2:30 soat</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black leading-tight">
                {mock0703.title}
              </h2>
              <p className="text-xs text-purple-100 leading-relaxed">
                35 ta rasmiy test va moslashtirish topshiriqlari, tiniq geometrik chizmalar va to‘liq matematik yechimlar.
              </p>

              <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-purple-200">
                <span className="px-2.5 py-1 rounded-md bg-white/10">35 savol</span>
                <span className="px-2.5 py-1 rounded-md bg-white/10">150 daqiqa</span>
                <span className="px-2.5 py-1 rounded-md bg-white/10">Geometriya</span>
              </div>
            </div>

            <button
              onClick={() => handleStartMock(mock0703)}
              disabled={starting}
              className="w-full py-4 rounded-2xl bg-white hover:bg-purple-50 text-[#6C4AB6] font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {starting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Play className="w-5 h-5 fill-[#6C4AB6]" />
                  <span>07.03.2026 Testni Boshlash</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* HERO 2: 04.12.2022 */}
        {mock0412 && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A2F8A] via-[#5C3FA6] to-[#7E57C2] p-6 sm:p-8 text-white shadow-xl shadow-purple-200/50 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>04.12.2022 • TEST 1 (Asosiy)</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/30 text-xs font-bold flex items-center space-x-1 text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>2:30 soat</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black leading-tight">
                {mock0412.title}
              </h2>
              <p className="text-xs text-purple-100 leading-relaxed">
                45 ta original imtihon topshirig‘i, barcha grafiklar, moslashtirish va ochiq masalalar bilan to‘liq variant.
              </p>

              <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-purple-200">
                <span className="px-2.5 py-1 rounded-md bg-white/10">45 savol</span>
                <span className="px-2.5 py-1 rounded-md bg-white/10">150 daqiqa</span>
                <span className="px-2.5 py-1 rounded-md bg-white/10">Rasmiy shkala</span>
              </div>
            </div>

            <button
              onClick={() => handleStartMock(mock0412)}
              disabled={starting}
              className="w-full py-4 rounded-2xl bg-white hover:bg-purple-50 text-[#6C4AB6] font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {starting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Play className="w-5 h-5 fill-[#6C4AB6]" />
                  <span>04.12.2022 Testni Boshlash</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ALL AVAILABLE MOCK TESTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#1A1A2E] flex items-center space-x-2">
            <Layers className="w-6 h-6 text-[#6C4AB6]" />
            <span>Barcha Mavjud Mock Imtihonlar ({templates.length} ta)</span>
          </h2>
          <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
            Tanlab, 2:30 soat davomida ishlang
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => {
            const is0703 = tpl.id === '07032026-0000-0000-0000-000000000000';
            const is0412 = tpl.id === '04122022-0000-0000-0000-000000000000';
            const isSelected = selectedTemplate?.id === tpl.id;

            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  is0703
                    ? 'border-emerald-500/60 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                    : is0412
                    ? 'border-[#6C4AB6] bg-purple-50/70 shadow-md ring-2 ring-[#6C4AB6]/20'
                    : isSelected
                    ? 'border-purple-300 bg-white shadow-sm'
                    : 'border-gray-100 bg-white hover:border-purple-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        is0703
                          ? 'bg-emerald-600 text-white font-black'
                          : is0412
                          ? 'bg-[#6C4AB6] text-white font-black'
                          : 'bg-purple-100 text-[#6C4AB6]'
                      }`}
                    >
                      {is0703
                        ? '✨ Yangi (07.03.2026)'
                        : is0412
                        ? '🔥 Tavsiya etiladi (04.12.2022)'
                        : 'Mock Variant'}
                    </span>
                    <span className="text-xs font-bold text-gray-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{tpl.duration_minutes} daqiqa (2:30 soat)</span>
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 leading-snug">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">
                    {tpl.total_questions} ta savol
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartMock(tpl);
                    }}
                    disabled={starting}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition ${
                      is0703
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        : is0412
                        ? 'bg-[#6C4AB6] hover:bg-[#4A2F8A] text-white shadow-sm'
                        : 'bg-gray-100 hover:bg-[#6C4AB6] hover:text-white text-gray-700'
                    }`}
                  >
                    <span>Ishlash</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INSTRUCTIONS */}
      <div className="card-premium p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <span>Mock Test Imtihon Nizomi va Qoidalari</span>
        </h3>
        <ul className="space-y-2.5 text-xs text-gray-600">
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Vaqt chegarasi:</strong> Test boshlangan vaqtdan boshlab roppa-rosa <strong>2 soat 30 daqiqa (150 daqiqa)</strong> hisoblanadi.
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Savollar tuzilishi:</strong> Test savollari, moslashtirish va ochiq masalalar rasmiy milliy sertifikat formati bo‘yicha taqdim etiladi.
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Chizmalar:</strong> Geometrik va funksiya grafiklari ekranda tiniq sifatda ochiladi.
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              Vaqt tugaganda barcha javoblar avtomatik yuborilib, natijalar tahlili ko‘rsatiladi.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
