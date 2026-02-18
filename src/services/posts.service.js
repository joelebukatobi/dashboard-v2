// src/services/posts.service.js
import { db, posts, categories, tags, postTags, users, mediaItems } from '../db/index.js';
import { eq, and, desc, asc, like, sql } from 'drizzle-orm';

/**
 * Posts Service
 * Handles all post-related database operations
 * Following Single Responsibility Principle
 */
class PostsService {
  /**
   * Get all posts with filters and pagination
   * @param {Object} options - Query options
   * @param {string} [options.status] - Filter by status (DRAFT, PUBLISHED, ARCHIVED, SCHEDULED)
   * @param {string} [options.categoryId] - Filter by category
   * @param {string} [options.search] - Search in title
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.limit=10] - Posts per page
   * @param {string} [options.sortBy='createdAt'] - Sort field
   * @param {string} [options.sortOrder='desc'] - Sort order (asc, desc)
   * @returns {Promise<Object>} - { posts, total, page, totalPages }
   */
  async getAllPosts(options = {}) {
    const {
      status,
      categoryId,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    // Build where conditions
    const whereConditions = [];
    
    if (status) {
      whereConditions.push(eq(posts.status, status));
    }
    
    if (categoryId) {
      whereConditions.push(eq(posts.categoryId, categoryId));
    }
    
    if (search) {
      whereConditions.push(like(posts.title, `%${search}%`));
    }

    // Get total count
    const countQuery = db.select({ count: sql`count(*)` }).from(posts);
    if (whereConditions.length > 0) {
      countQuery.where(and(...whereConditions));
    }
    const [{ count }] = await countQuery;
    const total = Number(count);

    // Get posts with relations
    let query = db
      .select({
        post: posts,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
        category: {
          id: categories.id,
          title: categories.title,
          slug: categories.slug,
          colorClass: categories.colorClass,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id));

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    // Sorting
    const sortColumn = posts[sortBy] || posts.createdAt;
    query = sortOrder === 'asc' 
      ? query.orderBy(asc(sortColumn))
      : query.orderBy(desc(sortColumn));

    // Pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);

    const results = await query;

    // Format results
    const formattedPosts = results.map(r => ({
      ...r.post,
      author: r.author,
      category: r.category,
    }));

    return {
      posts: formattedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get post by ID with full details
   * @param {string} id - Post UUID
   * @returns {Promise<Object|null>} - Post with relations or null
   */
  async getPostById(id) {
    const result = await db
      .select({
        post: posts,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        },
        category: {
          id: categories.id,
          title: categories.title,
          slug: categories.slug,
          colorClass: categories.colorClass,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.id, id))
      .limit(1);

    if (!result[0]) return null;

    // Get tags for this post
    const tagsResult = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
      })
      .from(postTags)
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, id));

    return {
      ...result[0].post,
      author: result[0].author,
      category: result[0].category,
      tags: tagsResult,
    };
  }

