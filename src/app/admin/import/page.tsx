'use client';

import React, { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/auth-context';
import MathView from '@/components/ui/math-view';
import {
  Upload,
  FileJson,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Play,
  RotateCcw,
  Loader2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface ParsedQuestion {
  id: string;
  topic_id: string;
  topic?: string;
  section?: string;
  difficulty: string;
  type: string;
  question: string;
  options: Record<string, string> | { key: string; text: string }[];
  correct_option: string;
  hint?: string;
  source?: string;
  isValid: boolean;
  errorReason?: string;
}

export default function AdminJsonImportPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [invalidQuestions, setInvalidQuestions] = useState<ParsedQuestion[]>([]);
  const [difficultyCounts, setDifficultyCounts] = useState({ easy: 0, medium: 0, hard: 0 });

  const [importResult, setImportResult] = useState<{
    successCount: number;
    failedCount: number;
    errors: any[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Download Sample JSON
  const handleDownloadSample = () => {
    const sample = {
      version: '1.0',
      subject: 'Mathematics',
      questions: [
        {
          id: 'math_demo_01',
          topic_id: 'B1-M01',
          topic: 'Natural sonlar va ular ustida amallar',
          section: 'Arifmetika va algebra asoslari',
          difficulty: 'oson',
          type: 'single_choice',
          question: 'Hisoblang: $$15 + 8 \\cdot 4$$.',
          options: {
            A: '$$47$$',
            B: '$$45$$',
            C: '$$48$$',
            D: '$$46$$',
          },
          correct_option: 'A',
          hint: 'Avval ko‘paytirish bajariladi: $$8 \\cdot 4 = 32$$, so‘ngra $$15 + 32 = 47$$.',
          source: 'Milliy sertifikat namunaviy to‘plami',
        },
        {
          id: 'math_demo_02',
          topic_id: 'B4-M01',
          topic: 'Logarifmik funksiya va uning xossalari',
          section: 'Logarifmlar, trigonometriya, analiz va kombinatorika',
          difficulty: 'medium',
          type: 'single_choice',
          question: 'Hisoblang: $$\\log_2 32 + \\log_3 27$$.',
          options: {
            A: '$$7$$',
            B: '$$8$$',
            C: '$$9$$',
            D: '$$10$$',
          },
          correct_option: 'B',
          hint: '$$\\log_2 32 = 5$$ va $$\\log_3 27 = 3$$, yig‘indi $$5 + 3 = 8$$.',
          source: 'Milliy sertifikat namunaviy to‘plami',
        },
      ],
    };

    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matematika_namunaviy_savollar.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle File Selection & Validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    processJsonFile(selected);
  };

  const processJsonFile = (fileToProcess: File) => {
    setParsing(true);
    setErrorMsg(null);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let json = JSON.parse(text);

        // Normalize format: if object with questions array, unwrap
        let rawList: any[] = [];
        if (Array.isArray(json)) {
          rawList = json;
        } else if (json && Array.isArray(json.questions)) {
          rawList = json.questions;
        } else {
          setErrorMsg('JSON fayl tarkibida savollar massivi topilmadi.');
          setParsing(false);
          return;
        }

        const validList: ParsedQuestion[] = [];
        const invalidList: ParsedQuestion[] = [];
        const seenIds = new Set<string>();
        const diffs = { easy: 0, medium: 0, hard: 0 };

        rawList.forEach((item, index) => {
          const id = item.id || `custom_q_${index + 1}`;
          let difficulty = (item.difficulty || 'medium').toLowerCase();
          if (difficulty === 'oson') difficulty = 'easy';
          if (difficulty === 'orta' || difficulty === "o'rta" || difficulty === 'o‘rta') difficulty = 'medium';
          if (difficulty === 'qiyin') difficulty = 'hard';

          const questionText = item.question || '';
          const correct = item.correct_option || item.correct_answer || '';
          const options = item.options || {};

          let errorReason = '';
          if (!questionText.trim()) {
            errorReason = 'Savol matni bo‘sh';
          } else if (!correct) {
            errorReason = 'To‘g‘ri javob kaliti ko‘rsatilmagan';
          } else if (seenIds.has(id)) {
            errorReason = `Takrorlangan savol ID: ${id}`;
          }

          seenIds.add(id);

          const parsed: ParsedQuestion = {
            id,
            topic_id: item.topic_id || 'B1-M01',
            topic: item.topic,
            section: item.section,
            difficulty,
            type: item.type || 'single_choice',
            question: questionText,
            options,
            correct_option: correct,
            hint: item.hint || item.explanation,
            source: item.source || 'JSON Import',
            isValid: !errorReason,
            errorReason,
          };

          if (parsed.isValid) {
            validList.push(parsed);
            if (difficulty === 'easy') diffs.easy++;
            else if (difficulty === 'hard') diffs.hard++;
            else diffs.medium++;
          } else {
            invalidList.push(parsed);
          }
        });

        setParsedQuestions(validList);
        setInvalidQuestions(invalidList);
        setDifficultyCounts(diffs);
      } catch (err: any) {
        console.error('JSON parse error:', err);
        setErrorMsg('Faylni o‘qishda xatolik: JSON formati noto‘g‘ri.');
      } finally {
        setParsing(false);
      }
    };

    reader.readAsText(fileToProcess, 'utf-8');
  };

  // Batch insert into Supabase via RPC
  const handleExecuteImport = async () => {
    if (parsedQuestions.length === 0) return;

    setImporting(true);
    setProgress(0);
    setErrorMsg(null);

    const BATCH_SIZE = 50;
    const total = parsedQuestions.length;
    let totalImported = 0;
    let totalFailed = 0;
    const allErrors: any[] = [];

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const chunk = parsedQuestions.slice(i, i + BATCH_SIZE);
      try {
        const { data, error } = await supabase.rpc('import_questions_batch', {
          p_questions: chunk,
        });

        if (error) {
          totalFailed += chunk.length;
          allErrors.push({ batch: i, error: error.message });
        } else if (data) {
          totalImported += data.imported_count || 0;
          totalFailed += data.failed_count || 0;
          if (data.errors && data.errors.length > 0) {
            allErrors.push(...data.errors);
          }
        }
      } catch (err: any) {
        totalFailed += chunk.length;
        allErrors.push({ batch: i, error: err.message });
      }

      setProgress(Math.min(100, Math.round(((i + chunk.length) / total) * 100)));
    }

    // Save record to import_history
    try {
      await supabase.from('import_history').insert({
        admin_id: user?.id || null,
        file_name: file?.name || 'unknown.json',
        total_questions: total,
        imported_questions: totalImported,
        failed_questions: totalFailed,
        status: totalFailed === 0 ? 'success' : 'completed_with_errors',
        errors_log: allErrors,
      });
    } catch (histErr) {
      console.error('Error saving import history:', histErr);
    }

    setImportResult({
      successCount: totalImported,
      failedCount: totalFailed,
      errors: allErrors,
    });
    setImporting(false);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E] tracking-tight">
            JSON Savollar Importi
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Yangi savollar to‘plamini JSON fayl orqali Supabase ma’lumotlar bazasiga ommaviy yuklash
          </p>
        </div>

        <button
          onClick={handleDownloadSample}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition"
        >
          <Download className="w-4 h-4 text-[#6C4AB6]" />
          <span>Namunaviy JSON shablonini yuklab olish</span>
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start space-x-3 text-red-700 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* IMPORT RESULT BANNER */}
      {importResult && (
        <div className="rounded-2xl p-6 bg-white border border-green-200 shadow-md space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Import muvaffaqiyatli yakunlandi!
              </h3>
              <p className="text-xs text-gray-500">
                Barcha kiritilgan savollar Supabase bazasiga joylandi va testlarda faol bo‘ldi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-green-50 rounded-xl">
              <span className="text-xs font-bold text-green-800">Yuklandi</span>
              <p className="text-xl font-extrabold text-green-700">{importResult.successCount} ta</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <span className="text-xs font-bold text-red-800">Xatolik</span>
              <p className="text-xl font-extrabold text-red-700">{importResult.failedCount} ta</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-xs font-bold text-purple-800">Holat</span>
              <p className="text-sm font-extrabold text-[#6C4AB6] mt-1">Tayyor</p>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD ZONE */}
      <div className="card-premium p-8 text-center space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-purple-200 hover:border-[#6C4AB6] bg-purple-50/30 rounded-3xl p-10 cursor-pointer transition flex flex-col items-center justify-center space-y-3 group"
        >
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md text-[#6C4AB6] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-800">
              JSON faylni tanlang yoki shu yerga tashlang
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Yangi yoki to‘liq savollar to‘plami (yangi_5950.json, toliq_9520.json, testlar.json)
            </p>
          </div>
          {file && (
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-100 text-[#4A2F8A] text-xs font-semibold">
              <FileJson className="w-4 h-4" />
              <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </div>
      </div>

      {/* VALIDATION PREVIEW SECTION */}
      {parsing ? (
        <div className="card-premium p-10 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C4AB6] mx-auto" />
          <p className="text-sm font-semibold text-gray-600">JSON fayl o‘qilmoqda va tekshirilmoqda...</p>
        </div>
      ) : parsedQuestions.length > 0 ? (
        <div className="space-y-6">
          {/* STATS SUMMARY BAR */}
          <div className="card-premium p-6 space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">
              Fayl tahlili va tasdiqlash
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-purple-50 rounded-xl">
                <span className="text-xs text-gray-500 font-bold uppercase">To‘g‘ri savollar</span>
                <p className="text-2xl font-extrabold text-[#6C4AB6] mt-1">{parsedQuestions.length} ta</p>
              </div>

              <div className="p-3 bg-green-50 rounded-xl">
                <span className="text-xs text-green-700 font-bold uppercase">Oson</span>
                <p className="text-2xl font-extrabold text-green-700 mt-1">{difficultyCounts.easy} ta</p>
              </div>

              <div className="p-3 bg-yellow-50 rounded-xl">
                <span className="text-xs text-yellow-800 font-bold uppercase">O‘rta</span>
                <p className="text-2xl font-extrabold text-yellow-800 mt-1">{difficultyCounts.medium} ta</p>
              </div>

              <div className="p-3 bg-red-50 rounded-xl">
                <span className="text-xs text-red-700 font-bold uppercase">Qiyin</span>
                <p className="text-2xl font-extrabold text-red-700 mt-1">{difficultyCounts.hard} ta</p>
              </div>
            </div>

            {/* PROGRESS BAR (during import) */}
            {importing && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold text-gray-600">
                  <span>Supabase bazasiga yuklanmoqda...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#6C4AB6] h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* CONFIRM BUTTON */}
            <div className="pt-2">
              <button
                onClick={handleExecuteImport}
                disabled={importing}
                className="w-full py-4 rounded-2xl bg-[#6C4AB6] hover:bg-[#4A2F8A] text-white font-extrabold text-sm shadow-xl shadow-purple-200 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {importing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Importni tasdiqlash va {parsedQuestions.length} ta savolni yuklash</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QUESTION SAMPLES PREVIEW */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-sm">
              Namuna savollar ko‘rinishi (dastlabki 3 ta)
            </h4>

            {parsedQuestions.slice(0, 3).map((q, idx) => (
              <div key={idx} className="card-premium p-5 space-y-3 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#6C4AB6]">{q.id} ({q.topic_id})</span>
                  <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold uppercase">
                    {q.difficulty}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <MathView content={q.question} />
                </div>
                <div className="text-xs text-gray-500 font-semibold">
                  To‘g‘ri javob kaliti: <strong className="text-green-600">{q.correct_option}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
