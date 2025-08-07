#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.join(__dirname, 'widyawan-coreauth');

const folders = [
  "prisma",
  "src/config",
  "src/plugins",
  "src/modules/credentials/controllers",
  "src/modules/credentials/routes",
  "src/modules/credentials/services",
  "src/modules/credentials/schemas",
  "src/modules/credentials/middlewares",
  "src/modules/credentials/utils",
  "src/modules/credentials/oauth",
  "src/modules/credentials/entities"
];

const files = {
  ".env": `DATABASE_URL="mysql://user:password@localhost:3306/widyawan_coreauth"
JWT_SECRET="supersecret"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""
BINANCE_CLIENT_ID=""
BINANCE_CLIENT_SECRET=""`,

  "README.md": `# widyawan-coreauth

Modular Fastify boilerplate with Passport.js, Prisma, OAuth, 2FA, RBAC, and Swagger docs.
`,

  "package.json": `{
  "name": "widyawan-coreauth",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "dev": "node src/server.js",
    "seed": "node prisma/seed.js",
    "migrate": "prisma migrate dev --name init",
    "generate": "prisma generate"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "fastify": "^4.25.1",
    "fastify-cors": "^8.4.0",
    "fastify-jwt": "^6.3.0",
    "fastify-passport": "^3.0.3",
    "fastify-swagger": "^7.6.0",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.8",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-jwt": "^4.0.1",
    "passport-linkedin-oauth2": "^2.0.0",
    "passport-local": "^1.0.0",
    "prisma": "^5.7.1",
    "qrcode": "^1.5.3",
    "speakeasy": "^2.0.0"
  },
  "devDependencies": {
    "@prisma/client": "^5.7.1"
  }
}`,

  "src/app.js": `import Fastify from 'fastify';
import dotenv from 'dotenv';
dotenv.config();

const app = Fastify({ logger: true });

export default app;
`,

  "src/server.js": `import app from './app.js';

const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
`,

  "prisma/schema.prisma": `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id          Int     @id @default(autoincrement())
  email       String  @unique
  password    String
  name        String?
  isActive    Boolean @default(true)
  twoFASecret String? @map("two_fa_secret")
  provider    String  @default("local")
  roleId      Int
  role        Role    @relation(fields: [roleId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Role {
  id          Int          @id @default(autoincrement())
  name        String       @unique
  permissions Permission[] @relation("RolePermission")
  users       User[]
}

model Permission {
  id    Int     @id @default(autoincrement())
  name  String  @unique
  roles Role[]  @relation("RolePermission")
}
`,

  "prisma/seed.js": `import { PrismaClient } from '@prisma/client';
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
`
};

// Create folders
folders.forEach(folder => {
  const dirPath = path.join(basePath, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Create files
Object.entries(files).forEach(([filename, content]) => {
  const filePath = path.join(basePath, filename);
  fs.writeFileSync(filePath, content);
});

console.log("✅ Project 'widyawan-coreauth' generated successfully!");
