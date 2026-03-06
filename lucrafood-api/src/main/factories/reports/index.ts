import { Registry } from '@kernel/di/Registry';

import { DownloadMonthlyReportExcelController } from '@application/controllers/reports/DownloadMonthlyReportExcelController';
import { DownloadMonthlyReportPdfController } from '@application/controllers/reports/DownloadMonthlyReportPdfController';
import { GetMonthlyReportController } from '@application/controllers/reports/GetMonthlyReportController';

const resolve = Registry.getInstace().resolve.bind(Registry.getInstace());

export const makeGetMonthlyReportController = () => resolve(GetMonthlyReportController);
export const makeDownloadMonthlyReportPdfController = () => resolve(DownloadMonthlyReportPdfController);
export const makeDownloadMonthlyReportExcelController = () => resolve(DownloadMonthlyReportExcelController);
