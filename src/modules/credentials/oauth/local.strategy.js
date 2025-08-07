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
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return done(null, false, { message: 'Invalid email' });

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return done(null, false, { message: 'Invalid password' });

          if (!user.isActive) return done(null, false, { message: 'Account inactive' });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};