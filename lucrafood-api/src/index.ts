import 'dotenv/config';
import Fastify from 'fastify';

const fastify = Fastify();

fastify.get('/', (request, reply) => {
  reply.send({ hello: 'world' });
});

fastify.listen({ port: 3333, host: '0.0.0.0' }, () => {
  console.log('🔥 Server at started in http://localhost:3333');
});
