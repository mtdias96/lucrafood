import { authPlugin } from '@main/plugins/authGuardPlugin';
import { FastifyPluginAsync } from 'fastify';
import { privateRoutes } from './private';
import { authRoutes } from './public/authRoutes';

export const routes: FastifyPluginAsync = async (fastify) => {
  fastify.register(authPlugin);
  fastify.register(authRoutes, { prefix: 'auth' });
  fastify.register(privateRoutes);

};
