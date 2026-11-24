'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Question, Topic, QuestionDifficulty } from '@/types';
import MathView from '@/components/ui/math-view';
import {
  FileQuestion,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  Filter,
  Loader2,
  Save,
  X
} from 'lucide-react';

export default function AdminQuestionsPage() {
  const supabase = createClient();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [formCustomId, setFormCustomId] = useState('');
  const [formTopicId, setFormTopicId] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<QuestionDifficulty>('medium');
  const [formQuestion, setFormQuestion] = useState('');
  const [formOptA, setFormOptA] = useState('');
  const [formOptB, setFormOptB] = useState('');
  const [formOptC, setFormOptC] = useState('');
  const [formOptD, setFormOptD] = useState('');
  const [formCorrect, setFormCorrect] = useState('A');
  const [formExplanation, setFormExplanation] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('questions')
        .select(`
          id,
          custom_id,
          topic_id,
          difficulty,
          type,
          question,
          correct_answer,
          explanation,
          source,
          is_active,
          created_at,
          topics (
            id,
            title,
            code,
            section
          ),
          question_options (
            key,
            text
          )
        `)
        .order('created_at', { ascending: false })
        .limit(300);

      const { data, error } = await query;
      if (!error && data) {
        setQuestions(data as any[]);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const { data } = await supabase
        .from('topics')
        .select('*')
        .order('order_num', { ascending: true });
      if (data) setTopics(data as Topic[]);
    } catch (err) {
      console.error('Error fetching topics:', err);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchQuestions();
  }, []);

  const openAddModal = () => {
    setEditingQuestion(null);
    setFormCustomId(`M-CUSTOM-${Date.now().toString().slice(-4)}`);
    setFormTopicId(topics[0]?.id || '');
    setFormDifficulty('medium');
    setFormQuestion('');
    setFormOptA('');
    setFormOptB('');
    setFormOptC('');
    setFormOptD('');
    setFormCorrect('A');
    setFormExplanation('');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (q: any) => {
    setEditingQuestion(q);
    setFormCustomId(q.custom_id || '');
    setFormTopicId(q.topic_id || topics[0]?.id || '');
    setFormDifficulty(q.difficulty);
    setFormQuestion(q.question);

    const opts = q.question_options || [];
    const getOpt = (k: string) => opts.find((o: any) => o.key === k)?.text || '';
    setFormOptA(getOpt('A'));
    setFormOptB(getOpt('B'));
    setFormOptC(getOpt('C'));
    setFormOptD(getOpt('D'));
    setFormCorrect(q.correct_answer || 'A');
    setFormExplanation(q.explanation || '');
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim()) {
      setFormError('Savol matnini kiriting.');
      return;
    }
    if (!formOptA.trim() || !formOptB.trim()) {
      setFormError('Kamida A va B variantlarini to‘ldiring.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const optsObj: Record<string, string> = {
        A: formOptA.trim(),
        B: formOptB.trim(),
      };
      if (formOptC.trim()) optsObj.C = formOptC.trim();
      if (formOptD.trim()) optsObj.D = formOptD.trim();

      const selectedTopic = topics.find((t) => t.id === formTopicId);
      const topicCode = selectedTopic?.code || 'B1-M01';

      const { data, error } = await supabase.rpc('import_question_item', {
        p_custom_id: formCustomId.trim(),
        p_topic_code: topicCode,
        p_difficulty: formDifficulty,
        p_question: formQuestion.trim(),
        p_options: optsObj,
        p_correct_option: formCorrect,
        p_explanation: formExplanation.trim() || null,
        p_source: 'Admin Manual',
      });

      if (error) {
        setFormError(error.message);
        setSaving(false);
        return;
      }

      setModalOpen(false);
      await fetchQuestions();
    } catch (err: any) {
      setFormError(err.message || 'Xatolik yuz berdi.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Haqiqatan ham bu savolni o‘chirmoqchimisiz?')) return;
    try {
      await supabase.from('questions').delete().eq('id', id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error('Error deleting question:', err);
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.custom_id && q.custom_id.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchTopic = selectedTopicId === 'all' || q.topic_id === selectedTopicId;
      const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      return matchSearch && matchTopic && matchDiff;
    });
  }, [questions, searchQuery, selectedTopicId, selectedDifficulty]);

  const totalPages = Math.ceil(filteredQuestions.length / PAGE_SIZE);
  const paginated = filteredQuestions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
            Savollar Boshqaruvi
          </h1>
          <p className="text-xs text-gray-500">
            Jami bazadagi savollar: {questions.length} ta (filtrlangan: {filteredQuestions.length})
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#6C4AB6] text-white font-bold text-xs shadow-md shadow-purple-200 hover:bg-[#4A2F8A] transition"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Savol Qo‘shish</span>
        </button>
      </div>

      {/* FILTERS */}
      <div className="card-premium p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Savol matni yoki ID bo‘yicha..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4AB6]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4AB6]"
          >
            <option value="all">Barcha mavzular</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.code} — {t.title}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#6C4AB6]"
          >
            <option value="all">Barcha qiyinliklar</option>
            <option value="easy">Oson</option>
            <option value="medium">O‘rta</option>
            <option value="hard">Qiyin</option>
          </select>
        </div>
      </div>

      {/* QUESTIONS LIST */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C4AB6] mx-auto" />
          <p className="text-xs text-gray-400">Savollar yuklanmoqda...</p>
        </div>
      ) : paginated.length > 0 ? (
        <div className="space-y-4">
          {paginated.map((q) => (
            <div key={q.id} className="card-premium p-5 space-y-3 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xs text-[#6C4AB6]">{q.custom_id}</span>
                  <span className="text-[11px] text-gray-500">
                    ({(q as any).topics?.code}: {(q as any).topics?.title})
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    q.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(q)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-[#6C4AB6] hover:bg-purple-50 transition"
                    title="Tahrirlash"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-900 font-medium leading-relaxed">
                <MathView content={q.question} />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {(q.options || (q as any).question_options || [])
                  .sort((a: any, b: any) => a.key.localeCompare(b.key))
                  .map((opt: any) => {
                    const isCorrect = opt.key === q.correct_answer;
                    return (
                      <div
                        key={opt.key}
                        className={`p-2 rounded-xl border text-xs flex items-center space-x-2 ${
                          isCorrect
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
                        {isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      </div>
                    );
                  })}
              </div>

              {q.explanation && (
                <div className="p-3 bg-purple-50/60 rounded-xl text-xs text-purple-950">
                  <span className="font-bold text-[#6C4AB6]">Tushuntirish: </span>
                  <MathView content={q.explanation} inline />
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold disabled:opacity-40"
              >
                Oldingi
              </button>
              <span className="text-xs text-gray-500 font-semibold">
                Sahifa {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold disabled:opacity-40"
              >
                Keyingi
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card-premium p-12 text-center text-gray-400 text-sm">
          Mos keladigan savollar topilmadi.
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {editingQuestion ? 'Savolni tahrirlash' : 'Yangi savol qo‘shish'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Savol ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formCustomId}
                    onChange={(e) => setFormCustomId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#6C4AB6]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Mavzu
                  </label>
                  <select
                    value={formTopicId}
                    onChange={(e) => setFormTopicId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#6C4AB6]"
                  >
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.code} — {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Qiyinlik
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#6C4AB6]"
                  >
                    <option value="easy">Oson (easy)</option>
                    <option value="medium">O‘rta (medium)</option>
                    <option value="hard">Qiyin (hard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Savol matni (LaTeX formulasini $$...$$ yoki $...$ orasiga yozing)
                </label>
                <textarea
                  required
                  rows={3}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Hisoblang: $$15 + 8 \\cdot 4$$"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#6C4AB6]"
                />
                {formQuestion && (
                  <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 text-xs mt-1">
                    <span className="text-[10px] text-gray-400 font-bold block mb-1">Jonli render:</span>
                    <MathView content={formQuestion} />
                  </div>
                )}
              </div>

              {/* Options A, B, C, D */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Variant A</label>
                  <input
                    type="text"
                    required
                    value={formOptA}
                    onChange={(e) => setFormOptA(e.target.value)}
                    placeholder="$$47$$"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Variant B</label>
                  <input
                    type="text"
                    required
                    value={formOptB}
                    onChange={(e) => setFormOptB(e.target.value)}
                    placeholder="$$45$$"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Variant C</label>
                  <input
                    type="text"
                    value={formOptC}
                    onChange={(e) => setFormOptC(e.target.value)}
                    placeholder="$$48$$"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Variant D</label>
                  <input
                    type="text"
                    value={formOptD}
                    onChange={(e) => setFormOptD(e.target.value)}
                    placeholder="$$46$$"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    To‘g‘ri javob kaliti
                  </label>
                  <select
                    value={formCorrect}
                    onChange={(e) => setFormCorrect(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-green-700 bg-green-50/50"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Tushuntirish / Yechim ishorasi (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={formExplanation}
                    onChange={(e) => setFormExplanation(e.target.value)}
                    placeholder="Avval ko‘paytirish bajariladi..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#6C4AB6] hover:bg-[#4A2F8A] text-white text-xs font-bold shadow-md shadow-purple-200 transition disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
