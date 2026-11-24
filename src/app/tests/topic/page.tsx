'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import { Topic, QuestionDifficulty } from '@/types';
import {
  BookOpen,
  Settings,
  HelpCircle,
  Clock,
  Play,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

function TopicTestSettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTopicId = searchParams.get('topicId');
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(preselectedTopicId || '');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string>('mixed');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(20);
  const [availableCount, setAvailableCount] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data, error } = await supabase
          .from('topics')
          .select('*')
          .eq('is_active', true)
          .order('order_num', { ascending: true });

        if (!error && data) {
          setTopics(data as Topic[]);
          if (!selectedTopicId && data.length > 0) {
            setSelectedTopicId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    if (preselectedTopicId) {
      setSelectedTopicId(preselectedTopicId);
    }
  }, [preselectedTopicId]);

  // Check available question count in selected topic & difficulty
  useEffect(() => {
    const checkAvailability = async () => {
      if (!selectedTopicId) return;
      try {
        let query = supabase
          .from('questions')
          .select('id', { count: 'exact', head: true })
          .eq('topic_id', selectedTopicId)
          .eq('is_active', true);

        if (difficulty !== 'mixed') {
          query = query.eq('difficulty', difficulty);
        }

        const { count } = await query;
        setAvailableCount(count || 0);
      } catch (err) {
        console.error('Error checking question count:', err);
      }
    };

    checkAvailability();
  }, [selectedTopicId, difficulty]);

  const handleStartTest = async () => {
    if (!user) {
      router.push(`/login?redirect=/tests/topic?topicId=${selectedTopicId}`);
      return;
    }

    if (!selectedTopicId) {
      setErrorMsg('Iltimos, mavzuni tanlang.');
      return;
    }

    setStarting(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.rpc('create_test_session_secure', {
        p_mode: 'topic',
        p_topic_id: selectedTopicId,
        p_subtopic_id: null,
        p_question_count: questionCount,
        p_difficulty: difficulty,
        p_time_limit_minutes: timeLimitMinutes,
      });

      if (error) {
        setErrorMsg(error.message);
        setStarting(false);
        return;
      }

      if (data && data.session_id) {
        router.push(`/tests/active/${data.session_id}`);
      } else {
        setErrorMsg('Test seansini yaratishda xatolik yuz berdi.');
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
        <p className="text-sm font-semibold text-gray-500">Sozlamalar yuklanmoqda...</p>
      </div>
    );
  }

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6C4AB6] text-xs font-bold">
          <Settings className="w-3.5 h-3.5" />
          <span>Mavzuli Test Sozlamalari</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] tracking-tight">
          Test parametrlarini tanlang
        </h1>
        <p className="text-sm text-gray-500">
          O‘zingizga mos savollar soni, qiyinlik darajasi va vaqt chegarasini belgilang
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start space-x-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="card-premium p-6 sm:p-8 space-y-6">
        {/* TOPIC SELECT */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Matematika mavzusi
          </label>
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4AB6] text-sm font-medium"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.code} — {t.title} ({t.section})
              </option>
            ))}
          </select>

          {selectedTopic && (
            <div className="p-3 bg-purple-50/60 rounded-xl text-xs text-purple-900 flex items-center justify-between">
              <span>{selectedTopic.section}</span>
              {availableCount !== null && (
                <span className="font-bold text-[#6C4AB6]">
                  Mavjud savollar: {availableCount} ta
                </span>
              )}
            </div>
          )}
        </div>

        {/* QUESTION COUNT OPTIONS */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Savollar soni
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[10, 20, 30, 50, 100].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setQuestionCount(cnt)}
                className={`py-3 rounded-xl text-sm font-bold transition border ${
                  questionCount === cnt
                    ? 'bg-[#6C4AB6] text-white border-[#6C4AB6] shadow-md shadow-purple-100'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cnt} ta
              </button>
            ))}
          </div>
          {availableCount !== null && availableCount < questionCount && (
            <p className="text-xs text-amber-600 font-semibold flex items-center space-x-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>
                Tanlangan parametr bo‘yicha hozircha {availableCount} ta savol mavjud. Tizim bor savollarni beradi.
              </span>
            </p>
          )}
        </div>

        {/* DIFFICULTY SELECT */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Qiyinlik darajasi
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'mixed', label: 'Aralash (Hammasi)' },
              { id: 'easy', label: 'Oson' },
              { id: 'medium', label: 'O‘rta' },
              { id: 'hard', label: 'Qiyin' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDifficulty(d.id)}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition border ${
                  difficulty === d.id
                    ? 'bg-[#6C4AB6] text-white border-[#6C4AB6] shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* TIME LIMIT */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Vaqt chegarasi
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { mins: 15, label: '15 daqiqa' },
              { mins: 20, label: '20 daqiqa' },
              { mins: 30, label: '30 daqiqa' },
              { mins: 45, label: '45 daqiqa' },
            ].map((t) => (
              <button
                key={t.mins}
                type="button"
                onClick={() => setTimeLimitMinutes(t.mins)}
                className={`py-2.5 rounded-xl text-xs font-bold transition border ${
                  timeLimitMinutes === t.mins
                    ? 'bg-[#6C4AB6] text-white border-[#6C4AB6]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* START BUTTON */}
        <button
          onClick={handleStartTest}
          disabled={starting}
          className="w-full mt-4 py-4 rounded-2xl bg-[#6C4AB6] hover:bg-[#4A2F8A] text-white font-extrabold text-base shadow-xl shadow-purple-200 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {starting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>Testni boshlash</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function TopicTestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6C4AB6]" />
      </div>
    }>
      <TopicTestSettingsContent />
    </Suspense>
  );
}
