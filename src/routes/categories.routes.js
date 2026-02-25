// src/routes/categories.routes.js
// Category routes

import { categoriesController } from '../controllers/categories.controller.js';

/**
 * Register category routes
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} opts - Route options
 */
export default async function categoryRoutes(fastify, opts) {
  // Authentication middleware (reuse from auth routes)
  const requireAuth = async (request, reply) => {
    try {
      await request.jwtVerify();
      request.user = request.user || {};
    } catch (err) {
      reply.redirect('/admin/auth/login');
    }
  };

  // GET /admin/categories - List all categories
  fastify.get('/', {
    preHandler: requireAuth,
    handler: categoriesController.list.bind(categoriesController),
  });

  // GET /admin/categories/new - Show new category form
  fastify.get('/new', {
    preHandler: requireAuth,
    handler: categoriesController.showNewForm.bind(categoriesController),
  });

  // POST /admin/categories - Create category
  fastify.post('/', {
    preHandler: requireAuth,
    handler: categoriesController.create.bind(categoriesController),
  });

  // GET /admin/categories/:id/edit - Show edit form
  fastify.get('/:id/edit', {
    preHandler: requireAuth,
    handler: categoriesController.showEditForm.bind(categoriesController),
  });

  // PUT /admin/categories/:id - Update category
  fastify.put('/:id', {
    preHandler: requireAuth,
    handler: categoriesController.update.bind(categoriesController),
  });

  // DELETE /admin/categories/:id - Delete category
  fastify.delete('/:id', {
    preHandler: requireAuth,
    handler: categoriesController.delete.bind(categoriesController),
  });

  // GET /admin/categories/check-slug - Check slug availability
  fastify.get('/check-slug', {
    preHandler: requireAuth,
    handler: categoriesController.checkSlug.bind(categoriesController),
  });
}
