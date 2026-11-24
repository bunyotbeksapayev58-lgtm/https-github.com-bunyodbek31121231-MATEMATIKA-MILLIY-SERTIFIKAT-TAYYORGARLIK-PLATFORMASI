'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ExamTemplate } from '@/types';
import {
  Award,
  Clock,
  FileText,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function AdminExamsPage() {
  const supabase = createClient();
  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ExamTemplate | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDuration, setFormDuration] = useState(150);
  const [formTotalQ, setFormTotalQ] = useState(35);
  const [formPassing, setFormPassing] = useState(60);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exam_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTemplates(data as ExamTemplate[]);
      }
    } catch (err) {
      console.error('Error fetching exam templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const openAddModal = () => {
    setEditingTemplate(null);
    setFormTitle('Matematika Milliy Sertifikat Standart Imtihoni');
    setFormDescription('Rasmiy mezonlar asosida 35 ta savol, 150 daqiqa vaqt.');
    setFormDuration(150);
    setFormTotalQ(35);
    setFormPassing(60);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (t: ExamTemplate) => {
    setEditingTemplate(t);
    setFormTitle(t.title);
    setFormDescription(t.description || '');
    setFormDuration(t.duration_minutes);
    setFormTotalQ(t.total_questions);
    setFormPassing(t.passing_score);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setErrorMsg('Imtihon nomini kiriting.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      if (editingTemplate) {
        const { error } = await supabase
          .from('exam_templates')
          .update({
            title: formTitle.trim(),
            description: formDescription.trim(),
            duration_minutes: formDuration,
            total_questions: formTotalQ,
            passing_score: formPassing,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTemplate.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('exam_templates').insert({
          title: formTitle.trim(),
          description: formDescription.trim(),
          duration_minutes: formDuration,
          total_questions: formTotalQ,
          passing_score: formPassing,
          is_active: true,
        });

        if (error) throw error;
      }

      setModalOpen(false);
      await fetchTemplates();
    } catch (err: any) {
      setErrorMsg(err.message || 'Xatolik yuz berdi.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await supabase
        .from('exam_templates')
        .update({ is_active: !current })
        .eq('id', id);

      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_active: !current } : t))
      );
    } catch (err) {
      console.error('Error toggling template:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Haqiqatan ham bu shablonni o‘chirmoqchimisiz?')) return;
    try {
      await supabase.from('exam_templates').delete().eq('id', id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
            Imtihon Shablonlari Boshqaruvi
          </h1>
          <p className="text-xs text-gray-500">
            Milliy sertifikat simulyatsiyasi uchun imtihon qoidalari, davomiyligi va savollar soni
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#6C4AB6] text-white font-bold text-xs shadow-md shadow-purple-200 hover:bg-[#4A2F8A] transition"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Imtihon Shablonini Yaratish</span>
        </button>
      </div>

      {/* TEMPLATES LIST */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C4AB6] mx-auto" />
          <p className="text-xs text-gray-400">Shablonlar yuklanmoqda...</p>
        </div>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((tpl) => (
            <div key={tpl.id} className="card-premium p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    tpl.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tpl.is_active ? 'Faol Imtihon' : 'Nofaol'}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(tpl)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#6C4AB6]"
                      title="Tahrirlash"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tpl.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-gray-900">{tpl.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{tpl.description}</p>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-purple-50">
                    <span className="text-[10px] text-gray-500 font-bold block">Vaqt</span>
                    <span className="font-extrabold text-[#6C4AB6]">{tpl.duration_minutes} daq</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50">
                    <span className="text-[10px] text-gray-500 font-bold block">Savollar</span>
                    <span className="font-extrabold text-blue-700">{tpl.total_questions} ta</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-green-50">
                    <span className="text-[10px] text-gray-500 font-bold block">O‘tish bali</span>
                    <span className="font-extrabold text-green-700">{tpl.passing_score} ball</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handleToggleActive(tpl.id, tpl.is_active)}
                  className="text-xs font-bold text-[#6C4AB6] hover:underline"
                >
                  {tpl.is_active ? 'Faolsizlantirish' : 'Faollashtirish'}
                </button>
                <Link
                  href="/exams"
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900"
                >
                  O‘quvchi ko‘rinishida ochish →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-premium p-12 text-center text-gray-400 text-sm">
          Imtihon shablonlari mavjud emas.
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingTemplate ? 'Shablonni tahrirlash' : 'Yangi imtihon shabloni'}
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

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Imtihon nomi
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Tavsif
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Vaqt (daqiqa)
                  </label>
                  <input
                    type="number"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Savollar soni
                  </label>
                  <input
                    type="number"
                    required
                    value={formTotalQ}
                    onChange={(e) => setFormTotalQ(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    O‘tish bali
                  </label>
                  <input
                    type="number"
                    required
                    value={formPassing}
                    onChange={(e) => setFormPassing(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
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
