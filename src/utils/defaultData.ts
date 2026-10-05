import { QuestionConfig, SchoolIdentity, AssessmentMeta } from '../types/anabus';

export const DEFAULT_SCHOOL: SchoolIdentity = {
  schoolName: 'UPT SPF SD INPRES 105285 TANDAM HILIR I',
  npsn: '10214371',
  address: 'Jl. Tengku Amir Hamzah, Dusun I Tandam Hilir I',
  village: 'Tandam Hilir I',
  subdistrict: 'Kec. Hamparan Perak',
  district: 'Kab. Deli Serdang',
  province: 'Sumatera Utara',
  headmasterName: 'KHAIRUNNISA, S.Pd., M.Si.',
  headmasterNip: '19740315 199903 2 004',
  teacherName: 'ASRIZA RINANDAR, S.Pd.',
  teacherNip: '19910528 202221 2 008',
};

export const CLASS_SUBJECTS = [
  'Pendidikan Pancasila (PKN)',
  'Bahasa Indonesia',
  'Matematika (MTK)',
  'IPAS (Ilmu Pengetahuan Alam & Sosial)',
  'Seni Budaya',
  'Bahasa Inggris',
  'Mulok Deli Serdang',
];

export const MAPEL_SUBJECTS = [
  'Pendidikan Agama Islam & BP',
  'Pendidikan Agama Kristen & BP',
  'PJOK (Pendidikan Jasmani, Olahraga & Kesehatan)',
];

export const ALL_CLASSES_LIST = [
  '1A', '1B', '1C',
  '2A', '2B', '2C',
  '3A', '3B', '3C',
  '4A', '4B', '4C',
  '5A', '5B', '5C',
  '6A', '6B', '6C',
];

export const DEFAULT_META: AssessmentMeta = {
  academicYear: '2024/2025',
  semester: 'Genap',
  assessmentName: 'Asesmen Sumatif Akhir Semester (SAS)',
  subject: 'Pendidikan Pancasila (PKN)',
  classTarget: '4A',
  kktp: 75,
  totalQuestions: 25,
  assessmentDate: new Date().toISOString().split('T')[0],
};

export const DEFAULT_SAMPLE_STUDENTS = [
  { nisn: '0123456701', name: 'ADITYA PRATAMA', gender: 'L' as const },
  { nisn: '0123456702', name: 'AISYAH PUTRI DELINA', gender: 'P' as const },
  { nisn: '0123456703', name: 'ALDIANSYAH LUBIS', gender: 'L' as const },
  { nisn: '0123456704', name: 'ANNISA SALSABILA', gender: 'P' as const },
  { nisn: '0123456705', name: 'BAGAS RAMADHAN SIREGAR', gender: 'L' as const },
  { nisn: '0123456706', name: 'BILQIS NUR AZIZAH', gender: 'P' as const },
  { nisn: '0123456707', name: 'DANIEL CHRISTIAN SITEPU', gender: 'L' as const },
  { nisn: '0123456708', name: 'DARA PUSPITA SARI', gender: 'P' as const },
  { nisn: '0123456709', name: 'FAHRI ARDIANSYAH', gender: 'L' as const },
  { nisn: '0123456710', name: 'FARHAN NURHIDAYAT', gender: 'L' as const },
  { nisn: '0123456711', name: 'FATIMAH AZ-ZAHRA', gender: 'P' as const },
  { nisn: '0123456712', name: 'GIBRAN AL-KHALIFI', gender: 'L' as const },
  { nisn: '0123456713', name: 'HAFIDZ SYAHPUTRA', gender: 'L' as const },
  { nisn: '0123456714', name: 'INDAH PERMATA SARI', gender: 'P' as const },
  { nisn: '0123456715', name: 'KAYLA AULIA NISA', gender: 'P' as const },
  { nisn: '0123456716', name: 'M. RIZKY PRATAMA', gender: 'L' as const },
  { nisn: '0123456717', name: 'NADIA KHAIRUNNISA', gender: 'P' as const },
  { nisn: '0123456718', name: 'NAURA ASYIFA PUTRI', gender: 'P' as const },
  { nisn: '0123456719', name: 'RAFI AHMAD FAUZI', gender: 'L' as const },
  { nisn: '0123456720', name: 'REVAN DIRGANTARA', gender: 'L' as const },
  { nisn: '0123456721', name: 'SALWA NAZHIFA', gender: 'P' as const },
  { nisn: '0123456722', name: 'TEUKU ARKAN MAULANA', gender: 'L' as const },
  { nisn: '0123456723', name: 'VANIA AURELLIA BR TARIGAN', gender: 'P' as const },
  { nisn: '0123456724', name: 'WILDAN PRABOWO', gender: 'L' as const },
  { nisn: '0123456725', name: 'YASMIN NABILA', gender: 'P' as const },
  { nisn: '0123456726', name: 'ZACKY AL-BUKHARI', gender: 'L' as const },
];

