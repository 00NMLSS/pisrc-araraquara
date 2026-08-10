import { FastifyInstance } from 'fastify';
import axios from 'axios';

const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:8082';
const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200';

export async function catalogRoutes(fastify: FastifyInstance) {
  fastify.get('/products', async (request, reply) => {
    try {
      const response = await axios.get(`${CATALOG_SERVICE_URL}/products`, { params: request.query });
      return reply.status(response.status).send(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      return reply.status(status).send(error.response?.data || { error: 'Failed to fetch products' });
    }
  });

  fastify.get('/products/:id', async (request: any, reply) => {
    try {
      const response = await axios.get(`${CATALOG_SERVICE_URL}/products/${request.params.id}`);
      return reply.status(response.status).send(response.data);
    } catch (error: any) {
      const status = error.response?.status || 404;
      return reply.status(status).send(error.response?.data || { error: 'Product not found' });
    }
  });

  fastify.get('/categories', async (request, reply) => {
    try {
      const response = await axios.get(`${CATALOG_SERVICE_URL}/categories`);
      return reply.status(response.status).send(response.data);
    } catch (error: any) {
      const status = error.response?.status || 500;
      return reply.status(status).send(error.response?.data || { error: 'Failed to fetch categories' });
    }
  });

  fastify.get('/search', async (request: any, reply) => {
    const { q } = request.query;
    if (!q) {
      return reply.send([]);
    }

    try {
      const esResponse = await axios.post(`${ELASTICSEARCH_URL}/products/_search`, {
        query: {
          multi_match: {
            query: q,
            fields: ['name^3', 'description', 'category_name'],
            fuzziness: 'AUTO'
          }
        }
      });

      const hits = esResponse.data.hits?.hits || [];
      const results = hits.map((hit: any) => hit._source);
      return reply.send(results);
    } catch (error) {
      const fallbackResponse = await axios.get(`${CATALOG_SERVICE_URL}/products`, { params: { search: q } });
      return reply.send(fallbackResponse.data);
    }
  });
}
