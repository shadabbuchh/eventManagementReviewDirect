import Fastify from 'fastify';
import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import configPlugin from '@fastify/env';
import { envSchema } from './config/env.schema';
import { buildPlugins } from './plugins/index';
import { buildRepositories } from './repositories/index';
import { buildServices } from './services/index';
import { healthRoutes, eventsRoutes } from './routes/index';

import { loggerOptions } from './utils/logger';
import registerHooks from './hooks/index';
import { constants } from './constants/index';

export default async function build(): Promise<FastifyInstance> {
  const app = Fastify({ logger: loggerOptions });

  try {
    await app.register(configPlugin, {
      schema: envSchema,
      dotenv: true,
    });

    await setupNotFoundHandler(app);

    app.decorate('plugins', buildPlugins(app));
    app.decorate('repositories', buildRepositories(app));
    app.decorate('services', buildServices(app));

    // Register sensible plugin early so httpErrors and other utilities are available
    await app.register(async function sensibleWrapper(
      _fastify: FastifyInstance
    ) {
      await app.plugins.sensible.register();
    });

    await registerHooks(app);

    // Register all routes
    await app.register(healthRoutes, { prefix: constants.API_PREFIX });
    await app.register(eventsRoutes, { prefix: constants.API_PREFIX });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }

  return app;
}

async function setupNotFoundHandler(app: FastifyInstance) {
  app.setNotFoundHandler(
    async (request: FastifyRequest, reply: FastifyReply) => {
      // For API routes or other methods, return 404
      return reply.code(404).send({ error: 'Not Found' });
    }
  );
}
