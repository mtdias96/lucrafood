import type { FastifyPluginAsync } from 'fastify';

import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import {
  makeCheckAlertsController,
  makeListAlertsController,
  makeMarkAlertAsReadController,
} from '@main/factories/alerts';

export const alertsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/alerts', fastifyPrivateRouteAdapter(makeListAlertsController()));
  fastify.post('/alerts/check', fastifyPrivateRouteAdapter(makeCheckAlertsController()));
  fastify.patch('/alerts/:id/read', fastifyPrivateRouteAdapter(makeMarkAlertAsReadController()));
};
