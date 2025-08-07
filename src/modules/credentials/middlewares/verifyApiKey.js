import prisma from '../../../plugins/prisma.js';
import { logAudit } from '../services/audit.service.js';

export async function verifyApiKey(req, reply) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    await logAudit({
      action: 'API_KEY_MISSING',
      description: 'Missing API Key in headers',
      req
    });
    return reply.code(401).send({ message: 'API Key required' });
  }

  const keyRecord = await prisma.apiKey.findUnique({ where: { key: apiKey } });

  if (!keyRecord || !keyRecord.isActive) {
    await logAudit({
      action: 'API_KEY_INVALID',
      description: `Invalid API Key: ${apiKey}`,
      req
    });
    return reply.code(403).send({ message: 'Invalid API Key' });
  }

  req.apiKey = keyRecord;
}
