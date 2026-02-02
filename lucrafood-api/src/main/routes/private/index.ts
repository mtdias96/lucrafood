import { FastifyPluginAsync } from 'fastify';
import { usersRoutes } from './me';

export const privateRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.register(usersRoutes);
};

