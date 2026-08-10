import { FastifyInstance } from 'fastify';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10)
});

interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export async function cartRoutes(fastify: FastifyInstance) {
  fastify.post('/cart/sync', async (request: any, reply) => {
    const { userId, items } = request.body as { userId: string; items: CartItem[] };

    if (!userId || !Array.isArray(items)) {
      return reply.status(400).send({ error: 'Invalid user or cart items payload' });
    }

    const cartKey = `cart:${userId}`;
    const existingRaw = await redis.get(cartKey);
    let existingItems: CartItem[] = existingRaw ? JSON.parse(existingRaw) : [];

    items.forEach(newItem => {
      const existingIdx = existingItems.findIndex(i => i.productId === newItem.productId);
      if (existingIdx >= 0) {
        existingItems[existingIdx].quantity += newItem.quantity;
      } else {
        existingItems.push(newItem);
      }
    });

    await redis.set(cartKey, JSON.stringify(existingItems), 'EX', 86400 * 30);

    return reply.send({
      message: 'Cart synchronized successfully',
      userId,
      items: existingItems
    });
  });

  fastify.get('/cart/:userId', async (request: any, reply) => {
    const { userId } = request.params;
    const cartKey = `cart:${userId}`;
    const raw = await redis.get(cartKey);
    const items = raw ? JSON.parse(raw) : [];
    return reply.send({ userId, items });
  });
}
