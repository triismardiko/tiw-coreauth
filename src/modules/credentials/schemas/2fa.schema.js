export const setup2FASchema = {
  tags: ['2FA'],
  summary: 'Setup 2FA for user',
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        qrCode: { type: 'string' },
        base32: { type: 'string' }
      }
    }
  }
};

export const verify2FASchema = {
  tags: ['2FA'],
  summary: 'Verify 2FA OTP',
  body: {
    type: 'object',
    required: ['email', 'token'],
    properties: {
      email: { type: 'string', format: 'email' },
      token: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        verified: { type: 'boolean' }
      }
    }
  }
};