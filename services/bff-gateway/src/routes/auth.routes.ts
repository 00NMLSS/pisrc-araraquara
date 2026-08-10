import { FastifyInstance } from 'fastify';
import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:8081';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/register', async (request, reply) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/auth/register`, request.body);
      return reply.status(response.status).send(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      const data = error.response?.data || { error: 'Internal Server Error' };
      return reply.status(status).send(data);
    }
  });

  fastify.post('/auth/login', async (request, reply) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, request.body);
      return reply.status(response.status).send(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      const data = error.response?.data || { error: 'Invalid credentials' };
      return reply.status(status).send(data);
    }
  });

  fastify.post('/auth/refresh', async (request, reply) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/auth/refresh`, request.body);
      return reply.status(response.status).send(response.data);
    } catch (error: any) {
      const status = error.response?.status || 401;
      const data = error.response?.data || { error: 'Invalid refresh token' };
      return reply.status(status).send(data);
    }
  });
}
