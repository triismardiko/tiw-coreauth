// File: src/modules/credentials/services/token.service.js

import prisma from '../../../plugins/prisma.js';

export async function revokeRefreshToken(token) {
  return prisma.refreshToken.updateMany({
    where: { token, revoked: false },
    data: { revoked: true }
  });
}
