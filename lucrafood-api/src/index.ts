import 'dotenv/config';
import 'reflect-metadata';

import fastifyJwt from '@fastify/jwt';
import Fastify from 'fastify';

import { ZodError } from 'zod';
import { routes } from './application/routes';
import { AppError } from './kernel/errors/AppError';

const fastify = Fastify();

fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.code(400).send({
      message: 'Validation error',
      issues: error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
  }

  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      message: error.message,
      code: error.code,
    });
  }

  return reply.code(500).send({
    message: 'Internal server error',
  });
});

fastify.register(fastifyJwt, {
  secret: 'superSecret',
});

fastify.register(routes, { prefix: 'api' });

fastify.listen({ port: 3333, host: '0.0.0.0' }, () => {
  console.log('🔥 Server at started in http://localhost:3333');
});
