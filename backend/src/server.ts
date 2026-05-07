import fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import fastifyCors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import dotenv from 'dotenv';

dotenv.config();

const server = fastify({ logger: true });

// Register Plugins
server.register(fastifyCors, { origin: '*' });
server.register(fastifyWebsocket);
server.register(fastifyFormbody);

// Setup Routes
server.register(import('./routes/clinic.routes.js'), { prefix: '/api/clinic' });
server.register(import('./routes/calendar.routes.js'), { prefix: '/api/calendar' });
server.register(import('./routes/twilio.routes.js'), { prefix: '/api/twilio' });
server.register(import('./routes/calls.routes.js'), { prefix: '/api/calls' });
server.register(import('./routes/appointments.routes.js'), { prefix: '/api/appointments' });
server.register(import('./routes/ai.routes.js'), { prefix: '/api/ai' });
server.register(import('./routes/voices.routes.js'), { prefix: '/api/voices' });

// Health Check
server.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
    await server.listen({ port, host: '0.0.0.0' });
    server.log.info(`Server listening on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
