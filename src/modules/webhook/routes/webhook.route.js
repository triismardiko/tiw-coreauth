// File: src/modules/webhook/routes/webhook.route.js

import { handlePaymentWebhook } from '../controllers/webhook.controller.js';
import { webhookSchemas } from '../schemas/webhook.schema.js';

export default async function webhookRoutes(fastify) {
  fastify.post('/webhooks/payment', {
    schema: webhookSchemas.payment,
    bodyLimit: 1048576 // 1 MB
  }, handlePaymentWebhook);
}
