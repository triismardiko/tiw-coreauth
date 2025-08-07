export function verifyRole(allowedRoles) {
  return async function (req, reply) {
    const role = req.user?.role;
    if (!allowedRoles.includes(role)) {
      return reply.code(403).send({ error: 'Access denied' });
    }
  };
}
