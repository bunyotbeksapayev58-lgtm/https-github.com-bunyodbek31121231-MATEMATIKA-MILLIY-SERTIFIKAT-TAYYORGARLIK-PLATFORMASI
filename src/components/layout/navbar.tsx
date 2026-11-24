'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import {
  GraduationCap,
  BookOpen,
  Shuffle,
  Award,
  BookMarked,
  Sigma,
  BarChart2,
  Trophy,
  ShieldAlert,
  LogOut,
  User,
  Menu,
  X,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart2, authRequired: true },
    { href: '/topics', label: 'Mavzular', icon: BookOpen },
    { href: '/tests/mixed', label: 'Aralash test', icon: Shuffle },
    { href: '/exams', label: 'Milliy Imtihon', icon: Award },
    { href: '/mistakes', label: 'Xatolar daftari', icon: CheckCircle2, authRequired: true },
    { href: '/formulas', label: 'Formulalar', icon: Sigma },
    { href: '/leaderboard', label: 'Reyting', icon: Trophy },
  ];

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C4AB6] to-[#9B7FE0] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-[#1A1A2E] leading-tight">
                  Matematika
                </span>
                <span className="text-xs font-semibold text-[#6C4AB6] uppercase tracking-wider">
                  Milliy Sertifikat
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.authRequired && !user) return null;
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#F8F6FC] text-[#6C4AB6] font-semibold'
                      : 'text-gray-600 hover:text-[#6C4AB6] hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#6C4AB6]' : 'text-gray-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side: Streak, User Profile, Admin */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {/* Learning Streak Pill */}
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  <Flame className="w-4 h-4 text-amber-500 animate-pulse fill-amber-500" />
                  <span>{profile?.current_streak || 0} kun streak</span>
                </div>

                {/* Admin Dashboard Pill */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-100 text-[#4A2F8A] hover:bg-purple-200 text-xs font-semibold transition"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#6C4AB6]" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 transition focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#6C4AB6] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
                      {profile?.full_name || 'Foydalanuvchi'}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Profil egasi</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{profile?.full_name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#F8F6FC] hover:text-[#6C4AB6]"
                      >
                        <User className="w-4 h-4" />
                        <span>Profil sozlamalari</span>
                      </Link>

                      <Link
                        href="/statistics"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#F8F6FC] hover:text-[#6C4AB6]"
                      >
                        <BarChart2 className="w-4 h-4" />
                        <span>Mening statistikam</span>
                      </Link>

                      <Link
                        href="/bookmarks"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#F8F6FC] hover:text-[#6C4AB6]"
                      >
                        <BookMarked className="w-4 h-4" />
                        <span>Saqlangan savollar</span>
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={signOut}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Chiqish</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#6C4AB6] hover:bg-[#F8F6FC] rounded-xl transition"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#6C4AB6] hover:bg-[#4A2F8A] rounded-xl shadow-md transition"
                >
                  Ro‘yxatdan o‘tish
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => {
            if (link.authRequired && !user) return null;
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-medium ${
                  active ? 'bg-[#F8F6FC] text-[#6C4AB6]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#6C4AB6]' : 'text-gray-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-medium text-purple-700 bg-purple-50"
            >
              <ShieldAlert className="w-5 h-5 text-[#6C4AB6]" />
              <span>Admin Panel</span>
            </Link>
          )}

          <div className="border-t border-gray-100 pt-4">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{profile?.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-md">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{profile?.current_streak || 0} kun</span>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Profil sozlamalari
                </Link>

                <button
                  onClick={signOut}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Chiqish</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-[#6C4AB6] border border-[#6C4AB6] rounded-xl"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-[#6C4AB6] rounded-xl"
                >
                  Ro‘yxatdan o‘tish
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
