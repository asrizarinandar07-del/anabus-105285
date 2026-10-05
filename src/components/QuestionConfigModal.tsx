import React from 'react';
import { QuestionConfig, QuestionType } from '../types/anabus';
import { Sliders, CheckSquare, Sparkles, RefreshCw, X } from 'lucide-react';

interface QuestionConfigModalProps {
  questions: QuestionConfig[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuestion: (index: number, updated: Partial<QuestionConfig>) => void;
  onApplyPreset: (presetType: 'kemendikdasmen' | 'all_pg' | 'mixed_essay') => void;
}

const QUESTION_TYPES: { label: string; value: QuestionType; defaultScore: number }[] = [
  { label: 'PG Biasa (A-D)', value: 'PG', defaultScore: 1 },
  { label: 'PG Kompleks (I II III IV)', value: 'PGK', defaultScore: 2 },
  { label: 'Benar / Salah (B/S)', value: 'BS', defaultScore: 1 },
  { label: 'Menjodohkan', value: 'JODOH', defaultScore: 2 },
  { label: 'Isian Singkat', value: 'ISIAN', defaultScore: 2 },
  { label: 'Uraian / Esai', value: 'URAIAN', defaultScore: 3 },
];

export const QuestionConfigModal: React.FC<QuestionConfigModalProps> = ({
  questions,
  isOpen,
  onClose,
  onUpdateQuestion,
  onApplyPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-sky-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                Konfigurasi Butir Soal & Bobot Penskoran (Kemendikdasmen 2025)
              </h3>
              <p className="text-xs text-sky-100">
                Atur tipe soal (PG, PG Kompleks, B-S, Menjodohkan, Isian, Uraian), kunci jawaban, dan bobot skor (Maks 50 Soal)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Presets Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Preset Standar:</span>
            <button
              onClick={() => onApplyPreset('kemendikdasmen')}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Standar Kemendikdasmen 2025 (Proporsional)
            </button>
            <button
              onClick={() => onApplyPreset('all_pg')}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Semua PG Biasa (1 Poin)
            </button>
            <button
              onClick={() => onApplyPreset('mixed_essay')}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Campuran + Uraian Bobot 4
            </button>
          </div>

          <div className="text-xs font-medium text-slate-500">
            Total: <span className="font-bold text-slate-800">{questions.length} Soal</span> | Total Skor Maks:{' '}
            <span className="font-black text-sky-700">
              {questions.reduce((sum, q) => sum + (q.maxScore || 1), 0)} Poin
            </span>
          </div>
        </div>

        {/* Question Grid / Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {questions.map((q, idx) => (
              <div
                key={q.number}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 font-black text-sm flex items-center justify-center">
                    {q.number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Skor Maks:</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={q.maxScore}
                      onChange={(e) =>
                        onUpdateQuestion(idx, {
                          maxScore: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                      className="w-12 text-center text-xs font-black p-1 border border-slate-300 rounded-lg bg-sky-50 text-sky-900"
                    />
                  </div>
                </div>

                {/* Question Type Selector */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Bentuk Soal:
                  </label>
                  <select
                    value={q.type}
                    onChange={(e) => {
                      const newType = e.target.value as QuestionType;
                      const defaultConf = QUESTION_TYPES.find((t) => t.value === newType);
                      onUpdateQuestion(idx, {
                        type: newType,
                        maxScore: defaultConf?.defaultScore || 1,
                        key: newType === 'PG' ? 'A' : newType === 'BS' ? 'B' : newType === 'PGK' ? 'I,III' : 'Kunci',
                      });
                    }}
                    className="w-full text-xs font-semibold p-1.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Key Answer */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Kunci Jawaban / Kriteria:
                  </label>
                  {q.type === 'PG' ? (
                    <div className="grid grid-cols-4 gap-1">
                      {['A', 'B', 'C', 'D'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => onUpdateQuestion(idx, { key: opt })}
                          className={`py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            q.key.toUpperCase() === opt
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : q.type === 'BS' ? (
                    <div className="grid grid-cols-2 gap-1">
                      {['B', 'S'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => onUpdateQuestion(idx, { key: opt })}
                          className={`py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            q.key.toUpperCase() === opt
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {opt === 'B' ? 'BENAR (B)' : 'SALAH (S)'}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={q.key}
                      onChange={(e) => onUpdateQuestion(idx, { key: e.target.value })}
                      placeholder={
                        q.type === 'PGK'
                          ? 'Misal: I,III'
                          : q.type === 'JODOH'
                          ? '1-B, 2-A'
                          : 'Kunci / Rubrik Skor'
                      }
                      className="w-full text-xs font-medium p-1.5 border border-slate-200 rounded-xl bg-white"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Perubahan bobot dan kunci langsung otomatis mengupdate hasil analisis butir soal.
          </p>
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            Selesai & Terapkan Konfigurasi
          </button>
        </div>
      </div>
    </div>
  );
};
