'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GraduationCap, Mail, Lock, User, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetScore, setTargetScore] = useState(80);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Parollar mos kelmadi.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Parol kamida 6 ta belgidan iborat bo‘lishi kerak.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            target_score: targetScore,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data.session) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setSuccessMsg('Muvaffaqiyatli ro‘yxatdan o‘tdingiz! Tizimga kirishingiz mumkin.');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch {
      setErrorMsg('Ro‘yxatdan o‘tishda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setErrorMsg(null);
      const redirectUrl = `${window.location.origin}/auth/callback?next=/dashboard`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        setErrorMsg(error.message || 'Google orqali ro‘yxatdan o‘tishda xatolik yuz berdi.');
        setGoogleLoading(false);
      }
    } catch {
      setErrorMsg('Google orqali kirishda xatolik yuz berdi.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#6C4AB6] text-white flex items-center justify-center shadow-lg shadow-purple-200">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] tracking-tight">
            Ro‘yxatdan o‘tish
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Platformada bepul hisob oching va tayyorgarlikni boshlang
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start space-x-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-start space-x-3 text-green-700 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-500 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* GOOGLE SIGN UP BUTTON */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-700 transition shadow-sm disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#6C4AB6]" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google orqali ro‘yxatdan o‘tish</span>
            </>
          )}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400 font-bold">Yoki email orqali</span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              F.I.SH (Ism va familiyangiz)
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
                placeholder="Ali Valiyev"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C4AB6] text-sm bg-gray-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email manzilingiz
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ali@namuna.uz"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C4AB6] text-sm bg-gray-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Parol yarating
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kamida 6 ta belgi"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C4AB6] text-sm bg-gray-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Parolni tasdiqlang
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Parolni qayta kiriting"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C4AB6] text-sm bg-gray-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Maqsadli ballingiz (A+ daraja uchun 86+)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="50"
                max="100"
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-[#6C4AB6]"
              />
              <span className="font-extrabold text-[#6C4AB6] text-sm w-12 text-right">
                {targetScore} ball
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full mt-4 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-white font-semibold bg-[#6C4AB6] hover:bg-[#4A2F8A] shadow-lg shadow-purple-200 transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Ro‘yxatdan o‘tish</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Hisobingiz bormi?{' '}
          <Link href="/login" className="font-bold text-[#6C4AB6] hover:underline">
            Kirish
          </Link>
        </p>
      </div>
    </div>
  );
}
