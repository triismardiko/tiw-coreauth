// File: src/modules/credentials/controllers/logout.controller.js

import { revokeRefreshToken } from '../services/token.service.js';
import { logAudit } from '../services/audit.service.js';

export async function logoutHandler(req, reply) {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return reply.code(400).send({ message: 'Refresh token is required' });
  }

  await revokeRefreshToken(refresh_token);

  await logAudit({
    userId: req.user.id,
    tenantId: req.tenant?.id || null,
    action: 'LOGOUT',
    description: 'User logged out and refresh token revoked',
    req
  });

  return reply.send({ success: true, message: 'Logged out successfully' });
}
