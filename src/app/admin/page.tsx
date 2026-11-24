'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  Users,
  FileQuestion,
  BookOpen,
  Award,
  Upload,
  ArrowRight,
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalTopics: 0,
    totalSessions: 0,
    recentSessions: [] as any[],
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [
          { count: usersCount },
          { count: questionsCount },
          { count: topicsCount },
          { count: sessionsCount },
          { data: recent },
        ] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('questions').select('id', { count: 'exact', head: true }),
          supabase.from('topics').select('id', { count: 'exact', head: true }),
          supabase.from('test_sessions').select('id', { count: 'exact', head: true }),
          supabase
            .from('test_sessions')
            .select(`
              id,
              title,
              mode,
              score,
              accuracy_percent,
              created_at,
              profiles (
                full_name,
                email
              )
            `)
            .order('created_at', { ascending: false })
            .limit(6),
        ]);

        setStats({
          totalUsers: usersCount || 0,
          totalQuestions: questionsCount || 0,
          totalTopics: topicsCount || 0,
          totalSessions: sessionsCount || 0,
          recentSessions: recent || [],
        });
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">Boshqaruv statistikasi yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] tracking-tight">
            Administrator Boshqaruv Markazi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Platforma umumiy holati, savollar bazasi va o‘quvchilar faolligi
          </p>
        </div>

        <Link
          href="/admin/import"
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#6C4AB6] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-200 hover:bg-[#4A2F8A] transition"
        >
          <Upload className="w-4 h-4" />
          <span>Yangi Savollar Importi (JSON)</span>
        </Link>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-premium p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Jami O‘quvchilar</span>
            <Users className="w-5 h-5 text-[#6C4AB6]" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{stats.totalUsers}</p>
          <p className="text-xs text-purple-600 font-semibold">Ro‘yxatdan o‘tgan talabalar</p>
        </div>

        <div className="card-premium p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Savollar Bazasi</span>
            <FileQuestion className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{stats.totalQuestions}</p>
          <p className="text-xs text-blue-600 font-semibold">Supabase bazasida saqlangan</p>
        </div>

        <div className="card-premium p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Matematik Mavzular</span>
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{stats.totalTopics}</p>
          <p className="text-xs text-green-600 font-semibold">Faol mavzular</p>
        </div>

        <div className="card-premium p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Test Sinovlari</span>
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{stats.totalSessions}</p>
          <p className="text-xs text-amber-600 font-semibold">Barcha urinishlar soni</p>
        </div>
      </div>

      {/* RECENT SESSIONS TABLE */}
      <div className="card-premium p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">So‘nggi Test Faoliyatlari</h3>
            <p className="text-xs text-gray-500">Talabalar tomonidan topshirilayotgan sinovlar</p>
          </div>
        </div>

        {stats.recentSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3">O‘quvchi</th>
                  <th className="py-3">Test</th>
                  <th className="py-3">Rejim</th>
                  <th className="py-3">Natija</th>
                  <th className="py-3 text-right">Vaqt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50">
                    <td className="py-3">
                      <p className="font-bold text-gray-900 text-xs">{s.profiles?.full_name || 'Talaba'}</p>
                      <p className="text-[11px] text-gray-400">{s.profiles?.email}</p>
                    </td>
                    <td className="py-3 text-xs font-semibold text-gray-700">{s.title}</td>
                    <td className="py-3">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#6C4AB6]">
                        {s.mode}
                      </span>
                    </td>
                    <td className="py-3 text-xs font-extrabold text-[#6C4AB6]">
                      {s.accuracy_percent}%
                    </td>
                    <td className="py-3 text-right text-xs text-gray-400">
                      {new Date(s.created_at).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-400">
            Hozircha test urinishlari qayd etilmagan.
          </div>
        )}
      </div>
    </div>
  );
}
