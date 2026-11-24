'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import { StudentDashboardStats } from '@/types';
import {
  GraduationCap,
  Award,
  BookOpen,
  Shuffle,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  RotateCcw,
  Sparkles,
  BarChart3,
  Loader2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const loadStats = async () => {
      try {
        const { data, error } = await supabase.rpc('get_student_dashboard_stats');
        if (!error && data) {
          setStats(data as StudentDashboardStats);
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">O‘quvchi kabineti yuklanmoqda...</p>
      </div>
    );
  }

  const dailyGoalPercent = Math.min(
    100,
    Math.round(((stats?.today_answered || 0) / (stats?.daily_goal || 20)) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* WELCOME HEADER */}
      <div className="bg-gradient-to-r from-[#6C4AB6] to-[#4A2F8A] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>Milliy Sertifikat Tayyorgarligi</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Assalomu alaykum, {profile?.full_name || 'Talaba'}!
          </h1>
          <p className="text-purple-100 text-sm sm:text-base max-w-xl">
            Bugungi o‘rganish maqsadingiz: <strong className="text-white">{stats?.daily_goal || 20} ta</strong> savol yechish.
            Maqsadingiz sari intiling!
          </p>
        </div>

        {/* Streak & Daily Goal widgets */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Learning Streak */}
          <div className="flex-1 md:flex-initial bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[120px]">
            <div className="flex justify-center mb-1">
              <Flame className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <p className="text-2xl font-extrabold">{stats?.current_learning_streak || 0}</p>
            <p className="text-xs text-purple-200">Kunlik Streak</p>
          </div>

          {/* Daily Goal */}
          <div className="flex-1 md:flex-initial bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[140px]">
            <div className="flex justify-center mb-1">
              <Target className="w-6 h-6 text-green-300" />
            </div>
            <p className="text-2xl font-extrabold">{stats?.today_answered || 0} / {stats?.daily_goal || 20}</p>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-green-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${dailyGoalPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-purple-200 mt-1">Bugungi maqsad: {dailyGoalPercent}%</p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/topics"
          className="card-premium p-5 flex items-center space-x-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6C4AB6] flex items-center justify-center group-hover:bg-[#6C4AB6] group-hover:text-white transition">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 group-hover:text-[#6C4AB6] transition">Mavzuli test</h4>
            <p className="text-xs text-gray-500">119 ta mavzudan birini tanlab mashq qiling</p>
          </div>
        </Link>

        <Link
          href="/tests/mixed"
          className="card-premium p-5 flex items-center space-x-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
            <Shuffle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition">Aralash test</h4>
            <p className="text-xs text-gray-500">Bir nechta mavzulardan muvozanatli sinov</p>
          </div>
        </Link>

        <Link
          href="/exams"
          className="card-premium p-5 flex items-center space-x-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 group-hover:text-amber-600 transition">Milliy Imtihon</h4>
            <p className="text-xs text-gray-500">35 ta savol, 150 daqiqa rasmiy simulyatsiya</p>
          </div>
        </Link>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-premium p-5 space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Topshirilgan testlar</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#1A1A2E]">{stats?.total_tests_completed || 0}</span>
            <span className="text-xs text-gray-400">ta</span>
          </div>
          <p className="text-xs text-purple-600 font-semibold">Yakunlangan seanslar</p>
        </div>

        <div className="card-premium p-5 space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jami yechilgan savollar</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#1A1A2E]">{stats?.total_questions_answered || 0}</span>
            <span className="text-xs text-gray-400">ta</span>
          </div>
          <p className="text-xs text-blue-600 font-semibold">Barcha urinishlar</p>
        </div>

        <div className="card-premium p-5 space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">To‘g‘ri javoblar</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-green-600">{stats?.correct_answers || 0}</span>
            <span className="text-xs text-gray-400">ta</span>
          </div>
          <p className="text-xs text-green-600 font-semibold">Muvaffaqiyatli</p>
        </div>

        <div className="card-premium p-5 space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Umumiy aniqlik</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#6C4AB6]">{stats?.accuracy_percentage || 0}%</span>
          </div>
          <p className="text-xs text-purple-600 font-semibold">O‘rtacha ko‘rsatkich</p>
        </div>
      </div>

      {/* CHARTS & WEAKEST TOPICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Chart (2 cols) */}
        <div className="lg:col-span-2 card-premium p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Haftalik faollik</h3>
              <p className="text-xs text-gray-500">So‘nggi 7 kunda yechilgan savollar soni</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="h-64 w-full pt-2">
            {stats?.weekly_activity && stats.weekly_activity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weekly_activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="day_name" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    cursor={{ fill: '#F8F6FC' }}
                  />
                  <Bar dataKey="questions_answered" name="Savollar" fill="#6C4AB6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="correct_answers" name="To‘g‘ri" fill="#16A36A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                Hozircha haftalik faollik ma’lumotlari mavjud emas.
              </div>
            )}
          </div>
        </div>

        {/* Weakest Topics (1 col) */}
        <div className="card-premium p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Zaif mavzular</h3>
                <p className="text-xs text-gray-500">Eng ko‘p xato qilingan mavzular</p>
              </div>
              <RotateCcw className="w-5 h-5 text-red-500" />
            </div>

            {stats?.weakest_topics && stats.weakest_topics.length > 0 ? (
              <div className="space-y-3">
                {stats.weakest_topics.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-red-50/50 border border-red-100 flex items-center justify-between">
                    <div className="pr-2">
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">{t.topic_title}</p>
                      <p className="text-[11px] text-red-600">{t.mistakes_count} ta xato</p>
                    </div>
                    <Link
                      href={`/tests/topic?topicId=${t.topic_id}`}
                      className="px-2.5 py-1 rounded-lg bg-white border border-red-200 text-red-700 text-xs font-bold hover:bg-red-50"
                    >
                      Mashq
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                <p className="text-sm font-semibold text-gray-700">Ajoyib!</p>
                <p className="text-xs text-gray-500">Hozircha zaif mavzular aniqlanmagan.</p>
              </div>
            )}
          </div>

          <Link
            href="/mistakes"
            className="w-full py-2.5 rounded-xl bg-[#F8F6FC] text-[#6C4AB6] text-center text-xs font-bold hover:bg-[#6C4AB6] hover:text-white transition"
          >
            Barcha xatolar daftarini ochish
          </Link>
        </div>
      </div>

      {/* RECENT ATTEMPTS TABLE */}
      <div className="card-premium p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">So‘nggi test urinishlari</h3>
            <p className="text-xs text-gray-500">Yaqinda topshirilgan sinovlar va ularning natijalari</p>
          </div>
          <Link href="/statistics" className="text-xs font-bold text-[#6C4AB6] hover:underline">
            To‘liq tarix
          </Link>
        </div>

        {stats?.recent_attempts && stats.recent_attempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3">Nomi</th>
                  <th className="py-3">Rejim</th>
                  <th className="py-3">Savollar</th>
                  <th className="py-3">To‘g‘ri</th>
                  <th className="py-3">Aniqlik</th>
                  <th className="py-3 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recent_attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-semibold text-gray-900">{att.title}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                        att.mode === 'exam' ? 'bg-amber-100 text-amber-800' :
                        att.mode === 'mixed' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {att.mode === 'exam' ? 'Imtihon' : att.mode === 'mixed' ? 'Aralash' : 'Mavzuli'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{att.total_questions} ta</td>
                    <td className="py-3 text-green-600 font-semibold">{att.correct_count} ta</td>
                    <td className="py-3 font-bold text-[#6C4AB6]">{att.accuracy_percent}%</td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/tests/result/${att.id}`}
                        className="text-xs font-bold text-[#6C4AB6] hover:underline"
                      >
                        Natijani ko‘rish
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 text-sm">
            Hali birorta test topshirmadingiz.{' '}
            <Link href="/topics" className="text-[#6C4AB6] font-bold hover:underline">
              Birinchi testni boshlash
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
