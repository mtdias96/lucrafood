
import { SignInController } from '@/application/controllers/auth/SignInController';
import { SignUpController } from '@/application/controllers/auth/SignUpController';
import { fastifyRouteAdapter } from '@/main/adapters/fastifyRoute';
import { FastifyPluginAsync } from 'fastify';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  const signUpController = new SignUpController();
  const signInController = new SignInController();

  fastify.post('/signup', fastifyRouteAdapter(signUpController));
  fastify.post('/signin', fastifyRouteAdapter(signInController));

};
