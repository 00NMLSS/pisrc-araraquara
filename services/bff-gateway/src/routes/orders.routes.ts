import { FastifyInstance } from 'fastify';
import axios from 'axios';

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:8083';

export async function orderRoutes(fastify: FastifyInstance) {
  fastify.post('/orders', async (request, reply) => {
    try {
      const response = await axios.post(`${ORDER_SERVICE_URL}/orders`, request.body);
      return reply.status(response.status).send(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      return reply.status(status).send(error.response?.data || { error: 'Order processing failed' });
    }
  });

  fastify.get('/orders/user/:userId', async (request: any, reply) => {
    try {
      const response = await axios.get(`${ORDER_SERVICE_URL}/orders/user/${request.params.userId}`);
      return reply.status(response.status).send(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      return reply.status(status).send(error.response?.data || { error: 'Failed to fetch user orders' });
    }
  });

  fastify.get('/orders/:id/sse', async (request: any, reply) => {
    const { id } = request.params;
    
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    reply.raw.write(`data: ${JSON.stringify({ orderId: id, status: 'CONFIRMED', timestamp: new Date().toISOString() })}\n\n`);

    const interval = setInterval(() => {
      const statuses = ['PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      reply.raw.write(`data: ${JSON.stringify({ orderId: id, status: randomStatus, timestamp: new Date().toISOString() })}\n\n`);
    }, 10000);

    request.raw.on('close', () => {
      clearInterval(interval);
    });
  });
}
