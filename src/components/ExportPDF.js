'use client';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ExportPDF({ patients }) {
  const [loading, setLoading] = useState(false);

  const exportPDF = () => {
    setLoading(true);

    const doc = new jsPDF({ orientation: 'landscape' });

    // ── Header ──
    doc.setFillColor(8, 8, 8);
    doc.rect(0, 0, 297, 40, 'F');

    doc.setTextColor(201, 168, 76);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('MediChain', 14, 18);

    doc.setTextColor(245, 240, 232);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Blockchain Rumah Sakit — Laporan Data Pasien', 14, 27);

    doc.setTextColor(122, 117, 112);
    doc.setFontSize(8);
    doc.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, 14, 34);
    doc.text(`Total Pasien: ${patients.length}`, 200, 34);

    // ── Summary Stats ──
    const normal       = patients.filter(p => p.hasilTest === 'Normal').length;
    const abnormal     = patients.filter(p => p.hasilTest === 'Abnormal').length;
    const inconclusive = patients.filter(p => p.hasilTest === 'Inconclusive').length;
    const totalBiaya   = patients.reduce((a, p) => a + parseFloat(p.biaya || 0), 0);

    doc.setFillColor(17, 17, 17);
    doc.rect(0, 40, 297, 20, 'F');

    doc.setTextColor(122, 117, 112);
    doc.setFontSize(7);
    doc.text('TOTAL PASIEN',  14, 48);
    doc.text('NORMAL',        70, 48);
    doc.text('ABNORMAL',     120, 48);
    doc.text('INCONCLUSIVE', 170, 48);
    doc.text('TOTAL BIAYA',  220, 48);

    doc.setTextColor(201, 168, 76);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${patients.length}`,                    14, 56);
    doc.text(`${normal}`,                             70, 56);
    doc.text(`${abnormal}`,                          120, 56);
    doc.text(`${inconclusive}`,                      170, 56);
    doc.text(`$${Math.round(totalBiaya).toLocaleString()}`, 220, 56);

    // ── Table ──
    autoTable(doc, {
      startY     : 65,
      head       : [[
        '#', 'Nama', 'Usia', 'Gender', 'Gol. Darah',
        'Kondisi', 'Masuk', 'Keluar', 'Dokter',
        'Hasil Test', 'Biaya (USD)',
      ]],
      body: patients.map((p, i) => [
        i + 1,
        p.nama,
        p.umur,
        p.jenisKelamin,
        p.golonganDarah,
        p.kondisiMedis,
        p.tanggalMasuk,
        p.tanggalKeluar,
        p.dokter,
        p.hasilTest,
        `$${parseFloat(p.biaya || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      ]),
      styles: {
        fontSize : 7.5,
        cellPadding: 3,
        textColor: [245, 240, 232],
        fillColor: [17, 17, 17],
        lineColor: [42, 42, 42],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor  : [8, 8, 8],
        textColor  : [201, 168, 76],
        fontStyle  : 'bold',
        fontSize   : 7,
        lineColor  : [42, 42, 42],
        lineWidth  : 0.1,
      },
      alternateRowStyles: {
        fillColor: [24, 24, 24],
      },
      columnStyles: {
        0 : { cellWidth: 8,  halign: 'center' },
        1 : { cellWidth: 35 },
        2 : { cellWidth: 10, halign: 'center' },
        3 : { cellWidth: 14, halign: 'center' },
        4 : { cellWidth: 16, halign: 'center' },
        5 : { cellWidth: 22 },
        6 : { cellWidth: 20, halign: 'center' },
        7 : { cellWidth: 20, halign: 'center' },
        8 : { cellWidth: 35 },
        9 : { cellWidth: 22, halign: 'center' },
        10: { cellWidth: 25, halign: 'right'  },
      },
      didDrawCell: (hookData) => {
        // Warna badge hasil test
        if (hookData.column.index === 9 && hookData.section === 'body') {
          const val = hookData.cell.text[0];
          if (val === 'Normal')
            doc.setTextColor(76, 175, 118);
          else if (val === 'Abnormal')
            doc.setTextColor(207, 74, 74);
          else
            doc.setTextColor(201, 168, 76);
        }
      },
    });

    // ── Footer ──
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setTextColor(42, 42, 42);
      doc.setFontSize(7);
      doc.text(
        `MediChain — Universitas Muhammadiyah Ponorogo | Halaman ${i} dari ${pageCount}`,
        14,
        doc.internal.pageSize.height - 8
      );
    }

    doc.save(`MediChain-Laporan-Pasien-${new Date().toISOString().split('T')[0]}.pdf`);
    setLoading(false);
  };

  return (
    <button
      onClick={exportPDF}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg border border-[#C9A84C] px-5 py-2.5 text-xs font-medium tracking-widest uppercase text-[#C9A84C] transition-all hover:bg-[rgba(201,168,76,0.1)] disabled:opacity-50"
    >
      <span>{loading ? '⏳' : '↓'}</span>
      {loading ? 'Generating PDF...' : 'Export PDF'}
    </button>
  );
}