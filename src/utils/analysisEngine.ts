import {
  QuestionConfig,
  StudentScore,
  ItemAnalysisResult,
  ClassStatistics,
  DistractorDetail,
} from '../types/anabus';

/**
 * Computes individual student scores based on responses and question keys
 */
export function calculateStudentScores(
  students: StudentScore[],
  questions: QuestionConfig[],
  kktp: number
): StudentScore[] {
  const maxTotalScore = questions.reduce((sum, q) => sum + (q.maxScore || 1), 0);

  const updatedStudents = students.map((student) => {
    const scores: Record<number, number> = {};
    let totalScore = 0;

    questions.forEach((q) => {
      const resp = student.responses[q.number];
      let earned = 0;

      if (q.type === 'PG') {
        // PG Biasa: letter match A, B, C, D
        const cleanResp = String(resp || '').trim().toUpperCase();
        const cleanKey = String(q.key || '').trim().toUpperCase();
        earned = cleanResp === cleanKey ? q.maxScore : 0;
      } else if (q.type === 'BS') {
        const cleanResp = String(resp || '').trim().toUpperCase();
        const cleanKey = String(q.key || '').trim().toUpperCase();
        earned = cleanResp === cleanKey ? q.maxScore : 0;
      } else {
        // Direct score entered (PGK, JODOH, ISIAN, URAIAN)
        // or check if response is numeric
        if (typeof resp === 'number') {
          earned = Math.min(q.maxScore, Math.max(0, resp));
        } else if (!isNaN(Number(resp)) && String(resp).trim() !== '') {
          earned = Math.min(q.maxScore, Math.max(0, Number(resp)));
        } else {
          // If text response matches key roughly
          const cleanResp = String(resp || '').trim().toLowerCase();
          const cleanKey = String(q.key || '').trim().toLowerCase();
          earned = cleanResp === cleanKey && cleanKey.length > 0 ? q.maxScore : 0;
        }
      }

      scores[q.number] = earned;
      totalScore += earned;
    });

    const finalGrade = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100 * 10) / 10 : 0;
    const isPassing = finalGrade >= kktp;

    return {
      ...student,
      scores,
      totalScore,
      finalGrade,
      isPassing,
    };
  });

  // Assign rankings (1 to N)
  const sorted = [...updatedStudents].sort((a, b) => b.totalScore - a.totalScore);
  const rankMap = new Map<string, number>();
  sorted.forEach((st, idx) => {
    rankMap.set(st.id, idx + 1);
  });

  return updatedStudents.map((st) => ({
    ...st,
    rank: rankMap.get(st.id) || 1,
  }));
}

/**
 * Performs Item Analysis (Tingkat Kesukaran, Daya Pembeda, Pengecoh, Rekomendasi)
 */
