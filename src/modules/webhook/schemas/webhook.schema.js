// File: src/modules/webhook/schemas/webhook.schema.js

export const webhookSchemas = {
  payment: {
    tags: ['Webhook'],
    summary: 'Handle payment webhook callback',
    body: {
      type: 'object',
      required: ['external_id', 'status'],
      properties: {
        external_id: { type: 'string' },
        status: { type: 'string' },
        amount: { type: 'number' }
      }
    }
  }
};
