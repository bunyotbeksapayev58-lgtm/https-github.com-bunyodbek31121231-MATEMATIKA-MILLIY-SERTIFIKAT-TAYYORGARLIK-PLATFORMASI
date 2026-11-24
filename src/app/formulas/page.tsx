'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Formula } from '@/types';
import MathView from '@/components/ui/math-view';
import {
  Sigma,
  Search,
  BookOpen,
  Copy,
  Check,
  Sparkles,
  Loader2,
  Folder
} from 'lucide-react';

export default function FormulasPage() {
  const supabase = createClient();
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const { data, error } = await supabase
          .from('formulas')
          .select('*')
          .eq('is_active', true)
          .order('order_num', { ascending: true });

        if (!error && data) {
          setFormulas(data as Formula[]);
        }
      } catch (err) {
        console.error('Error fetching formulas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormulas();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    formulas.forEach((f) => set.add(f.category));
    return Array.from(set);
  }, [formulas]);

  const filteredFormulas = useMemo(() => {
    return formulas.filter((f) => {
      const matchSearch =
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.formula_latex.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || f.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [formulas, searchQuery, selectedCategory]);

  const handleCopyLatex = (id: string, latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C4AB6]" />
        <p className="text-sm font-semibold text-gray-500">Formulalar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6C4AB6] text-xs font-bold">
          <Sigma className="w-3.5 h-3.5" />
          <span>Matematik Spravochnik</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight">
          Formulalar Kutubxonasi ({formulas.length})
        </h1>
        <p className="text-sm text-gray-500">
          Milliy sertifikat va kirish imtihonlari uchun zarur bo‘lgan barcha asosiy formulalar, ta’riflar va namunalar
        </p>
      </div>

      {/* SEARCH & CATEGORY FILTER */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Formula yoki mavzuni qidiring..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4AB6] text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-[#6C4AB6] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Barchasi ({formulas.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-[#6C4AB6] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FORMULAS GRID */}
      {filteredFormulas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormulas.map((f) => (
            <div
              key={f.id}
              className="card-premium p-6 flex flex-col justify-between space-y-4 group hover:border-[#9B7FE0] transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-[#6C4AB6] font-bold text-xs">
                    {f.category}
                  </span>
                  <button
                    onClick={() => handleCopyLatex(f.id, f.formula_latex)}
                    className="p-1.5 text-gray-400 hover:text-[#6C4AB6] rounded-lg hover:bg-purple-50 transition"
                    title="LaTeX kodini nusxalash"
                  >
                    {copiedId === f.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#6C4AB6] transition">
                  {f.title}
                </h3>

                {/* FORMULA DISPLAY */}
                <div className="p-4 rounded-2xl bg-[#F8F6FC] border border-purple-100/70 text-center my-2">
                  <MathView content={`$$${f.formula_latex}$$`} />
                </div>

                {f.description && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {f.description}
                  </p>
                )}
              </div>

              {f.examples && (
                <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <span className="font-bold text-gray-700 block mb-1">Misol:</span>
                  <MathView content={`$${f.examples}$`} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-2">
          <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
          <h4 className="text-base font-bold text-gray-700">Formula topilmadi</h4>
          <p className="text-xs text-gray-500">Qidiruv so‘zini o‘zgartiring.</p>
        </div>
      )}
    </div>
  );
}
