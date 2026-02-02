import { Controller } from '@application/contracts/Controller';
import { RouteHandlerMethod } from 'fastify';

export function fastifyPublicRouteAdapter<TResBody = unknown>(
  controller: Controller<'public', TResBody>,
): RouteHandlerMethod {
  return async (request, reply) => {
    const result = await controller.execute({
      body: (request.body ?? {}) as Record<string, unknown>,
      params: (request.params ?? {}) as Record<string, unknown>,
      headers: { authorization: String(request.headers.authorization ?? '') },
      queryParams: (request.query ?? {}) as Record<string, unknown>,
    });

    return reply.code(result.statusCode).send(result.body);
  };
}
