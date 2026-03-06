import { Controller } from '@application/contracts/Controller';
import type { RouteHandlerMethod } from 'fastify';

export function fastifyFileDownloadAdapter(
  controller: Controller<'private', Buffer>,
  contentType: string,
  filenameBuilder: (query: Record<string, unknown>) => string,
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

    if (result.statusCode !== 200) {
      return reply.code(result.statusCode).send(result.body);
    }

    const filename = filenameBuilder(request.query as Record<string, unknown>);

    return reply
      .code(200)
      .header('Content-Type', contentType)
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(result.body);
  };
}
