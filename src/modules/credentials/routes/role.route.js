import {
  getRoles,
  getPermissions,
  updateRolePermissions
} from '../controllers/role.controller.js';
import { resolveTenant } from '../middlewares/resolveTenant.js';
import { verifyRole } from '../middlewares/verifyRole.js';

export default async function roleRoutes(fastify) {
  fastify.get('/roles', { preHandler: [resolveTenant, verifyRole('admin')] }, getRoles);
  fastify.get('/permissions', { preHandler: [resolveTenant, verifyRole('admin')] }, getPermissions);
  fastify.put('/roles/:roleId/permissions', { preHandler: [resolveTenant, verifyRole('admin')] }, updateRolePermissions);
}
