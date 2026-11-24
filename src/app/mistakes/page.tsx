'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import MathView from '@/components/ui/math-view';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Filter,
  Check,
  HelpCircle,
  Loader2,
  Trash2
} from 'lucide-react';

export default function MistakesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [mistakes, setMistakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unreviewed' | 'reviewed'>('unreviewed');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/mistakes');
      return;
    }

    const fetchMistakes = async () => {
      try {
        let query = supabase
          .from('mistakes')
          .select(`
            id,
            user_answer,
            is_reviewed,
            review_count,
            created_at,
            questions (
              id,
              custom_id,
              question,
              difficulty,
              correct_answer,
              explanation,
              topic_id,
              topics (
                id,
                title,
                code,
                section
              ),
              question_options (
                key,
                text
              )
            )
          `)
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (filter === 'unreviewed') {
          query = query.eq('is_reviewed', false);
        } else if (filter === 'reviewed') {
          query = query.eq('is_reviewed', true);
        }

        const { data, error } = await query;
        if (!error && data) {
          setMistakes(data);
        }
      } catch (err) {
        console.error('Error fetching mistakes:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMistakes();
    }
  }, [user, authLoading, filter, router]);

  const handleToggleReviewed = async (id: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('mistakes')
        .update({ is_reviewed: !currentStatus })
        .eq('id', id);

      setMistakes((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_reviewed: !currentStatus } : m))
      );
    } catch (err) {
      console.error('Error updating mistake:', err);
    }
  };

  const handleDeleteMistake = async (id: string) => {
    try {
      await supabase.from('mistakes').delete().eq('id', id);
      setMistakes((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Error deleting mistake:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">Xatolar daftari yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2">
            <XCircle className="w-3.5 h-3.5" />
            <span>Xatolar Ustida Ishlash</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] tracking-tight">
            Xatolar daftari ({mistakes.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Avvalgi testlarda yo‘l qo‘yilgan xatolarni qayta tahlil qiling va bilimlaringizdagi bo‘shliqlarni to‘ldiring
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl border border-gray-200">
          <button
            onClick={() => setFilter('unreviewed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'unreviewed'
                ? 'bg-[#6C4AB6] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Ko‘rib chiqilmagan
          </button>
          <button
            onClick={() => setFilter('reviewed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'reviewed'
                ? 'bg-[#6C4AB6] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            O‘zlashtirilgan
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'all'
                ? 'bg-[#6C4AB6] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Barchasi
          </button>
        </div>
      </div>

      {/* MISTAKES LIST */}
      {mistakes.length > 0 ? (
        <div className="space-y-5">
          {mistakes.map((m, idx) => {
            const q = m.questions;
            return (
              <div
                key={m.id}
                className={`card-premium p-6 sm:p-8 space-y-4 border-2 ${
                  m.is_reviewed ? 'border-green-200 bg-white/70' : 'border-red-100 bg-white'
                }`}
              >
                {/* Meta bar */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-lg bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {q.topics?.code || 'Mavzu'}: {q.topics?.title}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleReviewed(m.id, m.is_reviewed)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        m.is_reviewed
                          ? 'bg-green-50 border-green-300 text-green-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{m.is_reviewed ? 'O‘zlashtirildi' : 'O‘zlashtirildi deb belgilash'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMistake(m.id)}
                      className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question */}
                <div className="text-base text-gray-900 font-medium">
                  <MathView content={q.question} />
                </div>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 text-xs">
                    <span className="text-red-700 font-bold block mb-1">Sizning noto‘g‘ri javobingiz:</span>
                    <span className="font-extrabold text-red-900">{m.user_answer || 'Javobsiz'}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-green-50/70 border border-green-200 text-xs">
                    <span className="text-green-700 font-bold block mb-1">To‘g‘ri javob:</span>
                    <span className="font-extrabold text-green-900">{q.correct_answer}</span>
                  </div>
                </div>

                {/* Options list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {(q.question_options || [])
                    .sort((a: any, b: any) => a.key.localeCompare(b.key))
                    .map((opt: any) => {
                      const isCorrect = opt.key === q.correct_answer;
                      const isUser = opt.key === m.user_answer;

                      return (
                        <div
                          key={opt.key}
                          className={`p-2.5 rounded-xl border flex items-center space-x-2 text-xs ${
                            isCorrect
                              ? 'bg-green-50 border-green-300 font-bold text-green-950'
                              : isUser
                              ? 'bg-red-50 border-red-300 text-red-950'
                              : 'bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                        >
                          <span className="w-5 h-5 rounded bg-white flex items-center justify-center font-bold text-[10px]">
                            {opt.key}
                          </span>
                          <div className="flex-1">
                            <MathView content={opt.text} />
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 space-y-1">
                    <span className="font-bold text-[#6C4AB6] uppercase tracking-wider block">
                      Yechim va tushuntirish:
                    </span>
                    <MathView content={q.explanation} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
          <h4 className="text-base font-bold text-gray-800">
            {filter === 'unreviewed'
              ? 'Ko‘rib chiqilmagan xatolar yo‘q!'
              : 'Xatolar ro‘yxati bo‘sh'}
          </h4>
          <p className="text-xs text-gray-500">
            Testlarni topshirishda davom eting. Xato qilgan savollaringiz avtomatik shu yerda jamlanadi.
          </p>
          <Link
            href="/topics"
            className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-[#6C4AB6] text-white text-xs font-bold shadow-md"
          >
            Mavzuli testlarni boshlash
          </Link>
        </div>
      )}
    </div>
  );
}
