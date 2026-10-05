import React from 'react';
import { UserCheck, Layers, BookMarked, Check, Shield, Sparkles } from 'lucide-react';
import { RoleType, ClassLevel, ParallelCode } from '../types/anabus';
import { CLASS_SUBJECTS, MAPEL_SUBJECTS, ALL_CLASSES_LIST } from '../utils/defaultData';

interface RoleClassSelectorProps {
  role: RoleType;
  onRoleChange: (role: RoleType) => void;
  // Guru Kelas state
  classLevel: ClassLevel;
  onClassLevelChange: (lvl: ClassLevel) => void;
  parallel: ParallelCode;
  onParallelChange: (p: ParallelCode) => void;
  selectedSubject: string;
  onSubjectChange: (subj: string) => void;
  // Guru Mapel state
  selectedMapelSubject: string;
  onMapelSubjectChange: (subj: string) => void;
  multiClasses: string[];
  onMultiClassesChange: (classes: string[]) => void;
  activeMapelClass: string;
  onActiveMapelClassChange: (cls: string) => void;
  onSaveCurrentSubject: () => void;
  isSavedMap: Record<string, boolean>; // key: subject or class
}

export const RoleClassSelector: React.FC<RoleClassSelectorProps> = ({
  role,
  onRoleChange,
  classLevel,
  onClassLevelChange,
  parallel,
  onParallelChange,
  selectedSubject,
  onSubjectChange,
  selectedMapelSubject,
  onMapelSubjectChange,
  multiClasses,
  onMultiClassesChange,
  activeMapelClass,
  onActiveMapelClassChange,
  onSaveCurrentSubject,
  isSavedMap,
}) => {
  const toggleMultiClass = (cls: string) => {
    if (multiClasses.includes(cls)) {
      if (multiClasses.length === 1) return; // keep at least 1
      const updated = multiClasses.filter((c) => c !== cls);
      onMultiClassesChange(updated);
      if (activeMapelClass === cls) {
        onActiveMapelClassChange(updated[0]);
      }
    } else {
      const updated = [...multiClasses, cls].sort();
      onMultiClassesChange(updated);
    }
  };

  const selectPresetClasses = (type: 'all' | 'lower' | 'upper') => {
    if (type === 'all') {
      onMultiClassesChange(ALL_CLASSES_LIST);
    } else if (type === 'lower') {
      onMultiClassesChange(['1A', '1B', '2A', '2B', '3A', '3B']);
    } else {
      onMultiClassesChange(['4A', '4B', '5A', '5B', '6A', '6B']);
    }
  };

  return (
    <div className="no-print space-y-4">
      {/* Role Switcher Bar */}
      <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-sky-100 shadow-sm flex flex-col sm:flex-row gap-1">
        <button
          onClick={() => onRoleChange('guru_kelas')}
          type="button"
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            role === 'guru_kelas'
              ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-sky-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>GURU KELAS (Kelas 1 - 6 & 7 Mapel)</span>
        </button>

        <button
          onClick={() => onRoleChange('guru_mapel')}
          type="button"
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            role === 'guru_mapel'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-indigo-50'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>GURU MAPEL (PAI, Kristen, PJOK & Multi-Kelas)</span>
        </button>
      </div>

      {/* Role-Specific Panel */}
      {role === 'guru_kelas' ? (
        <div className="bg-white/90 backdrop-blur-xl border border-sky-100 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                  <Layers className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-800 text-sm">Mode Guru Kelas SD Inpres 105285</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dapat mengerjakan seluruh 7 mata pelajaran pada kelas & paralel terpilih.
              </p>
            </div>

            {/* Class & Parallel Selector */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                <span className="text-xs font-semibold text-slate-600 px-2">Kelas:</span>
                {(['1', '2', '3', '4', '5', '6'] as ClassLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onClassLevelChange(lvl)}
                    type="button"
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      classLevel === lvl
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                <span className="text-xs font-semibold text-slate-600 px-2">Paralel:</span>
                {(['A', 'B', 'C'] as ParallelCode[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => onParallelChange(p)}
                    type="button"
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      parallel === p
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 7 Class Subjects Navigation & Save Button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pilih Mata Pelajaran (Kelas {classLevel}{parallel}):
              </span>
              <button
                onClick={onSaveCurrentSubject}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan Mapel {selectedSubject.split(' ')[0]}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {CLASS_SUBJECTS.map((subj) => {
                const isActive = selectedSubject === subj;
                const isSaved = isSavedMap[`${classLevel}${parallel}_${subj}`];

                return (
                  <button
                    key={subj}
                    onClick={() => onSubjectChange(subj)}
                    type="button"
                    className={`relative p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[64px] ${
                      isActive
                        ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-300 shadow-xs'
                        : 'bg-white/80 border-slate-200 hover:border-sky-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className={`text-xs font-bold leading-tight ${isActive ? 'text-sky-900' : 'text-slate-700'}`}>
                        {subj}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <span className={`text-[10px] ${isActive ? 'text-sky-700 font-semibold' : 'text-slate-400'}`}>
                        {isActive ? 'Aktif' : 'Buka'}
                      </span>
                      {isSaved && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">
                          <Check className="w-2.5 h-2.5" /> Tersimpan
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Guru Mapel Mode */
        <div className="bg-white/90 backdrop-blur-xl border border-indigo-100 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <Shield className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-800 text-sm">Mode Guru Mata Pelajaran</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dapat mengerjakan untuk banyak kelas sekaligus dengan satu mapel khusus.
              </p>
            </div>

            {/* Select Mapel */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Pilih Mapel:</span>
              <div className="flex flex-wrap gap-1">
                {MAPEL_SUBJECTS.map((subj) => (
                  <button
                    key={subj}
                    onClick={() => onMapelSubjectChange(subj)}
                    type="button"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedMapelSubject === subj
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {subj.split(' ')[0]} {subj.includes('Kristen') ? 'Kristen' : subj.includes('PJOK') ? 'PJOK' : 'PAI'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Multi-Class Checklist */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Checklist Multi-Kelas yang Diampu:
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {multiClasses.length} Kelas Terpilih
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => selectPresetClasses('all')}
                  type="button"
                  className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded border border-indigo-200 cursor-pointer"
                >
                  Pilih Semua (18)
                </button>
                <button
                  onClick={() => selectPresetClasses('lower')}
                  type="button"
                  className="text-[10px] font-bold text-slate-600 hover:bg-slate-100 px-2 py-1 rounded border border-slate-200 cursor-pointer"
                >
                  Kelas 1-3
                </button>
                <button
                  onClick={() => selectPresetClasses('upper')}
                  type="button"
                  className="text-[10px] font-bold text-slate-600 hover:bg-slate-100 px-2 py-1 rounded border border-slate-200 cursor-pointer"
                >
                  Kelas 4-6
                </button>
              </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-18 gap-1.5 p-2 bg-slate-50/80 rounded-xl border border-slate-200">
              {ALL_CLASSES_LIST.map((cls) => {
                const isChecked = multiClasses.includes(cls);
                return (
                  <label
                    key={cls}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                      isChecked
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isChecked}
                      onChange={() => toggleMultiClass(cls)}
                    />
                    <span>{cls}</span>
                    <span className="text-[9px] opacity-80">{isChecked ? '✓' : '+'}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Active Class Switcher for Editing */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-2xl">
              <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                Sedang Mengerjakan:
              </span>
              <div className="flex gap-1">
                {multiClasses.map((cls) => {
                  const isActive = activeMapelClass === cls;
                  return (
                    <button
                      key={cls}
                      onClick={() => onActiveMapelClassChange(cls)}
                      type="button"
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cls}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={onSaveCurrentSubject}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan Kelas {activeMapelClass}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
