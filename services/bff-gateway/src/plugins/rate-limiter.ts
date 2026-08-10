import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redis = new Redis({ host: redisHost, port: redisPort });

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 100;

export async function rateLimiterPlugin(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const ip = request.ip || '127.0.0.1';
    const currentTime = Date.now();
    const windowStart = currentTime - WINDOW_SIZE_IN_SECONDS * 1000;
    const key = `rate_limit:${ip}`;

    const multi = redis.multi();
    multi.zremrangebyscore(key, 0, windowStart);
    multi.zadd(key, currentTime, `${currentTime}:${Math.random()}`);
    multi.zcard(key);
    multi.expire(key, WINDOW_SIZE_IN_SECONDS);

    const results = await multi.exec();
    const requestCount = results ? (results[2][1] as number) : 0;

    reply.header('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
    reply.header('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS_PER_WINDOW - requestCount));

    if (requestCount > MAX_REQUESTS_PER_WINDOW) {
      reply.status(429).send({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        statusCode: 429
      });
    }
  });
}
