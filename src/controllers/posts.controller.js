// src/controllers/posts.controller.js
import { postsService } from '../services/posts.service.js';
import { db, categories, tags } from '../db/index.js';
import { eq } from 'drizzle-orm';

/**
 * Posts Controller
 * Handles post-related HTTP requests
 */
class PostsController {
  /**
   * GET /admin/posts
   * Display posts list page
   */
  async listPosts(request, reply) {
    try {
      const { 
        page = 1, 
        status, 
        category: categoryId,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = request.query;

      // Get posts with pagination
      const { posts, total, totalPages } = await postsService.getAllPosts({
        page: parseInt(page),
        status,
        categoryId,
        search,
        sortBy,
        sortOrder,
        limit: 10,
      });

      // Get categories for filter dropdown
      const allCategories = await db.select().from(categories);

      // Get counts by status
      const totalPosts = await postsService.getPostsCount();
      const publishedCount = await postsService.getPostsCount({ status: 'PUBLISHED' });
      const draftCount = await postsService.getPostsCount({ status: 'DRAFT' });
      const scheduledCount = await postsService.getPostsCount({ status: 'SCHEDULED' });

      const data = {
        posts,
        total,
        page: parseInt(page),
        totalPages,
        categories: allCategories,
        statusCounts: {
          total: totalPosts,
          published: publishedCount,
          draft: draftCount,
          scheduled: scheduledCount,
        },
        filters: {
          status,
          categoryId,
          search,
          sortBy,
          sortOrder,
        },
        user: request.user,
      };

      // Import template
      const { postsListPage } = await import('../templates/admin/pages/posts/index.js');

      return reply.type('text/html').send(postsListPage(data));

    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load posts. Please try again.'
      }));
    }
  }

  /**
   * GET /admin/posts/new
   * Display new post form
   */
  async showNewPostForm(request, reply) {
    try {
      // Get categories and tags for form
      const allCategories = await db.select().from(categories);
      const allTags = await db.select().from(tags);

      const data = {
        categories: allCategories,
        tags: allTags,
        post: null,
        user: request.user,
      };

      const { postNewPage } = await import('../templates/admin/pages/posts/index.js');

      return reply.type('text/html').send(postNewPage(data));

    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load post form. Please try again.'
      }));
    }
  }

  /**
   * POST /admin/posts
   * Create new post
   */
  async createPost(request, reply) {
    try {
      const {
        title,
        slug,
        content,
        excerpt,
        categoryId,
        tags: tagIdsString,
        status = 'DRAFT',
        metaTitle,
        metaDescription,
      } = request.body;

      // Validate required fields
      if (!title || !slug || !content) {
        reply.code(400);
        return reply.type('text/html').send(errorFragment({
          message: 'Title, slug, and content are required'
        }));
      }

      // Parse tags - handle both array (from multi-select) and comma-separated string
      const tagIds = Array.isArray(tagIdsString)
        ? tagIdsString.filter(Boolean)
        : tagIdsString
          ? tagIdsString.split(',').filter(Boolean)
          : [];

      // Create post
      const post = await postsService.createPost({
        title,
        slug,
        content,
        excerpt,
        categoryId,
        tagIds,
        status,
        metaTitle,
        metaDescription,
      }, request.user.id);

      // Send location for delayed redirect + toast trigger
      reply.header('HX-Location', `/admin/posts/${post.id}/edit`);
      reply.header('HX-Trigger', JSON.stringify({ "htmx:toast": { message: status === 'PUBLISHED' ? 'Post published successfully!' : 'Draft saved successfully!', type: 'success' } }));
      return reply.type('text/html').send('');

    } catch (error) {
      request.log.error(error);
      reply.code(400);
      return reply.type('text/html').send(errorFragment({
        message: error.message || 'Failed to create post. Please try again.'
      }));
    }
  }

  /**
   * GET /admin/posts/:id/edit
   * Display edit post form
   */
  async showEditPostForm(request, reply) {
    try {
      const { id } = request.params;
      
      const post = await postsService.getPostById(id);
      
      if (!post) {
        reply.code(404);
        return reply.type('text/html').send(errorFragment({
          message: 'Post not found'
        }));
      }

      // Get categories and tags for form
      const allCategories = await db.select().from(categories);
      const allTags = await db.select().from(tags);

      const data = {
        categories: allCategories,
        tags: allTags,
        post,
        user: request.user,
      };

      const { postEditPage } = await import('../templates/admin/pages/posts/index.js');

      return reply.type('text/html').send(postEditPage(data));

    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load post. Please try again.'
      }));
    }
  }

  /**
   * PUT /admin/posts/:id
   * Update existing post
   */
  async updatePost(request, reply) {
    try {
      const { id } = request.params;
      const {
        title,
        slug,
        content,
        excerpt,
        categoryId,
        tags: tagIdsString,
        status,
        metaTitle,
        metaDescription,
      } = request.body;

      // Validate required fields
      if (!title || !slug || !content) {
        reply.code(400);
        return reply.type('text/html').send(errorFragment({
          message: 'Title, slug, and content are required'
        }));
      }

      // Parse tags - handle both array (from multi-select) and comma-separated string
      const tagIds = Array.isArray(tagIdsString)
        ? tagIdsString.filter(Boolean)
        : tagIdsString
          ? tagIdsString.split(',').filter(Boolean)
          : undefined;

      // Update post
      const post = await postsService.updatePost(id, {
        title,
        slug,
        content,
        excerpt,
        categoryId,
        tagIds,
        status,
        metaTitle,
        metaDescription,
      });

      reply.header('HX-Trigger', JSON.stringify({ "htmx:toast": { message: status === 'PUBLISHED' ? 'Post updated and published!' : 'Draft updated successfully!', type: 'success' } }));
      return reply.type('text/html').send(successToast({
        message: status === 'PUBLISHED' ? 'Post updated and published!' : 'Draft updated successfully!'
      }));

    } catch (error) {
      request.log.error(error);
      reply.code(400);
      return reply.type('text/html').send(errorFragment({
        message: error.message || 'Failed to update post. Please try again.'
      }));
    }
  }

  /**
   * DELETE /admin/posts/:id
   * Delete post
   */
  async deletePost(request, reply) {
    try {
      const { id } = request.params;
      
      await postsService.deletePost(id);

      reply.header('HX-Location', '/admin/posts');
      reply.header('HX-Trigger', JSON.stringify({ "htmx:toast": { message: 'Post deleted successfully', type: 'success' } }));
      return reply.type('text/html').send('');

    } catch (error) {
      request.log.error(error);
      reply.code(400);
      return reply.type('text/html').send(errorFragment({
        message: error.message || 'Failed to delete post. Please try again.'
      }));
    }
  }

  /**
   * POST /admin/posts/:id/publish
   * Quick publish action
   */
  async publishPost(request, reply) {
    try {
      const { id } = request.params;
      
      await postsService.updatePost(id, { status: 'PUBLISHED' });

      reply.header('HX-Trigger', JSON.stringify({ "htmx:toast": { message: 'Post published successfully!', type: 'success' } }));
      return reply.type('text/html').send(successToast({
        message: 'Post published successfully!'
      }));

    } catch (error) {
      request.log.error(error);
      reply.code(400);
      return reply.type('text/html').send(errorFragment({
        message: error.message || 'Failed to publish post.'
      }));
    }
  }

  /**
   * POST /admin/posts/:id/unpublish
   * Quick unpublish action
   */
  async unpublishPost(request, reply) {
    try {
      const { id } = request.params;
      
      await postsService.updatePost(id, { status: 'DRAFT' });

      reply.header('HX-Trigger', JSON.stringify({ "htmx:toast": { message: 'Post moved to drafts', type: 'success' } }));
      return reply.type('text/html').send(successToast({
        message: 'Post moved to drafts'
      }));

    } catch (error) {
      request.log.error(error);
      reply.code(400);
      return reply.type('text/html').send(errorFragment({
        message: error.message || 'Failed to unpublish post.'
      }));
    }
  }

  /**
   * POST /admin/posts/upload-image
   * Upload featured image
   */
  async uploadImage(request, reply) {
    try {
      // Get uploaded file from multipart form
      const file = await request.file();
      
      if (!file) {
        reply.code(400);
        return reply.send({ error: 'No image file provided' });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.mimetype)) {
        reply.code(400);
        return reply.send({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' });
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.file.bytesRead > maxSize) {
        reply.code(400);
        return reply.send({ error: 'File too large. Max size: 10MB' });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const extension = file.filename.split('.').pop();
      const filename = `post-${timestamp}.${extension}`;
      const filepath = `public/uploads/posts/${filename}`;

      // Ensure uploads directory exists
      const fs = await import('fs/promises');
      const path = await import('path');
      const uploadsDir = path.join(process.cwd(), 'public/uploads/posts');
      
      try {
        await fs.access(uploadsDir);
      } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
      }

      // Save file
      const fullPath = path.join(process.cwd(), filepath);
      await fs.writeFile(fullPath, await file.toBuffer());

      // Create media record in database
      const { db, mediaItems } = await import('../db/index.js');
      const [mediaItem] = await db
        .insert(mediaItems)
        .values({
          type: 'IMAGE',
          filename,
          originalName: file.filename,
          mimeType: file.mimetype,
          size: file.file.bytesRead,
          path: filepath,
          uploadedBy: request.user.id,
        })
        .returning();

      return reply.send({
        id: mediaItem.id,
        url: `/${filepath}`,
        filename,
      });

    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.send({ error: 'Failed to upload image' });
    }
  }

  /**
   * GET /admin/posts/check-slug
   * Check if slug is available
   */
  async checkSlug(request, reply) {
    try {
      const { slug, excludeId } = request.query;
      
      if (!slug) {
        return reply.send({ available: false });
      }

      const existing = await postsService.getPostBySlug(slug);
      
      const available = !existing || existing.id === excludeId;
      
      return reply.send({ available });

    } catch (error) {
      request.log.error(error);
      return reply.send({ available: false });
    }
  }

  /**
   * POST /admin/posts/:id/view
   * Increment post view count
   * Public endpoint for blog tracking
   */
  async incrementViewCount(request, reply) {
    try {
      const { id } = request.params;
      
      await postsService.incrementViewCount(id);
      
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to track view' });
    }
  }
}

// Helper functions for fragments
function errorFragment({ message }) {
  return `
    <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800 mb-4" role="alert">
      <i data-lucide="alert-circle" class="w-5 h-5 shrink-0"></i>
      <span class="text-sm font-medium">${message}</span>
    </div>
  `;
}

function successFragment({ message }) {
  return `
    <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800 mb-4" role="alert">
      <i data-lucide="check-circle" class="w-5 h-5 shrink-0"></i>
      <span class="text-sm font-medium">${message}</span>
    </div>
  `;
}

function successToast({ message }) {
  return `
    <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800 mb-4" role="alert">
      <i data-lucide="check-circle" class="w-5 h-5 shrink-0"></i>
      <span class="text-sm font-medium">${message}</span>
    </div>
  `;
}

// Export singleton
export const postsController = new PostsController();
export default postsController;
