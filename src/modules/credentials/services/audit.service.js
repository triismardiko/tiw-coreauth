// src/modules/credentials/services/audit.service.js
import prisma from '../../../plugins/prisma.js';

export async function logAudit({ userId = null, action, description, req }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        tenantId: req.tenant?.id,
        action,
        description,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });
  } catch (err) {
    console.error('Audit log error:', err);
  }
}
