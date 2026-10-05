import { AssessmentMeta, QuestionConfig, StudentScore, SchoolIdentity } from '../types/anabus';

/**
 * Generates a complete standalone 1-file HTML with Tailwind CDN, embedded icons,
 * and full reactive data so teachers can run ANABUS 105285 offline anywhere.
 */
export function generateStandaloneHtml(
  school: SchoolIdentity,
  meta: AssessmentMeta,
  questions: QuestionConfig[],
  students: StudentScore[],
  developerPhotoUrl: string
): string {
  const serializedData = JSON.stringify({
    school,
    meta,
    questions,
    students,
    developerPhotoUrl,
  }).replace(/</g, '\\u003c');

  const isMultiSheet = questions.length > 25;
  const chunk1 = isMultiSheet ? questions.slice(0, 25) : questions;
  const chunk2 = isMultiSheet ? questions.slice(25) : [];

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ANABUS 105285 - Standalone 1 File Final</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .glass-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.7);
    }
    /* ANTI-HITAM PRINT CSS V3 */
    @media print {
      @page {
        size: A4 landscape;
        margin: 10mm !important;
      }
      html, body {
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #000000 !important;
        font-size: 7.5pt !important;
        line-height: 1.2 !important;
        margin: 0 !important;
        padding: 0 !important;
        zoom: 0.85 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print { display: none !important; }
      #printArea {
        display: block !important;
        width: 100% !important;
        background: #ffffff !important;
        color: #000000 !important;
      }
      #printArea .header-laporan {
        display: block !important;
        font-size: 14pt !important;
        margin-bottom: 15px !important;
        text-align: center !important;
      }
      table {
        font-size: 9pt !important;
      }
      .pengesahan {
        display: flex !important;
        justify-content: space-between !important;
        page-break-inside: avoid !important;
      }
      #printArea table,
      #printArea thead,
      #printArea tbody,
      #printArea tr,
      #printArea th,
      #printArea td {
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #000000 !important;
        border: 1px solid #000000 !important;
      }
      #printArea th {
        background-color: #f3f4f6 !important;
        font-weight: bold !important;
      }
      .page-break-after {
        page-break-after: always !important;
        break-after: page !important;
      }
    }
  </style>
