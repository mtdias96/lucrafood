import { FastifyPluginAsync } from 'fastify';
import { ingredientsRoutes } from './ingredients';
import { usersRoutes } from './me';

export const privateRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.register(usersRoutes);
  fastify.register(ingredientsRoutes);
};

