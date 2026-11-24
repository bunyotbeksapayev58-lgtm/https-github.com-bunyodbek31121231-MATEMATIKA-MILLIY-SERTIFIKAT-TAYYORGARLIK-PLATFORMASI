'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserProfile, UserRole } from '@/types';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  Flame,
  Award,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function AdminUsersPage() {
  const supabase = createClient();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProfiles(data as UserProfile[]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (!error) {
        setProfiles((prev) =>
          prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
        );
      }
    } catch (err) {
      console.error('Error updating role:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = profiles.filter(
    (p) =>
      (p.full_name && p.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
            Foydalanuvchilar Boshqaruvi
          </h1>
          <p className="text-xs text-gray-500">
            Jami talabalar va administratorlar: {profiles.length} ta
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="card-premium p-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ism yoki email bo‘yicha qidiring..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#6C4AB6]"
          />
        </div>
      </div>

      {/* USERS TABLE */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C4AB6] mx-auto" />
          <p className="text-xs text-gray-400">Foydalanuvchilar yuklanmoqda...</p>
        </div>
      ) : (
        <div className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100">
                  <th className="py-3 px-4">Foydalanuvchi</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Streak</th>
                  <th className="py-3 px-4">Maqsad</th>
                  <th className="py-3 px-4">Daraja / Rol</th>
                  <th className="py-3 px-4 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#6C4AB6] text-white flex items-center justify-center font-bold text-xs">
                          {u.full_name ? u.full_name[0].toUpperCase() : 'U'}
                        </div>
                        <span className="font-bold text-gray-900">{u.full_name || 'Noma’lum'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold">
                        <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{u.current_streak || 0} kun</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-semibold">
                      {u.target_score || 80} ball ({u.daily_goal_questions || 20} savol/kun)
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role === 'admin' && <ShieldAlert className="w-3 h-3 text-[#6C4AB6]" />}
                        <span>{u.role}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={u.role}
                        disabled={updatingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6C4AB6]"
                      >
                        <option value="student">Student</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
