export const updateRolePermissionsSchema = {
  tags: ['Role Management'],
  summary: 'Update permissions for a role',
  body: {
    type: 'object',
    required: ['permissionCodes'],
    properties: {
      permissionCodes: {
        type: 'array',
        items: { type: 'string' }
      }
    }
  }
};