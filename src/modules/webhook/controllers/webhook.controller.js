// File: src/modules/webhook/controllers/webhook.controller.js

import crypto from 'crypto';
import { logAudit } from '../../credentials/services/audit.service.js';

const SHARED_SECRET = process.env.WEBHOOK_SECRET || 'default_secret';

export async function handlePaymentWebhook(req, reply) {
  const signature = req.headers['x-callback-token'];
  const body = req.body;

  // Signature verification (opsional, tergantung provider)
  if (signature !== SHARED_SECRET) {
    return reply.code(403).send({ message: 'Invalid signature' });
  }

  const { external_id, status, amount } = body;

  // Simpan / update pembayaran di DB
  // Misalnya, update tabel invoice

  // Simpan log audit
  await logAudit({
    userId: null,
    tenantId: null,
    action: 'WEBHOOK_RECEIVED',
    description: `Payment callback for ${external_id} with status ${status}`,
    metadata: body,
    req
  });

  return reply.send({ success: true });
}
