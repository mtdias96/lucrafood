import { FastifyPluginAsync } from 'fastify';
import { authRoutes } from './public/authRoutes';

export const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(authRoutes, { prefix: 'auth' });
};
