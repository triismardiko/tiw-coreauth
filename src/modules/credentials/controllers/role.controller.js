// File: src/modules/credentials/controllers/role.controller.js
import prisma from '../../../plugins/prisma.js';
import { logAudit } from '../services/audit.service.js';

export async function getRoles(req, reply) {
  const roles = await prisma.role.findMany({
    where: { users: { some: { tenantId: req.tenant.id } } },
    include: { permissions: true }
  });

  await logAudit({
    userId: req.user.id,
    tenantId: req.tenant.id,
    action: 'ROLE_LIST_VIEWED',
    description: 'Admin viewed roles list',
    req
  });

  return roles;
}

export async function getPermissions(req, reply) {
  const permissions = await prisma.permission.findMany();

  await logAudit({
    userId: req.user.id,
    tenantId: req.tenant.id,
    action: 'PERMISSION_LIST_VIEWED',
    description: 'Admin viewed permissions list',
    req
  });

  return permissions;
}

export async function updateRolePermissions(req, reply) {
  const { roleId } = req.params;
  const { permissionCodes } = req.body;

  const updated = await prisma.role.update({
    where: { id: parseInt(roleId) },
    data: {
      permissions: {
        set: [],
        connect: permissionCodes.map(code => ({ code }))
      }
    },
    include: { permissions: true }
  });

  await logAudit({
    userId: req.user.id,
    tenantId: req.tenant.id,
    action: 'ROLE_PERMISSION_UPDATED',
    description: `Updated permissions for role ID ${roleId}`,
    req
  });

  return updated;
}