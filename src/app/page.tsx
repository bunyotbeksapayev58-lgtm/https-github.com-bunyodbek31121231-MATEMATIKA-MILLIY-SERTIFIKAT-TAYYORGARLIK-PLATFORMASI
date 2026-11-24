'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Shuffle,
  Award,
  CheckCircle2,
  Sigma,
  TrendingUp,
  Zap,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Clock
} from 'lucide-react';
import MathView from '@/components/ui/math-view';

export default function HomePage() {
  const sampleFormulas = [
    { title: 'Yig‘indining kvadrati', math: '(a + b)^2 = a^2 + 2ab + b^2' },
    { title: 'Asosiy logarifmik ayniyat', math: 'a^{\\log_a b} = b' },
    { title: 'Trigonometrik asos', math: '\\sin^2 x + \\cos^2 x = 1' },
    { title: 'Pifagor teoremasi', math: 'a^2 + b^2 = c^2' },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-[#6C4AB6] text-xs sm:text-sm font-bold shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#6C4AB6] animate-ping" />
              <span>O‘zbekiston Matematika Milliy Sertifikati — 2026</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1A1A2E] tracking-tight leading-[1.15]">
              Matematika Milliy Sertifikatidan{' '}
              <span className="bg-gradient-to-r from-[#6C4AB6] via-[#9B7FE0] to-[#4A2F8A] bg-clip-text text-transparent">
                A+ (86+)
              </span>{' '}
              Natijaga Erishing
            </h1>

            <p className="text-base sm:text-xl text-gray-600 leading-relaxed font-normal">
              119 ta to‘liq matematika mavzusi, 9,500+ pedagogik tahlil qilingan test savollari, adaptiv mashqlar va real imtihon simulyatori.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/tests/mixed"
                className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-4 rounded-2xl bg-[#6C4AB6] text-white font-bold text-base shadow-xl shadow-purple-200 hover:bg-[#4A2F8A] transition transform hover:-translate-y-0.5"
              >
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span>Sinov testini boshlash</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/topics"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-white border border-gray-200 text-[#1A1A2E] font-bold text-base hover:bg-gray-50 shadow-sm transition"
              >
                <BookOpen className="w-5 h-5 text-[#6C4AB6]" />
                <span>119 ta mavzuni ko‘rish</span>
              </Link>
            </div>

            {/* Live Stats */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#6C4AB6]">9,520+</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Test savollari</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#6C4AB6]">119</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Matematik mavzular</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#6C4AB6]">100%</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">LaTeX formulalar</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#6C4AB6]">150 daq</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Real imtihon rejimi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE TEST MODES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#6C4AB6] mb-2">Test turlari</h2>
          <h3 className="text-3xl font-extrabold text-[#1A1A2E]">
            Har tomonlama puxta tayyorgarlik uchun 3 ta maxsus rejim
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mode 1 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6C4AB6] flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Mavzuli testlar</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                119 ta matematik mavzudan birini tanlang. Oson, o‘rta yoki qiyin darajalarda o‘zingizga mos savollar soni bilan bilimingizni mustahkamlang.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Parametrlashtirilgan savollar</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>10, 20, 30, 50, 100 ta savol</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Yechimlar va tushuntirishlar</span>
                </li>
              </ul>
            </div>
            <Link
              href="/topics"
              className="mt-8 flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#F8F6FC] text-[#6C4AB6] font-bold text-sm hover:bg-[#6C4AB6] hover:text-white transition"
            >
              <span>Mavzuni tanlash</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mode 2 */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#6C4AB6] shadow-lg relative flex flex-col justify-between group">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#6C4AB6] text-white px-3.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              Tavsiya etiladi
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#6C4AB6] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shuffle className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Aralash test</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Barcha yoki o‘zingiz belgilagan mavzular bo‘yicha balanslashtirilgan tasodifiy savollar generatsiyasi. Bilim darajangizni xolis baholang.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Ko‘p mavzuli teng taqsimot</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Haqiqiy imtihon qiyinligi</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Takrorlanmas savollar</span>
                </li>
              </ul>
            </div>
            <Link
              href="/tests/mixed"
              className="mt-8 flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#6C4AB6] text-white font-bold text-sm hover:bg-[#4A2F8A] shadow-md transition"
            >
              <span>Aralash testni boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mode 3 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Milliy Imtihon Simulyatori</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Davlat test markazi standarti bo‘yicha 35 ta savol, 150 daqiqa vaqt chegarasi, qayta ko‘rib chiqish bayrog‘i va avtomatik topshirish.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>150 daqiqa jonli taymer</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Rasmiy baholash mezonlari (A+, A, B+)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>To‘liq elektron imtihon muhiti</span>
                </li>
              </ul>
            </div>
            <Link
              href="/exams"
              className="mt-8 flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#F8F6FC] text-[#6C4AB6] font-bold text-sm hover:bg-[#6C4AB6] hover:text-white transition"
            >
              <span>Imtihon topshirish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SAMPLE FORMULAS PREVIEW */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#6C4AB6] mb-2">
                Mukammal Matematik Tipografiya
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E]">
                KaTeX orqali aniq va chiroyli formulalar
              </h3>
            </div>
            <Link
              href="/formulas"
              className="inline-flex items-center space-x-1.5 text-sm font-bold text-[#6C4AB6] hover:underline"
            >
              <Sigma className="w-4 h-4" />
              <span>Barcha formulalar kutubxonasi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleFormulas.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#F8F6FC] border border-purple-100 text-center space-y-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{f.title}</span>
                <div className="py-2">
                  <MathView content={`$$${f.math}$$`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#4A2F8A] via-[#6C4AB6] to-[#9B7FE0] p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Matematika Milliy Sertifikatini birinchi urinishda oling!
            </h3>
            <p className="text-purple-100 text-base sm:text-lg">
              Hoziroq ro‘yxatdan o‘ting, shaxsiy o‘quv rejangizni tuzing va imtihondan 86+ ball to‘plab, oliygohga maksimal ball bilan kiring.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-[#4A2F8A] font-extrabold hover:bg-gray-100 shadow-lg transition"
            >
              Bepul hisob yaratish
            </Link>
            <Link
              href="/tests/mixed"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-purple-700/50 hover:bg-purple-700 text-white font-bold border border-purple-300/30 transition"
            >
              Sinov testini ko‘rish
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
