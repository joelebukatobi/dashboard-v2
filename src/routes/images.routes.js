// src/routes/images.routes.js
// Images routes - admin media library

import { imagesController } from '../controllers/images.controller.js';

/**
 * Register image routes
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} opts - Route options
 */
export default async function imagesRoutes(fastify, opts) {
  // Authentication middleware
  const requireAuth = async (request, reply) => {
    try {
      await request.jwtVerify();
      request.user = request.user || {};
    } catch (err) {
      reply.redirect('/admin/auth/login');
    }
  };

  // GET /admin/media/images - List all images
  fastify.get('/', {
    preHandler: requireAuth,
    handler: imagesController.list.bind(imagesController),
  });

  // POST /admin/media/images - Upload image
  fastify.post('/', {
    preHandler: requireAuth,
    handler: imagesController.upload.bind(imagesController),
  });

  // GET /admin/media/images/:id/edit - Show edit form
  fastify.get('/:id/edit', {
    preHandler: requireAuth,
    handler: imagesController.showEditForm.bind(imagesController),
  });

  // PUT /admin/media/images/:id - Update image
  fastify.put('/:id', {
    preHandler: requireAuth,
    handler: imagesController.update.bind(imagesController),
  });

  // DELETE /admin/media/images/:id - Delete image
  fastify.delete('/:id', {
    preHandler: requireAuth,
    handler: imagesController.delete.bind(imagesController),
  });
}
