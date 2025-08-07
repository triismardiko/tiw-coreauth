import { logAudit } from '../services/audit.service.js';

export async function getSecuredData(req, reply) {
  await logAudit({
    action: 'API_KEY_ACCESS',
    description: `Accessed /external/data using API Key: ${req.apiKey.label}`,
    req
  });

  return {
    message: 'Access granted via API Key',
    apiKeyLabel: req.apiKey?.label
  };
}
