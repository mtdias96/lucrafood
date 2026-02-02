import 'dotenv/config';
import 'reflect-metadata';

import Fastify from 'fastify';

import { errorHandlerPlugin } from '@main/plugins/errorHandler';
import { jwtPlugin } from '@main/plugins/jwtPlugin';
import { routes } from '@main/routes';

async function bootstrap() {
  const fastify = Fastify({ logger: true });

  await fastify.register(errorHandlerPlugin);

  await fastify.register(jwtPlugin);

  await fastify.register(routes, { prefix: '/api' });

  await fastify.listen({ port: 3333, host: '0.0.0.0' });

  console.log('🔥 Server started at http://localhost:3333');
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
