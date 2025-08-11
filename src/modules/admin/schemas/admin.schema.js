// File: src/modules/admin/schemas/admin.schema.js

export const adminSchema = {
  tags: ['admin'],
  summary: 'Example schema',
};

export const adminUserSchemas = {
  listUsers: {
    tags: ['Admin'],
    summary: 'List all users',
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            isActive: { type: 'boolean' },
            role: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            }
          }
        }
      }
    }
  },

  createUser: {
    tags: ['Admin'],
    summary: 'Create a new user',
    body: {
      type: 'object',
      required: ['name', 'email', 'password', 'roleName'],
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        roleName: { type: 'string' }
      }
    }
  },

  updateUser: {
    tags: ['Admin'],
    summary: 'Update an existing user',
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        roleName: { type: 'string' },
        isActive: { type: 'boolean' }
      }
    }
  }
};

export const adminTenantSchemas = {
  listTenants: {
    tags: ['Admin'],
    summary: 'List all tenants'
  },

  createTenant: {
    tags: ['Admin'],
    summary: 'Create new tenant',
    body: {
      type: 'object',
      required: ['name', 'code'],
      properties: {
        name: { type: 'string' },
        code: { type: 'string' }
      }
    }
  }
};

export const adminAuditSchemas = {
  getAuditLogs: {
    tags: ['Admin'],
    summary: 'List audit logs',
    querystring: {
      type: 'object',
      properties: {
        userId: { type: 'integer' },
        action: { type: 'string' },
        page: { type: 'integer', default: 1 },
        limit: { type: 'integer', default: 50 }
      }
    }
  }
};
