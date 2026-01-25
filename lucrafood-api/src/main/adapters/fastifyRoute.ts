import { Controller } from '@/application/contracts/Controller';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

export function fastifyRouteAdapter<TBody = undefined>(
  controler: Controller<TBody>,
): RouteHandlerMethod {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await controler.execute({
      body: request.body as Record<string, unknown>,
      params: request.params as Record<string, unknown>,
      header: request.headers as Record<string, string>,
      queryParams: request.query as Record<string, unknown>,
    });

    return reply.code(result.statusCode).send(result.body);
  };
}
