import { MeController } from '@application/controllers/me/MeController';
import { Registry } from '@kernel/di/Registry';
import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import type { FastifyPluginAsync } from 'fastify';

export const usersRoutes: FastifyPluginAsync = async (fastify) => {
  const meController = Registry.getInstace().resolve(MeController);

  fastify.get('/profile', fastifyPrivateRouteAdapter(meController));
};
