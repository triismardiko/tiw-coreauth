// src/plugins/swagger.js
export default async function (fastify) {
  await fastify.register(import('fastify-swagger'), {
    routePrefix: '/docs',
    exposeRoute: true,
    swagger: {
      info: {
        title: 'Widyawan CoreAuth API',
        description: 'Authentication and Authorization API',
        version: '1.0.0',
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });
}
