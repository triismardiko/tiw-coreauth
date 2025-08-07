import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      permissions: {
        connectOrCreate: [
          { where: { name: 'manage_users' }, create: { name: 'manage_users' } },
          { where: { name: 'manage_roles' }, create: { name: 'manage_roles' } },
          { where: { name: 'view_audit_logs' }, create: { name: 'view_audit_logs' } }
        ]
      }
    }
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      permissions: {}
    }
  });

  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@widyawan.id' },
    update: {},
    create: {
      email: 'admin@widyawan.id',
      password: hashedPassword,
      name: 'Admin Widyawan',
      roleId: adminRole.id
    }
  });

  await prisma.apiKey.create({
    data: {
      label: 'Default Integration Key',
      key: nanoid(32),
    }
  });

  const tenant = await prisma.tenant.upsert({
  where: { code: 'default' },
  update: {},
  create: {
    name: 'Default Tenant',
    code: 'default'
  }
});


const permissions = [
  { code: 'user:create', name: 'Create User' },
  { code: 'user:read', name: 'Read User' },
  { code: 'user:update', name: 'Update User' },
  { code: 'user:delete', name: 'Delete User' },
  { code: 'audit:read', name: 'Read Audit Logs' }
];

for (const p of permissions) {
  await prisma.permission.upsert({
    where: { code: p.code },
    update: {},
    create: p
  });
}

await prisma.role.upsert({
  where: { name: 'admin' },
  update: {},
  create: {
    name: 'admin',
    description: 'Administrator',
    permissions: {
      connect: permissions.map(p => ({ code: p.code }))
    }
  }
});

}

main()
  .then(() => {
    console.log('✅ Seed data inserted');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
