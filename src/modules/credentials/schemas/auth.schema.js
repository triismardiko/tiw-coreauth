
export const registerSchema = {
  tags: ['Auth'],
  summary: 'Register new user',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      name: { type: 'string' }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            name: { type: 'string' }
          }
        }
      }
    }
  }
};

export const loginSchema = {
  tags: ['Auth'],
  summary: 'Login user',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
      otp: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' }
      }
    }
  }
};

export const refreshTokenSchema = {
  tags: ['Auth'],
  summary: 'Generate new access token using refresh token',
  body: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' }
      }
    }
  }
};