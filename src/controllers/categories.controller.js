// src/controllers/categories.controller.js
// Categories controller - handles category HTTP requests

import { categoriesService } from '../services/categories.service.js';

/**
 * Categories Controller
 * Handles category-related HTTP requests
 */
class CategoriesController {
  /**
   * GET /admin/categories
   * List all categories
   */
  async list(request, reply) {
    try {
      const user = request.user;
      const {
        status,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
      } = request.query;

      // Get categories with pagination
      const { data: categories, pagination } = await categoriesService.getAll({
        status,
        search,
        sortBy,
        sortOrder,
        page: parseInt(page, 10) || 1,
        limit: 10,
      });

      // Get counts for filter tabs
      const counts = await categoriesService.getCounts();

      // Check if HTMX request
      const isHtmx = request.headers['hx-request'] === 'true';

      if (isHtmx) {
        // Return only table fragment
        return reply.type('text/html').send(categoriesTableFragment({
          categories,
          pagination,
          counts,
        }));
      }

      // Import categories list template
      const { categoriesListPage } = await import('../templates/admin/pages/categories/index.js');

      return reply.type('text/html').send(
        categoriesListPage({
          user,
          categories,
          pagination,
          counts,
          filters: { status, search },
        })
      );
    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load categories.',
      }));
    }
  }

  /**
   * GET /admin/categories/new
   * Show new category form
   */
  async showNewForm(request, reply) {
    try {
      const user = request.user;

      // Import new category template
      const { categoryNewPage } = await import('../templates/admin/pages/categories/index.js');

      return reply.type('text/html').send(
        categoryNewPage({ user })
      );
    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load form.',
      }));
    }
  }

  /**
   * POST /admin/categories
   * Create a new category
   */
  async create(request, reply) {
    try {
      const user = request.user;
      const { title, slug, description, status, colorClass } = request.body;

      // Validate required fields
      if (!title) {
        reply.code(400);
        return reply.type('text/html').send(errorFragment({
          message: 'Title is required.',
        }));
      }

      // Create category
      const category = await categoriesService.create({
        title,
        slug,
        description,
        status: status || 'PUBLISHED',
        colorClass: colorClass || 'badge--primary',
      }, user.id);

      // Redirect to edit page with toast notification
      reply.header('HX-Location', `/admin/categories/${category.id}/edit`);
      reply.header('HX-Trigger', JSON.stringify({ "htmx:toast": { message: 'Category created successfully!', type: 'success' } }));
      return reply.type('text/html').send('');
    } catch (error) {
      request.log.error(error);
      reply.code(400);
      return reply.type('text/html').send(errorFragment({
        message: error.message || 'Failed to create category.',
      }));
    }
  }

  /**
   * GET /admin/categories/:id/edit
   * Show edit category form
   */
  async showEditForm(request, reply) {
    try {
      const user = request.user;
      const { id } = request.params;

      // Get category
      const category = await categoriesService.getById(id);
      if (!category) {
        reply.code(404);
        return reply.type('text/html').send(errorFragment({
          message: 'Category not found.',
        }));
      }

      // Import edit category template
      const { categoryEditPage } = await import('../templates/admin/pages/categories/index.js');

      return reply.type('text/html').send(
        categoryEditPage({ user, category })
      );
    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load category.',
      }));
    }
  }

  /**
   * PUT /admin/categories/:id
   * Update a category
   */
  async update(request, reply) {
    try {
      const user = request.user;
      const { id } = request.params;
      const { title, slug, description, status, colorClass } = request.body;

      // Check if category exists
      const existing = await categoriesService.getById(id);
      if (!existing) {
        reply.code(404);
        return reply.type('text/html').send(errorFragment({
          message: 'Category not found.',
        }));
      }

      // Update category
      await categoriesService.update(id, {
        title,
        slug,
        description,
        status,
        colorClass,
      }, user.id);

      // Return success with toast notification
      reply.header('HX-Trigger', JSON.stringify({ "htmx:toast": { message: 'Category updated successfully!', type: 'success' } }));
      return reply.type('text/html').send('');
    } catch (error) {
      request.log.error(error);
      reply.code(400);
      return reply.type('text/html').send(errorFragment({
        message: error.message || 'Failed to update category.',
      }));
    }
  }

  /**
   * DELETE /admin/categories/:id
   * Delete a category
   */
  async delete(request, reply) {
    try {
      const user = request.user;
      const { id } = request.params;

      // Delete category
      await categoriesService.delete(id, user.id);

      // Redirect to list with toast notification
      reply.header('HX-Location', '/admin/categories');
      reply.header('HX-Trigger', JSON.stringify({ "htmx:toast": { message: 'Category deleted successfully!', type: 'success' } }));
      return reply.type('text/html').send('');
    } catch (error) {
      request.log.error(error);
      reply.code(400);
      return reply.type('text/html').send(errorFragment({
        message: error.message || 'Failed to delete category.',
      }));
    }
  }

  /**
   * GET /admin/categories/check-slug
   * Check if slug is available
   */
  async checkSlug(request, reply) {
    try {
      const { slug, excludeId } = request.query;

      if (!slug) {
        return reply.send({ available: false });
      }

      const existing = await categoriesService.getBySlug(slug);
      const available = !existing || existing.id === excludeId;

      return reply.send({ available });
    } catch (error) {
      request.log.error(error);
      return reply.send({ available: false });
    }
  }
}

