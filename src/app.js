import Fastify from 'fastify';
import dotenv from 'dotenv';
import swagger from './plugins/swagger.js';
dotenv.config();

const app = Fastify({ logger: true });
await app.register(swagger);

export default app;
