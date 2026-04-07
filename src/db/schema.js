// src/db/schema.js
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  serial,
  primaryKey,
  foreignKey,
  date,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// ENUMS
// ============================================

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'EDITOR', 'AUTHOR', 'VIEWER']);
export const userStatusEnum = pgEnum('user_status', ['ACTIVE', 'INVITED', 'SUSPENDED']);
export const postStatusEnum = pgEnum('post_status', ['PUBLISHED', 'DRAFT', 'ARCHIVED', 'SCHEDULED']);

export const commentStatusEnum = pgEnum('comment_status', ['PENDING', 'APPROVED', 'SPAM']);
export const mediaTypeEnum = pgEnum('media_type', ['IMAGE', 'VIDEO']);
export const settingGroupEnum = pgEnum('setting_group', ['GENERAL', 'SECURITY', 'CONTENT', 'EMAIL', 'SOCIAL']);
export const settingTypeEnum = pgEnum('setting_type', ['STRING', 'NUMBER', 'BOOLEAN', 'JSON']);
export const activityTypeEnum = pgEnum('activity_type', [
  'POST_CREATED', 'POST_UPDATED', 'POST_PUBLISHED', 'POST_DELETED',
  'CATEGORY_CREATED', 'CATEGORY_UPDATED', 'CATEGORY_DELETED',
  'TAG_CREATED', 'TAG_UPDATED', 'TAG_DELETED',
  'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'USER_INVITED', 'USER_SUSPENDED', 'USER_ACTIVATED',
  'IMAGE_UPLOADED', 'IMAGE_UPDATED', 'IMAGE_DELETED',
  'VIDEO_UPLOADED', 'VIDEO_UPDATED', 'VIDEO_DELETED',
  'LOGIN', 'LOGOUT', 'SETTINGS_UPDATED',
  'COMMENT_CREATED', 'SUBSCRIBER_CREATED'
]);
export const subscriberStatusEnum = pgEnum('subscriber_status', ['ACTIVE', 'PENDING', 'UNSUBSCRIBED', 'BOUNCED']);

// ============================================
// USERS
// ============================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  role: userRoleEnum('role').default('VIEWER').notNull(),
  status: userStatusEnum('status').default('ACTIVE').notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  emailVerified: boolean('email_verified').default(false).notNull(),
  invitedAt: timestamp('invited_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastActiveAt: timestamp('last_active_at'),
  failedLoginAttempts: integer('failed_login_attempts').default(0).notNull(),
  lockedUntil: timestamp('locked_until'),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  sessions: many(sessions),
  activities: many(activities),
}));

// ============================================
// SESSIONS
// ============================================

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 500 }).notNull().unique(),
  rememberMe: boolean('remember_me').default(false).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// ============================================
// PASSWORD RESETS
// ============================================

export const passwordResets = pgTable('password_resets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 500 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// CATEGORIES
// ============================================

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  postCount: integer('post_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

// ============================================
// TAGS
// ============================================

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  description: text('description'),
  postCount: integer('post_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

// ============================================
// POSTS
// ============================================

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featuredImageId: uuid('featured_image_id').references(() => mediaItems.id),
  authorId: uuid('author_id').notNull().references(() => users.id),
  categoryId: uuid('category_id').references(() => categories.id),
  status: postStatusEnum('status').default('DRAFT').notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  commentCount: integer('comment_count').default(0).notNull(),
  metaTitle: varchar('meta_title', { length: 60 }),
  metaDescription: varchar('meta_description', { length: 160 }),
  publishedAt: timestamp('published_at'),
  scheduledAt: timestamp('scheduled_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  featuredImage: one(mediaItems, {
    fields: [posts.featuredImageId],
    references: [mediaItems.id],
  }),
  postTags: many(postTags),
  comments: many(comments),
}));

// ============================================
// POST TAGS (Junction Table)
// ============================================

export const postTags = pgTable('post_tags', {
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.postId, table.tagId] }),
  };
});

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

// ============================================
// COMMENTS
// ============================================

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id').references(() => comments.id, { onDelete: 'cascade' }),
  authorName: varchar('author_name', { length: 100 }),
  authorEmail: varchar('author_email', { length: 255 }),
  content: text('content').notNull(),
  status: commentStatusEnum('status').default('APPROVED').notNull(),
  isEdited: boolean('is_edited').default(false).notNull(),
  editedAt: timestamp('edited_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));

// ============================================
// MEDIA ITEMS
// ============================================

export const mediaItems = pgTable('media_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: mediaTypeEnum('type').notNull(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  duration: integer('duration'),
  altText: varchar('alt_text', { length: 255 }),
  title: varchar('title', { length: 255 }),
  caption: text('caption'),
  description: text('description'),
  tag: varchar('tag', { length: 50 }),
  path: varchar('path', { length: 500 }).notNull(),
  thumbnailPath: varchar('thumbnail_path', { length: 500 }),
  hash: varchar('hash', { length: 64 }),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// SETTINGS
// ============================================

export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  group: settingGroupEnum('group').default('GENERAL').notNull(),
  type: settingTypeEnum('type').default('STRING').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// ACTIVITIES
// ============================================

export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  type: activityTypeEnum('type').notNull(),
  description: text('description').notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: uuid('entity_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

// ============================================
// ANALYTICS EVENTS
// ============================================

export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 50 }).notNull(),
  postId: uuid('post_id').references(() => posts.id),
  sessionId: varchar('session_id', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  path: varchar('path', { length: 500 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// DAILY PAGE VIEWS (for traffic analytics)
// ============================================

export const dailyPageViews = pgTable('daily_page_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date').notNull(),
  totalViews: integer('total_views').default(0).notNull(),
  uniqueVisitors: integer('unique_visitors').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  dateIdx: uniqueIndex('daily_page_views_date_idx').on(table.date),
}));

// ============================================
// SUBSCRIBERS
// ============================================

export const subscribers = pgTable('subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  status: subscriberStatusEnum('status').default('ACTIVE').notNull(),
  confirmedAt: timestamp('confirmed_at'),
  unsubscribedAt: timestamp('unsubscribed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// OAUTH ACCOUNTS
// ============================================

export const oauthAccounts = pgTable('oauth_accounts', {
  id: uuid('id').defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 50 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
  };
});