export function analyzeAssessmentItems(
  students: StudentScore[],
  questions: QuestionConfig[]
): ItemAnalysisResult[] {
  const n = students.length;
  if (n === 0) {
    return questions.map((q) => ({
      number: q.number,
      type: q.type,
      key: q.key,
      maxScore: q.maxScore,
      totalEarnedScore: 0,
      correctCount: 0,
      difficultyIndex: 0,
      difficultyCategory: 'Sedang',
      upperMean: 0,
      lowerMean: 0,
      discriminationIndex: 0,
      discriminationCategory: 'Cukup',
      itemStatus: 'Direvisi',
      recommendation: 'Belum ada data siswa untuk dianalisis.',
    }));
  }

  // Sort students for upper and lower group segmentation
  const sortedStudents = [...students].sort((a, b) => b.totalScore - a.totalScore);
  
  // Kelley's 27% rule or split half if small sample
  let groupSize = Math.round(n * 0.27);
  if (groupSize < 2 && n >= 4) groupSize = Math.floor(n / 2);
  if (groupSize < 1) groupSize = 1;

  const upperGroup = sortedStudents.slice(0, groupSize);
  const lowerGroup = sortedStudents.slice(Math.max(0, n - groupSize));

  return questions.map((q) => {
    const num = q.number;
    const maxScore = q.maxScore || 1;

    // Sum of earned scores for all students
    let totalScore = 0;
    let correctCount = 0;

    // Distractor tracking for PG
    const distractorCounts: Record<string, { total: number; upper: number; lower: number }> = {
      A: { total: 0, upper: 0, lower: 0 },
      B: { total: 0, upper: 0, lower: 0 },
      C: { total: 0, upper: 0, lower: 0 },
      D: { total: 0, upper: 0, lower: 0 },
      Lainnya: { total: 0, upper: 0, lower: 0 },
    };

    students.forEach((st) => {
      const s = st.scores[num] || 0;
      totalScore += s;
      if (s >= maxScore) correctCount++;

      if (q.type === 'PG') {
        const resp = String(st.responses[num] || '').trim().toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(resp)) {
          distractorCounts[resp].total++;
        } else if (resp) {
          distractorCounts['Lainnya'].total++;
        }
      }
    });

    // Upper and Lower group breakdown
    let upperScoreSum = 0;
    upperGroup.forEach((st) => {
      const s = st.scores[num] || 0;
      upperScoreSum += s;
      if (q.type === 'PG') {
        const resp = String(st.responses[num] || '').trim().toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(resp)) distractorCounts[resp].upper++;
      }
    });

    let lowerScoreSum = 0;
    lowerGroup.forEach((st) => {
      const s = st.scores[num] || 0;
      lowerScoreSum += s;
      if (q.type === 'PG') {
        const resp = String(st.responses[num] || '').trim().toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(resp)) distractorCounts[resp].lower++;
      }
    });

    const upperMean = upperGroup.length > 0 ? upperScoreSum / upperGroup.length : 0;
    const lowerMean = lowerGroup.length > 0 ? lowerScoreSum / lowerGroup.length : 0;

    // Tingkat Kesukaran (P) = Mean / MaxScore
    // Standard Kemendikdasmen: 0.00 - 0.30 Sukar, 0.31 - 0.70 Sedang, 0.71 - 1.00 Mudah
    const difficultyIndex = Math.round((totalScore / (n * maxScore)) * 100) / 100;
    let difficultyCategory: 'Sukar' | 'Sedang' | 'Mudah' = 'Sedang';
    if (difficultyIndex < 0.30) {
      difficultyCategory = 'Sukar';
    } else if (difficultyIndex > 0.70) {
      difficultyCategory = 'Mudah';
    } else {
      difficultyCategory = 'Sedang';
    }

    // Daya Pembeda (D) = (UpperMean - LowerMean) / MaxScore
    const rawD = (upperMean - lowerMean) / maxScore;
    const discriminationIndex = Math.round(rawD * 100) / 100;

    let discriminationCategory: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Jelek' | 'Sangat Buruk';
    if (discriminationIndex >= 0.40) {
      discriminationCategory = 'Sangat Baik';
    } else if (discriminationIndex >= 0.30) {
      discriminationCategory = 'Baik';
    } else if (discriminationIndex >= 0.20) {
      discriminationCategory = 'Cukup';
    } else if (discriminationIndex >= 0.00) {
      discriminationCategory = 'Jelek';
    } else {
      discriminationCategory = 'Sangat Buruk';
    }

    // Item Status Recommendation Kemendikdasmen 2025
    let itemStatus: 'Diterima' | 'Direvisi' | 'Dibuang' = 'Diterima';
    let recommendation = '';

    if (discriminationIndex >= 0.30 && difficultyIndex >= 0.20 && difficultyIndex <= 0.85) {
      itemStatus = 'Diterima';
      recommendation = 'Butir soal berkualitas tinggi, diterima dan layak disimpan di Bank Soal.';
    } else if (discriminationIndex >= 0.20) {
      itemStatus = 'Direvisi';
      if (difficultyCategory === 'Sukar') {
        recommendation = 'Daya pembeda cukup, namun soal terlalu sukar. Perbaiki bahasa/kejelasan stimulus.';
      } else if (difficultyCategory === 'Mudah') {
        recommendation = 'Daya pembeda cukup, namun soal terlalu mudah. Tingkatkan kualitas pilihan pengecoh.';
      } else {
        recommendation = 'Daya pembeda memadai, periksa redaksi kalimat dan opsi jawaban.';
      }
    } else {
      itemStatus = 'Dibuang';
      if (discriminationIndex < 0) {
        recommendation = 'Daya pembeda negatif (kelompok bawah menjawab lebih benar). Kunci salah atau soal membingungkan. Buang/Ganti.';
      } else {
        recommendation = 'Daya pembeda jelek (tidak mampu membedakan kemampuan siswa). Sebaiknya diganti.';
      }
    }

    // Process distractors if PG
    let distractors: Record<string, DistractorDetail> | undefined = undefined;
    if (q.type === 'PG') {
      distractors = {};
      const keyUpper = String(q.key || '').trim().toUpperCase();

      ['A', 'B', 'C', 'D'].forEach((opt) => {
        const info = distractorCounts[opt];
        const pct = n > 0 ? Math.round((info.total / n) * 100) : 0;
        const isKey = opt === keyUpper;

        let status: 'Kunci' | 'Berfungsi' | 'Kurang Berfungsi' | 'Menyesatkan' = 'Kurang Berfungsi';
        if (isKey) {
          status = 'Kunci';
        } else if (pct >= 5 && info.lower >= info.upper) {
          status = 'Berfungsi';
        } else if (pct >= 5 && info.upper > info.lower) {
          status = 'Menyesatkan'; // Distractor confuses higher ability students
        } else {
          status = 'Kurang Berfungsi'; // Chosen by < 5%
        }

        distractors![opt] = {
          count: info.total,
          percentage: pct,
          upperCount: info.upper,
          lowerCount: info.lower,
          isKey,
          status,
        };
      });
    }

    return {
      number: num,
      type: q.type,
      key: q.key,
      maxScore,
      totalEarnedScore: totalScore,
      correctCount,
      difficultyIndex,
      difficultyCategory,
      upperMean: Math.round(upperMean * 100) / 100,
      lowerMean: Math.round(lowerMean * 100) / 100,
      discriminationIndex,
      discriminationCategory,
      itemStatus,
      distractors,
      recommendation,
    };
  });
}

