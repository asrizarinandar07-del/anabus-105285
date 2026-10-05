import React, { useState } from 'react';
import {
  ItemAnalysisResult,
  ClassStatistics,
  StudentScore,
  QuestionConfig,
  AssessmentMeta,
} from '../types/anabus';
import {
  BarChart3,
  Award,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowUpDown,
  PieChart,
  Users,
  Percent,
  CheckCheck,
  TrendingUp,
} from 'lucide-react';

interface AnalysisDashboardProps {
  analysisResults: ItemAnalysisResult[];
  statistics: ClassStatistics;
  students: StudentScore[];
  questions: QuestionConfig[];
  meta: AssessmentMeta;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysisResults,
  statistics,
  students,
  questions,
  meta,
}) => {
  const [activeTab, setActiveTab] = useState<'butir' | 'distraktor' | 'rekap' | 'remedial'>('butir');

  // Counts of item status
  const acceptedCount = analysisResults.filter((r) => r.itemStatus === 'Diterima').length;
  const revisedCount = analysisResults.filter((r) => r.itemStatus === 'Direvisi').length;
  const rejectedCount = analysisResults.filter((r) => r.itemStatus === 'Dibuang').length;

  // Sorting students by grade
  const sortedStudents = [...students].sort((a, b) => b.finalGrade - a.finalGrade);
  const remedialStudents = sortedStudents.filter((s) => !s.isPassing);
  const passingStudents = sortedStudents.filter((s) => s.isPassing);

  // Hardest questions for remedial focus
  const hardestQuestions = [...analysisResults]
    .sort((a, b) => a.difficultyIndex - b.difficultyIndex)
    .slice(0, 5);

  return (
    <div className="no-print space-y-6">
      {/* Top Statistical Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase text-slate-400">Rata-Rata Nilai</span>
          <div className="my-1">
            <span className="text-2xl font-black text-slate-800">{statistics.averageGrade}</span>
            <span className="text-[10px] text-slate-400 font-semibold ml-1">/ 100</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Std. Dev: {statistics.standardDeviation}</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase text-slate-400">Tertinggi / Terendah</span>
          <div className="my-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-600">{statistics.maxGrade}</span>
            <span className="text-slate-400 font-normal">/</span>
            <span className="text-lg font-bold text-rose-600">{statistics.minGrade}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Rentang Nilai Siswa</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-sky-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase text-slate-400">Ketuntasan Klasikal</span>
          <div className="my-1">
            <span className="text-2xl font-black text-sky-700">{statistics.passingPercentage}%</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {statistics.passingCount} dari {statistics.studentCount} Tuntas
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase text-emerald-600">Soal Diterima</span>
          <div className="my-1">
            <span className="text-2xl font-black text-emerald-700">{acceptedCount}</span>
            <span className="text-xs text-slate-400 font-semibold ml-1">Butir</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Layak Bank Soal</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase text-amber-600">Soal Direvisi</span>
          <div className="my-1">
            <span className="text-2xl font-black text-amber-700">{revisedCount}</span>
            <span className="text-xs text-slate-400 font-semibold ml-1">Butir</span>
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Perlu Perbaikan</span>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase text-rose-600">Soal Ditolak</span>
          <div className="my-1">
            <span className="text-2xl font-black text-rose-700">{rejectedCount}</span>
            <span className="text-xs text-slate-400 font-semibold ml-1">Butir</span>
          </div>
          <span className="text-[10px] text-rose-600 font-medium">Daya Pembeda Jelek</span>
        </div>
      </div>

      {/* Main Analysis Tab Navigation */}
      <div className="bg-white/90 backdrop-blur-xl border border-sky-100 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('butir')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'butir'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analisis Tingkat Kesukaran & Daya Pembeda</span>
            </button>

            <button
              onClick={() => setActiveTab('distraktor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'distraktor'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Distribusi & Efektivitas Pengecoh (PG)</span>
            </button>

            <button
              onClick={() => setActiveTab('rekap')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'rekap'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Rekapitulasi Nilai & Peringkat Siswa</span>
            </button>

            <button
              onClick={() => setActiveTab('remedial')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'remedial'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Program Remedial & Pengayaan</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Pedoman Standar: <span className="font-bold text-sky-800">Kemendikdasmen 2025</span>
          </div>
        </div>

        {/* TAB 1: ANALISIS BUTIR SOAL */}
        {activeTab === 'butir' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <p>
                Analisis psikometrik klasik (Classical Test Theory) untuk mengevaluasi mutu instrumen asesmen.
              </p>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Diterima
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Direvisi
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Ditolak
                </span>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-12">No</th>
                    <th className="py-2.5 px-2 text-center w-16">Bentuk</th>
                    <th className="py-2.5 px-2 text-center w-16">Kunci</th>
                    <th className="py-2.5 px-2 text-center w-16">Maks</th>
                    <th className="py-2.5 px-3 text-center">Tingkat Kesukaran (P)</th>
                    <th className="py-2.5 px-3 text-center">Kategori TK</th>
                    <th className="py-2.5 px-3 text-center">Daya Pembeda (D)</th>
                    <th className="py-2.5 px-3 text-center">Kategori DP</th>
                    <th className="py-2.5 px-3 text-center w-28">Status Butir</th>
                    <th className="py-2.5 px-4">Tindak Lanjut & Rekomendasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analysisResults.map((r) => {
                    const statusBg =
                      r.itemStatus === 'Diterima'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : r.itemStatus === 'Direvisi'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200';

                    return (
                      <tr key={r.number} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 text-center font-black text-slate-700">
                          {r.number}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className="font-semibold text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {r.type}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-sky-700">
                          {r.key}
                        </td>
                        <td className="py-2 px-2 text-center font-bold text-slate-600">
                          {r.maxScore}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-bold">
                          {r.difficultyIndex}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.difficultyCategory === 'Sedang'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.difficultyCategory === 'Sukar'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {r.difficultyCategory}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-bold">
                          {r.discriminationIndex}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.discriminationCategory === 'Sangat Baik' ||
                              r.discriminationCategory === 'Baik'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.discriminationCategory === 'Cukup'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {r.discriminationCategory}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-black border ${statusBg}`}
                          >
                            {r.itemStatus}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-xs text-slate-600 font-medium">
                          {r.recommendation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DISTRIBUSI PENGECOH (PG) */}
        {activeTab === 'distraktor' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Distribusi jawaban peserta didik untuk soal Pilihan Ganda (PG). Pengecoh efektif apabila dipilih minimal 5% peserta didik dan lebih banyak dipilih oleh kelompok bawah.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysisResults
                .filter((r) => r.type === 'PG')
                .map((item) => (
                  <div
                    key={item.number}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center">
                          #{item.number}
                        </span>
                        <span className="text-xs font-bold text-slate-800">Soal Pilihan Ganda</span>
                      </div>
                      <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100">
                        Kunci: {item.key}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {['A', 'B', 'C', 'D'].map((opt) => {
                        const dist = item.distractors?.[opt];
                        if (!dist) return null;

                        const isKey = dist.isKey;
                        const statusColor = isKey
                          ? 'text-sky-700 font-bold bg-sky-50/70 border-sky-200'
                          : dist.status === 'Berfungsi'
                          ? 'text-emerald-700 bg-emerald-50/70 border-emerald-200'
                          : dist.status === 'Menyesatkan'
                          ? 'text-amber-700 bg-amber-50/70 border-amber-200'
                          : 'text-slate-500 bg-slate-50 border-slate-200';

                        return (
                          <div
                            key={opt}
                            className={`p-2 rounded-xl border flex items-center justify-between text-xs ${statusColor}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 font-black text-center">{opt}</span>
                              <span className="text-[11px]">
                                {dist.count} siswa ({dist.percentage}%)
                              </span>
                            </div>

                            <div className="text-[10px] flex items-center gap-2 font-medium">
                              <span>Atas: {dist.upperCount} | Bawah: {dist.lowerCount}</span>
                              <span className="font-bold underline">{dist.status}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: REKAPITULASI NILAI & PERINGKAT */}
        {activeTab === 'rekap' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <p>Rekapitulasi nilai akhir peserta didik lengkap dengan peringkat dan status ketuntasan.</p>
              <div className="font-bold text-slate-700">
                KKTP Sekolah: <span className="text-emerald-600 font-black">{meta.kktp}</span>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-14">Rank</th>
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-2 text-center w-14">L/P</th>
                    <th className="py-2.5 px-3 text-center">Skor Diperoleh</th>
                    <th className="py-2.5 px-3 text-center">Skor Maksimal</th>
                    <th className="py-2.5 px-3 text-center">Nilai Akhir (100)</th>
                    <th className="py-2.5 px-3 text-center">Ketuntasan</th>
                    <th className="py-2.5 px-4 text-center">Kategori Capaian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedStudents.map((st, idx) => {
                    const isPassed = st.finalGrade >= meta.kktp;
                    const maxScore = questions.reduce((sum, q) => sum + (q.maxScore || 1), 0);

                    return (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2 px-3 text-center font-black">
                          {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : idx + 1}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-800">{st.name}</td>
                        <td className="py-2 px-2 text-center text-slate-600 font-semibold">{st.gender}</td>
                        <td className="py-2 px-3 text-center font-bold text-sky-800">{st.totalScore}</td>
                        <td className="py-2 px-3 text-center text-slate-500">{maxScore}</td>
                        <td
                          className={`py-2 px-3 text-center font-black text-sm ${
                            isPassed ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {st.finalGrade}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              isPassed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isPassed ? 'TUNTAS' : 'REMEDIAL'}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center text-[11px] font-semibold text-slate-600">
                          {st.finalGrade >= 90
                            ? 'Sangat Mahir'
                            : st.finalGrade >= 80
                            ? 'Mahir'
                            : st.finalGrade >= meta.kktp
                            ? 'Cakap'
                            : 'Perlu Bimbingan'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REMEDIAL & PENGAYAAN */}
        {activeTab === 'remedial' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box Remedial */}
            <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/30 space-y-4">
              <div className="flex items-center justify-between border-b border-rose-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-rose-600 text-white">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      Daftar Peserta Didik Remedial ({remedialStudents.length} Siswa)
                    </h4>
                    <p className="text-[11px] text-slate-500">Nilai di bawah KKTP ({meta.kktp})</p>
                  </div>
                </div>
              </div>

              {remedialStudents.length === 0 ? (
                <div className="py-8 text-center text-emerald-600 font-bold text-xs">
                  🎉 Luar biasa! Seluruh peserta didik telah mencapai kriteria ketuntasan (KKTP).
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {remedialStudents.map((st, i) => (
                    <div
                      key={st.id}
                      className="p-2.5 rounded-xl bg-white border border-rose-100 flex items-center justify-between text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 font-bold text-slate-400">{i + 1}.</span>
                        <span className="font-bold text-slate-800">{st.name}</span>
                      </div>
                      <span className="font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                        {st.finalGrade}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Hardest Questions Recommendation */}
              <div className="pt-3 border-t border-rose-200">
                <h5 className="text-xs font-bold text-slate-700 mb-2">
                  Materi / Nomor Soal Prioritas Bimbingan Remedial:
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {hardestQuestions.map((q) => (
                    <div
                      key={q.number}
                      className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-[11px] font-semibold text-slate-700 shadow-2xs"
                    >
                      Soal #{q.number} ({q.type}) • TK: {q.difficultyIndex}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Box Pengayaan */}
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-emerald-600 text-white">
                    <CheckCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      Daftar Peserta Didik Pengayaan ({passingStudents.length} Siswa)
                    </h4>
                    <p className="text-[11px] text-slate-500">Nilai mencapai atau melampaui KKTP</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {passingStudents.map((st, i) => (
                  <div
                    key={st.id}
                    className="p-2.5 rounded-xl bg-white border border-emerald-100 flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 font-bold text-slate-400">{i + 1}.</span>
                      <span className="font-bold text-slate-800">{st.name}</span>
                    </div>
                    <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {st.finalGrade}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-emerald-200 text-xs text-slate-600">
                <b>Bentuk Tindak Lanjut Pengayaan:</b> Pemberian tugas proyek mandiri, tutor sebaya, atau eksplorasi materi lanjutan berstandar HOTS (Higher Order Thinking Skills).
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
