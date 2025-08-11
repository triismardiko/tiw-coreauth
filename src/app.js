import Fastify from 'fastify';
import dotenv from 'dotenv';
import swagger from './plugins/swagger.js';
import adminRoutes from './modules/admin/routes/admin.route.js';
import rateLimit from '@fastify/rate-limit';
import webhookRoutes from './modules/webhook/routes/webhook.route.js';



dotenv.config();

const app = Fastify({ logger: true });
await app.register(swagger);
await fastify.register(adminRoutes);
await fastify.register(webhookRoutes);  



await fastify.register(rateLimit, {
  max: 5, // max 5 request
  timeWindow: '1 minute', // per IP per menit
  errorResponseBuilder: (req, context) => ({
    statusCode: 429,
    error: 'Too Many Requests',
    message: `Too many requests. Please try again later.`
  })
});


export default app;