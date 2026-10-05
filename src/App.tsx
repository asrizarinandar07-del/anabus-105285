import React, { useState, useEffect, useMemo } from 'react';
import {
  SchoolIdentity,
  AssessmentMeta,
  QuestionConfig,
  StudentScore,
  RoleType,
  ClassLevel,
  ParallelCode,
} from './types/anabus';
import {
  DEFAULT_SCHOOL,
  DEFAULT_META,
  DEFAULT_SAMPLE_STUDENTS,
  generateKemendikdasmenQuestions,
  CLASS_SUBJECTS,
  MAPEL_SUBJECTS,
} from './utils/defaultData';
import {
  calculateStudentScores,
  analyzeAssessmentItems,
  calculateClassStatistics,
  generateDemoStudentScores,
} from './utils/analysisEngine';
import { generateStandaloneHtml } from './utils/exportStandaloneHtml';
import { cetakDokumen } from './utils/printHelper';
import { SplashScreen } from './components/SplashScreen';
import { RoleClassSelector } from './components/RoleClassSelector';
import { AssessmentHeader } from './components/AssessmentHeader';
import { QuestionConfigModal } from './components/QuestionConfigModal';
import { ScoreEntryTable } from './components/ScoreEntryTable';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { PrintPreviewV3 } from './components/PrintPreviewV3';
import {
  Printer,
  Table,
  BarChart2,
  FileDown,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  Download,
  Upload,
} from 'lucide-react';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash initially
    return true;
  });

  // Developer Photo stored locally
  const [developerPhoto, setDeveloperPhoto] = useState<string>(() => {
    return localStorage.getItem('anabus_dev_photo') || '';
  });

  // Active School Identity
  const [school, setSchool] = useState<SchoolIdentity>(() => {
    const saved = localStorage.getItem('anabus_school_identity');
    return saved ? JSON.parse(saved) : DEFAULT_SCHOOL;
  });

  // Active Role & Class/Subject State
  const [role, setRole] = useState<RoleType>('guru_kelas');
  const [classLevel, setClassLevel] = useState<ClassLevel>('4');
  const [parallel, setParallel] = useState<ParallelCode>('A');
  const [selectedSubject, setSelectedSubject] = useState<string>(CLASS_SUBJECTS[0]);

  // Guru Mapel State
  const [selectedMapelSubject, setSelectedMapelSubject] = useState<string>(MAPEL_SUBJECTS[0]);
  const [multiClasses, setMultiClasses] = useState<string[]>(['1A', '1B', '2A', '2B', '3A', '4A', '5A', '6A']);
  const [activeMapelClass, setActiveMapelClass] = useState<string>('4A');

  // Main navigation view
  const [activeView, setActiveView] = useState<'matrix' | 'analysis' | 'print'>('matrix');

  // Question Configuration Modal
  const [isQuestionConfigOpen, setIsQuestionConfigOpen] = useState(false);

  // Active Storage Key for current workspace
  const currentKey = useMemo(() => {
    if (role === 'guru_kelas') {
      return `anabus_data_${classLevel}${parallel}_${selectedSubject.replace(/\s+/g, '_')}`;
    } else {
      return `anabus_data_${activeMapelClass}_${selectedMapelSubject.replace(/\s+/g, '_')}`;
    }
  }, [role, classLevel, parallel, selectedSubject, activeMapelClass, selectedMapelSubject]);

  // Assessment Metadata
  const [meta, setMeta] = useState<AssessmentMeta>(() => {
    return {
      ...DEFAULT_META,
      classTarget: '4A',
      subject: CLASS_SUBJECTS[0],
    };
  });

  // Questions Configuration (1 to 50)
  const [questions, setQuestions] = useState<QuestionConfig[]>(() => {
    return generateKemendikdasmenQuestions(25);
  });

  // Students Data with responses and computed scores
  const [students, setStudents] = useState<StudentScore[]>(() => {
    return generateDemoStudentScores(DEFAULT_SAMPLE_STUDENTS, generateKemendikdasmenQuestions(25), 75);
  });

  // Track saved state for visual indicators
  const [isSavedMap, setIsSavedMap] = useState<Record<string, boolean>>({});
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);

  // Sync meta target class & subject when selector changes
  useEffect(() => {
    if (role === 'guru_kelas') {
      const cls = `${classLevel}${parallel}`;
      setMeta((prev) => ({
        ...prev,
        classTarget: cls,
        subject: selectedSubject,
      }));
    } else {
      setMeta((prev) => ({
        ...prev,
        classTarget: activeMapelClass,
        subject: selectedMapelSubject,
      }));
    }
  }, [role, classLevel, parallel, selectedSubject, activeMapelClass, selectedMapelSubject]);

  // Load data for current key or initialize default demo
  useEffect(() => {
    const raw = localStorage.getItem(currentKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.questions && parsed.students) {
          setQuestions(parsed.questions);
          setStudents(calculateStudentScores(parsed.students, parsed.questions, parsed.meta?.kktp || meta.kktp));
          if (parsed.meta) {
            setMeta((prev) => ({ ...prev, ...parsed.meta }));
          }
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    // If no saved data for this specific subject/class, load fresh demo
    const initialQuestions = generateKemendikdasmenQuestions(meta.totalQuestions || 25);
    setQuestions(initialQuestions);
    setStudents(generateDemoStudentScores(DEFAULT_SAMPLE_STUDENTS, initialQuestions, meta.kktp));
  }, [currentKey]);

  // Handle Ctrl+P / Cmd+P globally to invoke cetakDokumen directly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        cetakDokumen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save handler for current subject / class
  const handleSaveCurrent = () => {
    saveAllData(false);
    const subjectShort = role === 'guru_kelas' ? selectedSubject : `${selectedMapelSubject} (${activeMapelClass})`;
    setSaveToast(`Data ${subjectShort} berhasil disimpan ke sistem!`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Fungsi saveAllData(): simpan semua input analisis ke localStorage.setItem('anabus_105285_data', JSON.stringify(data))
  const saveAllData = (showToast: boolean = false) => {
    const dataToSave = {
      school,
      meta,
      questions,
      students,
      role,
      classLevel,
      parallel,
      selectedSubject,
      selectedMapelSubject,
      multiClasses,
      activeMapelClass,
      developerPhoto,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('anabus_105285_data', JSON.stringify(dataToSave));
    localStorage.setItem(currentKey, JSON.stringify(dataToSave));
    localStorage.setItem('anabus_school_identity', JSON.stringify(school));

    const itemLabel = role === 'guru_kelas' ? `${classLevel}${parallel}_${selectedSubject}` : `${activeMapelClass}_${selectedMapelSubject}`;
    setIsSavedMap((prev) => ({ ...prev, [itemLabel]: true }));

    if (showToast) {
      setSaveToast('Data berhasil disimpan!');
      setTimeout(() => setSaveToast(null), 1000);
    }
  };

  // Auto-save setiap 30 detik dengan setInterval(saveAllData, 30000)
  useEffect(() => {
    const timer = setInterval(() => {
      saveAllData(false);
    }, 30000);
    return () => clearInterval(timer);
  }, [school, meta, questions, students, role, classLevel, parallel, selectedSubject, selectedMapelSubject, multiClasses, activeMapelClass, developerPhoto, currentKey]);

  // Handler saat tombol YA, SIMPAN & KELUAR diklik
  const handleConfirmExit = () => {
    saveAllData(true);
    setTimeout(() => {
      setIsExitModalOpen(false);
      setShowSplash(true); // Kembali ke Portal Login / Splash Screen
      try {
        window.close();
      } catch (e) {
        // window.close()
      }
    }, 1000);
  };

  // Developer photo upload
  const handlePhotoUpload = (base64Photo: string) => {
    setDeveloperPhoto(base64Photo);
    localStorage.setItem('anabus_dev_photo', base64Photo);
  };

  // Update total questions count (1 to 50)
  const handleTotalQuestionsChange = (newTotal: number) => {
    const safeTotal = Math.min(50, Math.max(1, newTotal));
    setMeta((prev) => ({ ...prev, totalQuestions: safeTotal }));

    if (safeTotal > questions.length) {
      // Append additional questions
      const diff = safeTotal - questions.length;
      const additional = generateKemendikdasmenQuestions(safeTotal).slice(questions.length);
      const updatedQ = [...questions, ...additional];
      setQuestions(updatedQ);
      setStudents((prev) => calculateStudentScores(prev, updatedQ, meta.kktp));
    } else if (safeTotal < questions.length) {
      // Trim questions
      const updatedQ = questions.slice(0, safeTotal);
      setQuestions(updatedQ);
      setStudents((prev) => calculateStudentScores(prev, updatedQ, meta.kktp));
    }
  };

  // Student response change
  const handleUpdateResponse = (studentId: string, qNum: number, rawVal: string | number) => {
    setStudents((prevStudents) => {
      const updated = prevStudents.map((st) => {
        if (st.id === studentId) {
          const newResponses = { ...st.responses, [qNum]: rawVal };
          return {
            ...st,
            responses: newResponses,
          };
        }
        return st;
      });
      return calculateStudentScores(updated, questions, meta.kktp);
    });
  };

  // Update student name / NISN / Gender
  const handleUpdateStudentInfo = (studentId: string, field: 'name' | 'nisn' | 'gender', val: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, [field]: val } : s))
    );
  };

  // Add a new empty student row
  const handleAddStudent = () => {
    const newId = `std-${Date.now()}`;
    const newStudent: StudentScore = {
      id: newId,
      nisn: `012345${Math.floor(1000 + Math.random() * 9000)}`,
      name: `SISWA BARU ${students.length + 1}`,
      gender: 'L',
      responses: {},
      scores: {},
      totalScore: 0,
      finalGrade: 0,
      isPassing: false,
    };
    const updated = [...students, newStudent];
    setStudents(calculateStudentScores(updated, questions, meta.kktp));
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    setStudents(calculateStudentScores(updated, questions, meta.kktp));
  };

  // Regenerate demo scores
  const handleGenerateDemoData = () => {
    const newScores = generateDemoStudentScores(DEFAULT_SAMPLE_STUDENTS, questions, meta.kktp);
    setStudents(newScores);
    setSaveToast('Simulasi data realistis SD Inpres 105285 berhasil dimuat!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Clear all scores
  const handleClearAllScores = () => {
    const cleared = students.map((st) => ({
      ...st,
      responses: {},
      scores: {},
      totalScore: 0,
      finalGrade: 0,
      isPassing: false,
    }));
    setStudents(cleared);
  };

  // Import student names from raw lines
  const handleImportNames = (rawText: string) => {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const importedStudents: StudentScore[] = lines.map((name, idx) => ({
      id: `std-imp-${idx + 1}-${Date.now()}`,
      nisn: `012345${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.toUpperCase(),
      gender: idx % 2 === 0 ? 'L' : 'P',
      responses: {},
      scores: {},
      totalScore: 0,
      finalGrade: 0,
      isPassing: false,
    }));

    setStudents(calculateStudentScores(importedStudents, questions, meta.kktp));
    setSaveToast(`${lines.length} nama siswa berhasil diimpor!`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Update question configuration item
  const handleUpdateQuestion = (index: number, updated: Partial<QuestionConfig>) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updated };
      setStudents((currStudents) => calculateStudentScores(currStudents, next, meta.kktp));
      return next;
    });
  };

  // Apply Question Presets
  const handleApplyPreset = (presetType: 'kemendikdasmen' | 'all_pg' | 'mixed_essay') => {
    const total = meta.totalQuestions || 25;
    let newConfigs: QuestionConfig[] = [];

    if (presetType === 'all_pg') {
      const pgKeys = ['A', 'B', 'C', 'D'];
      newConfigs = Array.from({ length: total }, (_, i) => ({
        number: i + 1,
        type: 'PG',
        key: pgKeys[i % 4],
        maxScore: 1,
      }));
    } else if (presetType === 'mixed_essay') {
      newConfigs = generateKemendikdasmenQuestions(total).map((q) =>
        q.type === 'URAIAN' ? { ...q, maxScore: 4 } : q
      );
    } else {
      newConfigs = generateKemendikdasmenQuestions(total);
    }

    setQuestions(newConfigs);
    setStudents((curr) => calculateStudentScores(curr, newConfigs, meta.kktp));
    setSaveToast('Preset butir soal Kemendikdasmen berhasil diterapkan!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Recalculate psychometrics & class statistics in real-time
  const analysisResults = useMemo(() => {
    return analyzeAssessmentItems(students, questions);
  }, [students, questions]);

  const classStatistics = useMemo(() => {
    return calculateClassStatistics(students, questions, meta.kktp);
  }, [students, questions, meta.kktp]);

  const totalMaxScore = useMemo(() => {
    return questions.reduce((sum, q) => sum + (q.maxScore || 1), 0);
  }, [questions]);

  // Export 1-File Standalone HTML
  const handleExportStandalone = () => {
    const htmlString = generateStandaloneHtml(school, meta, questions, students, developerPhoto);
    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ANABUS_105285_${meta.classTarget}_${meta.subject.replace(/[^a-zA-Z0-9]/g, '_')}_Final.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSaveToast('File HTML Mandiri 1 File berhasil diunduh! Siap dibuka offline.');
    setTimeout(() => setSaveToast(null), 4000);
  };

  // Export CSV
  const handleExportCsv = () => {
    let csv = `KOP RESMI: ${school.schoolName}\n`;
    csv += `Mata Pelajaran: ${meta.subject}, Kelas: ${meta.classTarget}, KKTP: ${meta.kktp}\n\n`;
    csv += `No,Nama Siswa,L/P,`;
    questions.forEach((q) => {
      csv += `Soal_${q.number}_(${q.type}),`;
    });
    csv += `Total Skor,Nilai Akhir,Status\n`;

    students.forEach((st, idx) => {
      csv += `${idx + 1},"${st.name}",${st.gender},`;
      questions.forEach((q) => {
        csv += `"${st.responses[q.number] ?? ''}",`;
      });
      csv += `${st.totalScore},${st.finalGrade},"${st.isPassing ? 'TUNTAS' : 'REMEDIAL'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Nilai_${meta.classTarget}_${meta.subject.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export complete JSON backup
  const handleExportJson = () => {
    const backup = {
      school,
      role,
      classLevel,
      parallel,
      selectedSubject,
      meta,
      questions,
      students,
      developerPhoto,
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ANABUS_Backup_${meta.classTarget}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // If Splash Screen is active, show the futuristic splash screen
  if (showSplash) {
    return (
      <SplashScreen
        school={school}
        developerPhoto={developerPhoto}
        onPhotoUpload={handlePhotoUpload}
        onStart={() => setShowSplash(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-indigo-50/30 text-slate-800 pb-16">
      {/* Toast Notification */}
      {saveToast && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-slate-900/90 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md border border-slate-700 animate-in slide-in-from-bottom duration-300">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="no-print sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-sky-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & School Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSplash(true)}
              className="group flex items-center gap-2 text-left cursor-pointer"
              title="Kembali ke Layar Profil Splash Screen"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                {developerPhoto ? (
                  <img src={developerPhoto} className="w-full h-full object-cover rounded-xl" alt="Dev" />
                ) : (
                  '105'
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-sm tracking-tight">ANABUS 105285</span>
                  <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                    FINAL
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500 font-medium truncate max-w-[210px] sm:max-w-none">
                  SD Inpres 105285 Tandam Hilir I • Asriza Rinandar
                </p>
              </div>
            </button>
          </div>

          {/* Navigation View Pills */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveView('matrix')}
              type="button"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'matrix'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-sky-600" />
              <span>Matriks & Input</span>
            </button>

            <button
              onClick={() => setActiveView('analysis')}
              type="button"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'analysis'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Analisis Psikometrik</span>
            </button>

            <button
              onClick={() => setActiveView('print')}
              type="button"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'print'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cetak V3 (Anti-Hitam)</span>
            </button>
          </div>

          {/* Action Top Right: Save & Standalone HTML */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveCurrent}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simpan Mapel</span>
            </button>

            <button
              onClick={handleExportStandalone}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold transition cursor-pointer"
              title="Unduh versi 1-File HTML Mandiri (Bisa dibuka offline di laptop)"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden md:inline">1-File HTML</span>
            </button>

            <button
              onClick={cetakDokumen}
              type="button"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title="Cetak Cepat (Ctrl+P)"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Tombol KELUAR SISTEM Warna Merah #dc3545 dengan icon 🚪 */}
            <button
              onClick={() => setIsExitModalOpen(true)}
              type="button"
              style={{ backgroundColor: '#dc3545' }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              title="Keluar dari Sistem dengan Auto-Save"
            >
              <span className="text-sm">🚪</span>
              <span className="hidden sm:inline">KELUAR SISTEM</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-5">
        {/* Role & Class / Subject Switcher Bar */}
        <RoleClassSelector
          role={role}
          onRoleChange={setRole}
          classLevel={classLevel}
          onClassLevelChange={setClassLevel}
          parallel={parallel}
          onParallelChange={setParallel}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          selectedMapelSubject={selectedMapelSubject}
          onMapelSubjectChange={setSelectedMapelSubject}
          multiClasses={multiClasses}
          onMultiClassesChange={setMultiClasses}
          activeMapelClass={activeMapelClass}
          onActiveMapelClassChange={setActiveMapelClass}
          onSaveCurrentSubject={handleSaveCurrent}
          isSavedMap={isSavedMap}
        />

        {/* Assessment & School Header Config */}
        <AssessmentHeader
          meta={meta}
          school={school}
          onMetaChange={(updated) => setMeta((prev) => ({ ...prev, ...updated }))}
          onSchoolChange={(updated) => setSchool((prev) => ({ ...prev, ...updated }))}
          onTotalQuestionsChange={handleTotalQuestionsChange}
          studentCount={students.length}
          totalMaxScore={totalMaxScore}
        />

        {/* VIEW 1: MATRIX INPUT SPREADSHEET */}
        {activeView === 'matrix' && (
          <ScoreEntryTable
            students={students}
            questions={questions}
            kktp={meta.kktp}
            onUpdateResponse={handleUpdateResponse}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onUpdateStudentInfo={handleUpdateStudentInfo}
            onGenerateDemoData={handleGenerateDemoData}
            onOpenQuestionConfig={() => setIsQuestionConfigOpen(true)}
            onClearAllScores={handleClearAllScores}
            onImportNames={handleImportNames}
          />
        )}

        {/* VIEW 2: PSYCHOMETRIC ANALYSIS DASHBOARD */}
        {activeView === 'analysis' && (
          <AnalysisDashboard
            analysisResults={analysisResults}
            statistics={classStatistics}
            students={students}
            questions={questions}
            meta={meta}
          />
        )}

        {/* VIEW 3: PRINT PREVIEW V3 A4 LANDSCAPE (ANTI-HITAM) */}
        {activeView === 'print' && (
          <PrintPreviewV3
            school={school}
            meta={meta}
            questions={questions}
            students={students}
            analysisResults={analysisResults}
            statistics={classStatistics}
            onPrint={cetakDokumen}
            onExportHtml={handleExportStandalone}
            onExportCsv={handleExportCsv}
          />
        )}

        {/* Footer info & Backup bar */}
        <div className="no-print pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">ANABUS 105285</span>
            <span>•</span>
            <span className="italic">
              "Mudahkanlah bagimu kesulitan orang lain, maka Allah akan memudahkan kesulitanmu"
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              type="button"
              className="text-slate-600 hover:text-sky-700 font-semibold cursor-pointer underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Cadangkan Data (JSON)</span>
            </button>
            <span>|</span>
            <button
              onClick={() => setShowSplash(true)}
              type="button"
              className="text-sky-700 hover:underline font-bold cursor-pointer"
            >
              Tentang Pengembang
            </button>
          </div>
        </div>
      </main>

      {/* Question Configuration Modal */}
      <QuestionConfigModal
        questions={questions}
        isOpen={isQuestionConfigOpen}
        onClose={() => setIsQuestionConfigOpen(false)}
        onUpdateQuestion={handleUpdateQuestion}
        onApplyPreset={handleApplyPreset}
      />

      {/* Modal Konfirmasi Keluar Sistem dengan Fitur Auto-Save */}
      {isExitModalOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-rose-100 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-3xl mx-auto shadow-inner border border-rose-100">
              🚪
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Konfirmasi Keluar Sistem
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Data akan disimpan otomatis sebelum keluar. Yakin ingin keluar?
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsExitModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                BATAL
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                style={{ backgroundColor: '#dc3545' }}
                className="flex-1 py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                YA, SIMPAN & KELUAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
