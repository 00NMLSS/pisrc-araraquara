import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { rateLimiterPlugin } from './plugins/rate-limiter';
import { authRoutes } from './routes/auth.routes';
import { catalogRoutes } from './routes/catalog.routes';
import { cartRoutes } from './routes/cart.routes';
import { orderRoutes } from './routes/orders.routes';

const server = Fastify({
  logger: true
});

async function start() {
  await server.register(cors, {
    origin: true,
    credentials: true
  });

  await server.register(swagger, {
    openapi: {
      info: {
        title: 'Quintadinha Online - Unified BFF OpenAPI 3.0',
        description: 'Aggregated API Documentation for Quintadinha Online Microservices Architecture',
        version: '1.0.0'
      },
      servers: [
        {
          url: 'http://localhost:80/api',
          description: 'Local Nginx Ingress Gateway'
        }
      ]
    }
  });

  await server.register(swaggerUi, {
    routePrefix: '/documentation'
  });

  await server.register(rateLimiterPlugin);

  await server.register(authRoutes);
  await server.register(catalogRoutes);
  await server.register(cartRoutes);
  await server.register(orderRoutes);

  server.get('/health', async () => {
    return { status: 'UP', service: 'bff-gateway', timestamp: new Date().toISOString() };
  });

  const port = parseInt(process.env.PORT || '8080', 10);
  const host = '0.0.0.0';

  try {
    await server.listen({ port, host });
    console.log(`BFF Gateway listening on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
