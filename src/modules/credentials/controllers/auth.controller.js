// src/modules/credentials/controllers/auth.controller.js
import { verify } from 'jsonwebtoken';
import * as authService from '../services/auth.service.js';
import { logAudit } from '../services/audit.service.js';


export async function registerHandler(req, reply) {
  const { email, password, name } = req.body;
  try {
   const user = await prisma.user.create({
        data: {
        email,
        password: hashed,
        name,
        tenantId: req.tenant.id,
        role: { connect: { name: 'user' } }
        }
    });
    
    await logAudit({
      userId: user.id,
      action: 'REGISTER_SUCCESS',
      description: `User ${email} registered`,
      req
    });

    return reply.code(201).send({ message: 'Register success', user });
  } catch (err) {
    await logAudit({
      action: 'REGISTER_FAILED',
      description: `Register failed for ${email}`,
      req
    });

    return reply.code(400).send({ message: 'Register failed', error: err.message });
  }
}

export async function loginHandler(req, reply) {
  try {
    const token = await authService.login(req, reply);
    reply.send({ token });
  } catch (err) {
    reply.code(401).send({ error: err.message });
  }
}


export async function refreshTokenHandler(req, reply) {
  const { refreshToken } = req.body;

  try {
    const payload = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        isRevoked: false
      }
    });

    if (!tokenRecord) {
      await logAudit({
        action: 'REFRESH_TOKEN_FAILED',
        description: 'Invalid or revoked refresh token',
        req
      });
      return reply.code(401).send({ message: 'Invalid refresh token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { role: true }
    });

    const { accessToken } = await generateTokens(user);

    await logAudit({
      userId: user.id,
      action: 'REFRESH_TOKEN_SUCCESS',
      description: 'New access token issued',
      req
    });

    return { accessToken };
  } catch (err) {
    await logAudit({
      action: 'REFRESH_TOKEN_FAILED',
      description: 'Refresh token error: ' + err.message,
      req
    });
    return reply.code(401).send({ message: 'Token expired or invalid' });
  }
}