/**
 * Generate question configs up to total count (max 50) using Kemendikdasmen 2025 distribution
 */
export function generateKemendikdasmenQuestions(total: number = 25): QuestionConfig[] {
  const configs: QuestionConfig[] = [];
  const safeTotal = Math.min(50, Math.max(1, total));

  // Determine proportion based on total:
  // e.g. for 25: 15 PG, 3 PG Kompleks, 2 Benar Salah, 2 Menjodohkan, 2 Isian, 1 Uraian
  // for 50: 25 PG, 5 PGK, 5 BS, 5 Jodoh, 5 Isian, 5 Uraian
  const pgCount = Math.max(1, Math.round(safeTotal * 0.55));
  const pgkCount = Math.max(1, Math.round(safeTotal * 0.12));
  const bsCount = Math.max(1, Math.round(safeTotal * 0.08));
  const jodohCount = Math.max(1, Math.round(safeTotal * 0.08));
  const isianCount = Math.max(1, Math.round(safeTotal * 0.09));
  
  const pgKeys = ['A', 'B', 'C', 'D', 'B', 'C', 'A', 'D', 'C', 'A', 'B', 'D', 'C', 'B', 'A'];

  for (let i = 1; i <= safeTotal; i++) {
    if (i <= pgCount) {
      configs.push({
        number: i,
        type: 'PG',
        key: pgKeys[(i - 1) % pgKeys.length],
        maxScore: 1,
        competency: `Tujuan Pembelajaran Elemen ${Math.ceil(i / 5)}`,
      });
    } else if (i <= pgCount + pgkCount) {
      configs.push({
        number: i,
        type: 'PGK',
        key: 'I,III',
        maxScore: 2,
        competency: 'Penalaran Kritis dan Analisis Multiperspektif',
      });
    } else if (i <= pgCount + pgkCount + bsCount) {
      configs.push({
        number: i,
        type: 'BS',
        key: i % 2 === 0 ? 'B' : 'S',
        maxScore: 1,
        competency: 'Verifikasi Validitas Konsep',
      });
    } else if (i <= pgCount + pgkCount + bsCount + jodohCount) {
      configs.push({
        number: i,
        type: 'JODOH',
        key: '1-B, 2-A',
        maxScore: 2,
        competency: 'Asosiasi Konsep dan Relasi Kontekstual',
      });
    } else if (i <= pgCount + pgkCount + bsCount + jodohCount + isianCount) {
      configs.push({
        number: i,
        type: 'ISIAN',
        key: 'Pancasila',
        maxScore: 2,
        competency: 'Pemanggilan Istilah dan Fakta Kunci',
      });
    } else {
      configs.push({
        number: i,
        type: 'URAIAN',
        key: 'Rubrik 3 Kriteria Lengkap',
        maxScore: 3,
        competency: 'Sintesis Masalah dan Pemecahan Kontekstual',
      });
    }
  }

  return configs;
}
