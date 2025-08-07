// src/modules/credentials/services/2fa.service.js
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import prisma from '../../../plugins/prisma.js';

export async function setup2FA(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const secret = speakeasy.generateSecret({ name: `WidyawanApp (${email})` });

  await prisma.user.update({
    where: { email },
    data: { twoFASecret: secret.base32 },
  });

  const qr = await qrcode.toDataURL(secret.otpauth_url);
  return { qrCode: qr, base32: secret.base32 };
}

export async function verify2FA(email, token) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.twoFASecret) throw new Error('2FA not configured');

  return validateOTP(token, user.twoFASecret);
}

export function validateOTP(token, secret) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,
  });
}
