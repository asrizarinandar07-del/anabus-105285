import React, { useState } from 'react';
import { AssessmentMeta, SchoolIdentity } from '../types/anabus';
import { Settings, School, Sliders, Calendar, Hash, Target, ChevronDown, ChevronUp } from 'lucide-react';

interface AssessmentHeaderProps {
  meta: AssessmentMeta;
  school: SchoolIdentity;
  onMetaChange: (updated: Partial<AssessmentMeta>) => void;
  onSchoolChange: (updated: Partial<SchoolIdentity>) => void;
  onTotalQuestionsChange: (newTotal: number) => void;
  studentCount: number;
  totalMaxScore: number;
}

export const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({
  meta,
  school,
  onMetaChange,
  onSchoolChange,
  onTotalQuestionsChange,
  studentCount,
  totalMaxScore,
}) => {
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  return (
    <div className="no-print bg-white/90 backdrop-blur-xl border border-sky-100 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Bar with School & Meta Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                {school.schoolName}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                NPSN: {school.npsn}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{school.subdistrict}, {school.district}</span>
              <span>•</span>
              <span className="font-semibold text-sky-700">Guru: {school.teacherName}</span>
            </p>
          </div>
        </div>

        {/* Quick Stats & Toggle Settings */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Jml Soal</span>
            <span className="text-sm font-black text-sky-700">{meta.totalQuestions} Butir</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Skor Maks</span>
            <span className="text-sm font-black text-slate-700">{totalMaxScore} Poin</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Peserta</span>
            <span className="text-sm font-black text-indigo-700">{studentCount} Siswa</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">KKTP / KKM</span>
            <span className="text-sm font-black text-emerald-700">{meta.kktp}</span>
          </div>

          <button
            onClick={() => setIsOpenEdit(!isOpenEdit)}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-all border border-sky-200 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pengaturan Identitas & Soal</span>
            {isOpenEdit ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Edit Drawer */}
      {isOpenEdit && (
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Jenis Asesmen / Tes:
            </label>
            <input
              type="text"
              value={meta.assessmentName}
              onChange={(e) => onMetaChange({ assessmentName: e.target.value })}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Asesmen Sumatif Akhir Semester (SAS)"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Tahun Ajaran & Semester:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={meta.academicYear}
                onChange={(e) => onMetaChange({ academicYear: e.target.value })}
                className="w-2/3 text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-sky-500"
                placeholder="2024/2025"
              />
              <select
                value={meta.semester}
                onChange={(e) => onMetaChange({ semester: e.target.value as 'Ganjil' | 'Genap' })}
                className="w-1/3 text-xs font-medium px-2 py-2 rounded-xl border border-slate-200 bg-white focus:outline-sky-500"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Kriteria Ketercapaian (KKTP / KKM):
            </label>
            <input
              type="number"
              min={10}
              max={100}
              value={meta.kktp}
              onChange={(e) => onMetaChange({ kktp: Number(e.target.value) || 75 })}
              className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-sky-500 text-emerald-700"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center justify-between">
              <span>Jumlah Soal Dinamis (Maks 50):</span>
              <span className="text-[10px] text-sky-600 font-bold">{meta.totalQuestions} Soal</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={5}
                max={50}
                value={meta.totalQuestions}
                onChange={(e) => onTotalQuestionsChange(Number(e.target.value))}
                className="flex-1 accent-sky-600 cursor-pointer"
              />
              <input
                type="number"
                min={1}
                max={50}
                value={meta.totalQuestions}
                onChange={(e) => {
                  const val = Math.min(50, Math.max(1, Number(e.target.value) || 1));
                  onTotalQuestionsChange(val);
                }}
                className="w-14 text-center text-xs font-bold px-2 py-1.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>

          {/* Teacher and Principal Info */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Nama Guru Pengampu:
            </label>
            <input
              type="text"
              value={school.teacherName}
              onChange={(e) => onSchoolChange({ teacherName: e.target.value })}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-sky-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              NIP Guru Pengampu:
            </label>
            <input
              type="text"
              value={school.teacherNip}
              onChange={(e) => onSchoolChange({ teacherNip: e.target.value })}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-sky-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Nama Kepala Sekolah:
            </label>
            <input
              type="text"
              value={school.headmasterName}
              onChange={(e) => onSchoolChange({ headmasterName: e.target.value })}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-sky-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              NIP Kepala Sekolah:
            </label>
            <input
              type="text"
              value={school.headmasterNip}
              onChange={(e) => onSchoolChange({ headmasterNip: e.target.value })}
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-sky-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
