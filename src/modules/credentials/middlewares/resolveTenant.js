import prisma from '../../../plugins/prisma.js';

export async function resolveTenant(req, reply) {
  const tenantCode = req.headers['x-tenant'] || 'default';

  const tenant = await prisma.tenant.findUnique({
    where: { code: tenantCode }
  });

  if (!tenant) {
    return reply.code(404).send({ message: 'Tenant not found' });
  }

  req.tenant = tenant;
}
