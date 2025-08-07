import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import prisma from '../../../plugins/prisma.js';

export const setupOAuthStrategies = (passport) => {
  // GOOGLE
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: profile.displayName,
          provider: 'google',
          role: { connect: { name: 'user' } },
        }
      });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // LINKEDIN
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: '/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_liteprofile']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: profile.displayName,
          provider: 'linkedin',
          role: { connect: { name: 'user' } },
        }
      });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
};