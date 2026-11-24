'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/types';
import {
  Trophy,
  Medal,
  Flame,
  Award,
  Loader2,
  TrendingUp,
  User
} from 'lucide-react';

export default function LeaderboardPage() {
  const supabase = createClient();
  const [leaders, setLeaders] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('current_streak', { ascending: false })
          .limit(25);

        if (!error && data) {
          setLeaders(data as UserProfile[]);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">Peshqadamlar reytingi yuklanmoqda...</p>
      </div>
    );
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-sm shadow-md">
          1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-800 flex items-center justify-center font-bold text-sm shadow-md">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
          3
        </div>
      );
    }
    return (
      <span className="w-8 text-center text-sm font-bold text-gray-500">
        {rank}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Eng Faol O‘quvchilar</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight">
          Peshqadamlar Reytingi
        </h1>
        <p className="text-sm text-gray-500">
          Uzluksiz kunlik streak va faollik bo‘yicha eng yaxshi natijalar
        </p>
      </div>

      {/* LEADERBOARD LIST */}
      <div className="card-premium overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-50 to-white border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">O‘quvchi</span>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Uzluksiz Streak</span>
        </div>

        {leaders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {leaders.map((leader, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              return (
                <div
                  key={leader.id}
                  className={`p-4 sm:px-6 flex items-center justify-between transition ${
                    isTop3 ? 'bg-amber-50/20' : 'hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {getRankBadge(rank)}
                    <div className="w-10 h-10 rounded-full bg-[#6C4AB6] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {leader.full_name ? leader.full_name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{leader.full_name || 'Noma’lum talaba'}</h4>
                      <p className="text-[11px] text-gray-400">
                        Maqsadli ball: {leader.target_score || 80}+
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                    <span className="text-sm font-extrabold text-amber-900">
                      {leader.current_streak || 0} kun
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">
            Hozircha o‘quvchilar reytingi shakllanmagan.
          </div>
        )}
      </div>
    </div>
  );
}
