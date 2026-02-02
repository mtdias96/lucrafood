// src/@types/fastify-auth.d.ts

import '@fastify/jwt';
import 'fastify';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface FastifyInstance {
    authenticate: preHandlerHookHandler;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface FastifyRequest {
    userId?: string;
  }
}

declare module '@fastify/jwt' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface FastifyJWT {
    payload: {
      sub: string;
      email?: string;
      role?: string;
    };
    user: {
      sub: string;
      email?: string;
      role?: string;
    };
  }
}
