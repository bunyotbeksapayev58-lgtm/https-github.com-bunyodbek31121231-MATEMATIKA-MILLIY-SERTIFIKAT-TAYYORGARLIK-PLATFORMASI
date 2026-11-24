'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Topic } from '@/types';
import { BookOpen, Search, ArrowRight, Layers, HelpCircle, Loader2 } from 'lucide-react';

export default function TopicsPage() {
  const supabase = createClient();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data, error } = await supabase
          .from('topics')
          .select('*')
          .eq('is_active', true)
          .order('order_num', { ascending: true });

        if (!error && data) {
          setTopics(data as Topic[]);
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const sections = useMemo(() => {
    const set = new Set<string>();
    topics.forEach((t) => set.add(t.section));
    return Array.from(set);
  }, [topics]);

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.section.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSection = selectedSection === 'all' || t.section === selectedSection;
      return matchesSearch && matchesSection;
    });
  }, [topics, searchQuery, selectedSection]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">Mavzular yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6C4AB6] text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Mavzulashtirilgan Testlar</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight">
          Matematika Mavzulari ({topics.length})
        </h1>
        <p className="text-sm text-gray-500">
          Istalgan mavzuni tanlang va oson, o‘rta, qiyin darajalarda maqsadli test topshiring
        </p>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mavzu nomi yoki kodi bo‘yicha qidiring..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4AB6] text-sm"
          />
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedSection('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedSection === 'all'
                ? 'bg-[#6C4AB6] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Barchasi ({topics.length})
          </button>
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedSection === sec
                  ? 'bg-[#6C4AB6] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* TOPICS GRID */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="card-premium p-6 flex flex-col justify-between group hover:border-[#9B7FE0] transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-[#6C4AB6] font-bold text-xs">
                    {topic.code}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400 truncate max-w-[150px]">
                    {topic.section}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#6C4AB6] transition leading-snug">
                  {topic.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Ushbu mavzu bo‘yicha oson, o‘rta va qiyin darajalarda testlar mavjud.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">
                  {topic.order_num}-mavzu
                </span>
                <Link
                  href={`/tests/topic?topicId=${topic.id}`}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#6C4AB6] text-white text-xs font-bold hover:bg-[#4A2F8A] shadow-sm transition"
                >
                  <span>Testni sozlash</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
          <HelpCircle className="w-10 h-10 text-gray-400 mx-auto" />
          <h4 className="text-base font-bold text-gray-700">Hech qanday mavzu topilmadi</h4>
          <p className="text-xs text-gray-500">Qidiruv so‘zini o‘zgartiring yoki filterni tozalang.</p>
        </div>
      )}
    </div>
  );
}
