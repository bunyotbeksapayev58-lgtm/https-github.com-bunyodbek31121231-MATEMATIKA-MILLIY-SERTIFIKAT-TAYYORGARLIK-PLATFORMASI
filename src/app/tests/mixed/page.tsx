'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import { Topic } from '@/types';
import {
  Shuffle,
  CheckCircle2,
  Play,
  Search,
  Filter,
  AlertCircle,
  Loader2,
  Clock,
  Layers
} from 'lucide-react';

export default function MixedTestSettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [difficulty, setDifficulty] = useState<string>('mixed');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(30);
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

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
          setSelectedTopicIds(data.map((t) => t.id));
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleToggleTopic = (id: string) => {
    if (selectedTopicIds.includes(id)) {
      setSelectedTopicIds(selectedTopicIds.filter((t) => t !== id));
      setSelectAll(false);
    } else {
      const next = [...selectedTopicIds, id];
      setSelectedTopicIds(next);
      if (next.length === topics.length) setSelectAll(true);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedTopicIds([]);
      setSelectAll(false);
    } else {
      setSelectedTopicIds(topics.map((t) => t.id));
      setSelectAll(true);
    }
  };

  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartTest = async () => {
    if (!user) {
      router.push('/login?redirect=/tests/mixed');
      return;
    }

    if (selectedTopicIds.length === 0) {
      setErrorMsg('Kamida bitta mavzuni tanlashingiz kerak.');
      return;
    }

    setStarting(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.rpc('create_test_session_secure', {
        p_mode: 'mixed',
        p_topic_id: null,
        p_subtopic_id: null,
        p_question_count: questionCount,
        p_difficulty: difficulty,
        p_time_limit_minutes: timeLimitMinutes,
        p_selected_topics: selectAll ? null : selectedTopicIds,
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
        <p className="text-sm font-semibold text-gray-500">Aralash test sozlamalari yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
          <Shuffle className="w-3.5 h-3.5" />
          <span>Aralash Test Rejimi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] tracking-tight">
          Aralash test sozlamalari
        </h1>
        <p className="text-sm text-gray-500">
          Bir nechta mavzuni birlashtirib, o‘zingizning maxsus test bankingizni tuzing
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start space-x-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* SETTINGS PANEL (1 col) */}
        <div className="space-y-6">
          <div className="card-premium p-6 space-y-6">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Test parametrlari</h3>

            {/* Question count */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Savollar soni
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[10, 20, 30, 50].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition border ${
                      questionCount === cnt
                        ? 'bg-[#6C4AB6] text-white border-[#6C4AB6]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {cnt} ta
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Qiyinlik
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'mixed', label: 'Aralash' },
                  { id: 'easy', label: 'Oson' },
                  { id: 'medium', label: 'O‘rta' },
                  { id: 'hard', label: 'Qiyin' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      difficulty === d.id
                        ? 'bg-[#6C4AB6] text-white border-[#6C4AB6]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time limit */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Vaqt
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { mins: 20, label: '20 daq' },
                  { mins: 30, label: '30 daq' },
                  { mins: 45, label: '45 daq' },
                  { mins: 60, label: '60 daq' },
                ].map((t) => (
                  <button
                    key={t.mins}
                    type="button"
                    onClick={() => setTimeLimitMinutes(t.mins)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
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
              className="w-full py-3.5 rounded-xl bg-[#6C4AB6] hover:bg-[#4A2F8A] text-white font-bold text-sm shadow-lg shadow-purple-200 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {starting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Testni boshlash</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* TOPICS SELECTION LIST (2 cols) */}
        <div className="md:col-span-2 card-premium p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-bold text-gray-900">Mavzularni tanlash</h3>
              <p className="text-xs text-gray-500">
                Tanlangan: <strong className="text-[#6C4AB6]">{selectedTopicIds.length}</strong> / {topics.length} ta mavzu
              </p>
            </div>
            <button
              onClick={handleToggleSelectAll}
              className="text-xs font-bold text-[#6C4AB6] hover:underline"
            >
              {selectAll ? 'Barchasini bekor qilish' : 'Barchasini tanlash'}
            </button>
          </div>

          {/* Search topics */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ro‘yxatdan mavzuni qidiring..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#6C4AB6]"
            />
          </div>

          {/* Scrollable topics checklist */}
          <div className="max-h-[420px] overflow-y-auto space-y-1.5 pr-2">
            {filteredTopics.map((topic) => {
              const isChecked = selectedTopicIds.includes(topic.id);
              return (
                <div
                  key={topic.id}
                  onClick={() => handleToggleTopic(topic.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition select-none ${
                    isChecked
                      ? 'bg-purple-50/60 border-purple-200 text-purple-950 font-semibold'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-[#6C4AB6] focus:ring-[#6C4AB6]"
                    />
                    <span className="font-bold text-[#6C4AB6]">{topic.code}</span>
                    <span className="line-clamp-1">{topic.title}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 max-w-[120px] truncate hidden sm:inline">
                    {topic.section}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
