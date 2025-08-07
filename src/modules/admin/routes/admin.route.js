import {
  listUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import {
  listTenants,
  createTenant
} from '../controllers/tenant.controller.js';
import {
  getRoles,
  updateRolePermissions
} from '../controllers/role.controller.js';
import { getPermissions } from '../controllers/permission.controller.js';
import { getAuditLogs } from '../controllers/audit.controller.js';

import { resolveTenant } from '../../credentials/middlewares/resolveTenant.js';
import { verifyRole } from '../../credentials/middlewares/verifyRole.js';

export default async function adminRoutes(fastify) {
  const adminOnly = [resolveTenant, verifyRole('admin')];

  // User
  fastify.get('/admin/users', { preHandler: adminOnly }, listUsers);
  fastify.post('/admin/users', { preHandler: adminOnly }, createUser);
  fastify.put('/admin/users/:id', { preHandler: adminOnly }, updateUser);
  fastify.delete('/admin/users/:id', { preHandler: adminOnly }, deleteUser);

  // Tenant
  fastify.get('/admin/tenants', { preHandler: adminOnly }, listTenants);
  fastify.post('/admin/tenants', { preHandler: adminOnly }, createTenant);

  // Role & Permission
  fastify.get('/admin/roles', { preHandler: adminOnly }, getRoles);
  fastify.put('/admin/roles/:id/permissions', { preHandler: adminOnly }, updateRolePermissions);
  fastify.get('/admin/permissions', { preHandler: adminOnly }, getPermissions);

  // Audit Log
  fastify.get('/admin/audit-logs', { preHandler: adminOnly }, getAuditLogs);
}