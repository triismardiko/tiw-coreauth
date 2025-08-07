// src/modules/credentials/middlewares/logAccess.js
import { logAudit } from '../services/audit.service.js';

export function logAccess(action = 'ACCESS_ROUTE', description = '') {
  return async function (req, reply) {
    const userId = req.user?.id ?? null;
    await logAudit({ userId, action, description: description || req.url, req });
  };
}