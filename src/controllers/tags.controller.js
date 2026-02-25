// src/controllers/tags.controller.js
// Tags controller - handles tag HTTP requests

import { tagsService } from '../services/tags.service.js';

/**
 * Tags Controller
 * Handles tag-related HTTP requests
 */
class TagsController {
  /**
   * GET /admin/tags
   * List all tags
   */
  async list(request, reply) {
    try {
      const user = request.user;
      const {
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
      } = request.query;

      // Get tags with pagination
      const { data: tags, pagination } = await tagsService.getAll({
        search,
        sortBy,
        sortOrder,
        page: parseInt(page, 10) || 1,
        limit: 10,
      });

      // Check if HTMX request
      const isHtmx = request.headers['hx-request'] === 'true';

      if (isHtmx) {
        // Return only table fragment
        return reply.type('text/html').send(tagsTableFragment({
          tags,
          pagination,
        }));
      }

      // Import tags list template
      const { tagsListPage } = await import('../templates/admin/pages/tags/index.js');

      return reply.type('text/html').send(
        tagsListPage({
          user,
          tags,
          pagination,
          filters: { search },
        })
      );
    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load tags.',
      }));
    }
  }

  /**
   * GET /admin/tags/new
   * Show new tag form
   */
  async showNewForm(request, reply) {
    try {
      const user = request.user;

      // Import new tag template
      const { tagNewPage } = await import('../templates/admin/pages/tags/index.js');

      return reply.type('text/html').send(
        tagNewPage({ user })
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
   * POST /admin/tags
   * Create a new tag
   */
  async create(request, reply) {
    try {
      const user = request.user;
      const { name, slug, description, colorClass } = request.body;

      // Validate required fields
      if (!name) {
        reply.code(400);
        return reply.type('text/html').send(errorFragment({
          message: 'Name is required.',
        }));
      }

      // Create tag
      const tag = await tagsService.create({
        name,
        slug,
        description,
        colorClass: colorClass || 'badge--primary',
      }, user.id);

      // Redirect to edit page with toast notification
      reply.header('HX-Location', `/admin/tags/${tag.id}/edit`);
      reply.header('HX-Trigger', JSON.stringify({ "htmx:toast": { message: 'Tag created successfully!', type: 'success' } }));
      return reply.type('text/html').send('');
    } catch (error) {
      request.log.error(error);
      reply.code(400);
      return reply.type('text/html').send(errorFragment({
        message: error.message || 'Failed to create tag.',
      }));
    }
  }

  /**
   * GET /admin/tags/:id/edit
   * Show edit tag form
   */
  async showEditForm(request, reply) {
    try {
      const user = request.user;
      const { id } = request.params;

      // Get tag
      const tag = await tagsService.getById(id);
      if (!tag) {
        reply.code(404);
        return reply.type('text/html').send(errorFragment({
          message: 'Tag not found.',
        }));
      }

      // Import edit tag template
      const { tagEditPage } = await import('../templates/admin/pages/tags/index.js');

      return reply.type('text/html').send(
        tagEditPage({ user, tag })
      );
    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load tag.',
      }));
    }
  }

  /**
   * PUT /admin/tags/:id
   * Update a tag
   */
  async update(request, reply) {
    try {
      const user = request.user;
      const { id } = request.params;
      const { name, slug, description, colorClass } = request.body;

      // Check if tag exists
      const existing = await tagsService.getById(id);
      if (!existing) {
        reply.code(404);
        return reply.type('text/html').send(errorFragment({
          message: 'Tag not found.',
        }));
      }

      // Update tag
      await tagsService.update(id, {
        name,
        slug,
        description,
        colorClass,
      }, user.id);

      // Return success with toast notification
      reply.header('HX-Trigger', JSON.stringify({ "htmx:toast": { message: 'Tag updated successfully!', type: 'success' } }));
      return reply.type('text/html').send('');
    } catch (error) {
      request.log.error(error);
      reply.code(400);
      return reply.type('text/html').send(errorFragment({
        message: error.message || 'Failed to update tag.',
      }));
    }
  }

  /**
   * DELETE /admin/tags/:id
   * Delete a tag
   */
  async delete(request, reply) {
    try {
      const user = request.user;
      const { id } = request.params;

      // Delete tag
      await tagsService.delete(id, user.id);

      // Redirect to list with toast notification
      reply.header('HX-Location', '/admin/tags');
      reply.header('HX-Trigger', JSON.stringify({ "htmx:toast": { message: 'Tag deleted successfully!', type: 'success' } }));
      return reply.type('text/html').send('');
    } catch (error) {
      request.log.error(error);
      reply.code(400);
      return reply.type('text/html').send(errorFragment({
        message: error.message || 'Failed to delete tag.',
      }));
    }
  }

  /**
   * GET /admin/tags/check-slug
   * Check if slug is available
   */
  async checkSlug(request, reply) {
    try {
      const { slug, excludeId } = request.query;

      if (!slug) {
        return reply.send({ available: false });
      }

      const existing = await tagsService.getBySlug(slug);
      const available = !existing || existing.id === excludeId;

      return reply.send({ available });
    } catch (error) {
      request.log.error(error);
      return reply.send({ available: false });
    }
  }
}

// Helper function for tags table fragment
function tagsTableFragment({ tags, pagination }) {
  if (!tags || tags.length === 0) {
    return `
      <div class="text-center py-12">
        <i data-lucide="tag" class="w-16 h-16 mx-auto mb-4 text-gray-300"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No tags found</h3>
        <p class="text-gray-500 mb-4">Get started by creating your first tag.</p>
        <a href="/admin/tags/new" class="btn btn--primary">
          <i data-lucide="plus"></i>
          Create Tag
        </a>
      </div>
    `;
  }

  const rows = tags.map((tag) => {
    const date = new Date(tag.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `
      <tr class="table__tr">
        <td class="table__td">
          <span class="table__label">Name</span>
          <div class="table__title">
            <a href="/admin/tags/${tag.id}/edit">${tag.name}</a>
          </div>
        </td>
        <td class="table__td">
          <span class="table__label">Slug</span>
          <div class="table__slug">${tag.slug}</div>
        </td>
        <td class="table__td">
          <span class="table__label">Description</span>
          <div class="table__title">${tag.description || '-'}</div>
        </td>
        <td class="table__td">
          <span class="table__label">Posts</span>
          <span class="badge badge--neutral">${tag.postCount || 0}</span>
        </td>
        <td class="table__td">
          <span class="table__label">Date</span>
          ${date}
        </td>
        <td class="table__td table__td--actions">
          <div class="btn-group__actions">
            <a href="/admin/tags/${tag.id}/edit" class="btn--action btn--action--edit">
              <i data-lucide="pencil"></i>
              <span class="btn--action__text">Edit</span>
            </a>
            <button class="btn--action btn--action--delete" data-hs-overlay="#deleteModal" onclick="setDeleteId('${tag.id}')">
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
            <th>Name</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Posts</th>
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
export const tagsController = new TagsController();
export default tagsController;
