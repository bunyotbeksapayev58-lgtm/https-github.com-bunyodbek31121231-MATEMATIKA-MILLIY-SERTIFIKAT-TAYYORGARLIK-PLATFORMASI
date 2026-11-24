'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import {
  ShieldAlert,
  BarChart2,
  FileQuestion,
  Upload,
  BookOpen,
  Users,
  Award,
  ArrowLeft,
  Loader2,
  LogOut
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/dashboard');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">Administrator ruxsati tekshirilmoqda...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const adminNav = [
    { href: '/admin', label: 'Boshqaruv Paneli', icon: BarChart2, exact: true },
    { href: '/admin/questions', label: 'Savollar bazasi', icon: FileQuestion },
    { href: '/admin/import', label: 'JSON Savol Importi', icon: Upload },
    { href: '/admin/topics', label: 'Mavzular', icon: BookOpen },
    { href: '/admin/users', label: 'Foydalanuvchilar', icon: Users },
    { href: '/admin/exams', label: 'Imtihon shablonlari', icon: Award },
  ];

  const isActive = (item: any) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen bg-[#F8F6FC] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col justify-between shrink-0">
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6C4AB6] to-[#4A2F8A] text-white flex items-center justify-center shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-[#1A1A2E] text-base leading-tight">Admin Panel</h2>
              <span className="text-[10px] font-bold text-[#6C4AB6] uppercase tracking-wider">
                Boshqaruv Tizimi
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    active
                      ? 'bg-[#6C4AB6] text-white shadow-md shadow-purple-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-[#6C4AB6] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Saytga qaytish</span>
          </Link>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
