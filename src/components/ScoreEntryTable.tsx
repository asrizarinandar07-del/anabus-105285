import React, { useState } from 'react';
import { StudentScore, QuestionConfig } from '../types/anabus';
import {
  UserPlus,
  Trash2,
  Sparkles,
  ClipboardList,
  RotateCcw,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface ScoreEntryTableProps {
  students: StudentScore[];
  questions: QuestionConfig[];
  kktp: number;
  onUpdateResponse: (studentId: string, questionNumber: number, val: string | number) => void;
  onAddStudent: () => void;
  onDeleteStudent: (studentId: string) => void;
  onUpdateStudentInfo: (studentId: string, field: 'name' | 'nisn' | 'gender', val: string) => void;
  onGenerateDemoData: () => void;
  onOpenQuestionConfig: () => void;
  onClearAllScores: () => void;
  onImportNames: (rawText: string) => void;
}

export const ScoreEntryTable: React.FC<ScoreEntryTableProps> = ({
  students,
  questions,
  kktp,
  onUpdateResponse,
  onAddStudent,
  onDeleteStudent,
  onUpdateStudentInfo,
  onGenerateDemoData,
  onOpenQuestionConfig,
  onClearAllScores,
  onImportNames,
}) => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');

  const handleImportSubmit = () => {
    if (importText.trim()) {
      onImportNames(importText);
      setImportText('');
      setIsImportModalOpen(false);
    }
  };

  return (
    <div className="no-print bg-white/95 backdrop-blur-xl border border-sky-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-sky-50/50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-600 text-white shadow-xs">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Matriks Input Jawaban & Skor Siswa (1 s.d. {questions.length} Butir)
            </h3>
            <p className="text-[11px] text-slate-500">
              Ketik langsung respon (A/B/C/D untuk PG, B/S untuk Benar-Salah, angka skor untuk PGK/Uraian).
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={onGenerateDemoData}
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Isi data simulasi realistis untuk evaluasi cepat"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulasi Data Cepat (SD 105285)</span>
          </button>

          <button
            onClick={onOpenQuestionConfig}
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-600" />
            <span>Kunci & Bobot ({questions.length})</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Impor Daftar Nama</span>
          </button>

          <button
            onClick={onAddStudent}
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-sky-600" />
            <span>+ Tambah Siswa</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin mengosongkan seluruh respon dan skor siswa?')) {
                onClearAllScores();
              }
            }}
            type="button"
            className="inline-flex items-center gap-1 p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
            title="Kosongkan Respon Siswa"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Spreadsheet Matrix Grid */}
      <div className="overflow-x-auto max-h-[580px] relative divide-y divide-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          {/* Header 1: Column Names */}
          <thead className="bg-slate-100 sticky top-0 z-20 shadow-xs">
            <tr className="text-[11px] text-slate-700 font-bold divide-x divide-slate-200">
              <th className="py-2.5 px-2 text-center w-10 sticky left-0 z-30 bg-slate-100">No</th>
              <th className="py-2.5 px-3 min-w-[200px] sticky left-10 z-30 bg-slate-100">Nama Lengkap Siswa</th>
              <th className="py-2.5 px-2 text-center w-12 sticky left-[240px] z-30 bg-slate-100">L/P</th>
              {questions.map((q) => (
                <th
                  key={q.number}
                  className="py-2 px-1 text-center min-w-[42px] max-w-[50px] font-mono text-[10px]"
                  title={`Soal #${q.number} | Tipe: ${q.type} | Kunci: ${q.key} | Max Skor: ${q.maxScore}`}
                >
                  <div className="font-extrabold text-slate-800">{q.number}</div>
                  <div className="text-[8.5px] font-semibold text-sky-700 uppercase">{q.type}</div>
                </th>
              ))}
              <th className="py-2.5 px-2 text-center w-16 bg-sky-50 text-sky-900 font-black">Total</th>
              <th className="py-2.5 px-2 text-center w-16 bg-indigo-50 text-indigo-900 font-black">Nilai</th>
              <th className="py-2.5 px-2 text-center w-20 bg-emerald-50 text-emerald-900 font-black">Status</th>
              <th className="py-2.5 px-2 text-center w-10">Aksi</th>
            </tr>

            {/* Header 2: Answer Keys & Max Scores Indicator */}
            <tr className="bg-sky-50/70 text-[10px] text-sky-950 divide-x divide-slate-200 font-semibold border-b border-sky-200">
              <td className="py-1 px-2 text-center sticky left-0 z-30 bg-sky-50">★</td>
              <td className="py-1 px-3 sticky left-10 z-30 bg-sky-50 font-bold">KUNCI & BOBOT MAKS</td>
              <td className="py-1 px-2 text-center sticky left-[240px] z-30 bg-sky-50">-</td>
              {questions.map((q) => (
                <td key={q.number} className="py-1 px-1 text-center font-bold text-sky-800">
                  <div className="truncate text-[9.5px]" title={`Kunci: ${q.key}`}>
                    {q.key}
                  </div>
                  <div className="text-[8px] text-slate-500 font-normal">({q.maxScore}p)</div>
                </td>
              ))}
              <td className="py-1 px-2 text-center font-bold bg-sky-100">
                {questions.reduce((sum, q) => sum + (q.maxScore || 1), 0)}
              </td>
              <td className="py-1 px-2 text-center font-bold bg-indigo-100">100</td>
              <td className="py-1 px-2 text-center font-bold bg-emerald-100">≥ {kktp}</td>
              <td className="py-1 px-2 text-center">-</td>
            </tr>
          </thead>

          {/* Student Rows */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {students.length === 0 ? (
              <tr>
                <td colSpan={questions.length + 7} className="py-12 text-center text-slate-400">
                  <ClipboardList className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold text-sm text-slate-600">Belum ada data siswa.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Klik tombol "Simulasi Data Cepat", "+ Tambah Siswa", atau "Impor Daftar Nama" di atas.
                  </p>
                </td>
              </tr>
            ) : (
              students.map((st, idx) => {
                const isPassed = st.finalGrade >= kktp;
                return (
                  <tr
                    key={st.id}
                    className="hover:bg-sky-50/40 transition-colors divide-x divide-slate-100"
                  >
                    {/* Index */}
                    <td className="py-1.5 px-2 text-center font-medium text-slate-500 sticky left-0 z-10 bg-white hover:bg-sky-50/40">
                      {idx + 1}
                    </td>

                    {/* Student Name */}
                    <td className="py-1 px-3 sticky left-10 z-10 bg-white hover:bg-sky-50/40">
                      <input
                        type="text"
                        value={st.name}
                        onChange={(e) => onUpdateStudentInfo(st.id, 'name', e.target.value)}
                        className="w-full text-xs font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-sky-500 focus:bg-white px-1 py-0.5 rounded outline-none"
                        placeholder="Nama Siswa..."
                      />
                    </td>

                    {/* Gender */}
                    <td className="py-1 px-1 text-center sticky left-[240px] z-10 bg-white hover:bg-sky-50/40">
                      <select
                        value={st.gender}
                        onChange={(e) =>
                          onUpdateStudentInfo(st.id, 'gender', e.target.value as 'L' | 'P')
                        }
                        className="text-[11px] font-bold text-slate-600 bg-transparent border-none outline-none cursor-pointer text-center"
                      >
                        <option value="L">L</option>
                        <option value="P">P</option>
                      </select>
                    </td>

                    {/* Dynamic Question Cells */}
                    {questions.map((q) => {
                      const resp = st.responses[q.number] ?? '';
                      const scoreEarned = st.scores[q.number] || 0;
                      const isCorrect = scoreEarned >= q.maxScore;
                      const isPartial = scoreEarned > 0 && scoreEarned < q.maxScore;

                      return (
                        <td
                          key={q.number}
                          className={`p-0 text-center transition-colors ${
                            scoreEarned === 0 && String(resp).trim() !== ''
                              ? 'bg-rose-50/40'
                              : isCorrect
                              ? 'bg-emerald-50/30'
                              : isPartial
                              ? 'bg-amber-50/30'
                              : ''
                          }`}
                        >
                          <input
                            type="text"
                            value={resp}
                            maxLength={q.type === 'PG' || q.type === 'BS' ? 2 : 4}
                            onChange={(e) => {
                              const raw = e.target.value;
                              onUpdateResponse(st.id, q.number, raw);
                            }}
                            className={`w-full py-2 text-center text-xs font-mono font-bold uppercase outline-none focus:ring-2 focus:ring-sky-500 focus:z-10 bg-transparent ${
                              isCorrect
                                ? 'text-emerald-700'
                                : scoreEarned === 0 && String(resp).trim() !== ''
                                ? 'text-rose-600'
                                : 'text-slate-800'
                            }`}
                            placeholder="-"
                          />
                        </td>
                      );
                    })}

                    {/* Total Earned Score */}
                    <td className="py-1.5 px-2 text-center font-black text-sky-800 bg-sky-50/50">
                      {st.totalScore}
                    </td>

                    {/* Final Grade 0-100 */}
                    <td
                      className={`py-1.5 px-2 text-center font-black text-xs ${
                        isPassed
                          ? 'text-emerald-700 bg-emerald-50/50'
                          : 'text-rose-700 bg-rose-50/50'
                      }`}
                    >
                      {st.finalGrade}
                    </td>

                    {/* Status Passing/Remedial */}
                    <td className="py-1.5 px-2 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isPassed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {isPassed ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>TUNTAS</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>REMEDIAL</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Delete Action */}
                    <td className="py-1.5 px-1 text-center">
                      <button
                        onClick={() => onDeleteStudent(st.id)}
                        type="button"
                        className="text-slate-300 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                        title="Hapus baris siswa ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Import Names */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-sky-100 space-y-4">
            <h4 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Impor Daftar Nama Siswa
            </h4>
            <p className="text-xs text-slate-500">
              Paste daftar nama siswa dari Excel, Word, atau teks (satu nama per baris). Nilai awal akan otomatis direset.
            </p>
            <textarea
              rows={8}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Contoh:&#10;ADITYA PRATAMA&#10;AISYAH PUTRI DELINA&#10;BAGAS RAMADHAN&#10;DARA PUSPITA"
              className="w-full text-xs font-mono p-3 border border-slate-200 rounded-2xl focus:outline-sky-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition cursor-pointer"
              >
                Terapkan Daftar Siswa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
