
import { SignInController } from '@application/controllers/auth/SignInController';
import { SignUpController } from '@application/controllers/auth/SignUpController';
import { Registry } from '@kernel/di/Registry';
import { fastifyPublicRouteAdapter } from '@main/adapters/fastifyPublicRouteAdapter';

import { FastifyPluginAsync } from 'fastify';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  const signUpController = Registry.getInstace().resolve(SignUpController);
  const signInController = Registry.getInstace().resolve(SignInController);

  fastify.post('/signup', fastifyPublicRouteAdapter(signUpController));
  fastify.post('/signin', fastifyPublicRouteAdapter(signInController));

};