  /**
   * Get post by slug
   * @param {string} slug - Post slug
   * @returns {Promise<Object|null>} - Post or null
   */
  async getPostBySlug(slug) {
    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Create new post
   * @param {Object} data - Post data
   * @param {string} userId - Author user ID
   * @returns {Promise<Object>} - Created post
   */
  async createPost(data, userId) {
    const {
      title,
      slug,
      content,
      excerpt,
      categoryId,
      tagIds = [],
      status = 'DRAFT',
      metaTitle,
      metaDescription,
      featuredImageId,
    } = data;

    // Check for duplicate slug
    const existing = await this.getPostBySlug(slug);
    if (existing) {
      throw new Error('A post with this slug already exists');
    }

    // Create post
    const [post] = await db
      .insert(posts)
      .values({
        title,
        slug,
        content,
        excerpt,
        categoryId,
        authorId: userId,
        status,
        metaTitle,
        metaDescription,
        featuredImageId,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      })
      .returning();

    // Add tags if provided
    if (tagIds.length > 0) {
      await this.updatePostTags(post.id, tagIds);
    }

    // Increment category post count
    if (status === 'PUBLISHED') {
      await this.incrementCategoryPostCount(categoryId);
    }

    return this.getPostById(post.id);
  }

  /**
   * Update existing post
   * @param {string} id - Post ID
   * @param {Object} data - Post data
   * @returns {Promise<Object>} - Updated post
   */
  async updatePost(id, data) {
    const post = await this.getPostById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    const {
      title,
      slug,
      content,
      excerpt,
      categoryId,
      tagIds,
      status,
      metaTitle,
      metaDescription,
      featuredImageId,
    } = data;

    // Check for slug conflict if changed
    if (slug && slug !== post.slug) {
      const existing = await this.getPostBySlug(slug);
      if (existing && existing.id !== id) {
        throw new Error('A post with this slug already exists');
      }
    }

    // Determine if publishing for first time
    const wasPublished = post.status === 'PUBLISHED';
    const isPublishing = status === 'PUBLISHED' && !wasPublished;

    // Update post
    const [updated] = await db
      .update(posts)
      .set({
        title: title || post.title,
        slug: slug || post.slug,
        content: content || post.content,
        excerpt: excerpt !== undefined ? excerpt : post.excerpt,
        categoryId: categoryId || post.categoryId,
        status: status || post.status,
        metaTitle: metaTitle !== undefined ? metaTitle : post.metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : post.metaDescription,
        featuredImageId: featuredImageId !== undefined ? featuredImageId : post.featuredImageId,
        publishedAt: isPublishing ? new Date() : post.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    // Update tags if provided
    if (tagIds !== undefined) {
      await this.updatePostTags(id, tagIds);
    }

    // Update category counts if status changed
    if (status && status !== post.status) {
      if (status === 'PUBLISHED') {
        await this.incrementCategoryPostCount(categoryId || post.categoryId);
        if (post.categoryId !== categoryId) {
          await this.decrementCategoryPostCount(post.categoryId);
        }
      } else if (post.status === 'PUBLISHED') {
        await this.decrementCategoryPostCount(post.categoryId);
      }
    }

    return this.getPostById(id);
  }

  /**
   * Delete post
   * @param {string} id - Post ID
   * @returns {Promise<boolean>} - Success status
   */
  async deletePost(id) {
    const post = await this.getPostById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    // Delete post tags first
    await db.delete(postTags).where(eq(postTags.postId, id));

    // Delete post
    await db.delete(posts).where(eq(posts.id, id));

    // Decrement category count if was published
    if (post.status === 'PUBLISHED') {
      await this.decrementCategoryPostCount(post.categoryId);
    }

    return true;
  }

  /**
   * Update post tags
   * @param {string} postId - Post ID
   * @param {Array<string>} tagIds - Tag IDs
   */
  async updatePostTags(postId, tagIds) {
    // Remove existing tags
    await db.delete(postTags).where(eq(postTags.postId, postId));

    // Add new tags
    if (tagIds.length > 0) {
      const tagValues = tagIds.map(tagId => ({
        postId,
        tagId,
      }));
      await db.insert(postTags).values(tagValues);
    }
  }

  /**
   * Increment category post count
   * @param {string} categoryId - Category ID
   */
  async incrementCategoryPostCount(categoryId) {
    if (!categoryId) return;
    
    await db
      .update(categories)
      .set({
        postCount: sql`${categories.postCount} + 1`,
      })
      .where(eq(categories.id, categoryId));
  }

  /**
   * Decrement category post count
   * @param {string} categoryId - Category ID
   */
  async decrementCategoryPostCount(categoryId) {
    if (!categoryId) return;
    
    await db
      .update(categories)
      .set({
        postCount: sql`${categories.postCount} - 1`,
      })
      .where(eq(categories.id, categoryId));
  }

  /**
   * Get recent posts
   * @param {number} [limit=5] - Number of posts
   * @returns {Promise<Array>} - Recent posts
   */
  async getRecentPosts(limit = 5) {
    const results = await db
      .select({
        post: posts,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.status, 'PUBLISHED'))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);

    return results.map(r => ({
      ...r.post,
      author: r.author,
    }));
  }

  /**
   * Get top posts by view count
   * @param {number} [limit=5] - Number of posts
   * @returns {Promise<Array>} - Top posts
   */
  async getTopPosts(limit = 5) {
    const results = await db
      .select({
        post: posts,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.status, 'PUBLISHED'))
      .orderBy(desc(posts.viewCount))
      .limit(limit);

    return results.map(r => ({
      ...r.post,
      author: r.author,
    }));
  }

  /**
   * Get posts count
   * @param {Object} [filters] - Optional filters
   * @returns {Promise<number>} - Total count
   */
  async getPostsCount(filters = {}) {
    const { status } = filters;
    
    let query = db.select({ count: sql`count(*)` }).from(posts);
    
    if (status) {
      query = query.where(eq(posts.status, status));
    }
    
    const [{ count }] = await query;
    return Number(count);
  }
}

// Export singleton
export const postsService = new PostsService();
export default postsService;
