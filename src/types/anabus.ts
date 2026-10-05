export type QuestionType = 'PG' | 'PGK' | 'BS' | 'JODOH' | 'ISIAN' | 'URAIAN';

export interface QuestionConfig {
  number: number;
  type: QuestionType;
  key: string; // e.g. "A", "I,III", "B", "1-A,2-B", "kata kunci", etc.
  maxScore: number;
  competency?: string;
}

export interface StudentScore {
  id: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  // Responses by question number: e.g. { 1: "A", 2: "I,III", 3: 2 }
  responses: Record<number, string | number>;
  // Numerical scores earned: e.g. { 1: 1, 2: 2, 3: 0 }
  scores: Record<number, number>;
  totalScore: number;
  finalGrade: number; // 0 - 100
  isPassing: boolean; // >= KKTP
  rank?: number;
}

export type RoleType = 'guru_kelas' | 'guru_mapel';

export type ClassLevel = '1' | '2' | '3' | '4' | '5' | '6';
export type ParallelCode = 'A' | 'B' | 'C';

export interface SchoolIdentity {
  schoolName: string;
  npsn: string;
  address: string;
  village: string;
  subdistrict: string;
  district: string;
  province: string;
  headmasterName: string;
  headmasterNip: string;
  teacherName: string;
  teacherNip: string;
}

export interface AssessmentMeta {
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  assessmentName: string; // e.g., "Asesmen Sumatif Akhir Semester (SAS)"
  subject: string;
  classTarget: string; // e.g. "4A" or "Kelas 4 - Paralel A"
  kktp: number; // e.g. 75
  totalQuestions: number; // 1 to 50
  assessmentDate: string;
}

export interface DistractorDetail {
  count: number;
  percentage: number;
  upperCount: number;
  lowerCount: number;
  isKey: boolean;
  status: 'Kunci' | 'Berfungsi' | 'Kurang Berfungsi' | 'Menyesatkan';
}

export interface ItemAnalysisResult {
  number: number;
  type: QuestionType;
  key: string;
  maxScore: number;
  totalEarnedScore: number;
  correctCount: number;
  difficultyIndex: number; // Tingkat Kesukaran (P)
  difficultyCategory: 'Sukar' | 'Sedang' | 'Mudah';
  upperMean: number;
  lowerMean: number;
  discriminationIndex: number; // Daya Pembeda (D)
  discriminationCategory: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Jelek' | 'Sangat Buruk';
  itemStatus: 'Diterima' | 'Direvisi' | 'Dibuang';
  distractors?: Record<string, DistractorDetail>; // For PG: 'A','B','C','D'
  recommendation: string;
}

export interface ClassStatistics {
  studentCount: number;
  maxGrade: number;
  minGrade: number;
  averageGrade: number;
  passingCount: number;
  remedialCount: number;
  passingPercentage: number;
  standardDeviation: number;
  averageTotalScore: number;
  maxTotalScore: number;
}
