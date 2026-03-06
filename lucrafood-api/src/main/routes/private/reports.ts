import type { FastifyPluginAsync } from 'fastify';

import { fastifyFileDownloadAdapter } from '@main/adapters/fastifyFileDownloadAdapter';
import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import {
  makeDownloadMonthlyReportExcelController,
  makeDownloadMonthlyReportPdfController,
  makeGetMonthlyReportController,
} from '@main/factories/reports';

export const reportsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/reports/monthly', fastifyPrivateRouteAdapter(makeGetMonthlyReportController()));

  fastify.get('/reports/monthly/pdf', fastifyFileDownloadAdapter(
    makeDownloadMonthlyReportPdfController(),
    'application/pdf',
    (query) => `lucrafood-relatorio-${query.month ?? 'mensal'}.pdf`,
  ));

  fastify.get('/reports/monthly/excel', fastifyFileDownloadAdapter(
    makeDownloadMonthlyReportExcelController(),
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    (query) => `lucrafood-relatorio-${query.month ?? 'mensal'}.xlsx`,
  ));
};
