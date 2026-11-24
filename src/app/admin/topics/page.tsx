'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Topic } from '@/types';
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Loader2,
  Save,
  X
} from 'lucide-react';

export default function AdminTopicsPage() {
  const supabase = createClient();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formSection, setFormSection] = useState('Arifmetika va algebra asoslari');
  const [formOrder, setFormOrder] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
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

  useEffect(() => {
    fetchTopics();
  }, []);

  const openAddModal = () => {
    setEditingTopic(null);
    setFormCode(`B1-M${(topics.length + 1).toString().padStart(2, '0')}`);
    setFormTitle('');
    setFormSection('Arifmetika va algebra asoslari');
    setFormOrder(topics.length + 1);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (t: Topic) => {
    setEditingTopic(t);
    setFormCode(t.code);
    setFormTitle(t.title);
    setFormSection(t.section);
    setFormOrder(t.order_num);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setErrorMsg('Mavzu nomini kiriting.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      if (editingTopic) {
        const { error } = await supabase
          .from('topics')
          .update({
            code: formCode.trim(),
            title: formTitle.trim(),
            section: formSection.trim(),
            order_num: formOrder,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTopic.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('topics').insert({
          code: formCode.trim(),
          title: formTitle.trim(),
          section: formSection.trim(),
          order_num: formOrder,
          is_active: true,
        });

        if (error) throw error;
      }

      setModalOpen(false);
      await fetchTopics();
    } catch (err: any) {
      setErrorMsg(err.message || 'Xatolik yuz berdi.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await supabase
        .from('topics')
        .update({ is_active: !current })
        .eq('id', id);
      setTopics((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_active: !current } : t))
      );
    } catch (err) {
      console.error('Error toggling topic active:', err);
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm('Haqiqatan ham bu mavzuni o‘chirmoqchimisiz? Undagi savollar ajralib qolishi mumkin.')) return;
    try {
      await supabase.from('topics').delete().eq('id', id);
      setTopics((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting topic:', err);
    }
  };

  const filtered = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
            Mavzular Boshqaruvi
          </h1>
          <p className="text-xs text-gray-500">
            Jami mavzular: {topics.length} ta (faol: {topics.filter((t) => t.is_active).length} ta)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#6C4AB6] text-white font-bold text-xs shadow-md shadow-purple-200 hover:bg-[#4A2F8A] transition"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Mavzu Qo‘shish</span>
        </button>
      </div>

      {/* SEARCH */}
      <div className="card-premium p-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mavzu nomi, kodi yoki bo‘limi..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#6C4AB6]"
          />
        </div>
      </div>

      {/* TOPICS TABLE */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C4AB6] mx-auto" />
          <p className="text-xs text-gray-400">Mavzular yuklanmoqda...</p>
        </div>
      ) : (
        <div className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 border-b border-gray-100">
                  <th className="py-3 px-4">Tartib</th>
                  <th className="py-3 px-4">Kod</th>
                  <th className="py-3 px-4">Mavzu nomi</th>
                  <th className="py-3 px-4">Bo‘lim</th>
                  <th className="py-3 px-4">Holat</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-400 font-bold">{t.order_num}</td>
                    <td className="py-3 px-4 font-extrabold text-[#6C4AB6]">{t.code}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{t.title}</td>
                    <td className="py-3 px-4 text-gray-500">{t.section}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(t.id, t.is_active)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                          t.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {t.is_active ? 'Faol' : 'Nofaol'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openEditModal(t)}
                          className="p-1 rounded text-gray-400 hover:text-[#6C4AB6]"
                          title="Tahrirlash"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(t.id)}
                          className="p-1 rounded text-gray-400 hover:text-red-600"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingTopic ? 'Mavzuni tahrirlash' : 'Yangi mavzu qo‘shish'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveTopic} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Mavzu kodi
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="B1-M01"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Tartib raqami
                  </label>
                  <input
                    type="number"
                    required
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Mavzu nomi
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Natural sonlar va ular ustida amallar"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Bo‘lim
                </label>
                <select
                  value={formSection}
                  onChange={(e) => setFormSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                >
                  <option value="Arifmetika va algebra asoslari">Arifmetika va algebra asoslari</option>
                  <option value="Tenglamalar, progressiyalar va funksiyalar">Tenglamalar, progressiyalar va funksiyalar</option>
                  <option value="Geometriya">Geometriya</option>
                  <option value="Logarifmlar, trigonometriya, analiz va kombinatorika">Logarifmlar, trigonometriya, analiz va kombinatorika</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#6C4AB6] text-white text-xs font-bold shadow-md shadow-purple-200 flex items-center space-x-1.5"
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
