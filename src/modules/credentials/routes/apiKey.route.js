import { getSecuredData } from '../controllers/apiKey.controller.js';
import { verifyApiKey } from '../middlewares/verifyApiKey.js';
import { securedWithApiKeySchema } from '../schemas/apiKey.schema.js';

export default async function apiKeyRoutes(fastify) {
  fastify.get('/external/data', {
    preHandler: verifyApiKey,
    schema: securedWithApiKeySchema
  }, getSecuredData);
}
