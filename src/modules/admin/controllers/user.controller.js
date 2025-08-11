// File: src/modules/admin/controllers/user.controller.js

import prisma from '../../../plugins/prisma.js';
import { logAudit } from '../../credentials/services/audit.service.js';
import bcrypt from 'bcryptjs';

export async function listUsers(req, reply) {
  const users = await prisma.user.findMany({
    where: { tenantId: req.tenant.id },
    include: { role: true }
  });

  await logAudit({
    userId: req.user.id,
    tenantId: req.tenant.id,
    action: 'USER_LIST_VIEWED',
    description: 'Admin viewed user list',
    req
  });

  return users;
}

export async function createUser(req, reply) {
  const { name, email, password, roleName } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      tenant: { connect: { id: req.tenant.id } },
      role: { connect: { name: roleName } }
    },
    include: { role: true }
  });

  await logAudit({
    userId: req.user.id,
    tenantId: req.tenant.id,
    action: 'USER_CREATED',
    description: `Created user ${email}`,
    req
  });

  return reply.code(201).send(user);
}

export async function updateUser(req, reply) {
  const { id } = req.params;
  const { name, roleName, isActive } = req.body;

  const user = await prisma.user.update({
    where: { id: parseInt(id), tenantId: req.tenant.id },
    data: {
      name,
      role: roleName ? { connect: { name: roleName } } : undefined,
      isActive
    },
    include: { role: true }
  });

  await logAudit({
    userId: req.user.id,
    tenantId: req.tenant.id,
    action: 'USER_UPDATED',
    description: `Updated user ID ${id}`,
    req
  });

  return user;
}

export async function deleteUser(req, reply) {
  const { id } = req.params;

  const user = await prisma.user.update({
    where: { id: parseInt(id), tenantId: req.tenant.id },
    data: { isActive: false }
  });

  await logAudit({
    userId: req.user.id,
    tenantId: req.tenant.id,
    action: 'USER_DISABLED',
    description: `Disabled user ID ${id}`,
    req
  });

  return reply.send({ message: 'User disabled', user });
}
