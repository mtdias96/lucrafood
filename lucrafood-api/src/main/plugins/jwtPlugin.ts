import jwt from '@fastify/jwt';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const jwtPluginFn: FastifyPluginAsync = async (fastify) => {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET!,
    verify: { allowedIss: 'api', allowedAud: 'web' },
  });
};

export const jwtPlugin = fp(jwtPluginFn, { name: 'jwtPlugin' });
