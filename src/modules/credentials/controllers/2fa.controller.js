// src/modules/credentials/controllers/2fa.controller.js
import * as twoFAService from '../services/2fa.service.js';
import { logAudit } from '../services/audit.service.js';

export async function setup2FAHandler(req, reply) {
  const { email } = req.body;
  try {
    // proses setup
    await logAudit({
      action: '2FA_SETUP',
      description: `2FA setup initiated for ${email}`,
      req
    });
    return { qrCode: otpauthUrl, base32 };
  } catch (err) {
    await logAudit({
      action: '2FA_SETUP_FAILED',
      description: `2FA setup failed for ${email}`,
      req
    });
    throw err;
  }
}

export async function verify2FAHandler(req, reply) {
  const { email, token } = req.body;
  try {
    const isValid = true; // hasil verifikasi

    await logAudit({
      action: '2FA_VERIFY',
      description: `2FA verification for ${email}: ${isValid ? 'success' : 'failed'}`,
      req
    });

    return { verified: isValid };
  } catch (err) {
    await logAudit({
      action: '2FA_VERIFY_FAILED',
      description: `2FA verification error for ${email}`,
      req
    });

    throw err;
  }
}