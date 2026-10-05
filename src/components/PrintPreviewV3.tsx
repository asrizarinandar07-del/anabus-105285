import React from 'react';
import {
  SchoolIdentity,
  AssessmentMeta,
  QuestionConfig,
  StudentScore,
  ItemAnalysisResult,
  ClassStatistics,
} from '../types/anabus';
import { Printer, Download, FileText } from 'lucide-react';
import { cetakDokumen } from '../utils/printHelper';

interface PrintPreviewV3Props {
  school: SchoolIdentity;
  meta: AssessmentMeta;
  questions: QuestionConfig[];
  students: StudentScore[];
  analysisResults: ItemAnalysisResult[];
  statistics: ClassStatistics;
  onPrint?: () => void;
  onExportHtml: () => void;
  onExportCsv: () => void;
}

export const PrintPreviewV3: React.FC<PrintPreviewV3Props> = ({
  school,
  meta,
  questions,
  students,
  analysisResults,
  statistics,
  onExportHtml,
  onExportCsv,
}) => {
  const isMultiSheet = questions.length > 25;
  // If > 25 questions (up to 50), split exactly into 2 sheets: 1-25 (Sheet 1) and 26-N (Sheet 2)
  const chunk1 = isMultiSheet ? questions.slice(0, 25) : questions;
  const chunk2 = isMultiSheet ? questions.slice(25) : [];

  const getSubScore = (st: StudentScore, chunk: QuestionConfig[]) => {
    return chunk.reduce((sum, q) => sum + (st.scores[q.number] || 0), 0);
  };

  const getAnalysisItem = (num: number) => {
    return analysisResults.find((r) => r.number === num);
  };

  const handlePrintClick = () => {
    if (typeof (window as unknown as { cetakDokumen?: () => void }).cetakDokumen === 'function') {
      (window as unknown as { cetakDokumen: () => void }).cetakDokumen();
    } else {
      cetakDokumen();
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar for Teachers (Hidden during Print) */}
      <div className="no-print bg-white/95 backdrop-blur-xl border border-sky-100 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-600 text-white shadow-xs">
              <Printer className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black text-slate-800">
                Pratinjau Cetak V3 (A4 Landscape Skala 85% Auto-Fit 2 Halaman)
              </h3>
              <p className="text-xs text-slate-500">
                Layout landscape otomatis dengan margin 10mm & skala 85. Soal 1-50 muat presisi dalam 2 halaman.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btnCetakDokumen"
            onClick={handlePrintClick}
            type="button"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Sekarang (Ctrl+P)</span>
          </button>

          <button
            onClick={onExportHtml}
            type="button"
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            title="Download 1 file HTML mandiri offline lengkap dengan Tailwind CDN"
          >
            <Download className="w-4 h-4" />
            <span>Unduh 1-File HTML Mandiri</span>
          </button>

          <button
            onClick={onExportCsv}
            type="button"
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Ekspor CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* OFFICIAL PRINT AREA V3 (A4 LANDSCAPE) */}
      <div
        id="printArea"
        className="bg-white border border-slate-200 shadow-md p-4 sm:p-6 rounded-2xl max-w-7xl mx-auto text-black"
        style={{
          backgroundColor: '#ffffff',
          color: '#000000',
        }}
      >
        {/* ===================== HALAMAN 1 ===================== */}
        <div className={isMultiSheet ? 'page-break-after pb-4' : 'pb-4'}>
          {/* Header Laporan Sesuai Standar Cetak Maksimal */}
          <div className="header-laporan text-center mb-[15px]" style={{ textAlign: 'center', marginBottom: '15px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }} className="text-[14px] font-bold uppercase tracking-wide text-black">
              LAPORAN ANALISIS BUTIR SOAL
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600' }} className="text-[12px] font-semibold uppercase text-black mt-0.5">
              UPT SPF SD INPRES 105285 TANDAM HILIR I
            </div>
            <div style={{ fontSize: '10px' }} className="text-[10px] text-slate-600 italic">
              {school.address}, {school.subdistrict}, {school.district} • NPSN: {school.npsn}
            </div>
            <div style={{ fontSize: '10.5px' }} className="text-[10.5px] font-medium text-slate-800 mt-0.5">
              {meta.assessmentName} • Tahun Ajaran {meta.academicYear} (Semester {meta.semester})
            </div>
            <div className="border-b-2 border-black mt-2 w-full"></div>
          </div>

          {/* Identity Info Table */}
          <table className="w-full text-[7.5pt] mb-2 border-none border-collapse" style={{ border: 'none' }}>
            <tbody>
              <tr style={{ border: 'none' }}>
                <td style={{ border: 'none', width: '14%' }} className="font-semibold py-0.5">Mata Pelajaran</td>
                <td style={{ border: 'none', width: '36%' }}>: <b>{meta.subject}</b></td>
                <td style={{ border: 'none', width: '16%' }} className="font-semibold py-0.5">Jumlah Butir Soal</td>
                <td style={{ border: 'none', width: '34%' }}>: <b>{questions.length} Soal (Kemendikdasmen 2025)</b></td>
              </tr>
              <tr style={{ border: 'none' }}>
                <td style={{ border: 'none' }} className="font-semibold py-0.5">Kelas / Paralel</td>
                <td style={{ border: 'none' }}>: <b>Kelas {meta.classTarget}</b></td>
                <td style={{ border: 'none' }} className="font-semibold py-0.5">Kriteria Ketuntasan (KKTP)</td>
                <td style={{ border: 'none' }}>: <b>{meta.kktp}</b></td>
              </tr>
              <tr style={{ border: 'none' }}>
                <td style={{ border: 'none' }} className="font-semibold py-0.5">Guru Pengampu</td>
                <td style={{ border: 'none' }}>: <b>{school.teacherName}</b> (NIP. {school.teacherNip})</td>
                <td style={{ border: 'none' }} className="font-semibold py-0.5">Tanggal Asesmen</td>
                <td style={{ border: 'none' }}>: {meta.assessmentDate}</td>
              </tr>
            </tbody>
          </table>

          {/* Tabel Lembar 1: Soal 1 s.d. 25 */}
          <div className="mb-2">
            <div className="font-bold text-[8pt] mb-0.5 flex items-center justify-between">
              <span>
                {isMultiSheet
                  ? `HALAMAN 1: MATRIKS RESPON SISWA & BUTIR SOAL NO. 1 s.d. ${chunk1.length}`
                  : `MATRIKS RESPON SISWA & BUTIR SOAL NO. 1 s.d. ${chunk1.length}`}
              </span>
              <span className="text-[7pt] font-normal text-slate-500">
                {isMultiSheet ? `Sub 1: Maks ${chunk1.reduce((s, q) => s + q.maxScore, 0)} Poin` : `Total Maks: ${chunk1.reduce((s, q) => s + q.maxScore, 0)} Poin`}
              </span>
            </div>

            <table className="w-full text-center border-collapse border border-black text-[7pt]">
              <thead>
                <tr className="bg-gray-100 font-bold">
                  <th className="border border-black py-0.5 px-1 w-6">No</th>
                  <th className="border border-black py-0.5 px-1 text-left min-w-[130px] max-w-[150px]">Nama Peserta Didik</th>
                  <th className="border border-black py-0.5 px-0.5 w-5">L/P</th>
                  {chunk1.map((q) => (
                    <th key={q.number} className="border border-black p-0.5 min-w-[18px]">
                      <div>{q.number}</div>
                      <div className="text-[5.5pt] font-normal uppercase leading-tight">{q.type}</div>
                    </th>
                  ))}
                  <th className="border border-black py-0.5 px-1 w-8 bg-gray-100 font-bold">
                    {isMultiSheet ? 'Sub 1' : 'Total'}
                  </th>
                  {!isMultiSheet && (
                    <>
                      <th className="border border-black py-0.5 px-1 w-10 font-bold">Nilai</th>
                      <th className="border border-black py-0.5 px-1 w-14 font-bold">Ketuntasan</th>
                    </>
                  )}
                </tr>
                {/* Row Keys */}
                <tr className="bg-gray-50 text-[6.5pt]">
                  <th colSpan={3} className="border border-black text-right pr-1 font-bold">KUNCI & BOBOT:</th>
                  {chunk1.map((q) => (
                    <th key={q.number} className="border border-black p-0.5 font-bold">
                      <div>{q.key}</div>
                      <div className="text-[5.5pt] text-slate-600 font-normal">({q.maxScore})</div>
                    </th>
                  ))}
                  <th className="border border-black p-0.5 font-bold">{chunk1.reduce((s, q) => s + q.maxScore, 0)}</th>
                  {!isMultiSheet && (
                    <>
                      <th className="border border-black p-0.5 font-bold">100</th>
                      <th className="border border-black p-0.5">≥ {meta.kktp}</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {students.map((st, idx) => (
                  <tr key={st.id}>
                    <td className="border border-black py-0.5 px-1">{idx + 1}</td>
                    <td className="border border-black py-0.5 px-1 text-left font-medium truncate max-w-[140px]">{st.name}</td>
                    <td className="border border-black py-0.5 px-0.5">{st.gender}</td>
                    {chunk1.map((q) => {
                      const resp = st.responses[q.number] ?? '';
                      const sc = st.scores[q.number] || 0;
                      return (
                        <td key={q.number} className="border border-black p-0.5">
                          {resp !== '' ? resp : sc}
                        </td>
                      );
                    })}
                    <td className="border border-black py-0.5 px-1 font-bold bg-gray-50">
                      {isMultiSheet ? getSubScore(st, chunk1) : st.totalScore}
                    </td>
                    {!isMultiSheet && (
                      <>
                        <td className="border border-black py-0.5 px-1 font-black">{st.finalGrade}</td>
                        <td className="border border-black py-0.5 px-1 font-bold text-[6.5pt]">
                          {st.isPassing ? 'TUNTAS' : 'REMEDIAL'}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
              {/* Statistical summary under columns */}
              <tfoot>
                <tr className="bg-gray-100 font-bold text-[6.5pt]">
                  <td colSpan={3} className="border border-black text-right pr-1">JML SKOR BENAR:</td>
                  {chunk1.map((q) => {
                    const an = getAnalysisItem(q.number);
                    return (
                      <td key={q.number} className="border border-black p-0.5">
                        {an?.totalEarnedScore ?? '-'}
                      </td>
                    );
                  })}
                  <td className="border border-black p-0.5">-</td>
                  {!isMultiSheet && <td colSpan={2} className="border border-black">-</td>}
                </tr>
                <tr className="bg-gray-50 font-bold text-[6pt]">
                  <td colSpan={3} className="border border-black text-right pr-1">TINGKAT KESUKARAN (P):</td>
                  {chunk1.map((q) => {
                    const an = getAnalysisItem(q.number);
                    return (
                      <td key={q.number} className="border border-black p-0.5">
                        {an?.difficultyIndex ?? '-'}
                      </td>
                    );
                  })}
                  <td className="border border-black p-0.5">-</td>
                  {!isMultiSheet && <td colSpan={2} className="border border-black">-</td>}
                </tr>
                <tr className="bg-gray-50 font-bold text-[6pt]">
                  <td colSpan={3} className="border border-black text-right pr-1">DAYA PEMBEDA (D):</td>
                  {chunk1.map((q) => {
                    const an = getAnalysisItem(q.number);
                    return (
                      <td key={q.number} className="border border-black p-0.5">
                        {an?.discriminationIndex ?? '-'}
                      </td>
                    );
                  })}
                  <td className="border border-black p-0.5">-</td>
                  {!isMultiSheet && <td colSpan={2} className="border border-black">-</td>}
                </tr>
                <tr className="bg-gray-100 font-bold text-[6pt]">
                  <td colSpan={3} className="border border-black text-right pr-1">STATUS BUTIR:</td>
                  {chunk1.map((q) => {
                    const an = getAnalysisItem(q.number);
                    const statusShort = an?.itemStatus === 'Diterima' ? 'OK' : an?.itemStatus === 'Direvisi' ? 'REV' : 'DROP';
                    return (
                      <td key={q.number} className="border border-black p-0.5 font-bold">
                        {statusShort}
                      </td>
                    );
                  })}
                  <td className="border border-black p-0.5">-</td>
                  {!isMultiSheet && <td colSpan={2} className="border border-black">-</td>}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* ===================== HALAMAN 2 (JIKA SOAL > 25) ===================== */}
        {isMultiSheet && (
          <div className="pt-2 avoid-break-inside">
            {/* Header Lanjutan Halaman 2 */}
            <div className="header-laporan text-center mb-[15px]" style={{ textAlign: 'center', marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }} className="text-[14px] font-bold uppercase tracking-wide text-black">
                LAPORAN ANALISIS BUTIR SOAL (LEMBAR 2)
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600' }} className="text-[12px] font-semibold uppercase text-black mt-0.5">
                UPT SPF SD INPRES 105285 TANDAM HILIR I
              </div>
              <div style={{ fontSize: '10.5px' }} className="text-[10.5px] text-slate-700">
                Mata Pelajaran: <b>{meta.subject}</b> | Kelas: <b>{meta.classTarget}</b> | Butir Soal No. 26 s.d. {questions.length}
              </div>
              <div className="border-b-2 border-black mt-2 w-full"></div>
            </div>

            {/* Tabel Lembar 2: Soal 26 s.d. N */}
            <div className="mb-3">
              <table className="w-full text-center border-collapse border border-black text-[7pt]">
                <thead>
                  <tr className="bg-gray-100 font-bold">
                    <th className="border border-black py-0.5 px-1 w-6">No</th>
                    <th className="border border-black py-0.5 px-1 text-left min-w-[130px] max-w-[150px]">Nama Peserta Didik</th>
                    {chunk2.map((q) => (
                      <th key={q.number} className="border border-black p-0.5 min-w-[18px]">
                        <div>{q.number}</div>
                        <div className="text-[5.5pt] font-normal uppercase leading-tight">{q.type}</div>
                      </th>
                    ))}
                    <th className="border border-black py-0.5 px-1 w-8 bg-gray-100 font-bold">Sub 2</th>
                    <th className="border border-black py-0.5 px-1 w-8 font-bold">Total</th>
                    <th className="border border-black py-0.5 px-1 w-10 font-black">Nilai</th>
                    <th className="border border-black py-0.5 px-1 w-14 font-bold">Ketuntasan</th>
                  </tr>
                  {/* Row Keys */}
                  <tr className="bg-gray-50 text-[6.5pt]">
                    <th colSpan={2} className="border border-black text-right pr-1 font-bold">KUNCI & BOBOT:</th>
                    {chunk2.map((q) => (
                      <th key={q.number} className="border border-black p-0.5 font-bold">
                        <div>{q.key}</div>
                        <div className="text-[5.5pt] text-slate-600 font-normal">({q.maxScore})</div>
                      </th>
                    ))}
                    <th className="border border-black p-0.5 font-bold">{chunk2.reduce((s, q) => s + q.maxScore, 0)}</th>
                    <th className="border border-black p-0.5 font-bold">
                      {questions.reduce((s, q) => s + q.maxScore, 0)}
                    </th>
                    <th className="border border-black p-0.5 font-bold">100</th>
                    <th className="border border-black p-0.5">≥ {meta.kktp}</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st, idx) => (
                    <tr key={st.id}>
                      <td className="border border-black py-0.5 px-1">{idx + 1}</td>
                      <td className="border border-black py-0.5 px-1 text-left font-medium truncate max-w-[140px]">{st.name}</td>
                      {chunk2.map((q) => {
                        const resp = st.responses[q.number] ?? '';
                        const sc = st.scores[q.number] || 0;
                        return (
                          <td key={q.number} className="border border-black p-0.5">
                            {resp !== '' ? resp : sc}
                          </td>
                        );
                      })}
                      <td className="border border-black py-0.5 px-1 font-bold bg-gray-50">
                        {getSubScore(st, chunk2)}
                      </td>
                      <td className="border border-black py-0.5 px-1 font-bold">{st.totalScore}</td>
                      <td className="border border-black py-0.5 px-1 font-black">{st.finalGrade}</td>
                      <td className="border border-black py-0.5 px-1 font-bold text-[6.5pt]">
                        {st.isPassing ? 'TUNTAS' : 'REMEDIAL'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold text-[6.5pt]">
                    <td colSpan={2} className="border border-black text-right pr-1">JML SKOR BENAR:</td>
                    {chunk2.map((q) => {
                      const an = getAnalysisItem(q.number);
                      return (
                        <td key={q.number} className="border border-black p-0.5">
                          {an?.totalEarnedScore ?? '-'}
                        </td>
                      );
                    })}
                    <td className="border border-black p-0.5">-</td>
                    <td colSpan={3} className="border border-black">-</td>
                  </tr>
                  <tr className="bg-gray-50 font-bold text-[6.5pt]">
                    <td colSpan={2} className="border border-black text-right pr-1">TINGKAT KESUKARAN (P):</td>
                    {chunk2.map((q) => {
                      const an = getAnalysisItem(q.number);
                      return (
                        <td key={q.number} className="border border-black p-0.5">
                          {an?.difficultyIndex ?? '-'}
                        </td>
                      );
                    })}
                    <td className="border border-black p-0.5">-</td>
                    <td colSpan={3} className="border border-black">-</td>
                  </tr>
                  <tr className="bg-gray-50 font-bold text-[6.5pt]">
                    <td colSpan={2} className="border border-black text-right pr-1">DAYA PEMBEDA (D):</td>
                    {chunk2.map((q) => {
                      const an = getAnalysisItem(q.number);
                      return (
                        <td key={q.number} className="border border-black p-0.5">
                          {an?.discriminationIndex ?? '-'}
                        </td>
                      );
                    })}
                    <td className="border border-black p-0.5">-</td>
                    <td colSpan={3} className="border border-black">-</td>
                  </tr>
                  <tr className="bg-gray-100 font-bold text-[6.5pt]">
                    <td colSpan={2} className="border border-black text-right pr-1">STATUS BUTIR:</td>
                    {chunk2.map((q) => {
                      const an = getAnalysisItem(q.number);
                      const statusShort = an?.itemStatus === 'Diterima' ? 'OK' : an?.itemStatus === 'Direvisi' ? 'REV' : 'DROP';
                      return (
                        <td key={q.number} className="border border-black p-0.5 font-bold">
                          {statusShort}
                        </td>
                      );
                    })}
                    <td className="border border-black p-0.5">-</td>
                    <td colSpan={3} className="border border-black">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* ===================== RINGKASAN STATISTIK & KETERANGAN ===================== */}
        <div className="grid grid-cols-2 gap-3 text-[7.5pt] mb-3 avoid-break-inside border border-black p-2 mt-2">
          <div>
            <div className="font-bold border-b border-black pb-0.5 mb-1">STATISTIK KELAS</div>
            <div className="grid grid-cols-2 gap-y-0.5">
              <span>Jumlah Peserta: <b>{statistics.studentCount} Siswa</b></span>
              <span>Rata-Rata Nilai: <b>{statistics.averageGrade}</b></span>
              <span>Nilai Tertinggi: <b>{statistics.maxGrade}</b></span>
              <span>Nilai Terendah: <b>{statistics.minGrade}</b></span>
              <span>Siswa Tuntas: <b>{statistics.passingCount} Siswa</b></span>
              <span>Siswa Remedial: <b>{statistics.remedialCount} Siswa</b></span>
              <span className="col-span-2">Ketuntasan Klasikal: <b>{statistics.passingPercentage}%</b></span>
            </div>
          </div>

          <div>
            <div className="font-bold border-b border-black pb-0.5 mb-1">KUALITAS BUTIR SOAL</div>
            <div className="grid grid-cols-2 gap-y-0.5">
              <span>Soal Diterima (OK): <b>{analysisResults.filter((r) => r.itemStatus === 'Diterima').length} Soal</b></span>
              <span>Soal Direvisi (REV): <b>{analysisResults.filter((r) => r.itemStatus === 'Direvisi').length} Soal</b></span>
              <span>Soal Dibuang (DROP): <b>{analysisResults.filter((r) => r.itemStatus === 'Dibuang').length} Soal</b></span>
              <span>Kriteria Standar: <b>Kemendikdasmen 2025</b></span>
              <span className="col-span-2 text-[6.5pt] italic text-slate-600 mt-0.5">
                Keterangan: TK = P (Sukar &lt; 0.30; Sedang 0.30 - 0.70; Mudah &gt; 0.70). DP = D (&ge;0.30 Baik).
              </span>
            </div>
          </div>
        </div>

        {/* ===================== LEMBAR PENGESAHAN 3 KOLOM ===================== */}
        <div
          className="pengesahan text-[8pt] mt-[40px]"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            textAlign: 'center',
            marginTop: '40px',
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
          }}
        >
          {/* Kolom 1: Mengetahui Kepala Sekolah */}
          <div style={{ width: '35%', textAlign: 'center', lineHeight: '1.4' }}>
            <p className="m-0">Mengetahui,</p>
            <p className="font-semibold m-0">Kepala UPT SPF SD Inpres 105285</p>
            <p className="m-0">Tandam Hilir I</p>
            <div style={{ height: '55px', lineHeight: '55px' }}>&nbsp;</div>
            <p className="font-bold underline uppercase m-0">{school.headmasterName}</p>
            <p className="m-0">NIP. {school.headmasterNip}</p>
          </div>

          {/* Kolom 2: Kosong */}
          <div style={{ width: '30%' }}></div>

          {/* Kolom 3: Tandam Hilir, Tanggal, Guru Pengampu */}
          <div style={{ width: '35%', textAlign: 'center', lineHeight: '1.4' }}>
            <p className="m-0">Tandam Hilir I, {meta.assessmentDate}</p>
            <p className="font-semibold m-0">Guru Pengampu Asesmen,</p>
            <p className="invisible m-0 leading-tight">&nbsp;</p>
            <div style={{ height: '55px', lineHeight: '55px' }}>&nbsp;</div>
            <p className="font-bold underline uppercase m-0">{school.teacherName}</p>
            <p className="m-0">NIP. {school.teacherNip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
