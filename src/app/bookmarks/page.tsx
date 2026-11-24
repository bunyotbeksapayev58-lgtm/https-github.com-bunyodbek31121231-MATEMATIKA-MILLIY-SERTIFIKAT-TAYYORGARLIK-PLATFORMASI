'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@/lib/supabase/client';
import MathView from '@/components/ui/math-view';
import {
  BookMarked,
  Bookmark,
  Trash2,
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function BookmarksPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/bookmarks');
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .select(`
            id,
            note,
            created_at,
            questions (
              id,
              custom_id,
              question,
              difficulty,
              correct_answer,
              explanation,
              topics (
                id,
                title,
                code
              ),
              question_options (
                key,
                text
              )
            )
          `)
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setBookmarks(data);
        }
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookmarks();
    }
  }, [user, authLoading, router]);

  const handleRemoveBookmark = async (id: string) => {
    try {
      await supabase.from('bookmarks').delete().eq('id', id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Error removing bookmark:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">Saqlangan savollar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6C4AB6] text-xs font-bold mb-2">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Sevimlilar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] tracking-tight">
            Saqlangan Savollar ({bookmarks.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Keyinchalik tahlil qilish uchun belgilab qo‘ygan savollaringiz
          </p>
        </div>
      </div>

      {/* BOOKMARKS LIST */}
      {bookmarks.length > 0 ? (
        <div className="space-y-6">
          {bookmarks.map((bm, idx) => {
            const q = bm.questions;
            return (
              <div key={bm.id} className="card-premium p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6C4AB6] flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {q.topics?.code || 'Mavzu'}: {q.topics?.title}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemoveBookmark(bm.id)}
                    className="flex items-center space-x-1 text-xs text-gray-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>O‘chirish</span>
                  </button>
                </div>

                <div className="text-base text-gray-900 font-medium">
                  <MathView content={q.question} />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {(q.question_options || [])
                    .sort((a: any, b: any) => a.key.localeCompare(b.key))
                    .map((opt: any) => (
                      <div
                        key={opt.key}
                        className={`p-2.5 rounded-xl border flex items-center space-x-2 text-xs ${
                          opt.key === q.correct_answer
                            ? 'bg-green-50 border-green-300 font-bold text-green-950'
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        <span className="w-5 h-5 rounded bg-white flex items-center justify-center font-bold text-[10px]">
                          {opt.key}
                        </span>
                        <div className="flex-1">
                          <MathView content={opt.text} />
                        </div>
                      </div>
                    ))}
                </div>

                {q.explanation && (
                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 space-y-1">
                    <span className="font-bold text-[#6C4AB6] uppercase tracking-wider block">
                      Tushuntirish:
                    </span>
                    <MathView content={q.explanation} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
          <Bookmark className="w-10 h-10 text-gray-300 mx-auto" />
          <h4 className="text-base font-bold text-gray-800">Hozircha saqlangan savollar yo‘q</h4>
          <p className="text-xs text-gray-500">
            Test topshirish vaqtida savol tepasidagi "Saqlash" tugmasini bosib, qiziqarli savollarni bu yerda to‘plashingiz mumkin.
          </p>
        </div>
      )}
    </div>
  );
}
