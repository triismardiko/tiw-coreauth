// src/modules/credentials/services/auth.service.js
import bcrypt from 'bcryptjs';
import prisma from '../../../plugins/prisma.js';
import jwt from 'jsonwebtoken';
import fastifyPassport from 'fastify-passport';
import * as twoFAService from './2fa.service.js';
import { logAudit } from '../services/audit.service.js';

export async function register({ email, password, name }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('User already exists');

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      role: { connect: { name: 'user' } },
    },
  });
  return { id: user.id, email: user.email, name: user.name };
}

export async function login(req, reply) {
  return new Promise((resolve, reject) => {
    fastifyPassport.authenticate('local', async (err, user, info) => {
        
        if (!user || !isPasswordValid) {
                await logAudit({
                    action: 'LOGIN_FAILED',
                    description: `Failed login for ${email}`,
                    req
                });
                } else {
                await logAudit({
                    userId: user.id,
                    action: 'LOGIN_SUCCESS',
                    description: `User ${user.email} logged in`,
                    req
                });
            }
      if (err || !user) return reject(new Error(info?.message || 'Login failed'));


      // Check 2FA if enabled
      if (user.twoFASecret) {
        const token = req.body.otp;
        const verified = twoFAService.validateOTP(token, user.twoFASecret);
        if (!verified) return reject(new Error('Invalid OTP'));
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      resolve(token);
    })(req, reply);
  });
}
