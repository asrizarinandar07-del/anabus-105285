/**
 * Utility for printing #printArea via a new window with strict white background CSS
 * and anti-hitam enforcement.
 */

export function cetakDokumen(): void {
  const printArea = document.getElementById('printArea');
  if (!printArea) {
    window.print();
    return;
  }

  const printContent = printArea.innerHTML;

  // Strict anti-black, pure white background CSS template for A4 Landscape
  const printDoc = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cetak Dokumen ANABUS 105285 - V3 A4 Landscape</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm !important;
    }

    /* ANTI-HITAM TOTAL: Paksa semua background jadi putih !important */
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      background-image: none !important;
      text-shadow: none !important;
      box-shadow: none !important;
    }

    html, body {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background-color: #ffffff !important;
      background: #ffffff !important;
      color: #000000 !important;
      font-family: 'Plus Jakarta Sans', Arial, Helvetica, sans-serif !important;
      font-size: 7.5pt !important;
      line-height: 1.2 !important;
      zoom: 0.85 !important; /* Scale default 85 agar tabel 1-50 muat 2 halaman */
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Fallback jika browser tidak mendukung zoom pada print */
    @supports not (zoom: 0.85) {
      body {
        transform: scale(0.85);
        transform-origin: top left;
        width: 117.6% !important;
      }
    }

    /* Semua tabel, baris, cell dipaksa background putih dan border hitam */
    table, thead, tbody, tfoot, tr, th, td {
      background-color: #ffffff !important;
      background: #ffffff !important;
      color: #000000 !important;
      border: 1px solid #111111 !important;
      border-collapse: collapse !important;
    }

    th {
      background-color: #f3f4f6 !important;
      background: #f3f4f6 !important;
      font-weight: 700 !important;
    }

    .border-none, [style*="border:none"], [style*="border: none"] {
      border: none !important;
    }

    table[style*="border:none"] td,
    table[style*="border: none"] td,
    table[style*="border:none"] tr,
    table[style*="border: none"] tr {
      border: none !important;
    }

    .page-break-after {
      page-break-after: always !important;
      break-after: page !important;
    }

    .avoid-break-inside {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    /* Header Laporan & Table Font Size */
    #printArea .header-laporan,
    .header-laporan {
      display: block !important;
      font-size: 14pt !important;
      margin-bottom: 15px !important;
      text-align: center !important;
    }

    table {
      font-size: 9pt !important;
    }

    /* Pengesahan 3 Kolom */
    .pengesahan {
      display: flex !important;
      justify-content: space-between !important;
      text-align: center !important;
      margin-top: 40px !important;
      page-break-inside: avoid !important;
    }

    @media print {
      @page {
        size: A4 landscape;
        margin: 10mm !important;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        zoom: 0.85 !important;
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #000000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      #printArea .header-laporan,
      .header-laporan {
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
      table, tr, td, th {
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #000000 !important;
        border: 1px solid #000000 !important;
      }
      th {
        background-color: #f3f4f6 !important;
        background: #f3f4f6 !important;
      }
    }
  </style>
</head>
<body>
  <div style="background:#ffffff !important; color:#000000 !important; width:100% !important;">
    ${printContent}
  </div>
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;

  // 1. Coba buka window baru
  let printWindow: Window | null = null;
  try {
    printWindow = window.open('', '_blank', 'width=1150,height=850,top=40,left=40');
  } catch (err) {
    printWindow = null;
  }

  if (printWindow && printWindow.document) {
    printWindow.document.open();
    printWindow.document.write(printDoc);
    printWindow.document.close();

    // Fallback timer trigger in case onload was instantaneous
    setTimeout(() => {
      try {
        printWindow?.focus();
        printWindow?.print();
      } catch (e) {
        console.warn('Direct print window trigger:', e);
      }
    }, 450);
  } else {
    // 2. Fallback jika popup window diblokir oleh browser / iframe iFrame environment
    let hiddenIframe = document.getElementById('anabus_print_frame') as HTMLIFrameElement;
    if (!hiddenIframe) {
      hiddenIframe = document.createElement('iframe');
      hiddenIframe.id = 'anabus_print_frame';
      hiddenIframe.style.position = 'fixed';
      hiddenIframe.style.right = '0';
      hiddenIframe.style.bottom = '0';
      hiddenIframe.style.width = '0px';
      hiddenIframe.style.height = '0px';
      hiddenIframe.style.border = '0';
      hiddenIframe.style.zIndex = '-9999';
      document.body.appendChild(hiddenIframe);
    }

    const frameDoc = hiddenIframe.contentWindow?.document || hiddenIframe.contentDocument;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(printDoc);
      frameDoc.close();

      setTimeout(() => {
        try {
          hiddenIframe.contentWindow?.focus();
          hiddenIframe.contentWindow?.print();
        } catch (e) {
          window.print();
        }
      }, 500);
    } else {
      window.print();
    }
  }
}

// Expose cetakDokumen ke window global agar onclick="cetakDokumen()" dapat dipanggil dari mana saja
if (typeof window !== 'undefined') {
  (window as unknown as { cetakDokumen: () => void }).cetakDokumen = cetakDokumen;
}
