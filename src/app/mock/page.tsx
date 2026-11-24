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
  Sparkles,
  ChevronRight,
  Flame,
  Calendar,
  Layers
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
          setTemplates(data as ExamTemplate[]);
          // Default to Milliy 04.12.2022 if present, otherwise first
          const targetMock = data.find((t: any) => t.id === '04122022-0000-0000-0000-000000000000') || data[0];
          setSelectedTemplate(targetMock as ExamTemplate);
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
        p_question_count: activeTemplate.total_questions || 45,
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

  const primaryMock = templates.find((t) => t.id === '04122022-0000-0000-0000-000000000000') || selectedTemplate;

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

      {/* FEATURED: MILLIY 04.12.2022 HERO CARD */}
      {primaryMock && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A2F8A] via-[#6C4AB6] to-[#9B7FE0] p-6 sm:p-10 text-white shadow-2xl shadow-purple-200">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white text-xs font-extrabold">
                <Calendar className="w-4 h-4" />
                <span>04.12.2022 • TEST 1 (Asosiy Variant)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                {primaryMock.title}
              </h2>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                45 ta original imtihon savoli, to‘liq geometrik chizmalar, grafiklar, moslashtirish va ochiq topshiriqlar. 2:30 soat (150 daqiqa) vaqt hisobi bilan.
              </p>

              {/* STAT BADGES */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/20 text-xs font-bold">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>2:30 soat (150 daq)</span>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/20 text-xs font-bold">
                  <FileText className="w-4 h-4 text-blue-300" />
                  <span>45 ta topshiriq</span>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/20 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-green-300" />
                  <span>Rasmiy T-shkala baholash</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="flex-shrink-0">
              <button
                onClick={() => handleStartMock(primaryMock)}
                disabled={starting}
                className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-white hover:bg-purple-50 text-[#6C4AB6] font-black text-base shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {starting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-[#6C4AB6]" />
                    <span>04.12.2022 Mock Testni Boshlash</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
            const is0412 = tpl.id === '04122022-0000-0000-0000-000000000000';
            const isSelected = selectedTemplate?.id === tpl.id;

            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  is0412
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
                        is0412
                          ? 'bg-[#6C4AB6] text-white font-black'
                          : 'bg-purple-100 text-[#6C4AB6]'
                      }`}
                    >
                      {is0412 ? '🔥 Tavsiya etiladi (04.12.2022)' : 'Mock Variant'}
                    </span>
                    <span className="text-xs font-bold text-gray-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{tpl.duration_minutes} daqiqa</span>
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
                      is0412
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
              <strong>Savollar tuzilishi:</strong> 1–32 gacha test savollari, 33–35 moslashtirish, 36–45 ochiq va tahliliy masalalar.
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
