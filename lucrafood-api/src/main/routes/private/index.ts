import { FastifyPluginAsync } from 'fastify';
import { ingredientsRoutes } from './ingredient';
import { usersRoutes } from './me';
import { productRoutes } from './product';
import { storeRoutes } from './store';

export const privateRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.register(usersRoutes);
  fastify.register(ingredientsRoutes);
  fastify.register(productRoutes);
  fastify.register(storeRoutes);
};

