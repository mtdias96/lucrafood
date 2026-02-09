import { CreateStoreController } from '@application/controllers/store/CreateStoreController';
import { Registry } from '@kernel/di/Registry';
import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import { type FastifyPluginAsync } from 'fastify';

export const storeRoutes: FastifyPluginAsync = async (fastify) => {
  const createStoreController = Registry.getInstace().resolve(CreateStoreController);

  fastify.post('/store', fastifyPrivateRouteAdapter(createStoreController));
};
