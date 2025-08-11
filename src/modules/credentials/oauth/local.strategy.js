// src/modules/credentials/oauth/local.strategy.js
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import prisma from '../../../plugins/prisma.js';

export const setupLocalStrategy = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user) return done(null, false, { message: 'Invalid email' });

          if (user.lockedUntil && new Date() < user.lockedUntil) {
            return done(null, false, {
              message: `Account is locked until ${user.lockedUntil.toLocaleTimeString()}`
            });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            const attempts = (user.failedAttempts || 0) + 1;
            const lockThreshold = 5;

            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedAttempts: attempts,
                lockedUntil: attempts >= lockThreshold
                  ? new Date(Date.now() + 15 * 60 * 1000) // 15 menit
                  : null
              }
            });

            return done(null, false, {
              message: attempts >= lockThreshold
                ? 'Account locked due to too many failed attempts'
                : 'Invalid password'
            });
          }

          if (!user.isActive) return done(null, false, { message: 'Account inactive' });

          // reset gagal login
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedAttempts: 0,
              lockedUntil: null
            }
          });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};