</head>
<body class="bg-gradient-to-br from-sky-50 via-indigo-50/40 to-slate-100 min-h-screen text-slate-800">
  <div id="offlineApp">
    <!-- Notice Banner -->
    <div class="no-print bg-sky-600 text-white text-xs py-2 px-4 flex justify-between items-center shadow">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-semibold">ANABUS 105285 (Versi 1 File Mandiri Offline)</span>
        <span class="opacity-75">| UPT SPF SD Inpres 105285 Tandam Hilir I</span>
      </div>
      <div class="flex gap-2">
        <button onclick="cetakDokumen()" class="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-bold transition">Cetak Laporan (Ctrl+P)</button>
        <button onclick="bukaModalKeluar()" style="background-color: #dc3545;" class="px-3 py-1 rounded text-xs font-bold text-white shadow hover:brightness-110 transition flex items-center gap-1 cursor-pointer">
          <span>🚪</span> <span>Keluar Sistem</span>
        </button>
      </div>
    </div>

    <!-- Modal Konfirmasi Keluar Sistem -->
    <div id="modalKeluar" class="no-print hidden fixed inset-0 z-50 items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-rose-100 text-center space-y-4">
        <div class="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-3xl mx-auto shadow-inner border border-rose-100">
          🚪
        </div>
        <h3 class="text-base sm:text-lg font-bold text-slate-900">
          Konfirmasi Keluar Sistem
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Data akan disimpan otomatis sebelum keluar. Yakin ingin keluar?
        </p>
        <div class="flex gap-2.5 pt-2">
          <button type="button" onclick="tutupModalKeluar()" class="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer">
            BATAL
          </button>
          <button type="button" onclick="konfirmasiKeluar()" style="background-color: #dc3545;" class="flex-1 py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer">
            YA, SIMPAN & KELUAR
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div id="toastNotification" class="no-print hidden fixed bottom-6 right-6 z-50 bg-slate-900/90 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold backdrop-blur-md border border-slate-700">
      Data berhasil disimpan!
    </div>

    <!-- Main Container -->
    <div class="no-print max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div class="glass-card rounded-2xl p-6 shadow-xl border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-sky-100 overflow-hidden">
            ${developerPhotoUrl ? `<img src="${developerPhotoUrl}" class="w-full h-full object-cover">` : '105'}
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">ANABUS 105285</h1>
            <p class="text-xs text-sky-700 font-semibold">${school.schoolName} - ${school.subdistrict}</p>
            <p class="text-xs text-slate-500 italic mt-0.5">"Mudahkanlah bagimu kesulitan orang lain, maka Allah akan memudahkan kesulitanmu"</p>
          </div>
        </div>
        <div class="text-right text-xs">
          <span class="inline-block bg-sky-100 text-sky-800 px-3 py-1 rounded-full font-bold">Kemendikdasmen 2025</span>
          <p class="text-slate-500 mt-1">Pengembang: <b>${school.teacherName}</b></p>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6 shadow-xl space-y-4">
        <div class="flex justify-between items-center border-b pb-3">
          <h2 class="font-bold text-lg text-slate-800">Pratinjau Hasil & Cetak Cepat V3</h2>
          <button onclick="cetakDokumen()" class="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md transition flex items-center gap-2">
            🖨️ Cetak A4 Landscape (Anti-Hitam)
          </button>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          File ini adalah versi mandiri portabel 1 file untuk guru. Skala cetak 85% otomatis memuat soal 1-50 ke dalam 2 halaman secara presisi tanpa blok hitam.
        </p>
      </div>
    </div>

    <!-- Print Area V3 -->
    <div id="printArea" class="p-4 md:p-6 bg-white max-w-7xl mx-auto" style="zoom: 0.85;">
      <!-- Halaman 1 -->
      <div class="${isMultiSheet ? 'page-break-after pb-4' : 'pb-4'}">
        <!-- Header Laporan Sesuai Standar Cetak Maksimal -->
        <div class="header-laporan text-center mb-[15px]" style="text-align: center; margin-bottom: 15px;">
          <div style="font-size: 14px; font-weight: bold;" class="text-[14px] font-bold uppercase tracking-wide text-black">
            LAPORAN ANALISIS BUTIR SOAL
          </div>
          <div style="font-size: 12px; font-weight: 600;" class="text-[12px] font-semibold uppercase text-black mt-0.5">
            UPT SPF SD INPRES 105285 TANDAM HILIR I
          </div>
          <div style="font-size: 10px;" class="text-[10px] text-slate-600 italic">
            ${school.address}, ${school.subdistrict}, ${school.district} • NPSN: ${school.npsn}
          </div>
          <div style="font-size: 10.5px;" class="text-[10.5px] font-medium text-slate-800 mt-0.5">
            ${meta.assessmentName} • Tahun Ajaran ${meta.academicYear} (Semester ${meta.semester})
          </div>
          <div class="border-b-2 border-black mt-2 w-full"></div>
        </div>

        <!-- Identity Grid -->
        <table class="w-full text-[7.5pt] mb-2 border-none" style="border:none !important;">
          <tr style="border:none !important;"><td style="border:none !important; width:15%;">Mata Pelajaran</td><td style="border:none !important;">: <b>${meta.subject}</b></td><td style="border:none !important; width:15%;">Jumlah Soal</td><td style="border:none !important;">: <b>${questions.length} Butir</b></td></tr>
          <tr style="border:none !important;"><td style="border:none !important;">Kelas / Paralel</td><td style="border:none !important;">: <b>${meta.classTarget}</b></td><td style="border:none !important;">Kriteria KKTP</td><td style="border:none !important;">: <b>${meta.kktp}</b></td></tr>
          <tr style="border:none !important;"><td style="border:none !important;">Guru Pengampu</td><td style="border:none !important;">: <b>${school.teacherName}</b></td><td style="border:none !important;">Tanggal Analisis</td><td style="border:none !important;">: ${meta.assessmentDate}</td></tr>
        </table>

        <!-- Table Sheet 1 (Soal 1 s.d. 25) -->
        <div class="mb-2">
          <div class="font-bold text-[8pt] mb-1 flex justify-between">
            <span>${isMultiSheet ? `HALAMAN 1: MATRIKS RESPON SISWA & BUTIR SOAL NO. 1 s.d. ${chunk1.length}` : `MATRIKS RESPON SISWA & BUTIR SOAL NO. 1 s.d. ${chunk1.length}`}</span>
            <span>${isMultiSheet ? `Sub 1: Maks ${chunk1.reduce((sum, q) => sum + (q.maxScore || 1), 0)} Poin` : `Total Maks: ${chunk1.reduce((sum, q) => sum + (q.maxScore || 1), 0)} Poin`}</span>
          </div>
          <table class="w-full text-center border-collapse border border-black text-[7pt]">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-black p-0.5 w-6">No</th>
                <th class="border border-black p-0.5 text-left min-w-[130px] max-w-[150px]">Nama Siswa</th>
                <th class="border border-black p-0.5 w-5">L/P</th>
                ${chunk1.map(q => `<th class="border border-black p-0.5 min-w-[18px]"><div>${q.number}</div><div class="text-[5.5pt] font-normal uppercase">${q.type}</div></th>`).join('')}
                <th class="border border-black p-0.5 w-8 bg-sky-50 font-bold">${isMultiSheet ? 'Sub 1' : 'Total'}</th>
                ${!isMultiSheet ? '<th class="border border-black p-0.5 w-10 font-bold">Nilai</th><th class="border border-black p-0.5 w-12 font-bold">Status</th>' : ''}
              </tr>
              <tr class="bg-gray-50 text-[6.5pt]">
                <th colspan="3" class="border border-black text-right pr-1 font-bold">Kunci & Bobot:</th>
                ${chunk1.map(q => `<th class="border border-black p-0.5"><div>${q.key}</div><div class="text-[5.5pt]">(${q.maxScore}p)</div></th>`).join('')}
                <th class="border border-black p-0.5 font-bold">${chunk1.reduce((sum, q) => sum + (q.maxScore || 1), 0)}</th>
                ${!isMultiSheet ? '<th class="border border-black">100</th><th class="border border-black">≥ ' + meta.kktp + '</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${students.map((st, idx) => {
                const subScore = chunk1.reduce((sum, q) => sum + (st.scores[q.number] || 0), 0);
                return `
                <tr>
                  <td class="border border-black py-0.5 px-1">${idx + 1}</td>
                  <td class="border border-black py-0.5 px-1 text-left font-medium truncate max-w-[140px]">${st.name}</td>
                  <td class="border border-black py-0.5 px-0.5">${st.gender}</td>
                  ${chunk1.map(q => {
                    const sc = st.scores[q.number] || 0;
                    return `<td class="border border-black p-0.5 ${sc > 0 ? 'font-semibold' : 'text-gray-400'}">${st.responses[q.number] ?? sc}</td>`;
                  }).join('')}
                  <td class="border border-black py-0.5 px-1 font-bold bg-sky-50">${isMultiSheet ? subScore : st.totalScore}</td>
                  ${!isMultiSheet ? `<td class="border border-black py-0.5 px-1 font-bold">${st.finalGrade}</td><td class="border border-black py-0.5 px-1 font-bold text-[6.5pt]">${st.isPassing ? 'TUNTAS' : 'REMEDIAL'}</td>` : ''}
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      ${isMultiSheet ? `
      <!-- Halaman 2 (Soal 26 s.d. N) -->
      <div class="pt-2 avoid-break-inside">
        <!-- Header Lanjutan Halaman 2 -->
        <div class="header-laporan text-center mb-[15px]" style="text-align: center; margin-bottom: 15px;">
          <div style="font-size: 14px; font-weight: bold;" class="text-[14px] font-bold uppercase tracking-wide text-black">
            LAPORAN ANALISIS BUTIR SOAL (LEMBAR 2)
          </div>
          <div style="font-size: 12px; font-weight: 600;" class="text-[12px] font-semibold uppercase text-black mt-0.5">
            UPT SPF SD INPRES 105285 TANDAM HILIR I
          </div>
          <div style="font-size: 10.5px;" class="text-[10.5px] text-slate-700">
            Mata Pelajaran: <b>${meta.subject}</b> | Kelas: <b>${meta.classTarget}</b> | Butir Soal No. 26 s.d. ${questions.length}
          </div>
          <div class="border-b-2 border-black mt-2 w-full"></div>
        </div>
        <table class="w-full text-center border-collapse border border-black text-[7pt] mb-3">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-black p-0.5 w-6">No</th>
              <th class="border border-black p-0.5 text-left min-w-[130px] max-w-[150px]">Nama Siswa</th>
              ${chunk2.map(q => `<th class="border border-black p-0.5 min-w-[18px]"><div>${q.number}</div><div class="text-[5.5pt] font-normal uppercase">${q.type}</div></th>`).join('')}
              <th class="border border-black p-0.5 w-8 bg-sky-50 font-bold">Sub 2</th>
              <th class="border border-black p-0.5 w-8 bg-indigo-50 font-bold">Total</th>
              <th class="border border-black p-0.5 w-10 bg-emerald-50 font-black">Nilai</th>
              <th class="border border-black p-0.5 w-12 font-bold">Status</th>
            </tr>
            <tr class="bg-gray-50 text-[6.5pt]">
              <th colSpan="2" class="border border-black text-right pr-1 font-bold">Kunci & Bobot:</th>
              ${chunk2.map(q => `<th class="border border-black p-0.5"><div>${q.key}</div><div class="text-[5.5pt]">(${q.maxScore}p)</div></th>`).join('')}
              <th class="border border-black p-0.5 font-bold">${chunk2.reduce((sum, q) => sum + (q.maxScore || 1), 0)}</th>
              <th class="border border-black p-0.5 font-bold">${questions.reduce((sum, q) => sum + (q.maxScore || 1), 0)}</th>
              <th class="border border-black p-0.5 font-bold">100</th>
              <th class="border border-black p-0.5 font-bold">≥ ${meta.kktp}</th>
            </tr>
          </thead>
          <tbody>
            ${students.map((st, idx) => {
              const sub2 = chunk2.reduce((sum, q) => sum + (st.scores[q.number] || 0), 0);
              return `
              <tr>
                <td class="border border-black py-0.5 px-1">${idx + 1}</td>
                <td class="border border-black py-0.5 px-1 text-left truncate max-w-[140px]">${st.name}</td>
                ${chunk2.map(q => {
                  const sc = st.scores[q.number] || 0;
                  return `<td class="border border-black p-0.5">${st.responses[q.number] ?? sc}</td>`;
                }).join('')}
                <td class="border border-black py-0.5 px-1 font-bold bg-sky-50">${sub2}</td>
                <td class="border border-black py-0.5 px-1 font-bold bg-indigo-50">${st.totalScore}</td>
                <td class="border border-black py-0.5 px-1 font-black ${st.finalGrade >= meta.kktp ? 'text-emerald-700' : 'text-rose-700'}">${st.finalGrade}</td>
                <td class="border border-black py-0.5 px-1 font-bold text-[6.5pt]">${st.isPassing ? 'TUNTAS' : 'REMEDIAL'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>` : ''}

      <!-- Lembar Pengesahan 3 Kolom -->
      <div class="pengesahan text-[8pt] mt-[40px]" style="display: flex; justify-content: space-between; text-align: center; margin-top: 40px; page-break-inside: avoid;">
        <div style="width: 35%; text-align: center; line-height: 1.4;">
          <p class="m-0">Mengetahui,</p>
          <p class="font-semibold m-0">Kepala UPT SPF SD Inpres 105285</p>
          <p class="m-0">Tandam Hilir I</p>
          <div style="height: 55px; line-height: 55px;">&nbsp;</div>
          <p class="font-bold underline uppercase m-0">${school.headmasterName}</p>
          <p class="m-0">NIP. ${school.headmasterNip}</p>
        </div>
        <div style="width: 30%;"></div>
        <div style="width: 35%; text-align: center; line-height: 1.4;">
          <p class="m-0">Tandam Hilir I, ${meta.assessmentDate}</p>
          <p class="font-semibold m-0">Guru Pengampu Asesmen,</p>
          <p class="invisible m-0">&nbsp;</p>
          <div style="height: 55px; line-height: 55px;">&nbsp;</div>
          <p class="font-bold underline uppercase m-0">${school.teacherName}</p>
          <p class="m-0">NIP. ${school.teacherNip}</p>
        </div>
      </div>
    </div>
  </div>
  <script>
    window.__ANABUS_DATA__ = ${serializedData};

    function cetakDokumen() {
      var printContent = document.getElementById('printArea');
      if (!printContent) {
        window.print();
        return;
      }

      var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cetak ANABUS 105285</title>' +
        '<style>' +
        '@page { size: A4 landscape; margin: 10mm !important; }' +
        '* { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }' +
        'html, body { background: #ffffff !important; background-color: #ffffff !important; color: #000000 !important; font-family: Arial, sans-serif !important; font-size: 7.5pt !important; line-height: 1.2 !important; margin: 0 !important; padding: 0 !important; zoom: 0.85 !important; }' +
        'table, thead, tbody, tr, th, td { background: #ffffff !important; background-color: #ffffff !important; color: #000000 !important; border: 1px solid #000000 !important; border-collapse: collapse !important; }' +
        'th { background-color: #f3f4f6 !important; font-weight: bold !important; }' +
        '.page-break-after { page-break-after: always !important; break-after: page !important; }' +
        '.avoid-break-inside { page-break-inside: avoid !important; break-inside: avoid !important; }' +
        '#printArea .header-laporan, .header-laporan { display: block !important; font-size: 14pt !important; margin-bottom: 15px !important; text-align: center !important; }' +
        'table { font-size: 9pt !important; }' +
        '.pengesahan { display: flex !important; justify-content: space-between !important; page-break-inside: avoid !important; }' +
        '@media print { @page { size: A4 landscape; margin: 10mm !important; } #printArea .header-laporan, .header-laporan { display: block !important; font-size: 14pt !important; margin-bottom: 15px !important; text-align: center !important; } table { font-size: 9pt !important; } .pengesahan { display: flex !important; justify-content: space-between !important; page-break-inside: avoid !important; } html, body, table, tr, td, th { background: #ffffff !important; color: #000000 !important; zoom: 0.85 !important; } }' +
        '</style></head><body>' +
        printContent.innerHTML +
        '</body></html>';

      var win = null;
      try {
        win = window.open('', '_blank', 'width=1100,height=800');
      } catch (e) {
        win = null;
      }

      if (win && win.document) {
        win.document.open();
        win.document.write(html);
        win.document.close();
        setTimeout(function() {
          win.focus();
          win.print();
        }, 350);
      } else {
        window.print();
      }
    }

    function saveAllData(showToast) {
      try {
        localStorage.setItem('anabus_105285_data', JSON.stringify(window.__ANABUS_DATA__));
        if (showToast) {
          var toast = document.getElementById('toastNotification');
          if (toast) {
            toast.classList.remove('hidden');
            setTimeout(function() {
              toast.classList.add('hidden');
            }, 1000);
          }
        }
      } catch (e) {
        console.error('Auto-save error', e);
      }
    }

    // Auto-save setiap 30 detik
    setInterval(function() {
      saveAllData(false);
    }, 30000);

    function bukaModalKeluar() {
      var modal = document.getElementById('modalKeluar');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
    }

    function tutupModalKeluar() {
      var modal = document.getElementById('modalKeluar');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    }

    function konfirmasiKeluar() {
      saveAllData(true);
      setTimeout(function() {
        tutupModalKeluar();
        try {
          window.close();
        } catch (e) {}
        try {
          window.location.href = '/login';
        } catch (e) {}
      }, 1000);
    }
  </script>
</body>
</html>`;
}
