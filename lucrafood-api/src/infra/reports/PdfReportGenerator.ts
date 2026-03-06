import PDFDocument from 'pdfkit';
import { GetMonthlyReportUseCase } from '@application/usecases/reports/GetMonthlyReportUseCase';

const COLORS = {
  primary: '#059669',
  primaryLight: '#10B981',
  dark: '#111827',
  gray600: '#4B5563',
  gray400: '#9CA3AF',
  gray200: '#E5E7EB',
  gray50: '#F9FAFB',
  white: '#FFFFFF',
  red: '#EF4444',
  green: '#10B981',
};

const FONT_SIZES = {
  title: 22,
  subtitle: 14,
  sectionTitle: 13,
  body: 9.5,
  small: 8,
  kpiValue: 20,
  kpiLabel: 8,
};

export class PdfReportGenerator {
  static generate(report: GetMonthlyReportUseCase.Output): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 40, bottom: 40, left: 48, right: 48 },
        bufferPages: true,
        info: {
          Title: `Relatorio Mensal - ${report.monthLabel}`,
          Author: 'LucraFood',
          Subject: 'Relatorio Financeiro Mensal',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

      this.drawHeader(doc, report, pageWidth);
      this.drawKPICards(doc, report, pageWidth);
      this.drawIngredientCostsTable(doc, report, pageWidth);
      this.drawProductFinancialsTable(doc, report, pageWidth);
      this.drawFooter(doc, report);

      doc.end();
    });
  }

  private static drawHeader(doc: PDFKit.PDFDocument, report: GetMonthlyReportUseCase.Output, pageWidth: number) {
    const startY = doc.y;

    doc.save();
    doc.rect(doc.page.margins.left - 8, startY - 8, pageWidth + 16, 56)
      .fill(COLORS.primary);

    doc.fontSize(24).font('Helvetica-Bold').fillColor(COLORS.white)
      .text('LucraFood', doc.page.margins.left, startY, { continued: false });

    doc.fontSize(FONT_SIZES.subtitle).font('Helvetica').fillColor(COLORS.white)
      .text(`Relatorio Financeiro Mensal`, doc.page.margins.left, startY + 28);

    doc.fontSize(FONT_SIZES.subtitle).font('Helvetica-Bold').fillColor(COLORS.white)
      .text(report.monthLabel, doc.page.margins.left + pageWidth - 150, startY + 10, {
        width: 150,
        align: 'right',
      });

    doc.restore();
    doc.y = startY + 68;
  }

  private static drawKPICards(doc: PDFKit.PDFDocument, report: GetMonthlyReportUseCase.Output, pageWidth: number) {
    const { summary } = report;
    const cardWidth = (pageWidth - 24) / 4;
    const cardHeight = 64;
    const startX = doc.page.margins.left;
    const startY = doc.y;

    const kpis = [
      { label: 'Custo Total Compras', value: this.formatCurrency(summary.totalPurchaseCost), color: COLORS.red },
      { label: 'Custo Producao', value: this.formatCurrency(summary.totalProductionCost), color: COLORS.gray600 },
      { label: 'Lucro Bruto Total', value: this.formatCurrency(summary.totalGrossProfit), color: summary.totalGrossProfit >= 0 ? COLORS.green : COLORS.red },
      { label: 'Margem Media', value: `${summary.avgProfitMargin.toFixed(1)}%`, color: summary.avgProfitMargin >= 30 ? COLORS.green : COLORS.red },
    ];

    kpis.forEach((kpi, i) => {
      const x = startX + i * (cardWidth + 8);

      doc.save();
      doc.roundedRect(x, startY, cardWidth, cardHeight, 6).fill(COLORS.gray50);
      doc.roundedRect(x, startY, cardWidth, 3, 1).fill(kpi.color);
      doc.restore();

      doc.fontSize(FONT_SIZES.kpiLabel).font('Helvetica').fillColor(COLORS.gray400)
        .text(kpi.label.toUpperCase(), x + 10, startY + 12, { width: cardWidth - 20 });

      doc.fontSize(FONT_SIZES.kpiValue).font('Helvetica-Bold').fillColor(kpi.color)
        .text(kpi.value, x + 10, startY + 28, { width: cardWidth - 20 });
    });

    doc.y = startY + cardHeight + 20;
  }

  private static drawSectionTitle(doc: PDFKit.PDFDocument, title: string) {
    const y = doc.y;
    doc.save();
    doc.rect(doc.page.margins.left, y, 3, 16).fill(COLORS.primary);
    doc.restore();

    doc.fontSize(FONT_SIZES.sectionTitle).font('Helvetica-Bold').fillColor(COLORS.dark)
      .text(title, doc.page.margins.left + 12, y + 1);

    doc.y = y + 24;
  }

  private static drawIngredientCostsTable(doc: PDFKit.PDFDocument, report: GetMonthlyReportUseCase.Output, pageWidth: number) {
    if (report.ingredientCosts.length === 0) return;

    this.drawSectionTitle(doc, 'Custos por Ingrediente');

    const cols = [
      { label: 'Ingrediente', width: pageWidth * 0.45, align: 'left' as const },
      { label: 'Compras', width: pageWidth * 0.15, align: 'center' as const },
      { label: 'Total Gasto', width: pageWidth * 0.20, align: 'right' as const },
      { label: '% do Total', width: pageWidth * 0.20, align: 'right' as const },
    ];

    const totalSpent = report.ingredientCosts.reduce((s, c) => s + c.totalSpent, 0);

    this.drawTableHeader(doc, cols, pageWidth);

    report.ingredientCosts.forEach((item, i) => {
      if (doc.y > doc.page.height - 80) {
        doc.addPage();
        this.drawTableHeader(doc, cols, pageWidth);
      }

      const rowY = doc.y;
      const bgColor = i % 2 === 0 ? COLORS.white : COLORS.gray50;

      doc.save();
      doc.rect(doc.page.margins.left, rowY, pageWidth, 20).fill(bgColor);
      doc.restore();

      let x = doc.page.margins.left + 8;

      doc.fontSize(FONT_SIZES.body).font('Helvetica').fillColor(COLORS.dark)
        .text(item.ingredientName, x, rowY + 5, { width: cols[0].width - 16 });

      x += cols[0].width;
      doc.text(String(item.purchaseCount), x, rowY + 5, { width: cols[1].width, align: 'center' });

      x += cols[1].width;
      doc.text(this.formatCurrency(item.totalSpent), x, rowY + 5, { width: cols[2].width - 8, align: 'right' });

      x += cols[2].width;
      const pct = totalSpent > 0 ? ((item.totalSpent / totalSpent) * 100).toFixed(1) : '0.0';
      doc.text(`${pct}%`, x, rowY + 5, { width: cols[3].width - 8, align: 'right' });

      doc.y = rowY + 20;
    });

    doc.y += 16;
  }

  private static drawProductFinancialsTable(doc: PDFKit.PDFDocument, report: GetMonthlyReportUseCase.Output, pageWidth: number) {
    if (report.productFinancials.length === 0) return;

    if (doc.y > doc.page.height - 140) {
      doc.addPage();
    }

    this.drawSectionTitle(doc, 'Financeiro por Produto');

    const cols = [
      { label: 'Produto', width: pageWidth * 0.28, align: 'left' as const },
      { label: 'Preco Venda', width: pageWidth * 0.16, align: 'right' as const },
      { label: 'Custo Unit.', width: pageWidth * 0.16, align: 'right' as const },
      { label: 'Lucro Bruto', width: pageWidth * 0.16, align: 'right' as const },
      { label: 'Margem', width: pageWidth * 0.24, align: 'right' as const },
    ];

    this.drawTableHeader(doc, cols, pageWidth);

    report.productFinancials.forEach((item, i) => {
      if (doc.y > doc.page.height - 80) {
        doc.addPage();
        this.drawTableHeader(doc, cols, pageWidth);
      }

      const rowY = doc.y;
      const bgColor = i % 2 === 0 ? COLORS.white : COLORS.gray50;

      doc.save();
      doc.rect(doc.page.margins.left, rowY, pageWidth, 20).fill(bgColor);
      doc.restore();

      let x = doc.page.margins.left + 8;

      doc.fontSize(FONT_SIZES.body).font('Helvetica').fillColor(COLORS.dark)
        .text(item.productName, x, rowY + 5, { width: cols[0].width - 16 });

      x += cols[0].width;
      doc.text(this.formatCurrency(item.salePrice), x, rowY + 5, { width: cols[1].width - 8, align: 'right' });

      x += cols[1].width;
      doc.text(this.formatCurrency(item.unitCost), x, rowY + 5, { width: cols[2].width - 8, align: 'right' });

      x += cols[2].width;
      const profitColor = item.grossProfit >= 0 ? COLORS.green : COLORS.red;
      doc.fillColor(profitColor)
        .text(this.formatCurrency(item.grossProfit), x, rowY + 5, { width: cols[3].width - 8, align: 'right' });

      x += cols[3].width;

      const marginColor = item.profitMargin >= 30 ? COLORS.green : item.profitMargin >= 0 ? COLORS.gray600 : COLORS.red;

      doc.fillColor(marginColor).font('Helvetica-Bold')
        .text(`${item.profitMargin.toFixed(1)}%`, x, rowY + 5, { width: cols[4].width - 40, align: 'right' });

      const barX = x + cols[4].width - 34;
      const barWidth = 30;
      const barFill = Math.min(Math.max(item.profitMargin, 0), 100) / 100 * barWidth;

      doc.save();
      doc.roundedRect(barX, rowY + 7, barWidth, 6, 2).fill(COLORS.gray200);
      if (barFill > 0) {
        doc.roundedRect(barX, rowY + 7, barFill, 6, 2).fill(marginColor);
      }
      doc.restore();

      doc.y = rowY + 20;
    });

    doc.y += 8;
  }

  private static drawTableHeader(
    doc: PDFKit.PDFDocument,
    cols: Array<{ label: string; width: number; align: 'left' | 'center' | 'right' }>,
    pageWidth: number,
  ) {
    const headerY = doc.y;

    doc.save();
    doc.rect(doc.page.margins.left, headerY, pageWidth, 22).fill(COLORS.dark);
    doc.restore();

    let x = doc.page.margins.left + 8;
    cols.forEach(col => {
      doc.fontSize(FONT_SIZES.small).font('Helvetica-Bold').fillColor(COLORS.white)
        .text(col.label.toUpperCase(), x, headerY + 6, {
          width: col.width - 16,
          align: col.align,
        });
      x += col.width;
    });

    doc.y = headerY + 22;
  }

  private static drawFooter(doc: PDFKit.PDFDocument, report: GetMonthlyReportUseCase.Output) {
    const pages = doc.bufferedPageRange();
    for (let i = pages.start; i < pages.start + pages.count; i++) {
      doc.switchToPage(i);

      doc.save();
      const y = doc.page.height - 30;

      doc.fontSize(7).font('Helvetica').fillColor(COLORS.gray400)
        .text(
          `LucraFood  |  Relatorio gerado em ${new Date().toLocaleDateString('pt-BR')}  |  ${report.monthLabel}`,
          doc.page.margins.left,
          y,
          { width: doc.page.width - doc.page.margins.left - doc.page.margins.right, align: 'left', lineBreak: false },
        );

      doc.text(
        `Pagina ${i + 1} de ${pages.count}`,
        doc.page.margins.left,
        y,
        { width: doc.page.width - doc.page.margins.left - doc.page.margins.right, align: 'right', lineBreak: false },
      );

      doc.restore();
    }
  }

  private static formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
