import { Unauthorized } from '@application/errors/http/Unauthorization';
import type { FastifyPluginAsync, preHandlerHookHandler } from 'fastify';
import fp from 'fastify-plugin';

export const authPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorate('authenticate', (async (request) => {
    try {
      await request.jwtVerify();
      request.userId = request.user.sub;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid or missing token';
      throw new Unauthorized(msg);
    }
  }) as preHandlerHookHandler);
});
