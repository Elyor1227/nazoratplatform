import PDFDocument from 'pdfkit';

/**
 * Hisobot PDF ni response oqimiga yozadi (pipe tartibi: avval pipe, keyin kontent, end).
 */
export function pipeReportPdf(res, report, companyLabel) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  doc.info.Title = 'Qurilish hisobot';

  doc.pipe(res);

  doc.fontSize(18).text('Qurilish korxonasi hisoboti', { align: 'center' });
  doc.moveDown(0.4);
  doc.fontSize(10).fillColor('#555555').text(`Davr: ${report.periodMonth} / ${report.periodYear}`, {
    align: 'center',
  });
  doc.moveDown(1.2);
  doc.fillColor('#000000').fontSize(11);

  const rows = [
    ['Korxona', companyLabel || '—'],
    ['Xodimlar soni', String(report.employeeCount)],
    ['Ish haqi fondi (so‘m)', formatNum(report.payrollFund)],
    ['Shartnoma summasi (so‘m)', formatNum(report.contractAmount)],
    ['Qurilish turi', String(report.constructionType || '—')],
    ['Izoh', String(report.notes || '—')],
  ];

  rows.forEach(([k, v]) => {
    doc.font('Helvetica-Bold').text(`${k}:`, { continued: true });
    doc.font('Helvetica').text(` ${v}`);
    doc.moveDown(0.35);
  });

  if (report.invoices?.length) {
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(12).text('Fakturalar');
    doc.font('Helvetica').fontSize(10);
    report.invoices.forEach((inv, i) => {
      doc.text(`${i + 1}. ${inv.fileName}`, { indent: 10 });
    });
  }

  doc.moveDown(1);
  doc.fontSize(9).fillColor('#888888').text(`Yaratilgan: ${new Date().toISOString().slice(0, 10)}`, {
    align: 'right',
  });

  doc.end();
}

function formatNum(n) {
  if (n == null || Number.isNaN(Number(n))) return '—';
  return Number(n).toLocaleString('uz-UZ');
}
