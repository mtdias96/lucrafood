import { CreateStoreController } from '@application/controllers/store/CreateStoreController';
import { ListStoresController } from '@application/controllers/store/ListStoresController';
import { Registry } from '@kernel/di/Registry';
import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import { type FastifyPluginAsync } from 'fastify';

export const storeRoutes: FastifyPluginAsync = async (fastify) => {
  const createStoreController = Registry.getInstace().resolve(CreateStoreController);
  const listStoresController = Registry.getInstace().resolve(ListStoresController);

  fastify.post('/store', fastifyPrivateRouteAdapter(createStoreController));
  fastify.get('/store', fastifyPrivateRouteAdapter(listStoresController));
};
