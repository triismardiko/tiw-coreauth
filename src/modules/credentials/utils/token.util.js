// src/modules/credentials/utils/token.util.js
import prisma from '../../../plugins/prisma.js';
import { sign } from 'jsonwebtoken';

export async function generateTokens(user) {
  const payload = { userId: user.id, role: user.role.name };

  const accessToken = sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });

  const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });

  // simpan ke DB
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 hari
    }
  });

  return { accessToken, refreshToken };
}