// Helper function for categories table fragment
function categoriesTableFragment({ categories, pagination, counts }) {
  if (!categories || categories.length === 0) {
    return `
      <div class="text-center py-12">
        <i data-lucide="folder-open" class="w-16 h-16 mx-auto mb-4 text-gray-300"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
        <p class="text-gray-500 mb-4">Get started by creating your first category.</p>
        <a href="/admin/categories/new" class="btn btn--primary">
          <i data-lucide="plus"></i>
          Create Category
        </a>
      </div>
    `;
  }

  const rows = categories.map((category) => {
    const statusClass = category.status === 'PUBLISHED' ? 'status--success' : 'status--draft';
    const statusDot = category.status === 'PUBLISHED' ? 'status__dot--success' : '';
    const date = new Date(category.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `
      <tr class="table__tr">
        <td class="table__td">
          <span class="table__label">Title</span>
          <div class="table__title">
            <a href="/admin/categories/${category.id}/edit">${category.title}</a>
          </div>
        </td>
        <td class="table__td">
          <span class="table__label">Slug</span>
          <div class="table__slug">${category.slug}</div>
        </td>
        <td class="table__td">
          <span class="table__label">Description</span>
          <div class="table__title">${category.description || '-'}</div>
        </td>
        <td class="table__td">
          <span class="table__label">Status</span>
          <span class="status ${statusClass}">
            <span class="status__dot ${statusDot}"></span>
            ${category.status}
          </span>
        </td>
        <td class="table__td">
          <span class="table__label">Date</span>
          ${date}
        </td>
        <td class="table__td table__td--actions">
          <div class="btn-group__actions">
            <a href="/admin/categories/${category.id}/edit" class="btn--action btn--action--edit">
              <i data-lucide="pencil"></i>
              <span class="btn--action__text">Edit</span>
            </a>
            <button class="btn--action btn--action--delete" data-hs-overlay="#deleteModal" onclick="setDeleteId('${category.id}')">
              <i data-lucide="trash-2"></i>
              <span class="btn--action__text">Delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="table">
      <table class="table__table">
        <thead class="table__thead">
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody class="table__tbody">
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

// Helper function for error fragment
function errorFragment({ message }) {
  return `
    <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800" role="alert">
      <i data-lucide="alert-circle" class="w-5 h-5 shrink-0"></i>
      <span class="text-sm font-medium">${message}</span>
    </div>
  `;
}

// Export singleton
export const categoriesController = new CategoriesController();
export default categoriesController;
