import ExcelJS from 'exceljs';
import { GetMonthlyReportUseCase } from '@application/usecases/reports/GetMonthlyReportUseCase';

const COLORS = {
  primary: '059669',
  primaryLight: '10B981',
  dark: '111827',
  gray: '6B7280',
  lightGray: 'F3F4F6',
  white: 'FFFFFF',
  red: 'EF4444',
  green: '10B981',
};

export class ExcelReportGenerator {
  static async generate(report: GetMonthlyReportUseCase.Output): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'LucraFood';
    workbook.created = new Date();

    this.createSummarySheet(workbook, report);
    this.createIngredientCostsSheet(workbook, report);
    this.createProductFinancialsSheet(workbook, report);

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  private static createSummarySheet(workbook: ExcelJS.Workbook, report: GetMonthlyReportUseCase.Output) {
    const sheet = workbook.addWorksheet('Resumo', {
      properties: { tabColor: { argb: COLORS.primary } },
    });

    sheet.columns = [
      { width: 35 },
      { width: 25 },
    ];

    const titleRow = sheet.addRow([`LucraFood - Relatorio Mensal`]);
    titleRow.font = { size: 16, bold: true, color: { argb: COLORS.white } };
    titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primary } };
    titleRow.height = 32;
    titleRow.alignment = { vertical: 'middle' };
    sheet.mergeCells('A1:B1');

    const periodRow = sheet.addRow([report.monthLabel]);
    periodRow.font = { size: 12, color: { argb: COLORS.gray } };
    periodRow.height = 24;
    sheet.mergeCells('A2:B2');

    sheet.addRow([]);

    const headerRow = sheet.addRow(['Indicador', 'Valor']);
    this.styleHeaderRow(headerRow);

    const { summary } = report;
    const rows: [string, string][] = [
      ['Total Gasto em Compras', this.formatCurrency(summary.totalPurchaseCost)],
      ['Custo Total de Producao', this.formatCurrency(summary.totalProductionCost)],
      ['Receita Potencial Total', this.formatCurrency(summary.totalRevenuePotential)],
      ['Lucro Bruto Total', this.formatCurrency(summary.totalGrossProfit)],
      ['Margem Media de Lucro', `${summary.avgProfitMargin.toFixed(1)}%`],
      ['Quantidade de Produtos', String(summary.productCount)],
      ['Compras no Periodo', String(summary.ingredientPurchaseCount)],
    ];

    rows.forEach((data, i) => {
      const row = sheet.addRow(data);
      row.font = { size: 11 };
      row.getCell(1).font = { size: 11, bold: true };
      if (i % 2 === 0) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.lightGray } };
      }
    });
  }

  private static createIngredientCostsSheet(workbook: ExcelJS.Workbook, report: GetMonthlyReportUseCase.Output) {
    const sheet = workbook.addWorksheet('Custos Ingredientes', {
      properties: { tabColor: { argb: COLORS.dark } },
    });

    sheet.columns = [
      { width: 35 },
      { width: 18 },
      { width: 20 },
      { width: 18 },
    ];

    const titleRow = sheet.addRow(['Custos por Ingrediente']);
    titleRow.font = { size: 14, bold: true, color: { argb: COLORS.white } };
    titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primary } };
    titleRow.height = 28;
    titleRow.alignment = { vertical: 'middle' };
    sheet.mergeCells('A1:D1');

    sheet.addRow([]);

    const headerRow = sheet.addRow(['Ingrediente', 'Compras', 'Total Gasto', '% do Total']);
    this.styleHeaderRow(headerRow);

    const totalSpent = report.ingredientCosts.reduce((s, c) => s + c.totalSpent, 0);

    report.ingredientCosts.forEach((item, i) => {
      const pct = totalSpent > 0 ? ((item.totalSpent / totalSpent) * 100).toFixed(1) : '0.0';
      const row = sheet.addRow([
        item.ingredientName,
        item.purchaseCount,
        this.formatCurrency(item.totalSpent),
        `${pct}%`,
      ]);
      row.font = { size: 10 };
      if (i % 2 === 0) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.lightGray } };
      }
    });

    const totalRow = sheet.addRow(['TOTAL', '', this.formatCurrency(totalSpent), '100%']);
    totalRow.font = { size: 11, bold: true };
    totalRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.dark } };
    totalRow.font = { size: 11, bold: true, color: { argb: COLORS.white } };
  }

  private static createProductFinancialsSheet(workbook: ExcelJS.Workbook, report: GetMonthlyReportUseCase.Output) {
    const sheet = workbook.addWorksheet('Financeiro Produtos', {
      properties: { tabColor: { argb: COLORS.primaryLight } },
    });

    sheet.columns = [
      { width: 30 },
      { width: 18 },
      { width: 18 },
      { width: 18 },
      { width: 16 },
    ];

    const titleRow = sheet.addRow(['Financeiro por Produto']);
    titleRow.font = { size: 14, bold: true, color: { argb: COLORS.white } };
    titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primary } };
    titleRow.height = 28;
    titleRow.alignment = { vertical: 'middle' };
    sheet.mergeCells('A1:E1');

    sheet.addRow([]);

    const headerRow = sheet.addRow(['Produto', 'Preco Venda', 'Custo Unit.', 'Lucro Bruto', 'Margem']);
    this.styleHeaderRow(headerRow);

    report.productFinancials.forEach((item, i) => {
      const row = sheet.addRow([
        item.productName,
        this.formatCurrency(item.salePrice),
        this.formatCurrency(item.unitCost),
        this.formatCurrency(item.grossProfit),
        `${item.profitMargin.toFixed(1)}%`,
      ]);
      row.font = { size: 10 };

      if (item.grossProfit < 0) {
        row.getCell(4).font = { size: 10, color: { argb: COLORS.red } };
      }
      if (item.profitMargin < 0) {
        row.getCell(5).font = { size: 10, color: { argb: COLORS.red } };
      }

      if (i % 2 === 0) {
        row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.lightGray } };
      }
    });
  }

  private static styleHeaderRow(row: ExcelJS.Row) {
    row.font = { size: 10, bold: true, color: { argb: COLORS.white } };
    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.dark } };
    row.height = 24;
    row.alignment = { vertical: 'middle' };
  }

  private static formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
