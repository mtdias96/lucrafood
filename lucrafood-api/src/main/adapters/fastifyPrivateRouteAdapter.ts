import { Controller } from '@application/contracts/Controller';
import type { RouteHandlerMethod } from 'fastify';

export function fastifyPrivateRouteAdapter<TResBody = unknown>(
  controller: Controller<'private', TResBody>,
): RouteHandlerMethod {
  return async (request, reply) => {
    const accountId = request.user?.sub;

    if (!accountId) {
      return reply.code(500).send({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Auth guard not applied to private route',
      });
    }

    const result = await controller.execute({
      body: (request.body ?? {}) as Record<string, unknown>,
      params: (request.params ?? {}) as Record<string, unknown>,
      headers: { authorization: String(request.headers.authorization ?? '') },
      queryParams: request.query as Record<string, unknown>,
      accountId,
    });

    return reply.code(result.statusCode).send(result.body);
  };
}
