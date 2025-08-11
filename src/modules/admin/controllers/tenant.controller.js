// File: src/modules/admin/controllers/tenant.controller.js

import prisma from '../../../plugins/prisma.js';
import { logAudit } from '../../credentials/services/audit.service.js';

export async function listTenants(req, reply) {
  const tenants = await prisma.tenant.findMany();

  await logAudit({
    userId: req.user.id,
    tenantId: req.tenant.id,
    action: 'TENANT_LIST_VIEWED',
    description: 'Admin viewed tenant list',
    req
  });

  return tenants;
}

export async function createTenant(req, reply) {
  const { name, code } = req.body;

  const existing = await prisma.tenant.findUnique({ where: { code } });
  if (existing) {
    return reply.code(400).send({ message: 'Tenant code already exists' });
  }

  const tenant = await prisma.tenant.create({
    data: { name, code }
  });

  await logAudit({
    userId: req.user.id,
    tenantId: req.tenant.id,
    action: 'TENANT_CREATED',
    description: `Created tenant ${code}`,
    req
  });

  return reply.code(201).send(tenant);
}
