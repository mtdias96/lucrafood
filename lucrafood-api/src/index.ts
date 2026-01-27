import 'dotenv/config';
import 'reflect-metadata';

import fastifyJwt from '@fastify/jwt';
import Fastify from 'fastify';

import { ZodError } from 'zod';
import { ErrorCode } from './application/errors/ErrorCode';
import { HttpError } from './application/errors/http/HttpError';
import { routes } from './application/routes';

const fastify = Fastify();

fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.code(400).send({
      Error: {
        code: ErrorCode.VALIDATION,
        message: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          error: issue.message,
        })),
      },
    });
  }

  if (error instanceof HttpError) {
    return reply.code(error.statusCode).send({
      message: error.message,
      code: error.code,
    });
  }

  return reply.code(500).send({
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: 'Internal server error.',
  });
});

fastify.register(fastifyJwt, {
  secret: 'superSecret',
});

fastify.register(routes, { prefix: 'api' });

fastify.listen({ port: 3333, host: '0.0.0.0' }, () => {
  console.log('🔥 Server at started in http://localhost:3333');
});
