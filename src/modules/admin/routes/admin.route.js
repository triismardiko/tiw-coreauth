// File: src/modules/admin/routes/admin.route.js

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
  getAuditLogs
} from '../controllers/audit.controller.js';

import {
  adminUserSchemas,
  adminTenantSchemas,
  adminAuditSchemas
} from '../schemas/admin.schema.js';

import { resolveTenant } from '../../credentials/middlewares/resolveTenant.js';
import { verifyRole } from '../../credentials/middlewares/verifyRole.js';

export default async function adminRoutes(fastify) {
  const adminOnly = [resolveTenant, verifyRole('admin')];

  // Users
  fastify.get('/admin/users', { preHandler: adminOnly, schema: adminUserSchemas.listUsers }, listUsers);
  fastify.post('/admin/users', { preHandler: adminOnly, schema: adminUserSchemas.createUser }, createUser);
  fastify.put('/admin/users/:id', { preHandler: adminOnly, schema: adminUserSchemas.updateUser }, updateUser);
  fastify.delete('/admin/users/:id', { preHandler: adminOnly }, deleteUser);

  // Tenants
  fastify.get('/admin/tenants', { preHandler: adminOnly, schema: adminTenantSchemas.listTenants }, listTenants);
  fastify.post('/admin/tenants', { preHandler: adminOnly, schema: adminTenantSchemas.createTenant }, createTenant);

  // Audit Logs
  fastify.get('/admin/audit-logs', { preHandler: adminOnly, schema: adminAuditSchemas.getAuditLogs }, getAuditLogs);
}
