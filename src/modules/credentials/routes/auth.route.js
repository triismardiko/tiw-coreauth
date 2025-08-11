import { registerHandler, loginHandler } from '../controllers/auth.controller.js';
import { setup2FAHandler, verify2FAHandler } from '../controllers/2fa.controller.js';
import fastifyPassport from 'fastify-passport';
import { verifyRole } from '../middlewares/verifyRole.js';

import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { setup2FASchema, verify2FASchema } from '../schemas/2fa.schema.js';
import { googleSchema, linkedinSchema } from '../schemas/oauth.schema.js';

import {
  loginRateLimit,
  registerRateLimit,
  twoFARateLimit
} from '../middlewares/rateLimits.js';

import { logoutHandler } from '../controllers/logout.controller.js';
import { verifyAccessToken } from '../middlewares/verifyAccessToken.js';


export default async function authRoutes(fastify) {
  fastify.post('/auth/register', {   preHandler: [resolveTenant],schema: registerSchema },registerRateLimit, registerHandler);
  fastify.post('/auth/login', {  preHandler: [resolveTenant],schema: loginSchema },loginRateLimit, loginHandler);
  fastify.post('/auth/2fa/setup', { preHandler: [resolveTenant], schema: setup2FASchema }, setup2FAHandler);
  fastify.post('/auth/2fa/verify', {  preHandler: [resolveTenant],schema: verify2FASchema },twoFARateLimit, verify2FAHandler);

  fastify.get('/auth/google', { schema: googleSchema }, fastifyPassport.authenticate('google', { scope: ['email', 'profile'] }));
  fastify.get('/auth/google/callback', { schema: { tags: ['OAuth'], summary: 'Google callback' } }, fastifyPassport.authenticate('google', { session: false }), async (req, reply) => {
    const token = await req.jwtSign({ userId: req.user.id, role: req.user.role.name });
    reply.send({ token });
  });

  fastify.get('/auth/linkedin', { schema: linkedinSchema }, fastifyPassport.authenticate('linkedin'));
  fastify.get('/auth/linkedin/callback', { preHandler: [resolveTenant], schema: { tags: ['OAuth'], summary: 'LinkedIn callback' } }, fastifyPassport.authenticate('linkedin', { session: false }), async (req, reply) => {
    const token = await req.jwtSign({ userId: req.user.id, role: req.user.role.name });
    reply.send({ token });
  });

  fastify.post('/auth/refresh-token', { preHandler: [resolveTenant],schema: refreshTokenSchema}, refreshTokenHandler);
  fastify.post('/auth/logout', { preHandler: [verifyAccessToken] }, logoutHandler);
}