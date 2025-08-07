# tiw-coreauth

Modular Node.js Fastify Boilerplate for Auth, RBAC, OAuth, Audit, and Multitenancy — built with Prisma, Passport.js, and JWT.

## Features
- 🔐 Login/Register with JWT
- 🔗 OAuth (Google, LinkedIn)
- 🔐 2FA / OTP
- 🎯 RBAC (Role & Permission Matrix)
- 🧾 Audit Trail
- 🧠 Multitenancy
- 🔑 API Key Support
- 🔁 Refresh Token Flow
- 🛠 CLI Generator

## Getting Started

```bash
cp .env.example .env
npm install
npx prisma generate
npm run dev
