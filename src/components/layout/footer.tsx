'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, BookOpen, Sigma, Award, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#6C4AB6] flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-gray-900 text-lg">Matematika</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              O‘zbekiston Respublikasi Matematika fani bo‘yicha Milliy Sertifikat imtihoniga tayyorgarlik ko‘rish uchun rasmiy spetsifikatsiyalarga moslashtirilgan onlayn platforma.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Bo‘limlar</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/topics" className="hover:text-[#6C4AB6]">Mavzuli testlar</Link></li>
              <li><Link href="/tests/mixed" className="hover:text-[#6C4AB6]">Aralash testlar</Link></li>
              <li><Link href="/exams" className="hover:text-[#6C4AB6]">Milliy imtihon simulyatsiyasi</Link></li>
              <li><Link href="/formulas" className="hover:text-[#6C4AB6]">Formulalar kutubxonasi</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Foydali</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/mistakes" className="hover:text-[#6C4AB6]">Xatolar ustida ishlash</Link></li>
              <li><Link href="/leaderboard" className="hover:text-[#6C4AB6]">Peshqadamlar reytingi</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#6C4AB6]">O‘quvchi kabineti</Link></li>
              <li><Link href="/statistics" className="hover:text-[#6C4AB6]">O‘zlashtirish tahlili</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Milliy Sertifikat</h4>
            <p className="text-sm text-gray-500 mb-3">
              Platforma 9,500+ dan ortiq saralangan savollar bazasi va parametrlashtirilgan mashqlar bilan taʼminlangan.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>Baza yangilangan: 2026</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2026 Matematika Milliy Sertifikat Platformasi. Barcha huquqlar himoyalangan.</p>
          <p className="mt-2 md:mt-0 flex items-center space-x-1">
            <span>Matematika o‘rganuvchilar uchun</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" />
            <span>bilan yaratildi.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
