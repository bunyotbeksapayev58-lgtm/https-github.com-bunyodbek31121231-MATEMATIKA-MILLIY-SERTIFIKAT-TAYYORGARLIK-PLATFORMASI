'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import {
  BarChart2,
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Layers,
  Flame,
  Loader2,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function StatisticsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [testHistory, setTestHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/statistics');
      return;
    }

    const loadData = async () => {
      try {
        const { data: dashStats } = await supabase.rpc('get_student_dashboard_stats');
        setStats(dashStats);

        const { data: history } = await supabase
          .from('test_sessions')
          .select('*')
          .eq('user_id', user!.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        setTestHistory(history || []);
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">Statistika hisoblanmoqda...</p>
      </div>
    );
  }

  const accuracyData = [
    { name: 'To‘g‘ri', value: stats?.correct_answers || 0, color: '#16A36A' },
    { name: 'Noto‘g‘ri', value: Math.max(0, (stats?.total_questions_answered || 0) - (stats?.correct_answers || 0)), color: '#E5484D' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6C4AB6] text-xs font-bold">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>O‘quvchi Ko‘rsatkichlari</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#1A1A2E] tracking-tight">
          Shaxsiy Tayyorgarlik Statistikasi
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Imtihonlarga tayyorlanish dinamikangiz, o‘zlashtirish foizlari va zaif nuqtalar tahlili
        </p>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-premium p-5 space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase">Jami testlar</span>
          <p className="text-3xl font-extrabold text-gray-900">{stats?.total_tests_completed || 0}</p>
          <p className="text-xs text-purple-600 font-semibold">Bajarilgan seanslar</p>
        </div>

        <div className="card-premium p-5 space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase">Yechilgan savollar</span>
          <p className="text-3xl font-extrabold text-gray-900">{stats?.total_questions_answered || 0}</p>
          <p className="text-xs text-blue-600 font-semibold">Jami urinishlar</p>
        </div>

        <div className="card-premium p-5 space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase">Umumiy aniqlik</span>
          <p className="text-3xl font-extrabold text-[#6C4AB6]">{stats?.accuracy_percentage || 0}%</p>
          <p className="text-xs text-green-600 font-semibold">O‘rtacha ko‘rsatkich</p>
        </div>

        <div className="card-premium p-5 space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase">O‘rganish streaki</span>
          <div className="flex items-center space-x-2">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
            <p className="text-3xl font-extrabold text-amber-600">{stats?.current_learning_streak || 0}</p>
            <span className="text-xs text-gray-400">kun</span>
          </div>
          <p className="text-xs text-amber-600 font-semibold">Uzluksiz faollik</p>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity (2 cols) */}
        <div className="lg:col-span-2 card-premium p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Haftalik o‘rganish dinamikasi</h3>
              <p className="text-xs text-gray-500">So‘nggi 7 kunda kunlik yechilgan savollar</p>
            </div>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.weekly_activity || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="day_name" tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}
                  cursor={{ fill: '#F8F6FC' }}
                />
                <Bar dataKey="questions_answered" name="Jami savollar" fill="#6C4AB6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="correct_answers" name="To‘g‘ri javoblar" fill="#16A36A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Pie (1 col) */}
        <div className="card-premium p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2 border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-base">Javoblar nisbati</h3>
            <p className="text-xs text-gray-500">To‘g‘ri va noto‘g‘ri javoblar taqsimoti</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            {stats?.total_questions_answered > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accuracyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-gray-400">Ma’lumot mavjud emas</div>
            )}
          </div>

          <div className="flex justify-around text-xs font-semibold pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-[#16A36A]" />
              <span>To‘g‘ri ({stats?.correct_answers || 0})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-[#E5484D]" />
              <span>Noto‘g‘ri ({(stats?.total_questions_answered || 0) - (stats?.correct_answers || 0)})</span>
            </div>
          </div>
        </div>
      </div>

      {/* FULL TEST ATTEMPTS HISTORY */}
      <div className="card-premium p-6 space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h3 className="font-bold text-gray-900 text-base">To‘liq test urinishlari tarixi ({testHistory.length})</h3>
          <p className="text-xs text-gray-500">Barcha topshirilgan testlar bo‘yicha batafsil ma’lumot</p>
        </div>

        {testHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3">Sana</th>
                  <th className="py-3">Nomi</th>
                  <th className="py-3">Rejim</th>
                  <th className="py-3">Savollar</th>
                  <th className="py-3">To‘g‘ri</th>
                  <th className="py-3">Vaqt</th>
                  <th className="py-3">Aniqlik</th>
                  <th className="py-3 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testHistory.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50">
                    <td className="py-3 text-xs text-gray-500">
                      {new Date(t.created_at).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className="py-3 font-semibold text-gray-900">{t.title}</td>
                    <td className="py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                        {t.mode}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{t.total_questions} ta</td>
                    <td className="py-3 text-green-600 font-semibold">{t.correct_count} ta</td>
                    <td className="py-3 text-gray-500 text-xs">{Math.floor(t.time_spent_seconds / 60)} daq</td>
                    <td className="py-3 font-extrabold text-[#6C4AB6]">{t.accuracy_percent}%</td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/tests/result/${t.id}`}
                        className="text-xs font-bold text-[#6C4AB6] hover:underline"
                      >
                        Tahlil
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-gray-400">
            Hali birorta yakunlangan test mavjud emas.
          </div>
        )}
      </div>
    </div>
  );
}