/**
 * Computes class overall statistics
 */
export function calculateClassStatistics(
  students: StudentScore[],
  questions: QuestionConfig[],
  kktp: number
): ClassStatistics {
  const n = students.length;
  const maxTotalScore = questions.reduce((sum, q) => sum + (q.maxScore || 1), 0);

  if (n === 0) {
    return {
      studentCount: 0,
      maxGrade: 0,
      minGrade: 0,
      averageGrade: 0,
      passingCount: 0,
      remedialCount: 0,
      passingPercentage: 0,
      standardDeviation: 0,
      averageTotalScore: 0,
      maxTotalScore,
    };
  }

  const grades = students.map((s) => s.finalGrade);
  const totalScores = students.map((s) => s.totalScore);

  const maxGrade = Math.max(...grades);
  const minGrade = Math.min(...grades);
  const avgGrade = Math.round((grades.reduce((a, b) => a + b, 0) / n) * 10) / 10;
  const avgTotalScore = Math.round((totalScores.reduce((a, b) => a + b, 0) / n) * 10) / 10;

  const passingCount = students.filter((s) => s.finalGrade >= kktp).length;
  const remedialCount = n - passingCount;
  const passingPercentage = Math.round((passingCount / n) * 1000) / 10;

  // Standard Deviation
  const variance = grades.reduce((acc, val) => acc + Math.pow(val - avgGrade, 2), 0) / n;
  const standardDeviation = Math.round(Math.sqrt(variance) * 10) / 10;

  return {
    studentCount: n,
    maxGrade,
    minGrade,
    averageGrade: avgGrade,
    passingCount,
    remedialCount,
    passingPercentage,
    standardDeviation,
    averageTotalScore: avgTotalScore,
    maxTotalScore,
  };
}

/**
 * Generates realistic simulation data for instant demo
 */
export function generateDemoStudentScores(
  studentList: { nisn: string; name: string; gender: 'L' | 'P' }[],
  questions: QuestionConfig[],
  kktp: number
): StudentScore[] {
  const options = ['A', 'B', 'C', 'D'];

  const rawStudents: StudentScore[] = studentList.map((st, sIdx) => {
    const responses: Record<number, string | number> = {};
    // Ability factor: higher index slightly different ability to create realistic curve
    const ability = 0.45 + (Math.sin(sIdx * 0.6) + 1) * 0.25; // 0.45 to 0.95

    questions.forEach((q) => {
      const isCorrect = Math.random() < ability;

      if (q.type === 'PG') {
        const key = String(q.key || 'A').toUpperCase();
        if (isCorrect) {
          responses[q.number] = key;
        } else {
          const wrongOptions = options.filter((o) => o !== key);
          responses[q.number] = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        }
      } else if (q.type === 'BS') {
        const key = String(q.key || 'B').toUpperCase();
        if (isCorrect) {
          responses[q.number] = key;
        } else {
          responses[q.number] = key === 'B' ? 'S' : 'B';
        }
      } else if (q.type === 'PGK' || q.type === 'JODOH' || q.type === 'ISIAN') {
        if (isCorrect) {
          responses[q.number] = q.maxScore;
        } else {
          // partial or 0
          responses[q.number] = Math.random() > 0.5 ? Math.max(0, q.maxScore - 1) : 0;
        }
      } else {
        // URAIAN
        if (isCorrect) {
          responses[q.number] = q.maxScore;
        } else {
          responses[q.number] = Math.floor(Math.random() * q.maxScore);
        }
      }
    });

    return {
      id: `std-${sIdx + 1}`,
      nisn: st.nisn,
      name: st.name,
      gender: st.gender,
      responses,
      scores: {},
      totalScore: 0,
      finalGrade: 0,
      isPassing: false,
    };
  });

  return calculateStudentScores(rawStudents, questions, kktp);
}
