'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Mail,
  Target,
  Flame,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [dailyGoal, setDailyGoal] = useState(20);
  const [targetScore, setTargetScore] = useState(80);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/profile');
      return;
    }

    if (profile) {
      setFullName(profile.full_name || '');
      setDailyGoal(profile.daily_goal_questions || 20);
      setTargetScore(profile.target_score || 80);
    }
  }, [user, profile, authLoading, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMsg(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          daily_goal_questions: dailyGoal,
          target_score: targetScore,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        setMsg({ type: 'error', text: error.message });
      } else {
        await refreshProfile();
        setMsg({ type: 'success', text: 'Profil ma’lumotlari muvaffaqiyatli saqlandi!' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Saqlashda kutilmagan xatolik yuz berdi.' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">Profil yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6C4AB6] text-xs font-bold">
          <User className="w-3.5 h-3.5" />
          <span>Shaxsiy Ma’lumotlar</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#1A1A2E] tracking-tight">
          Profil Sozlamalari
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Shaxsiy ma’lumotlaringiz va o‘rganish maqsadlarini boshqaring
        </p>
      </div>

      {msg && (
        <div
          className={`rounded-xl p-4 flex items-start space-x-3 text-sm ${
            msg.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* PROFILE FORM */}
      <div className="card-premium p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Email (Readonly) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Email manzili
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-gray-400">Email o‘zgartirilmaydi.</p>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Tizimdagi darajangiz
            </label>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                profile?.role === 'admin'
                  ? 'bg-purple-100 text-[#4A2F8A]'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {profile?.role === 'admin' ? 'Bosh Administrator' : 'O‘quvchi (Student)'}
              </span>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              To‘liq ism-familiyangiz
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4AB6] text-sm"
              />
            </div>
          </div>

          {/* Daily Goal */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Kunlik o‘rganish maqsadi (Savollar soni)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 50].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setDailyGoal(goal)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition border ${
                    dailyGoal === goal
                      ? 'bg-[#6C4AB6] text-white border-[#6C4AB6]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {goal} ta
                </button>
              ))}
            </div>
          </div>

          {/* Target Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Maqsadli imtihon balli
              </label>
              <span className="text-xs font-bold text-[#6C4AB6] bg-purple-50 px-2 py-0.5 rounded">
                {targetScore} ball ({targetScore >= 86 ? 'A+ daraja' : targetScore >= 76 ? 'A daraja' : 'B+ daraja'})
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
              className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-[#6C4AB6]"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-[#6C4AB6] hover:bg-[#4A2F8A] text-white font-bold text-sm shadow-md shadow-purple-200 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>O‘zgarishlarni saqlash</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
