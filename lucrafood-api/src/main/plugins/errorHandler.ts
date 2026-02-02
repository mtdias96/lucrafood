import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { ZodError } from 'zod';

import { ErrorCode } from '@application/errors/ErrorCode';
import { HttpError } from '@application/errors/http/HttpError';

export const errorHandlerPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        code: ErrorCode.VALIDATION,
        message: 'Validation error',
        details: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          error: issue.message,
        })),
      });
    }

    if (error instanceof HttpError) {
      return reply.code(error.statusCode).send({
        code: error.code,
        message: error.message,
      });
    }

    request.log.error({ err: error }, 'unhandled error');

    return reply.code(500).send({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Internal server error.',
    });
  });

  fastify.setNotFoundHandler((request, reply) => {
    return reply.code(404).send({
      code: ErrorCode.NOT_FOUND,
      message: 'Route not found',
    });
  });
});
