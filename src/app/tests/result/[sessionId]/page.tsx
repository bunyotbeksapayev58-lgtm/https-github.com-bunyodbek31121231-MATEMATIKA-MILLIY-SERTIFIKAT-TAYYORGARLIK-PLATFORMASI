'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/auth-context';
import MathView from '@/components/ui/math-view';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Loader2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function TestResultPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const [session, setSession] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data: sess, error: sessErr } = await supabase
          .from('test_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (sessErr || !sess) {
          console.error('Session error:', sessErr);
          setLoading(false);
          return;
        }

        setSession(sess);

        // Confetti if passed / score >= 70
        if (sess.accuracy_percent >= 70) {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {}
        }

        // Fetch answers with question details, correct_answer & explanation
        const { data: ans, error: ansErr } = await supabase
          .from('test_answers')
          .select(`
            id,
            question_order,
            user_answer,
            is_correct,
            time_spent_seconds,
            questions (
              id,
              custom_id,
              question,
              difficulty,
              type,
              correct_answer,
              explanation,
              image_url,
              question_options (
                key,
                text
              )
            )
          `)
          .eq('session_id', sessionId)
          .order('question_order', { ascending: true });

        if (!ansErr && ans) {
          setAnswers(ans);
        }
      } catch (err) {
        console.error('Error fetching test results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchResults();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">Natijalar hisoblanmoqda...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-gray-100 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-gray-900">Natija topilmadi</h3>
        <p className="text-xs text-gray-500">Test seansi mavjud emas yoki yakunlanmagan.</p>
        <Link
          href="/dashboard"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#6C4AB6] text-white text-xs font-bold"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  const formatSec = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins} daqiqa ${s} soniya`;
  };

  const getTier = (score: number) => {
    if (score >= 86) return { grade: 'A+', label: 'A+ Daraja (Maksimal)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (score >= 76) return { grade: 'A', label: 'A Daraja (Yuqori)', color: 'text-green-600 bg-green-50 border-green-200' };
    if (score >= 68) return { grade: 'B+', label: 'B+ Daraja (Yaxshi)', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (score >= 60) return { grade: 'B', label: 'B Daraja (O‘tdi)', color: 'text-purple-600 bg-purple-50 border-purple-200' };
    if (score >= 46) return { grade: 'C', label: 'C Daraja (Qoniqarli)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { grade: 'Yetarsiz', label: 'Sertifikat chegarasiga yetmadi', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  const tier = getTier(session.accuracy_percent);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* RESULT HERO CARD */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl text-center space-y-6">
        <div className="space-y-3">
          <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${tier.color}`}>
            <Award className="w-4 h-4" />
            <span>{tier.label}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1A1A2E] tracking-tight">
            {session.accuracy_percent}%
          </h1>
          <p className="text-gray-500 text-sm sm:text-base font-medium">
            {session.title} — Test natijalari
          </p>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            <span className="text-xs font-bold text-gray-500">Jami savollar</span>
            <p className="text-2xl font-extrabold text-[#1A1A2E] mt-1">{session.total_questions}</p>
          </div>

          <div className="p-4 rounded-2xl bg-green-50/70 border border-green-100">
            <span className="text-xs font-bold text-green-700">To‘g‘ri</span>
            <p className="text-2xl font-extrabold text-green-700 mt-1">{session.correct_count}</p>
          </div>

          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100">
            <span className="text-xs font-bold text-red-700">Noto‘g‘ri</span>
            <p className="text-2xl font-extrabold text-red-700 mt-1">{session.incorrect_count}</p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
            <span className="text-xs font-bold text-gray-500">Javobsiz</span>
            <p className="text-2xl font-extrabold text-gray-600 mt-1">{session.unanswered_count}</p>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Sarflangan vaqt: {formatSec(session.time_spent_seconds)}</span>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => {
              if (session.mode === 'topic' && session.topic_id) {
                router.push(`/tests/topic?topicId=${session.topic_id}`);
              } else if (session.mode === 'mixed') {
                router.push('/tests/mixed');
              } else {
                router.push('/exams');
              }
            }}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#6C4AB6] text-white font-bold text-xs sm:text-sm hover:bg-[#4A2F8A] shadow-md transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Qaytadan topshirish</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs sm:text-sm hover:bg-gray-50 shadow-sm transition"
          >
            <Home className="w-4 h-4" />
            <span>Dashboardga qaytish</span>
          </Link>
        </div>
      </div>

      {/* DETAILED QUESTION REVIEW SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Barcha savollar tahlili va yechimlari
            </h2>
            <p className="text-xs text-gray-500">
              Har bir savolning to‘g‘ri javobi va batafsil tushuntirishini ko‘ring
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {answers.map((ans, idx) => {
            const q = ans.questions;
            const isCorrect = ans.is_correct === true;
            const isUnanswered = !ans.user_answer;
            const isExpanded = expandedId === ans.id;

            return (
              <div
                key={ans.id}
                className={`card-premium p-6 transition border-2 ${
                  isCorrect
                    ? 'border-green-200 bg-white'
                    : isUnanswered
                    ? 'border-gray-200 bg-gray-50/30'
                    : 'border-red-200 bg-white'
                }`}
              >
                {/* Header */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : ans.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold ${
                        isCorrect
                          ? 'bg-green-100 text-green-700'
                          : isUnanswered
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div>
                      <span className="text-xs font-bold text-gray-900">
                        {isCorrect
                          ? 'To‘g‘ri javob berildi'
                          : isUnanswered
                          ? 'Javob berilmadi'
                          : `Noto‘g‘ri (Sizning javobingiz: ${ans.user_answer})`}
                      </span>
                      <span className="text-[11px] text-gray-400 ml-2">
                        To‘g‘ri javob: <strong>{q.correct_answer}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Body (Expanded or Preview) */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                  {/* Question */}
                  <div className="text-sm sm:text-base font-medium text-gray-900">
                    <MathView content={q.question} />
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {(q.question_options || [])
                      .sort((a: any, b: any) => a.key.localeCompare(b.key))
                      .map((opt: any) => {
                        const isCorrectOpt = opt.key === q.correct_answer;
                        const isUserOpt = opt.key === ans.user_answer;

                        let optClass = 'bg-gray-50 border-gray-200 text-gray-700';
                        if (isCorrectOpt) {
                          optClass = 'bg-green-50 border-green-300 text-green-950 font-bold';
                        } else if (isUserOpt && !isCorrect) {
                          optClass = 'bg-red-50 border-red-300 text-red-950 font-medium';
                        }

                        return (
                          <div
                            key={opt.key}
                            className={`p-3 rounded-xl border flex items-center space-x-2 text-xs ${optClass}`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-white/80 flex items-center justify-center font-bold text-[11px]">
                              {opt.key}
                            </span>
                            <div className="flex-1">
                              <MathView content={opt.text} />
                            </div>
                            {isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
                            {isUserOpt && !isCorrect && <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                          </div>
                        );
                      })}
                  </div>

                  {/* Explanation (Hint) */}
                  {q.explanation && (
                    <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 space-y-1">
                      <span className="font-bold uppercase tracking-wider text-[#6C4AB6] block">
                        Tushuntirish / Yechim ishorasi:
                      </span>
                      <MathView content={q.explanation} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
