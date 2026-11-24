'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import MathView from '@/components/ui/math-view';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  Loader2,
  Bookmark,
  Volume2
} from 'lucide-react';

interface ActiveQuestionOption {
  key: string;
  text: string;
}

interface ActiveQuestion {
  id: string;
  order: number;
  custom_id: string;
  question: string;
  difficulty: string;
  type: string;
  image_url: string | null;
  options: ActiveQuestionOption[];
}

export default function ActiveTestPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [questions, setQuestions] = useState<ActiveQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User answers map: question_id -> selected_key
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  // Review flags map: question_id -> boolean
  const [reviewFlags, setReviewFlags] = useState<Record<string, boolean>>({});
  // Bookmarks map: question_id -> boolean
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch session and questions
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/tests/active/${sessionId}`);
      return;
    }

    const loadSession = async () => {
      try {
        const { data: session, error: sessErr } = await supabase
          .from('test_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (sessErr || !session) {
          setErrorMsg('Test seansi topilmadi yoki sizga tegishli emas.');
          setLoading(false);
          return;
        }

        if (session.status === 'completed') {
          router.push(`/tests/result/${sessionId}`);
          return;
        }

        setSessionData(session);

        // Calculate time left from started_at
        const started = new Date(session.started_at).getTime();
        const now = new Date().getTime();
        const elapsedSec = Math.floor((now - started) / 1000);
        const remaining = Math.max(0, session.time_limit_seconds - elapsedSec);
        setTimeLeft(remaining);

        // Fetch questions from test_answers with questions join
        const { data: answers, error: ansErr } = await supabase
          .from('test_answers')
          .select(`
            question_id,
            question_order,
            user_answer,
            is_marked_for_review,
            questions (
              id,
              custom_id,
              question,
              difficulty,
              type,
              image_url,
              question_options (
                key,
                text
              )
            )
          `)
          .eq('session_id', sessionId)
          .order('question_order', { ascending: true });

        if (!ansErr && answers) {
          const initialAnswers: Record<string, string> = {};
          const initialFlags: Record<string, boolean> = {};

          const loadedQuestions: ActiveQuestion[] = answers.map((a: any) => {
            const q = a.questions;
            if (a.user_answer) initialAnswers[q.id] = a.user_answer;
            if (a.is_marked_for_review) initialFlags[q.id] = true;

            const opts = (q.question_options || []).sort((x: any, y: any) =>
              x.key.localeCompare(y.key)
            );

            return {
              id: q.id,
              order: a.question_order,
              custom_id: q.custom_id,
              question: q.question,
              difficulty: q.difficulty,
              type: q.type,
              image_url: q.image_url,
              options: opts,
            };
          });

          setQuestions(loadedQuestions);
          setUserAnswers(initialAnswers);
          setReviewFlags(initialFlags);
        }
      } catch (err) {
        console.error('Error loading active test:', err);
        setErrorMsg('Test ma’lumotlarini yuklashda xatolik yuz berdi.');
      } finally {
        setLoading(false);
      }
    };

    if (user && sessionId) {
      loadSession();
    }
  }, [user, authLoading, sessionId, router]);

  // Countdown timer
  useEffect(() => {
    if (loading || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, timeLeft]);

  // Select Option
  const handleSelectOption = async (optionKey: string) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const newAnswers = { ...userAnswers, [currentQ.id]: optionKey };
    setUserAnswers(newAnswers);

    // Persist answer in background
    try {
      await supabase
        .from('test_answers')
        .update({ user_answer: optionKey, updated_at: new Date().toISOString() })
        .eq('session_id', sessionId)
        .eq('question_id', currentQ.id);
    } catch (err) {
      console.error('Error saving answer:', err);
    }
  };

  // Toggle Mark for Review
  const handleToggleReview = async () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const currentFlag = !!reviewFlags[currentQ.id];
    const newFlags = { ...reviewFlags, [currentQ.id]: !currentFlag };
    setReviewFlags(newFlags);

    try {
      await supabase
        .from('test_answers')
        .update({ is_marked_for_review: !currentFlag })
        .eq('session_id', sessionId)
        .eq('question_id', currentQ.id);
    } catch (err) {
      console.error('Error saving review flag:', err);
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    const currentQ = questions[currentIndex];
    if (!currentQ || !user) return;

    const isBookmarked = !!bookmarkedIds[currentQ.id];
    setBookmarkedIds({ ...bookmarkedIds, [currentQ.id]: !isBookmarked });

    try {
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('question_id', currentQ.id);
      } else {
        await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, question_id: currentQ.id });
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  // Submit test
  const handleSubmitTest = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setConfirmModalOpen(false);

    try {
      const answersPayload = questions.map((q) => ({
        question_id: q.id,
        user_answer: userAnswers[q.id] || null,
        time_spent: 10,
      }));

      const timeSpentSec = (sessionData?.time_limit_seconds || 1200) - timeLeft;

      const { data, error } = await supabase.rpc('submit_test_session_secure', {
        p_session_id: sessionId,
        p_time_spent_seconds: Math.max(0, timeSpentSec),
        p_answers: answersPayload,
      });

      if (error) {
        console.error('Error submitting test:', error);
        setErrorMsg('Natijalarni saqlashda xatolik yuz berdi: ' + error.message);
        setSubmitting(false);
        return;
      }

      router.push(`/tests/result/${sessionId}`);
    } catch (err) {
      console.error('Unexpected error on submit:', err);
      setErrorMsg('Kutilmagan xatolik yuz berdi.');
      setSubmitting(false);
    }
  }, [submitting, questions, userAnswers, sessionData, timeLeft, sessionId, supabase, router]);

  // Format time display
  const formattedTime = useMemo(() => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    const pad = (n: number) => (n < 10 ? `0${n}` : n);

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  }, [timeLeft]);

  const isLowTime = timeLeft < 300 && timeLeft > 0; // Less than 5 mins

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">Imtihon savollari yuklanmoqda...</p>
      </div>
    );
  }

  if (errorMsg && questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-red-200 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-gray-900">Xatolik</h3>
        <p className="text-xs text-gray-600">{errorMsg}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-2.5 rounded-xl bg-[#6C4AB6] text-white text-xs font-bold"
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).filter((k) => !!userAnswers[k]).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* TOP BAR: Title, Timer, Finish Button */}
      <div className="bg-white rounded-2xl p-4 sm:px-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-20 z-30">
        <div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
            {sessionData?.mode === 'exam' ? 'Milliy Imtihon' : sessionData?.mode === 'mixed' ? 'Aralash test' : 'Mavzuli test'}
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900 mt-1 line-clamp-1">
            {sessionData?.title || 'Faol Test'}
          </h2>
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          {/* COUNTDOWN TIMER */}
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-mono text-base sm:text-lg font-extrabold transition-colors ${
              isLowTime
                ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                : 'bg-[#F8F6FC] border-purple-200 text-[#4A2F8A]'
            }`}
          >
            <Clock className="w-5 h-5 text-current" />
            <span>{formattedTime}</span>
          </div>

          {/* FINISH BUTTON */}
          <button
            onClick={() => setConfirmModalOpen(true)}
            disabled={submitting}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#6C4AB6] hover:bg-[#4A2F8A] text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Testni yakunlash</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MAIN TEST AREA: Question card (left) + Navigation Grid (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* QUESTION PANEL (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="card-premium p-6 sm:p-8 space-y-6">
            {/* Question meta bar */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-extrabold text-[#6C4AB6]">
                  {currentIndex + 1}-savol
                </span>
                <span className="text-xs text-gray-400">/ {questions.length} ta savol</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  currentQuestion?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQuestion?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQuestion?.difficulty === 'easy' ? 'Oson' : currentQuestion?.difficulty === 'medium' ? 'O‘rta' : 'Qiyin'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Bookmark button */}
                <button
                  onClick={handleToggleBookmark}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition ${
                    bookmarkedIds[currentQuestion?.id]
                      ? 'bg-purple-50 border-purple-200 text-[#6C4AB6]'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                  title="Savolni saqlash"
                >
                  <Bookmark className={`w-4 h-4 ${bookmarkedIds[currentQuestion?.id] ? 'fill-[#6C4AB6]' : ''}`} />
                </button>

                {/* Mark for review toggle */}
                <button
                  onClick={handleToggleReview}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition ${
                    reviewFlags[currentQuestion?.id]
                      ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${reviewFlags[currentQuestion?.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>Qayta ko‘rish</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg text-gray-900 leading-relaxed font-medium min-h-[80px]">
              {currentQuestion && <MathView content={currentQuestion.question} />}
            </div>

            {/* Image (if any) */}
            {currentQuestion?.image_url && (
              <div className="rounded-xl overflow-hidden border border-gray-200 max-h-72 flex justify-center bg-gray-50 p-2">
                <img
                  src={currentQuestion.image_url}
                  alt="Savol chizmasi"
                  className="max-h-64 object-contain"
                />
              </div>
            )}

            {/* ANSWER OPTIONS */}
            <div className="space-y-3 pt-2">
              {currentQuestion?.options.map((opt) => {
                const isSelected = userAnswers[currentQuestion.id] === opt.key;
                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`flex items-start space-x-3.5 p-4 rounded-2xl border-2 cursor-pointer transition select-none ${
                      isSelected
                        ? 'border-[#6C4AB6] bg-purple-50/70 text-[#1A1A2E] shadow-sm'
                        : 'border-gray-200 bg-white hover:bg-gray-50/70 text-gray-800'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition ${
                        isSelected
                          ? 'bg-[#6C4AB6] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {opt.key}
                    </div>
                    <div className="flex-1 text-sm sm:text-base pt-0.5 font-medium leading-relaxed">
                      <MathView content={opt.text} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center space-x-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 transition disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Oldingisi</span>
              </button>

              <span className="text-xs text-gray-400 font-semibold">
                {currentIndex + 1} / {questions.length}
              </span>

              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIndex === questions.length - 1}
                className="flex items-center space-x-1 px-4 py-2.5 rounded-xl bg-[#6C4AB6] text-white text-xs font-bold hover:bg-[#4A2F8A] transition disabled:opacity-30 disabled:pointer-events-none"
              >
                <span>Keyingisi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* NAVIGATION GRID SIDEBAR (1 col) */}
        <div className="card-premium p-6 space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-sm">Savollar xaritasi</h3>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6C4AB6]"></span>
                <span>Belgilangan: <strong>{answeredCount}</strong></span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span>
                <span>Qolgan: <strong>{unansweredCount}</strong></span>
              </span>
            </div>
          </div>

          {/* Grid buttons */}
          <div className="grid grid-cols-5 gap-2 max-h-[350px] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isAnswered = !!userAnswers[q.id];
              const isFlagged = !!reviewFlags[q.id];
              const isCurrent = idx === currentIndex;

              let btnBg = 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100';
              if (isAnswered) {
                btnBg = 'bg-[#6C4AB6] text-white border-[#6C4AB6]';
              }
              if (isFlagged) {
                btnBg = isAnswered
                  ? 'bg-[#6C4AB6] text-white border-amber-400 ring-2 ring-amber-400'
                  : 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-300';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-10 rounded-xl text-xs font-extrabold border transition relative flex items-center justify-center ${btnBg} ${
                    isCurrent ? 'ring-2 ring-offset-2 ring-[#6C4AB6]' : ''
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-[11px] text-gray-500 border-t border-gray-100 pt-3">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-md bg-[#6C4AB6]" />
              <span>Javob berilgan</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-md bg-white border border-gray-300" />
              <span>Javob berilmagan</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-400" />
              <span>Qayta ko‘rish belgisi</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRMATION SUBMIT MODAL */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6C4AB6] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Testni yakunlaysizmi?
              </h3>
              <p className="text-xs text-gray-500">
                Yakunlaganingizdan so‘ng javoblarni qayta o‘zgartirib bo‘lmaydi.
              </p>
            </div>

            <div className="bg-[#F8F6FC] rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-600">Jami savollar:</span>
                <span className="text-gray-900">{questions.length} ta</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-green-600">Javob berilgan:</span>
                <span className="text-green-700 font-bold">{answeredCount} ta</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-amber-600">Javobsiz qolgan:</span>
                <span className="text-amber-700 font-bold">{unansweredCount} ta</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-purple-600">Qolgan vaqt:</span>
                <span className="text-purple-700 font-bold font-mono">{formattedTime}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="w-1/2 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Davom etish
              </button>
              <button
                type="button"
                onClick={handleSubmitTest}
                disabled={submitting}
                className="w-1/2 py-3 rounded-xl bg-[#6C4AB6] hover:bg-[#4A2F8A] text-white text-xs font-bold shadow-md shadow-purple-200 transition"
              >
                {submitting ? 'Yuborilmoqda...' : 'Tasdiqlash va topshirish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
