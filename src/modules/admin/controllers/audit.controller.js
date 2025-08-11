// File: src/modules/admin/controllers/audit.controller.js

import prisma from '../../../plugins/prisma.js';

export async function getAuditLogs(req, reply) {
  const { userId, action, limit = 50, page = 1 } = req.query;

  const where = {
    tenantId: req.tenant.id,
    ...(userId && { userId: parseInt(userId) }),
    ...(action && { action })
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    }),
    prisma.auditLog.count({ where })
  ]);

  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    data: logs
  };
}
