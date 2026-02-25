// src/routes/tags.routes.js
// Tags routes - admin tag management

import { tagsController } from '../controllers/tags.controller.js';

/**
 * Tags Routes
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} opts - Route options
 */
export default async function tagsRoutes(fastify, opts) {
  // All routes require authentication
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
      request.user = request.user || {};
    } catch (err) {
      reply.redirect('/admin/auth/login');
    }
  });

  // GET /admin/tags - List all tags
  fastify.get('/', tagsController.list.bind(tagsController));

  // GET /admin/tags/new - Show new tag form
  fastify.get('/new', tagsController.showNewForm.bind(tagsController));

  // POST /admin/tags - Create new tag
  fastify.post('/', tagsController.create.bind(tagsController));

  // GET /admin/tags/:id/edit - Show edit tag form
  fastify.get('/:id/edit', tagsController.showEditForm.bind(tagsController));

  // PUT /admin/tags/:id - Update tag
  fastify.put('/:id', tagsController.update.bind(tagsController));

  // DELETE /admin/tags/:id - Delete tag
  fastify.delete('/:id', tagsController.delete.bind(tagsController));

  // GET /admin/tags/check-slug - Check slug availability
  fastify.get('/check-slug', tagsController.checkSlug.bind(tagsController));
}
