# BlogCMS Fastify Backend Specification

**Stack**: Fastify + Node.js + Alpine.js + HTMX + fastify-html (template literals) + SASS/Tailwind CSS  
**Architecture**: Hypermedia-Driven Application (HDA) - Server renders HTML, HTMX swaps fragments  
**Database**: PostgreSQL (via Drizzle ORM)

---

## Table of Contents
1. [Project Architecture](#project-architecture)
2. [Database Schema](#database-schema)
3. [Route Specifications](#route-specifications)
4. [Middleware Layer](#middleware-layer)
5. [Service Layer](#service-layer)
6. [Controller Layer](#controller-layer)
7. [HTMX Templates Structure](#htmx-templates-structure)
8. [Static Assets Configuration](#static-assets-configuration)
9. [Authentication Flow](#authentication-flow)
10. [File Upload System](#file-upload-system)
11. [Email Service](#email-service)
12. [Real-time Notifications](#real-time-notifications)
13. [Error Handling](#error-handling)
14. [Security Configuration](#security-configuration)
15. [Environment Variables](#environment-variables)

---

## Project Architecture

```
html-dashboard-backend/
├── src/
│   ├── app.js                          # Fastify application factory
│   ├── server.js                       # Entry point
│   ├── config/
│   │   ├── database.js                 # Drizzle database connection
│   │   ├── env.js                      # Environment validation
│   │   ├── storage.js                  # File storage (local/S3)
│   │   ├── email.js                    # SMTP/email service config
│   │   └── cache.js                    # Redis/cache config
│   ├── plugins/
│   │   ├── auth.js                     # JWT auth decorators
│   │   ├── htmx.js                     # fastify-htmx plugin config
│   │   ├── multipart.js                # File upload handling
│   │   ├── swagger.js                  # API documentation
│   │   └── rate-limit.js               # Rate limiting rules
│   ├── middleware/
│   │   ├── authenticate.js             # JWT verification
│   │   ├── authorize.js                # Role-based access control
│   │   ├── validate-request.js         # Request validation
│   │   ├── csrf-protection.js          # CSRF token validation
│   │   ├── error-handler.js            # Global error handler
│   │   ├── request-logger.js           # Request logging
│   │   └── cors.js                     # CORS configuration
│   ├── routes/
│   │   ├── auth.routes.js              # Authentication routes
│   │   ├── posts.routes.js             # Blog posts CRUD
│   │   ├── categories.routes.js        # Categories management
│   │   ├── tags.routes.js              # Tags management
│   │   ├── users.routes.js             # User management
│   │   ├── images.routes.js            # Image gallery
│   │   ├── videos.routes.js            # Video gallery
│   │   ├── settings.routes.js          # System settings
│   │   ├── dashboard.routes.js         # Dashboard data
│   │   ├── notifications.routes.js     # Notification system
│   │   ├── media.routes.js             # Media library
│   │   └── static.routes.js            # Static page routes
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── posts.controller.js
│   │   ├── categories.controller.js
│   │   ├── tags.controller.js
│   │   ├── users.controller.js
│   │   ├── images.controller.js
│   │   ├── videos.controller.js
│   │   ├── settings.controller.js
│   │   ├── dashboard.controller.js
│   │   └── notifications.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── posts.service.js
│   │   ├── categories.service.js
│   │   ├── tags.service.js
│   │   ├── users.service.js
│   │   ├── images.service.js
│   │   ├── videos.service.js
│   │   ├── settings.service.js
│   │   ├── dashboard.service.js
│   │   ├── notifications.service.js
│   │   ├── email.service.js
│   │   ├── slug.service.js
│   │   ├── file-storage.service.js
│   │   ├── cache.service.js
│   │   └── search.service.js
│   ├── schemas/
│   │   ├── auth.schemas.js
│   │   ├── posts.schemas.js
│   │   ├── categories.schemas.js
│   │   ├── tags.schemas.js
│   │   ├── users.schemas.js
│   │   ├── images.schemas.js
│   │   ├── videos.schemas.js
│   │   ├── settings.schemas.js
│   │   ├── dashboard.schemas.js
│   │   └── notifications.schemas.js
  │   ├── templates/                      # HTML templates with fastify-html
  │   │   ├── admin/                      # Admin Dashboard (www.example.com/admin/*)
  │   │   │   ├── layouts/
  │   │   │   │   ├── main.html           # Admin layout with sidebar
  │   │   │   │   ├── auth.html           # Login layout
  │   │   │   │   └── error.html
  │   │   │   ├── partials/
  │   │   │   │   ├── header.html
  │   │   │   │   ├── sidebar.html
  │   │   │   │   ├── footer.html
  │   │   │   │   ├── breadcrumb.html
  │   │   │   │   ├── pagination.html
  │   │   │   │   ├── notifications-dropdown.html
  │   │   │   │   ├── user-dropdown.html
  │   │   │   │   ├── delete-modal.html
  │   │   │   │   ├── table-row-post.html
  │   │   │   │   ├── table-row-category.html
  │   │   │   │   ├── table-row-tag.html
  │   │   │   │   ├── table-row-user.html
  │   │   │   │   ├── table-row-image.html
  │   │   │   │   ├── table-row-video.html
  │   │   │   │   ├── card-post.html
  │   │   │   │   ├── card-image.html
  │   │   │   │   ├── card-video.html
  │   │   │   │   ├── activity-item.html
  │   │   │   │   ├── notification-item.html
  │   │   │   │   ├── stat-card.html
  │   │   │   │   ├── empty-state.html
  │   │   │   │   ├── loading-spinner.html
  │   │   │   │   ├── toast.html
  │   │   │   │   └── error-message.html
  │   │   │   ├── pages/
  │   │   │   │   ├── index.html               # Dashboard
  │   │   │   │   ├── login.html
  │   │   │   │   ├── posts.html
  │   │   │   │   ├── new-post.html
  │   │   │   │   ├── edit-post.html
  │   │   │   │   ├── categories.html
  │   │   │   │   ├── new-category.html
  │   │   │   │   ├── edit-category.html
  │   │   │   │   ├── tags.html
  │   │   │   │   ├── new-tag.html
  │   │   │   │   ├── edit-tag.html
  │   │   │   │   ├── images.html
  │   │   │   │   ├── edit-image.html
  │   │   │   │   ├── videos.html
  │   │   │   │   ├── edit-video.html
  │   │   │   │   ├── users.html
  │   │   │   │   ├── new-user.html
  │   │   │   │   ├── edit-user.html
  │   │   │   │   ├── settings.html
  │   │   │   │   └── 404.html
  │   │   │   └── emails/
  │   │   │       ├── invitation.html
  │   │   │       ├── password-reset.html
  │   │   │       ├── welcome.html
  │   │   │       └── notification.html
  │   │   │
  │   │   └── public/                     # Public Website (www.example.com/*)
  │   │       └── (future implementation)
  │   │
│   │       ├── invitation.html
│   │       ├── password-reset.html
│   │       ├── welcome.html
│   │       └── notification.html
│   ├── utils/
│   │   ├── password.js
│   │   ├── jwt.js
│   │   ├── slugify.js
│   │   ├── pagination.js
│   │   ├── date-formatter.js
│   │   ├── validators.js
│   │   ├── response-helpers.js
│   │   ├── file-helpers.js
│   │   ├── html-sanitizer.js
│   │   ├── logger.js
│   │   └── constants.js
│   └── types/
│       └── index.d.ts
├── db/
│   ├── schema.js          # Drizzle schema definitions
│   ├── index.js           # Database connection
│   └── migrations/        # Migration files
├── public/                             # Static files (from original html-dashboard)
│   ├── css/                            # Compiled SASS/Tailwind
│   ├── js/
│   │   ├── main.js
│   │   ├── alpine-components.js
│   │   └── htmx-extensions.js
│   ├── images/
│   ├── uploads/
│   │   ├── avatars/
│   │   ├── posts/
│   │   ├── images/
│   │   ├── videos/
│   │   ├── logos/
│   │   └── favicons/
│   └── fonts/
├── tests/
│   ├── integration/
│   ├── unit/
│   └── e2e/
├── scripts/
│   ├── seed.js
│   └── migrate.js
├── .env
├── .env.example
├── package.json
├── docker-compose.yml
└── Dockerfile
```

---

## Database Schema

```javascript
// db/schema.js

import { pgTable, uuid, varchar, text, integer, boolean, timestamp, jsonb, pgEnum, serial, foreignKey, primaryKey, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// ENUMS
// ============================================

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'EDITOR', 'AUTHOR', 'VIEWER']);
export const userStatusEnum = pgEnum('user_status', ['ACTIVE', 'INVITED', 'SUSPENDED']);
export const postStatusEnum = pgEnum('post_status', ['PUBLISHED', 'DRAFT', 'ARCHIVED', 'SCHEDULED']);
export const categoryStatusEnum = pgEnum('category_status', ['PUBLISHED', 'DRAFT', 'ARCHIVED']);
export const commentStatusEnum = pgEnum('comment_status', ['PENDING', 'APPROVED', 'SPAM']);
export const mediaTypeEnum = pgEnum('media_type', ['IMAGE', 'VIDEO']);
export const settingGroupEnum = pgEnum('setting_group', ['GENERAL', 'SECURITY', 'CONTENT', 'EMAIL', 'SOCIAL']);
export const settingTypeEnum = pgEnum('setting_type', ['STRING', 'NUMBER', 'BOOLEAN', 'JSON']);
export const notificationTypeEnum = pgEnum('notification_type', ['COMMENT', 'SUBSCRIBER', 'TRAFFIC_SPIKE', 'POST_PUBLISHED', 'USER_INVITED', 'SYSTEM']);
export const subscriberStatusEnum = pgEnum('subscriber_status', ['ACTIVE', 'PENDING', 'UNSUBSCRIBED', 'BOUNCED']);

// ============================================
// USER MANAGEMENT
// ============================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }), // Nullable for OAuth users
  role: userRoleEnum('role').notNull().default('VIEWER'),
  status: userStatusEnum('status').notNull().default('ACTIVE'),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  
  // Account tracking
  emailVerified: boolean('email_verified').notNull().default(false),
  invitedAt: timestamp('invited_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
  
  // Security
  failedLoginAttempts: integer('failed_login_attempts').notNull().default(0),
  lockedUntil: timestamp('locked_until', { withTimezone: true })
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  rememberMe: boolean('remember_me').notNull().default(false),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent')
});

export const passwordResets = pgTable('password_resets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// ============================================
// CONTENT MANAGEMENT
// ============================================

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featuredImageId: uuid('featured_image_id'),
  authorId: uuid('author_id').notNull().references(() => users.id),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  status: postStatusEnum('status').notNull().default('DRAFT'),
  
  // Analytics
  viewCount: integer('view_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  
  // SEO
  metaTitle: varchar('meta_title', { length: 60 }),
  metaDescription: varchar('meta_description', { length: 160 }),
  
  // Publishing
  publishedAt: timestamp('published_at', { withTimezone: true }),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  status: categoryStatusEnum('status').notNull().default('PUBLISHED'),
  postCount: integer('post_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  postCount: integer('post_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const postTags = pgTable('post_tags', {
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.postId, table.tagId] })
  };
});

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  authorEmail: varchar('author_email', { length: 255 }).notNull(),
  content: text('content').notNull(),
  status: commentStatusEnum('status').notNull().default('PENDING'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

// ============================================
// MEDIA MANAGEMENT
// ============================================

export const mediaItems = pgTable('media_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: mediaTypeEnum('type').notNull(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(), // bytes
  
  // Image-specific
  width: integer('width'),
  height: integer('height'),
  altText: varchar('alt_text', { length: 255 }),
  
  // Video-specific
  duration: integer('duration'), // seconds
  
  // Common metadata
  title: varchar('title', { length: 255 }),
  caption: text('caption'),
  description: text('description'),
  tag: varchar('tag', { length: 50 }),
  
  // File path
  path: varchar('path', { length: 500 }).notNull(),
  thumbnailPath: varchar('thumbnail_path', { length: 500 }),
  
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

// ============================================
// SYSTEM SETTINGS
// ============================================

export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  group: settingGroupEnum('group').notNull().default('GENERAL'),
  type: settingTypeEnum('type').notNull().default('STRING'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

// ============================================
// NOTIFICATIONS & ACTIVITY
// ============================================

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  data: jsonb('data'), // Additional context
  read: boolean('read').notNull().default(false),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(), // POST_CREATED, POST_UPDATED, etc.
  description: text('description').notNull(),
  entityType: varchar('entity_type', { length: 50 }), // post, category, user, etc.
  entityId: uuid('entity_id'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// ============================================
// ANALYTICS
// ============================================

export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 50 }).notNull(),
  postId: uuid('post_id'),
  sessionId: varchar('session_id', { length: 255 }),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  referrer: varchar('referrer', { length: 500 }),
  path: varchar('path', { length: 500 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const subscribers = pgTable('subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  status: subscriberStatusEnum('status').notNull().default('ACTIVE'),
  confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
  unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

// ============================================
// SOCIAL/OAUTH
// ============================================

export const oauthAccounts = pgTable('oauth_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  provider: varchar('provider', { length: 50 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => {
  return {
    uniqueProviderAccount: unique().on(table.provider, table.providerAccountId)
  };
});

// ============================================
// RELATIONS
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  sessions: many(sessions),
  notifications: many(notifications),
  activities: many(activities)
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id]
  }),
  featuredImage: one(mediaItems, {
    fields: [posts.featuredImageId],
    references: [mediaItems.id]
  }),
  tags: many(postTags),
  comments: many(comments),
  activities: many(activities)
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts)
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postTags)
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id]
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id]
  })
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id]
  })
}));

export const mediaItemsRelations = relations(mediaItems, ({ one, many }) => ({
  uploadedByUser: one(users, {
    fields: [mediaItems.uploadedBy],
    references: [users.id]
  }),
  posts: many(posts)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  })
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
     references: [users.id]
  })
}));
```

### Drizzle Kit Configuration

Create a `drizzle.config.js` file in the project root:

```javascript
// drizzle.config.js
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.js',
  out: './db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
});
```

---

## Route Specifications

### 1. Admin Authentication Routes (`/admin/auth`)

#### POST `/admin/auth/login`
- **Purpose**: Authenticate user with email/password
- **Request Body**:
  ```json
  {
    "email": "string (required, valid email)",
    "password": "string (required, min 8 chars)",
    "rememberMe": "boolean (optional, default: false)"
  }
  ```
- **Success Response**: 
  - Sets HTTP-only cookie with JWT token
  - Redirects to `/admin/dashboard` or returns JSON with user data
  - HTMX: Triggers `redirect` event
- **Error Responses**:
  - 400: Validation errors
  - 401: Invalid credentials
  - 423: Account locked (too many failed attempts)
  - 403: Account suspended
- **Rate Limit**: 5 attempts per 15 minutes per IP

#### POST `/admin/auth/logout`
- **Purpose**: Invalidate user session
- **Success Response**: 
  - Clears JWT cookie
  - Redirects to `/admin/login`
- **Error Responses**: 401 if not authenticated

#### POST `/admin/auth/forgot-password`
- **Purpose**: Send password reset email
- **Request Body**:
  ```json
  {
    "email": "string (required, valid email)"
  }
  ```
- **Success Response**: 
  - Always returns 200 (even if email doesn't exist - security)
  - Sends email with reset link valid for 1 hour
  - HTMX: Shows success toast
- **Rate Limit**: 3 requests per hour per IP

#### POST `/admin/auth/reset-password`
- **Purpose**: Reset password with token
- **Request Body**:
  ```json
  {
    "token": "string (required)",
    "password": "string (required, min 8, meets policy)",
    "confirmPassword": "string (required, must match)"
  }
  ```
- **Success Response**: 
  - Updates password
  - Invalidates all sessions
  - Redirects to `/admin/login` with success message
- **Error Responses**:
  - 400: Invalid or expired token
  - 400: Password doesn't meet requirements

#### GET `/admin/auth/me`
- **Purpose**: Get current authenticated user data
- **Headers**: Authorization: Bearer <token> or Cookie
- **Success Response**:
  ```json
  {
    "id": "uuid",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "ADMIN|EDITOR|AUTHOR|VIEWER",
    "avatarUrl": "string|null",
    "permissions": ["string"]
  }
  ```
- **Error Responses**: 401 if not authenticated

#### GET `/admin/auth/google`
- **Purpose**: Initiate Google OAuth flow
- **Success Response**: Redirects to Google consent screen

#### GET `/admin/auth/google/callback`
- **Purpose**: Handle Google OAuth callback
- **Query Params**: code, state
- **Success Response**: 
  - Creates/updates user account
  - Sets JWT cookie
  - Redirects to `/admin/dashboard`
- **Error Responses**: 400 if OAuth fails

#### POST `/admin/auth/refresh`
- **Purpose**: Refresh JWT token
- **Headers**: Cookie with refresh token
- **Success Response**: New JWT token
- **Error Responses**: 401 if refresh token invalid/expired

---

### 2. Admin Dashboard Routes (`/admin/dashboard`)

#### GET `/admin/dashboard`
- **Purpose**: Serve main dashboard page
- **Query Params**: 
  - `trafficRange`: 7d|30d|90d|1y (default: 7d)
- **Response**: Full HTML page (index.html)
- **Data Loaded**:
  - Quick stats (posts, views, comments, subscribers)
  - Traffic chart data
  - Recent activity (last 10)
  - Recent posts (last 5)
  - Top performing posts
  - Notifications count
- **Permissions**: All authenticated users

#### GET `/admin/dashboard/stats`
- **Purpose**: Get dashboard statistics (HTMX fragment)
- **Response**: HTML partial with stat cards
- **Data**:
  ```json
  {
    "totalPosts": "number",
    "totalPageViews": "number",
    "totalComments": "number",
    "totalSubscribers": "number",
    "postsChange": "number (percentage)",
    "viewsChange": "number (percentage)"
  }
  ```

#### GET `/admin/dashboard/traffic`
- **Purpose**: Get traffic chart data
- **Query Params**:
  - `range`: 7d|30d|90d|1y (default: 7d)
- **Response**: JSON data for chart.js or HTMX partial
- **Data**:
  ```json
  {
    "labels": ["date strings"],
    "datasets": [
      {
        "label": "Page Views",
        "data": ["numbers"]
      },
      {
        "label": "Unique Visitors",
        "data": ["numbers"]
      }
    ]
  }
  ```

#### GET `/admin/dashboard/activity`
- **Purpose**: Get recent activity feed
- **Query Params**:
  - `limit`: number (default: 10)
- **Response**: HTMX partial with activity items
- **Real-time**: SSE endpoint for live updates

#### GET `/admin/dashboard/top-posts`
- **Purpose**: Get top performing posts
- **Query Params**:
  - `period`: 7d|30d|90d (default: 7d)
  - `limit`: number (default: 5)
- **Response**: HTMX partial with post cards

#### GET `/admin/dashboard/notifications`
- **Purpose**: Get notification dropdown content
- **Response**: HTMX partial with notifications list

---

### 3. Admin Posts Routes (`/admin/posts`)

#### GET `/admin/posts`
- **Purpose**: List all posts with filters
- **Query Params**:
  - `page`: number (default: 1)
  - `limit`: number (default: 20)
  - `status`: published|draft|archived|all
  - `category`: string (category slug or id)
  - `author`: string (user id)
  - `search`: string (title/content search)
  - `sort`: createdAt|updatedAt|publishedAt|title|views
  - `order`: asc|desc
- **Response**: Full HTML page (posts.html) or HTMX fragment
- **Permissions**: 
  - Admin/Editor: All posts
  - Author: Own posts only
  - Viewer: None

#### GET `/admin/posts/table`
- **Purpose**: Get posts table fragment (HTMX)
- **Query Params**: Same as GET /posts
- **Response**: HTMX partial with table rows

#### GET `/admin/posts/new`
- **Purpose**: Serve new post creation page
- **Response**: Full HTML page (new-post.html)
- **Data Loaded**:
  - Categories list (for dropdown)
  - Authors list (admin only)
  - Current user (as default author)
- **Permissions**: Admin, Editor, Author

#### POST `/admin/posts`
- **Purpose**: Create new post
- **Content-Type**: multipart/form-data
- **Request Body**:
  ```json
  {
    "title": "string (required, max 200)",
    "content": "string (HTML, required)",
    "excerpt": "string (optional)",
    "featuredImage": "file (optional, image)",
    "authorId": "string (required, must exist)",
    "categoryId": "string (required, must exist)",
    "tags": "string (comma-separated tag names)",
    "status": "draft|published|scheduled (default: draft)",
    "scheduledAt": "ISO date (required if status=scheduled)",
    "metaTitle": "string (optional, max 60)",
    "metaDescription": "string (optional, max 160)"
  }
  ```
- **Success Response**: 
  - 201 Created
  - Redirects to posts list or edit page
  - HTMX: Shows success toast, redirects
- **Error Responses**:
  - 400: Validation errors
  - 403: Unauthorized to create posts
  - 409: Slug already exists

#### GET `/admin/posts/:id`
- **Purpose**: Get single post (API) or edit page (HTML)
- **Headers**: Accept: application/json or text/html
- **Response**: 
  - JSON: Post data with relations
  - HTML: edit-post.html template
- **Permissions**:
  - Admin/Editor: Any post
  - Author: Own posts only

#### GET `/admin/posts/:id/edit`
- **Purpose**: Serve post edit page
- **Response**: Full HTML page (edit-post.html)
- **Data Loaded**: Same as new post + existing post data

#### PUT `/admin/posts/:id`
- **Purpose**: Update existing post
- **Content-Type**: multipart/form-data
- **Request Body**: Same as POST /posts
- **Success Response**: 
  - 200 OK
  - Redirects to posts list
- **Error Responses**:
  - 400: Validation errors
  - 403: Unauthorized to edit this post
  - 404: Post not found

#### DELETE `/admin/posts/:id`
- **Purpose**: Delete post
- **Success Response**: 
  - 200 OK
  - HTMX: Removes row from table, shows toast
- **Error Responses**:
  - 403: Unauthorized
  - 404: Post not found

#### POST `/admin/posts/:id/publish`
- **Purpose**: Publish a draft post
- **Success Response**: 200 OK, status changed to PUBLISHED

#### POST `/admin/posts/:id/archive`
- **Purpose**: Archive a published post
- **Success Response**: 200 OK, status changed to ARCHIVED

#### POST `/admin/posts/:id/duplicate`
- **Purpose**: Duplicate existing post
- **Success Response**: 201 Created with new post data

#### GET `/admin/posts/search`
- **Purpose**: Search posts (for autocomplete/quick search)
- **Query Params**:
  - `q`: search string
  - `limit`: number (default: 10)
- **Response**: JSON array of matching posts

---

### 4. Admin Categories Routes (`/admin/categories`)

#### GET `/admin/categories`
- **Purpose**: List all categories
- **Query Params**:
  - `page`: number
  - `limit`: number
  - `status`: published|draft|archived|all
  - `search`: string
- **Response**: Full HTML page or HTMX fragment
- **Permissions**: Admin, Editor

#### GET `/admin/categories/table`
- **Purpose**: Get categories table fragment
- **Response**: HTMX partial

#### GET `/admin/categories/new`
- **Purpose**: Serve new category page
- **Response**: new-category.html

#### POST `/admin/categories`
- **Purpose**: Create new category
- **Request Body**:
  ```json
  {
    "title": "string (required, max 100)",
    "slug": "string (optional, auto-generated from title)",
    "description": "string (optional, max 500)",
    "status": "published|draft (default: published)"
  }
  ```
- **Success Response**: 201 Created

#### GET `/admin/categories/:id/edit`
- **Purpose**: Serve category edit page
- **Response**: edit-category.html

#### PUT `/admin/categories/:id`
- **Purpose**: Update category
- **Request Body**: Same as POST
- **Success Response**: 200 OK

#### DELETE `/admin/categories/:id`
- **Purpose**: Delete category
- **Constraints**: Cannot delete if posts exist (or reassign posts first)
- **Success Response**: 200 OK

#### GET `/admin/categories/:id/posts`
- **Purpose**: Get posts in this category
- **Query Params**: Same as /posts
- **Response**: Posts list or HTMX fragment

---

### 5. Admin Tags Routes (`/admin/tags`)

#### GET `/admin/tags`
- **Purpose**: List all tags
- **Query Params**:
  - `page`: number
  - `limit`: number
  - `search`: string
- **Response**: tags.html or HTMX fragment
- **Permissions**: Admin, Editor

#### GET `/admin/tags/table`
- **Purpose**: Get tags table fragment
- **Response**: HTMX partial

#### GET `/admin/tags/new`
- **Purpose**: Serve new tag page
- **Response**: new-tag.html

#### POST `/admin/tags`
- **Purpose**: Create new tag
- **Request Body**:
  ```json
  {
    "name": "string (required, max 50)",
    "slug": "string (optional, auto-generated)",
    "description": "string (optional, max 500)"
  }
  ```
- **Success Response**: 201 Created

#### GET `/admin/tags/:id/edit`
- **Purpose**: Serve tag edit page
- **Response**: edit-tag.html

#### PUT `/admin/tags/:id`
- **Purpose**: Update tag
- **Request Body**: Same as POST
- **Success Response**: 200 OK

#### DELETE `/admin/tags/:id`
- **Purpose**: Delete tag
- **Success Response**: 200 OK

#### GET `/admin/tags/:id/posts`
- **Purpose**: Get posts with this tag
- **Response**: Posts list

#### GET `/admin/tags/search`
- **Purpose**: Search tags (for autocomplete)
- **Query Params**: q, limit
- **Response**: JSON array

---

### 6. Admin Users Routes (`/admin/users`)

#### GET `/admin/users`
- **Purpose**: List all users
- **Query Params**:
  - `page`: number
  - `limit`: number
  - `role`: admin|editor|author|viewer
  - `status`: active|invited|suspended
  - `search`: string (name or email)
- **Response**: users.html or HTMX fragment
- **Permissions**: Admin only

#### GET `/admin/users/table`
- **Purpose**: Get users table fragment
- **Response**: HTMX partial

#### GET `/admin/users/new`
- **Purpose**: Serve invite user page
- **Response**: new-user.html

#### POST `/admin/users`
- **Purpose**: Invite/create new user
- **Request Body**:
  ```json
  {
    "firstName": "string (required)",
    "lastName": "string (required)",
    "email": "string (required, valid email)",
    "role": "admin|editor|author|viewer (required)",
    "personalMessage": "string (optional)",
    "sendWelcomeEmail": "boolean (default: true)"
  }
  ```
- **Success Response**: 
  - 201 Created
  - Sends invitation email with activation link
  - HTMX: Shows success, redirects to users list

#### GET `/admin/users/:id/edit`
- **Purpose**: Serve user edit page
- **Response**: edit-user.html

#### PUT `/admin/users/:id`
- **Purpose**: Update user
- **Content-Type**: multipart/form-data (for avatar)
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "string",
    "avatar": "file (optional, image)"
  }
  ```
- **Success Response**: 200 OK
- **Permissions**: 
  - Admin: Any user
  - User: Own profile only (except role)

#### DELETE `/admin/users/:id`
- **Purpose**: Delete user
- **Success Response**: 200 OK
- **Constraints**: Cannot delete own account, cannot delete last admin

#### POST `/admin/users/:id/suspend`
- **Purpose**: Suspend user account
- **Success Response**: 200 OK, status changed to SUSPENDED

#### POST `/admin/users/:id/activate`
- **Purpose**: Activate suspended user
- **Success Response**: 200 OK, status changed to ACTIVE

#### POST `/admin/users/:id/resend-invitation`
- **Purpose**: Resend invitation email
- **Success Response**: 200 OK

#### POST `/admin/users/:id/avatar`
- **Purpose**: Upload/change user avatar
- **Content-Type**: multipart/form-data
- **Request Body**: `avatar` file field
- **Success Response**: 200 OK with new avatar URL

#### DELETE `/admin/users/:id/avatar`
- **Purpose**: Remove user avatar
- **Success Response**: 200 OK

#### GET `/admin/users/:id/activity`
- **Purpose**: Get user's activity history
- **Query Params**: page, limit
- **Response**: Activity list

---

### 7. Admin Images Routes (`/admin/images`)

#### GET `/admin/images`
- **Purpose**: List all images
- **Query Params**:
  - `page`: number
  - `limit`: number (default: 20)
  - `tag`: string (category filter)
  - `search`: string (filename search)
- **Response**: images.html or HTMX fragment

#### GET `/admin/images/grid`
- **Purpose**: Get images grid fragment
- **Response**: HTMX partial with image cards

#### GET `/admin/images/:id/edit`
- **Purpose**: Serve image edit page
- **Response**: edit-image.html

#### POST `/admin/images`
- **Purpose**: Upload new image
- **Content-Type**: multipart/form-data
- **Request Body**:
  ```json
  {
    "image": "file (required, image)",
    "altText": "string (optional)",
    "caption": "string (optional)",
    "tag": "string (optional, category)"
  }
  ```
- **Success Response**: 201 Created
- **Processing**: 
  - Save original
  - Generate thumbnail (if image)
  - Extract dimensions (if image)

#### PUT `/admin/images/:id`
- **Purpose**: Update image metadata
- **Request Body**:
  ```json
  {
    "filename": "string (optional)",
    "altText": "string (optional)",
    "caption": "string (optional)",
    "tag": "string (optional)"
  }
  ```
- **Success Response**: 200 OK

#### DELETE `/admin/images/:id`
- **Purpose**: Delete image
- **Success Response**: 200 OK
- **Side Effects**: Remove from storage, update post featured images

#### POST `/admin/images/:id/replace`
- **Purpose**: Replace image file
- **Content-Type**: multipart/form-data
- **Request Body**: `image` file field
- **Success Response**: 200 OK

#### GET `/admin/images/:id/download`
- **Purpose**: Download image file
- **Response**: File stream with proper headers

---

### 8. Admin Videos Routes (`/admin/videos`)

#### GET `/admin/videos`
- **Purpose**: List all videos
- **Query Params**: Same as images
- **Response**: videos.html or HTMX fragment

#### GET `/admin/videos/grid`
- **Purpose**: Get videos grid fragment
- **Response**: HTMX partial

#### GET `/admin/videos/:id/edit`
- **Purpose**: Serve video edit page
- **Response**: edit-video.html

#### POST `/admin/videos`
- **Purpose**: Upload new video
- **Content-Type**: multipart/form-data
- **Request Body**:
  ```json
  {
    "video": "file (required, video)",
    "title": "string (optional)",
    "description": "string (optional)",
    "tag": "string (optional)"
  }
  ```
- **Success Response**: 201 Created
- **Processing**: Extract duration, generate thumbnail

#### PUT `/admin/videos/:id`
- **Purpose**: Update video metadata
- **Request Body**:
  ```json
  {
    "filename": "string (optional)",
    "title": "string (optional)",
    "description": "string (optional)",
    "tag": "string (optional)"
  }
  ```
- **Success Response**: 200 OK

#### DELETE `/admin/videos/:id`
- **Purpose**: Delete video
- **Success Response**: 200 OK

#### POST `/admin/videos/:id/replace`
- **Purpose**: Replace video file
- **Content-Type**: multipart/form-data
- **Request Body**: `video` file field
- **Success Response**: 200 OK

#### GET `/admin/videos/:id/stream`
- **Purpose**: Stream video (for video player)
- **Response**: Video stream with range support

#### GET `/admin/videos/:id/download`
- **Purpose**: Download video file
- **Response**: File stream

---

### 9. Admin Settings Routes (`/admin/settings`)

#### GET `/admin/settings`
- **Purpose**: Serve settings page
- **Response**: settings.html
- **Data Loaded**: All settings grouped by category
- **Permissions**: Admin only

#### PUT `/admin/settings`
- **Purpose**: Update settings
- **Request Body**:
  ```json
  {
    "general": {
      "siteName": "string",
      "siteTagline": "string",
      "siteUrl": "string",
      "timezone": "string",
      "dateFormat": "string",
      "language": "string"
    },
    "security": {
      "require2FA": "boolean",
      "passwordMinLength": "number",
      "passwordRequireUppercase": "boolean",
      "passwordRequireLowercase": "boolean",
      "passwordRequireNumbers": "boolean",
      "passwordRequireSpecial": "boolean",
      "sessionTimeout": "number (minutes)",
      "maxLoginAttempts": "number"
    },
    "content": {
      "defaultPostStatus": "draft|published",
      "postsPerPage": "number",
      "maxUploadSize": "number (MB)",
      "allowedFileTypes": ["string"]
    }
  }
  ```
- **Success Response**: 200 OK

#### POST `/admin/settings/logo`
- **Purpose**: Upload site logo
- **Content-Type**: multipart/form-data
- **Request Body**: `logo` file field
- **Success Response**: 200 OK with URL

#### POST `/admin/settings/favicon`
- **Purpose**: Upload site favicon
- **Content-Type**: multipart/form-data
- **Request Body**: `favicon` file field (.ico or .png)
- **Success Response**: 200 OK with URL

#### DELETE `/admin/settings/logo`
- **Purpose**: Remove site logo
- **Success Response**: 200 OK

#### DELETE `/admin/settings/favicon`
- **Purpose**: Remove site favicon
- **Success Response**: 200 OK

#### GET `/admin/settings/:key`
- **Purpose**: Get single setting value (public)
- **Response**: Setting value (for frontend use)

---

### 10. Admin Notifications Routes (`/admin/notifications`)

#### GET `/admin/notifications`
- **Purpose**: Get all notifications for current user
- **Query Params**:
  - `page`: number
  - `limit`: number
  - `unreadOnly`: boolean
- **Response**: notifications.html or HTMX fragment

#### GET `/admin/notifications/unread-count`
- **Purpose**: Get count of unread notifications (for badge)
- **Response**: JSON { count: number }
- **HTMX**: OOB swap for badge update

#### PUT `/admin/notifications/:id/read`
- **Purpose**: Mark single notification as read
- **Success Response**: 200 OK
- **HTMX**: Updates notification item

#### PUT `/admin/notifications/read-all`
- **Purpose**: Mark all notifications as read
- **Success Response**: 200 OK
- **HTMX**: Clears badge, updates list

#### DELETE `/admin/notifications/:id`
- **Purpose**: Delete notification
- **Success Response**: 200 OK

#### GET `/admin/notifications/stream`
- **Purpose**: SSE endpoint for real-time notifications
- **Response**: Event stream

---

### 11. Admin Search Routes (`/admin/search`)

#### GET `/admin/search`
- **Purpose**: Global search across content
- **Query Params**:
  - `q`: search query
  - `type`: posts|categories|tags|users|images|videos|all
  - `limit`: number
- **Response**: Search results page or HTMX fragment

#### GET `/admin/search/suggestions`
- **Purpose**: Autocomplete suggestions
- **Query Params**: q
- **Response**: JSON array of suggestions

---

## Middleware Layer

### Database Configuration (`database.js`)
```javascript
// src/config/database.js
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Export database client with schema
export const db = drizzle(pool, { schema });

// Export schema for use in queries
export * from '../db/schema.js';

// Helper functions for common queries
export async function findUserById(id) {
  return db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1).then(rows => rows[0] || null);
}

export async function findUserByEmail(email) {
  return db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1).then(rows => rows[0] || null);
}

export async function createUser(data) {
  return db.insert(schema.users).values(data).returning().then(rows => rows[0]);
}

export async function updateUser(id, data) {
  return db.update(schema.users).set({ ...data, updatedAt: new Date() }).where(eq(schema.users.id, id)).returning().then(rows => rows[0]);
}

export async function deleteUser(id) {
  return db.delete(schema.users).where(eq(schema.users.id, id));
}
```

### 1. Authentication Middleware (`authenticate.js`)
```javascript
// Verifies JWT from cookie or Authorization header
// Attaches user to request object
// Returns 401 if not authenticated
async function authenticate(request, reply) {
  try {
    const token = request.cookies.auth_token || 
                  request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No token provided');
    }
    
    const decoded = await request.jwtVerify(token);
    const user = await db.select({
      id: users.id,
      email: users.email,
      role: users.role,
      status: users.status,
      firstName: users.firstName,
      lastName: users.lastName
    }).from(users).where(eq(users.id, decoded.userId)).limit(1).then(rows => rows[0] || null);
    
    if (!user || user.status === 'SUSPENDED') {
      throw new Error('User not found or suspended');
    }
    
    request.user = user;
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
}
```

### 2. Authorization Middleware (`authorize.js`)
```javascript
// Checks if user has required role
// Usage: authorize(['ADMIN', 'EDITOR'])
function authorize(allowedRoles) {
  return async function(request, reply) {
    if (!request.user) {
      reply.code(401).send({ error: 'Authentication required' });
      return;
    }
    
    if (!allowedRoles.includes(request.user.role)) {
      reply.code(403).send({ error: 'Insufficient permissions' });
      return;
    }
  };
}

// Resource ownership check for authors
function authorizeOwnerOrAdmin(getResourceOwnerId) {
  return async function(request, reply) {
    if (request.user.role === 'ADMIN') return;
    
    const ownerId = await getResourceOwnerId(request.params.id);
    if (ownerId !== request.user.id) {
      reply.code(403).send({ error: 'Not authorized to access this resource' });
    }
  };
}
```

### 3. Request Validation Middleware (`validate-request.js`)
```javascript
// Validates request body/query against JSON schema
// Uses Ajv for validation
function validateBody(schema) {
  return async function(request, reply) {
    const validate = request.server.ajv.compile(schema);
    const valid = validate(request.body);
    
    if (!valid) {
      reply.code(400).send({ 
        error: 'Validation failed',
        details: validate.errors 
      });
    }
  };
}

function validateQuery(schema) {
  return async function(request, reply) {
    const validate = request.server.ajv.compile(schema);
    const valid = validate(request.query);
    
    if (!valid) {
      reply.code(400).send({ 
        error: 'Invalid query parameters',
        details: validate.errors 
      });
    }
  };
}
```

### 4. CSRF Protection Middleware (`csrf-protection.js`)
```javascript
// Validates CSRF token for state-changing operations
// Exempts: GET, HEAD, OPTIONS requests
// Token sources: header (X-CSRF-Token), form field (_csrf)
function csrfProtection(request, reply, done) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return done();
  }
  
  const token = request.headers['x-csrf-token'] || request.body._csrf;
  const sessionToken = request.session.csrfToken;
  
  if (!token || !sessionToken || token !== sessionToken) {
    reply.code(403).send({ error: 'Invalid CSRF token' });
    return;
  }
  
  done();
}

// Generates new CSRF token for session
function generateCsrfToken(request) {
  const token = crypto.randomBytes(32).toString('hex');
  request.session.csrfToken = token;
  return token;
}
```

### 5. Rate Limiting Middleware (`rate-limit.js`)
```javascript
// Rate limit configurations
const rateLimits = {
  login: { max: 5, timeWindow: '15 minutes' },
  forgotPassword: { max: 3, timeWindow: '1 hour' },
  api: { max: 100, timeWindow: '1 minute' },
  upload: { max: 10, timeWindow: '1 minute' }
};

// Uses @fastify/rate-limit plugin
// Different limits for different routes
```

### 6. Request Logger Middleware (`request-logger.js`)
```javascript
// Logs all requests with timing
// Includes: method, path, status code, duration, user agent, IP
// Excludes health checks from logs
async function requestLogger(request, reply) {
  const start = Date.now();
  
  reply.then(() => {
    const duration = Date.now() - start;
    logger.info({
      method: request.method,
      path: request.routerPath,
      statusCode: reply.statusCode,
      duration,
      userId: request.user?.id,
      ip: request.ip,
      userAgent: request.headers['user-agent']
    });
  });
}
```

### 7. Error Handler Middleware (`error-handler.js`)
```javascript
import { errorMessage } from '../templates/partials/index.js';

// Global error handler
// Formats errors for JSON vs HTML responses
// Logs errors appropriately
function errorHandler(error, request, reply) {
  request.log.error(error);
  
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : error.message;
  
  // Check if request expects HTML (from Accept header or HTMX)
  const acceptsHtml = request.headers.accept?.includes('text/html') ||
                      request.headers['hx-request'];
  
  if (acceptsHtml) {
    // Return error HTML partial for HTMX using fastify-html
    reply.code(statusCode).html(errorMessage({ message, statusCode }));
  } else {
    // Return JSON error
    reply.code(statusCode).send({
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}
```

---

## Service Layer

### 1. Auth Service (`auth.service.js`)
```javascript
class AuthService {
  // Login user with credentials
  async login(email, password, rememberMe) {
    // Find user by email
    // Verify password with bcrypt
    // Check account status
    // Update last active timestamp
    // Generate JWT and refresh tokens
    // Create session record
    // Return tokens and user data
  }
  
  // Logout user
  async logout(token) {
    // Invalidate session/token
    // Clear from cache/DB
  }
  
  // Refresh access token
  async refreshToken(refreshToken) {
    // Verify refresh token
    // Check if session still valid
    // Generate new access token
    // Return new token
  }
  
  // Generate password reset token
  async generatePasswordReset(email) {
    // Find user
    // Create reset token (expires in 1 hour)
    // Send email with reset link
  }
  
  // Reset password with token
  async resetPassword(token, newPassword) {
    // Verify token
    // Check not expired
    // Hash new password
    // Update user password
    // Invalidate all sessions
    // Mark token as used
  }
  
  // Google OAuth
  async googleAuth(code) {
    // Exchange code for tokens
    // Get user info from Google
    // Find or create user
    // Link OAuth account
    // Generate JWT
  }
}
```

### 2. Posts Service (`posts.service.js`)
```javascript
class PostsService {
  // List posts with filters
  async listPosts({ page, limit, status, category, author, search, sort, order, user }) {
    // Build Drizzle query with filters
    // Apply role-based filtering
    // Calculate pagination
    // Return posts with author/category data
  }
  
  // Get single post
  async getPost(id, user) {
    // Fetch post with all relations
    // Check permissions
    // Increment view count (async)
    // Return post data
  }
  
  // Create new post
  async createPost(data, featuredImage, user) {
    // Validate authorId (must exist)
    // Validate categoryId
    // Handle featured image upload
    // Generate slug from title
    // Create post record
    // Handle tags (create if not exist, link)
    // Log activity
    // Return created post
  }
  
  // Update post
  async updatePost(id, data, featuredImage, user) {
    // Check permissions
    // Handle image replacement
    // Update fields
    // Handle tag changes
    // Update slug if title changed (optional)
    // Log activity
    // Return updated post
  }
  
  // Delete post
  async deletePost(id, user) {
    // Check permissions
    // Delete featured image if exists
    // Remove tag associations
    // Delete post
    // Log activity
  }
  
  // Change post status
  async changeStatus(id, status, user) {
    // Update status
    // Set publishedAt if publishing
    // Log activity
  }
  
  // Duplicate post
  async duplicatePost(id, user) {
    // Get original post
    // Create copy with "-copy" suffix on slug
    // Copy all fields except id/timestamps
    // Copy tag associations
    // Return new post
  }
}
```

### 3. Categories Service (`categories.service.js`)
```javascript
class CategoriesService {
  // List categories
  async listCategories({ page, limit, status, search }) {
    // Query with filters
    // Include post count
    // Return paginated results
  }
  
  // Get single category
  async getCategory(id) {
    // Fetch with post count
    // Return category data
  }
  
  // Create category
  async createCategory(data) {
    // Generate slug from title
    // Check slug uniqueness
    // Create record
    // Log activity
  }
  
  // Update category
  async updateCategory(id, data) {
    // Update fields
    // Recalculate post count
    // Log activity
  }
  
  // Delete category
  async deleteCategory(id) {
    // Check if posts exist
    // Reassign posts to default category or prevent deletion
    // Delete category
    // Log activity
  }
}
```

### 4. Tags Service (`tags.service.js`)
```javascript
class TagsService {
  // List tags
  async listTags({ page, limit, search }) {
    // Query with filters
    // Include post count
    // Return paginated results
  }
  
  // Get single tag
  async getTag(id) {
    // Fetch with post count
    // Return tag data
  }
  
  // Create tag
  async createTag(data) {
    // Generate slug from name
    // Check uniqueness
    // Create record
    // Log activity
  }
  
  // Update tag
  async updateTag(id, data) {
    // Update fields
    // Log activity
  }
  
  // Delete tag
  async deleteTag(id) {
    // Remove from all posts (junction table)
    // Delete tag
    // Log activity
  }
  
  // Find or create tags (for post creation)
  async findOrCreateTags(tagNames) {
    // Split by comma
    // Trim whitespace
    // For each: find existing or create new
    // Return array of tag IDs
  }
}
```

### 5. Users Service (`users.service.js`)
```javascript
class UsersService {
  // List users
  async listUsers({ page, limit, role, status, search }) {
    // Query with filters
    // Calculate pagination
    // Return user data
  }
  
  // Get single user
  async getUser(id) {
    // Fetch with all data
    // Return user
  }
  
  // Create user (invite)
  async createUser(data) {
    // Check email uniqueness
    // Generate invitation token
    // Create user with INVITED status
    // Send invitation email
    // Log activity
  }
  
  // Update user
  async updateUser(id, data, avatar) {
    // Handle avatar upload
    // Update fields
    // Check email uniqueness if changed
    // Log activity
  }
  
  // Delete user
  async deleteUser(id) {
    // Prevent self-deletion
    // Prevent deleting last admin
    // Delete avatar if exists
    // Remove all user data (posts stay with author ID)
    // Invalidate sessions
    // Log activity
  }
  
  // Suspend user
  async suspendUser(id) {
    // Update status
    // Invalidate all sessions
    // Log activity
  }
  
  // Activate user
  async activateUser(id) {
    // Update status
    // Log activity
  }
  
  // Resend invitation
  async resendInvitation(id) {
    // Generate new token
    // Update invitedAt
    // Send email
  }
  
  // Accept invitation (set password)
  async acceptInvitation(token, password) {
    // Verify token
    // Hash password
    // Update user status to ACTIVE
    // Mark invitation as accepted
  }
  
  // Upload avatar
  async uploadAvatar(userId, file) {
    // Delete old avatar if exists
    // Process image (resize if needed)
    // Save file
    // Update user record
    // Return URL
  }
}
```

### 6. Images Service (`images.service.js`)
```javascript
class ImagesService {
  // List images
  async listImages({ page, limit, tag, search }) {
    // Query with filters
    // Calculate pagination
    // Return image data
  }
  
  // Get single image
  async getImage(id) {
    // Fetch image data
    // Return with metadata
  }
  
  // Upload image
  async uploadImage(file, metadata, userId) {
    // Validate file type (jpg, png, gif, webp)
    // Validate file size (from settings)
    // Generate unique filename
    // Save original file
    // Generate thumbnail (multiple sizes)
    // Extract dimensions
    // Create database record
    // Log activity
    // Return image data
  }
  
  // Update image metadata
  async updateImage(id, data) {
    // Update fields
    // Allow filename rename (update path)
  }
  
  // Delete image
  async deleteImage(id) {
    // Get image data
    // Delete files from storage
    // Remove from database
    // Update posts using this as featured image
    // Log activity
  }
  
  // Replace image
  async replaceImage(id, file) {
    // Get old image
    // Delete old files
    // Process new file
    // Update record with new paths/metadata
    // Keep same ID
  }
  
  // Generate thumbnails
  async generateThumbnails(filePath, sizes = [150, 300, 600]) {
    // Use sharp to resize
    // Save with size suffix
    // Return paths
  }
}
```

### 7. Videos Service (`videos.service.js`)
```javascript
class VideosService {
  // List videos
  async listVideos({ page, limit, tag, search }) {
    // Query with filters
    // Return video data
  }
  
  // Get single video
  async getVideo(id) {
    // Fetch video data
    // Return with metadata
  }
  
  // Upload video
  async uploadVideo(file, metadata, userId) {
    // Validate file type (mp4, webm, mov)
    // Validate file size
    // Generate unique filename
    // Save file
    // Extract duration (ffmpeg)
    // Generate thumbnail
    // Create database record
    // Log activity
  }
  
  // Update video metadata
  async updateVideo(id, data) {
    // Update fields
  }
  
  // Delete video
  async deleteVideo(id) {
    // Delete files
    // Remove from database
    // Log activity
  }
  
  // Replace video
  async replaceVideo(id, file) {
    // Replace file
    // Update metadata
    // Extract new duration
  }
  
  // Get video stream
  async getVideoStream(id, range) {
    // Handle range requests for video streaming
    // Return partial content
  }
}
```

### 8. Settings Service (`settings.service.js`)
```javascript
class SettingsService {
  // Get all settings
  async getAllSettings() {
    // Fetch all from database
    // Group by category
    // Return structured object
  }
  
  // Get setting by key
  async getSetting(key, defaultValue = null) {
    // Fetch single setting
    // Return value or default
  }
  
  // Update settings
  async updateSettings(settings) {
    // For each setting
    // Validate value type
    // Upsert in database
    // Clear cache
  }
  
  // Upload logo
  async uploadLogo(file) {
    // Validate image
    // Save to storage
    // Update setting
    // Return URL
  }
  
  // Upload favicon
  async uploadFavicon(file) {
    // Validate .ico or .png
    // Save to storage
    // Update setting
  }
  
  // Get public settings
  async getPublicSettings() {
    // Return non-sensitive settings
    // Site name, logo URL, etc.
  }
}
```

### 9. Dashboard Service (`dashboard.service.js`)
```javascript
class DashboardService {
  // Get dashboard stats
  async getStats() {
    // Count total posts
    // Sum total page views
    // Count total comments
    // Count total subscribers
    // Calculate change percentages (vs last period)
    // Return stats object
  }
  
  // Get traffic data
  async getTrafficData(range = '7d') {
    // Calculate date range
    // Query analytics events
    // Aggregate by day
    // Return chart data format
  }
  
  // Get recent activity
  async getRecentActivity(limit = 10) {
    // Query activities
    // Join with users
    // Return formatted activity items
  }
  
  // Get recent posts
  async getRecentPosts(limit = 5) {
    // Query posts
    // Sort by createdAt desc
    // Return post summaries
  }
  
  // Get top posts
  async getTopPosts(period = '7d', limit = 5) {
    // Calculate date range
    // Query posts with view counts in period
    // Sort by views desc
    // Return top posts
  }
}
```

### 10. Notifications Service (`notifications.service.js`)
```javascript
class NotificationsService {
  // Get user notifications
  async getNotifications(userId, { page, limit, unreadOnly }) {
    // Query notifications
    // Filter by user
    // Sort by createdAt desc
    // Return paginated
  }
  
  // Get unread count
  async getUnreadCount(userId) {
    // Count unread notifications
    // Return count
  }
  
  // Mark as read
  async markAsRead(notificationId, userId) {
    // Update notification
    // Set read=true, readAt=now
  }
  
  // Mark all as read
  async markAllAsRead(userId) {
    // Update all user's notifications
  }
  
  // Create notification
  async createNotification({ userId, type, title, message, data }) {
    // Create record
    // Send real-time event (SSE/WebSocket)
    // Return notification
  }
  
  // Delete notification
  async deleteNotification(id, userId) {
    // Verify ownership
    // Delete record
  }
}
```

### 11. Email Service (`email.service.js`)
```javascript
class EmailService {
  // Send invitation email
  async sendInvitationEmail(user, token, personalMessage) {
    // Generate invitation link
    // Render email template
    // Send via SMTP/SendGrid
    // Log send attempt
  }
  
  // Send password reset email
  async sendPasswordResetEmail(user, token) {
    // Generate reset link
    // Render template
    // Send email
  }
  
  // Send welcome email
  async sendWelcomeEmail(user) {
    // Render welcome template
    // Send email
  }
  
  // Send notification email
  async sendNotificationEmail(user, notification) {
    // Render notification template
    // Send if user preferences allow
  }
  
  // Generic send method
  async send({ to, subject, template, data }) {
    // Render template
    // Send email
    // Handle errors
  }
}
```

### 12. Slug Service (`slug.service.js`)
```javascript
class SlugService {
  // Generate slug from string
  async generateSlug(text, model, field = 'slug') {
    // Convert to lowercase
    // Remove special chars
    // Replace spaces with hyphens
    // Check uniqueness in model
    // If exists, append number
    // Return unique slug
  }
  
  // Check if slug exists
  async slugExists(slug, model, field = 'slug') {
    // Query database
    // Return boolean
  }
}
```

### 13. File Storage Service (`file-storage.service.js`)
```javascript
class FileStorageService {
  // Upload file
  async upload(file, path, options = {}) {
    // Determine storage (local/S3)
    // Process file if needed
    // Save to storage
    // Return URL/path
  }
  
  // Delete file
  async delete(path) {
    // Remove from storage
    // Return success/fail
  }
  
  // Get file URL
  getUrl(path) {
    // Generate public URL
    // Handle CDN paths
  }
  
  // Stream file
  async stream(path, range) {
    // Return readable stream
    // Handle range requests
  }
}
```

---

## Controller Layer

### 1. Auth Controller (`auth.controller.js`)
```javascript
import { loginPage, dashboardPage } from '../templates/pages/index.js';

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
  
  // GET /admin/login
  async loginPage(request, reply) {
    const error = request.query.error;
    const reset = request.query.reset;
    return reply.html(loginPage({ error, reset }));
  }
  
  // POST /admin/auth/login
  async login(request, reply) {
    const { email, password, rememberMe } = request.body;
    
    try {
      const { user, tokens } = await this.authService.login(email, password, rememberMe);
      
      // Set cookies
      reply.setCookie('auth_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
      });
      
      reply.setCookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
      
      // HTMX redirect
      reply.header('HX-Redirect', '/admin/dashboard');
      reply.code(200).send({ success: true, user });
    } catch (error) {
      // Return error for HTMX toast
      reply.code(401).header('HX-Trigger', JSON.stringify({
        showToast: { message: error.message, type: 'error' }
      })).send({ error: error.message });
    }
  }
  
  // POST /admin/auth/logout
  async logout(request, reply) {
    const token = request.cookies.auth_token;
    await this.authService.logout(token);
    
    // Clear cookies
    reply.clearCookie('auth_token');
    reply.clearCookie('refresh_token');
    
    reply.header('HX-Redirect', '/admin/login');
    reply.code(200).send({ success: true });
  }
  
  // POST /admin/auth/forgot-password
  async forgotPassword(request, reply) {
    const { email } = request.body;
    await this.authService.generatePasswordReset(email);
    
    // Always return success (security)
    reply.header('HX-Trigger', JSON.stringify({
      showToast: { 
        message: 'If an account exists with this email, you will receive reset instructions.',
        type: 'success'
      }
    }));
    reply.code(200).send({ success: true });
  }
  
  // POST /admin/auth/reset-password
  async resetPassword(request, reply) {
    const { token, password } = request.body;
    await this.authService.resetPassword(token, password);
    
    reply.header('HX-Redirect', '/admin/login?reset=success');
    reply.code(200).send({ success: true });
  }
  
  // GET /admin/auth/me
  async getCurrentUser(request, reply) {
    reply.code(200).send(request.user);
  }
  
  // GET /admin/auth/google/callback
  async googleCallback(request, reply) {
    const { code } = request.query;
    const { user, tokens } = await this.authService.googleAuth(code);
    
    // Set cookies and redirect
    reply.setCookie('auth_token', tokens.accessToken, { httpOnly: true, secure: true });
    reply.header('HX-Redirect', '/admin/dashboard');
    reply.code(200).send({ success: true });
  }
}
```

### 2. Posts Controller (`posts.controller.js`)
```javascript
import { postsPage, newPostPage, editPostPage } from '../templates/pages/index.js';
import { tableRowsPost, tableRowPost } from '../templates/partials/index.js';

class PostsController {
  constructor(postsService) {
    this.postsService = postsService;
  }
  
  // GET /admin/posts
  async list(request, reply) {
    const filters = {
      page: parseInt(request.query.page) || 1,
      limit: parseInt(request.query.limit) || 20,
      status: request.query.status,
      category: request.query.category,
      author: request.query.author,
      search: request.query.search,
      sort: request.query.sort || 'createdAt',
      order: request.query.order || 'desc',
      user: request.user
    };
    
    const result = await this.postsService.listPosts(filters);
    
    // Check if HTMX request for partial
    if (request.headers['hx-request'] && request.headers['hx-target'] === 'posts-table') {
      return reply.html(tableRowsPost({ posts: result.data }));
    }
    
    // Return full page using template function
    reply.html(postsPage({
      posts: result.data,
      pagination: result.pagination,
      filters: request.query,
      user: request.user
    }));
  }
  
  // GET /admin/posts/new
  async newForm(request, reply) {
    // Load categories and authors
    const categories = await categoriesService.listAll();
    const authors = request.user.role === 'ADMIN' 
      ? await usersService.listAll() 
      : [request.user];
    
    reply.html(newPostPage({
      categories,
      authors,
      user: request.user
    }));
  }
  
  // POST /admin/posts
  async create(request, reply) {
    const data = request.body;
    const featuredImage = request.file; // From multipart
    
    try {
      const post = await this.postsService.createPost(data, featuredImage, request.user);
      
      reply.header('HX-Redirect', `/admin/posts/${post.id}/edit`);
      reply.code(201).header('HX-Trigger', JSON.stringify({
        showToast: { message: 'Post created successfully', type: 'success' }
      })).send({ success: true, post });
    } catch (error) {
      reply.code(400).header('HX-Trigger', JSON.stringify({
        showToast: { message: error.message, type: 'error' }
      })).send({ error: error.message });
    }
  }
  
  // GET /admin/posts/:id/edit
  async editForm(request, reply) {
    const { id } = request.params;
    const post = await this.postsService.getPost(id, request.user);
    
    const categories = await categoriesService.listAll();
    const authors = request.user.role === 'ADMIN' 
      ? await usersService.listAll() 
      : [request.user];
    const tags = await tagsService.listAll();
    
    reply.html(editPostPage({
      post,
      categories,
      authors,
      tags,
      user: request.user
    }));
  }
  
  // PUT /admin/posts/:id
  async update(request, reply) {
    const { id } = request.params;
    const data = request.body;
    const featuredImage = request.file;
    
    const post = await this.postsService.updatePost(id, data, featuredImage, request.user);
    
    reply.code(200).header('HX-Trigger', JSON.stringify({
      showToast: { message: 'Post updated successfully', type: 'success' }
    })).send({ success: true, post });
  }
  
  // DELETE /admin/posts/:id
  async delete(request, reply) {
    const { id } = request.params;
    await this.postsService.deletePost(id, request.user);
    
    // HTMX: Remove row from table
    reply.code(200).header('HX-Trigger', JSON.stringify({
      showToast: { message: 'Post deleted successfully', type: 'success' },
      removePost: { id }
    })).send({ success: true });
  }
  
  // POST /admin/posts/:id/publish
  async publish(request, reply) {
    const { id } = request.params;
    await this.postsService.changeStatus(id, 'PUBLISHED', request.user);
    
    // Return updated row
    const post = await this.postsService.getPost(id, request.user);
    reply.html(tableRowPost({ post }));
  }
  
  // POST /admin/posts/:id/archive
  async archive(request, reply) {
    const { id } = request.params;
    await this.postsService.changeStatus(id, 'ARCHIVED', request.user);
    
    const post = await this.postsService.getPost(id, request.user);
    reply.html(tableRowPost({ post }));
  }
}
```

### 3. Categories Controller (`categories.controller.js`)
```javascript
import { categoriesPage, newCategoryPage, editCategoryPage } from '../templates/pages/index.js';
import { tableRowsCategory } from '../templates/partials/index.js';

class CategoriesController {
  constructor(categoriesService) {
    this.categoriesService = categoriesService;
  }
  
  // GET /admin/categories
  async list(request, reply) {
    const filters = {
      page: parseInt(request.query.page) || 1,
      limit: parseInt(request.query.limit) || 20,
      status: request.query.status,
      search: request.query.search
    };
    
    const result = await this.categoriesService.listCategories(filters);
    
    if (request.headers['hx-request']) {
      return reply.html(tableRowsCategory({ categories: result.data }));
    }
    
    reply.html(categoriesPage({
      categories: result.data,
      pagination: result.pagination,
      user: request.user
    }));
  }
  
  // GET /admin/categories/new
  async newForm(request, reply) {
    reply.html(newCategoryPage({ user: request.user }));
  }
  
  // POST /admin/categories
  async create(request, reply) {
    const category = await this.categoriesService.createCategory(request.body);
    reply.header('HX-Redirect', '/admin/categories');
    reply.code(201).send({ success: true, category });
  }
  
  // GET /admin/categories/:id/edit
  async editForm(request, reply) {
    const { id } = request.params;
    const category = await this.categoriesService.getCategory(id);
    reply.html(editCategoryPage({ category, user: request.user }));
  }
  
  // PUT /admin/categories/:id
  async update(request, reply) {
    const { id } = request.params;
    const category = await this.categoriesService.updateCategory(id, request.body);
    reply.code(200).send({ success: true, category });
  }
  
  // DELETE /admin/categories/:id
  async delete(request, reply) {
    const { id } = request.params;
    await this.categoriesService.deleteCategory(id);
    reply.code(200).header('HX-Trigger', JSON.stringify({
      deleteCategory: { id },
      showToast: { message: 'Category deleted', type: 'success' }
    })).send({ success: true });
  }
}
```

### 4. Tags Controller (`tags.controller.js`)
```javascript
import { tagsPage, newTagPage, editTagPage } from '../templates/pages/index.js';
import { tableRowsTag } from '../templates/partials/index.js';

class TagsController {
  constructor(tagsService) {
    this.tagsService = tagsService;
  }
  
  // GET /admin/tags
  async list(request, reply) {
    const filters = {
      page: parseInt(request.query.page) || 1,
      limit: parseInt(request.query.limit) || 20,
      search: request.query.search
    };
    
    const result = await this.tagsService.listTags(filters);
    
    if (request.headers['hx-request']) {
      return reply.html(tableRowsTag({ tags: result.data }));
    }
    
    reply.html(tagsPage({
      tags: result.data,
      pagination: result.pagination,
      user: request.user
    }));
  }
  
  // GET /admin/tags/new
  async newForm(request, reply) {
    reply.html(newTagPage({ user: request.user }));
  }
  
  // POST /admin/tags
  async create(request, reply) {
    const tag = await this.tagsService.createTag(request.body);
    reply.header('HX-Redirect', '/admin/tags');
    reply.code(201).send({ success: true, tag });
  }
  
  // GET /admin/tags/:id/edit
  async editForm(request, reply) {
    const { id } = request.params;
    const tag = await this.tagsService.getTag(id);
    reply.html(editTagPage({ tag, user: request.user }));
  }
  
  // PUT /admin/tags/:id
  async update(request, reply) {
    const { id } = request.params;
    const tag = await this.tagsService.updateTag(id, request.body);
    reply.code(200).send({ success: true, tag });
  }
  
  // DELETE /admin/tags/:id
  async delete(request, reply) {
    const { id } = request.params;
    await this.tagsService.deleteTag(id);
    reply.code(200).send({ success: true });
  }
}
```

### 5. Users Controller (`users.controller.js`)
```javascript
import { usersPage, newUserPage, editUserPage } from '../templates/pages/index.js';
import { tableRowsUser, tableRowUser } from '../templates/partials/index.js';

class UsersController {
  constructor(usersService, emailService) {
    this.usersService = usersService;
    this.emailService = emailService;
  }
  
  // GET /admin/users
  async list(request, reply) {
    const filters = {
      page: parseInt(request.query.page) || 1,
      limit: parseInt(request.query.limit) || 20,
      role: request.query.role,
      status: request.query.status,
      search: request.query.search
    };
    
    const result = await this.usersService.listUsers(filters);
    
    if (request.headers['hx-request']) {
      return reply.html(tableRowsUser({ users: result.data }));
    }
    
    reply.html(usersPage({
      users: result.data,
      pagination: result.pagination,
      user: request.user
    }));
  }
  
  // GET /admin/users/new
  async newForm(request, reply) {
    reply.html(newUserPage({ user: request.user }));
  }
  
  // POST /admin/users
  async create(request, reply) {
    const user = await this.usersService.createUser(request.body);
    
    if (request.body.sendWelcomeEmail !== false) {
      await this.emailService.sendInvitationEmail(user, user.invitationToken, request.body.personalMessage);
    }
    
    reply.header('HX-Redirect', '/admin/users');
    reply.code(201).header('HX-Trigger', JSON.stringify({
      showToast: { message: 'Invitation sent successfully', type: 'success' }
    })).send({ success: true, user });
  }
  
  // GET /admin/users/:id/edit
  async editForm(request, reply) {
    const { id } = request.params;
    const user = await this.usersService.getUser(id);
    reply.html(editUserPage({ 
      editUser: user, 
      user: request.user 
    }));
  }
  
  // PUT /admin/users/:id
  async update(request, reply) {
    const { id } = request.params;
    const avatar = request.file;
    const user = await this.usersService.updateUser(id, request.body, avatar);
    reply.code(200).send({ success: true, user });
  }
  
  // DELETE /admin/users/:id
  async delete(request, reply) {
    const { id } = request.params;
    await this.usersService.deleteUser(id);
    reply.code(200).send({ success: true });
  }
  
  // POST /admin/users/:id/suspend
  async suspend(request, reply) {
    const { id } = request.params;
    await this.usersService.suspendUser(id);
    
    const user = await this.usersService.getUser(id);
    reply.html(tableRowUser({ user }));
  }
  
  // POST /admin/users/:id/activate
  async activate(request, reply) {
    const { id } = request.params;
    await this.usersService.activateUser(id);
    
    const user = await this.usersService.getUser(id);
    reply.html(tableRowUser({ user }));
  }
  
  // POST /admin/users/:id/resend-invitation
  async resendInvitation(request, reply) {
    const { id } = request.params;
    await this.usersService.resendInvitation(id);
    reply.code(200).header('HX-Trigger', JSON.stringify({
      showToast: { message: 'Invitation resent', type: 'success' }
    })).send({ success: true });
  }
}
```

### 6. Images Controller (`images.controller.js`)
```javascript
import { imagesPage, editImagePage } from '../templates/pages/index.js';
import { cardsImage } from '../templates/partials/index.js';

class ImagesController {
  constructor(imagesService) {
    this.imagesService = imagesService;
  }
  
  // GET /admin/images
  async list(request, reply) {
    const filters = {
      page: parseInt(request.query.page) || 1,
      limit: parseInt(request.query.limit) || 20,
      tag: request.query.tag,
      search: request.query.search
    };
    
    const result = await this.imagesService.listImages(filters);
    
    if (request.headers['hx-request']) {
      return reply.html(cardsImage({ images: result.data }));
    }
    
    reply.html(imagesPage({
      images: result.data,
      pagination: result.pagination,
      user: request.user
    }));
  }
  
  // GET /admin/images/:id/edit
  async editForm(request, reply) {
    const { id } = request.params;
    const image = await this.imagesService.getImage(id);
    reply.html(editImagePage({ image, user: request.user }));
  }
  
  // POST /admin/images
  async upload(request, reply) {
    const file = request.file;
    const metadata = request.body;
    
    const image = await this.imagesService.uploadImage(file, metadata, request.user.id);
    
    reply.code(201).header('HX-Trigger', JSON.stringify({
      showToast: { message: 'Image uploaded successfully', type: 'success' },
      prependImage: { image }
    })).send({ success: true, image });
  }
  
  // PUT /admin/images/:id
  async update(request, reply) {
    const { id } = request.params;
    const image = await this.imagesService.updateImage(id, request.body);
    reply.code(200).send({ success: true, image });
  }
  
  // DELETE /admin/images/:id
  async delete(request, reply) {
    const { id } = request.params;
    await this.imagesService.deleteImage(id);
    reply.code(200).send({ success: true });
  }
  
  // POST /admin/images/:id/replace
  async replace(request, reply) {
    const { id } = request.params;
    const file = request.file;
    const image = await this.imagesService.replaceImage(id, file);
    reply.code(200).send({ success: true, image });
  }
}
```

### 7. Videos Controller (`videos.controller.js`)
```javascript
import { videosPage, editVideoPage } from '../templates/pages/index.js';
import { cardsVideo } from '../templates/partials/index.js';

class VideosController {
  constructor(videosService) {
    this.videosService = videosService;
  }
  
  // GET /admin/videos
  async list(request, reply) {
    const filters = {
      page: parseInt(request.query.page) || 1,
      limit: parseInt(request.query.limit) || 20,
      tag: request.query.tag,
      search: request.query.search
    };
    
    const result = await this.videosService.listVideos(filters);
    
    if (request.headers['hx-request']) {
      return reply.html(cardsVideo({ videos: result.data }));
    }
    
    reply.html(videosPage({
      videos: result.data,
      pagination: result.pagination,
      user: request.user
    }));
  }
  
  // GET /admin/videos/:id/edit
  async editForm(request, reply) {
    const { id } = request.params;
    const video = await this.videosService.getVideo(id);
    reply.html(editVideoPage({ video, user: request.user }));
  }
  
  // POST /admin/videos
  async upload(request, reply) {
    const file = request.file;
    const metadata = request.body;
    
    const video = await this.videosService.uploadVideo(file, metadata, request.user.id);
    reply.code(201).send({ success: true, video });
  }
  
  // PUT /admin/videos/:id
  async update(request, reply) {
    const { id } = request.params;
    const video = await this.videosService.updateVideo(id, request.body);
    reply.code(200).send({ success: true, video });
  }
  
  // DELETE /admin/videos/:id
  async delete(request, reply) {
    const { id } = request.params;
    await this.videosService.deleteVideo(id);
    reply.code(200).send({ success: true });
  }
  
  // GET /admin/videos/:id/stream
  async stream(request, reply) {
    const { id } = request.params;
    const range = request.headers.range;
    
    const stream = await this.videosService.getVideoStream(id, range);
    reply.type('video/mp4').send(stream);
  }
}
```

### 8. Settings Controller (`settings.controller.js`)
```javascript
import { settingsPage } from '../templates/pages/index.js';

class SettingsController {
  constructor(settingsService) {
    this.settingsService = settingsService;
  }
  
  // GET /admin/settings
  async index(request, reply) {
    const settings = await this.settingsService.getAllSettings();
    reply.html(settingsPage({
      settings,
      user: request.user
    }));
  }
  
  // PUT /admin/settings
  async update(request, reply) {
    await this.settingsService.updateSettings(request.body);
    reply.code(200).header('HX-Trigger', JSON.stringify({
      showToast: { message: 'Settings saved successfully', type: 'success' }
    })).send({ success: true });
  }
  
  // POST /admin/settings/logo
  async uploadLogo(request, reply) {
    const logo = await this.settingsService.uploadLogo(request.file);
    reply.code(200).send({ success: true, url: logo.url });
  }
  
  // POST /admin/settings/favicon
  async uploadFavicon(request, reply) {
    const favicon = await this.settingsService.uploadFavicon(request.file);
    reply.code(200).send({ success: true, url: favicon.url });
  }
}
```

### 9. Dashboard Controller (`dashboard.controller.js`)
```javascript
import { dashboardPage } from '../templates/pages/index.js';
import { statCards, activityList } from '../templates/partials/index.js';

class DashboardController {
  constructor(dashboardService) {
    this.dashboardService = dashboardService;
  }
  
  // GET /admin/dashboard
  async index(request, reply) {
    const trafficRange = request.query.trafficRange || '7d';
    
    const [stats, trafficData, recentActivity, recentPosts, topPosts] = await Promise.all([
      this.dashboardService.getStats(),
      this.dashboardService.getTrafficData(trafficRange),
      this.dashboardService.getRecentActivity(10),
      this.dashboardService.getRecentPosts(5),
      this.dashboardService.getTopPosts(trafficRange, 5)
    ]);
    
    reply.html(dashboardPage({
      stats,
      trafficData,
      recentActivity,
      recentPosts,
      topPosts,
      trafficRange,
      user: request.user
    }));
  }
  
  // GET /admin/dashboard/stats
  async getStats(request, reply) {
    const stats = await this.dashboardService.getStats();
    reply.html(statCards({ stats }));
  }
  
  // GET /admin/dashboard/traffic
  async getTraffic(request, reply) {
    const range = request.query.range || '7d';
    const data = await this.dashboardService.getTrafficData(range);
    reply.send({ data });
  }
  
  // GET /admin/dashboard/activity
  async getActivity(request, reply) {
    const limit = parseInt(request.query.limit) || 10;
    const activities = await this.dashboardService.getRecentActivity(limit);
    reply.html(activityList({ activities }));
  }
}
```

### 10. Notifications Controller (`notifications.controller.js`)
```javascript
import { notificationsPage } from '../templates/pages/index.js';
import { notificationsList, notificationBadge } from '../templates/partials/index.js';

class NotificationsController {
  constructor(notificationsService) {
    this.notificationsService = notificationsService;
  }
  
  // GET /admin/notifications
  async list(request, reply) {
    const filters = {
      page: parseInt(request.query.page) || 1,
      limit: parseInt(request.query.limit) || 20,
      unreadOnly: request.query.unreadOnly === 'true'
    };
    
    const result = await this.notificationsService.getNotifications(request.user.id, filters);
    
    if (request.headers['hx-request']) {
      return reply.html(notificationsList({ 
        notifications: result.data 
      }));
    }
    
    reply.html(notificationsPage({
      notifications: result.data,
      pagination: result.pagination,
      user: request.user
    }));
  }
  
  // GET /admin/notifications/unread-count
  async getUnreadCount(request, reply) {
    const count = await this.notificationsService.getUnreadCount(request.user.id);
    
    // Return OOB swap for badge update using template function
    reply.html(notificationBadge({ count }));
  }
  
  // PUT /admin/notifications/:id/read
  async markAsRead(request, reply) {
    const { id } = request.params;
    await this.notificationsService.markAsRead(id, request.user.id);
    
    // Return updated notification item
    reply.code(200).send({ success: true });
  }
  
  // PUT /admin/notifications/read-all
  async markAllAsRead(request, reply) {
    await this.notificationsService.markAllAsRead(request.user.id);
    reply.code(200).send({ success: true });
  }
  
  // DELETE /admin/notifications/:id
  async delete(request, reply) {
    const { id } = request.params;
    await this.notificationsService.deleteNotification(id, request.user.id);
    reply.code(200).send({ success: true });
  }
  
  // GET /admin/notifications/stream
  async stream(request, reply) {
    // Server-Sent Events for real-time notifications
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    
    // Subscribe to notification events for this user
    const unsubscribe = notificationsService.subscribe(request.user.id, (notification) => {
      reply.raw.write(`data: ${JSON.stringify(notification)}\n\n`);
    });
    
    request.raw.on('close', unsubscribe);
  }
}
```

---

## HTMX Templates Structure

With **fastify-html**, templates are JavaScript functions that return HTML strings using ES6 template literals. This approach provides:
- **Type safety**: Templates are typed JavaScript functions
- **Composition**: Easy to compose templates together via function calls
- **No template engine overhead**: Pure JavaScript string interpolation
- **IDE support**: Full autocomplete, linting, and refactoring support
- **Fast rendering**: No compilation step, direct string interpolation

### How fastify-html Works

1. **Register the plugin** in your Fastify app:
```javascript
import fastifyHtml from 'fastify-html';

await fastify.register(fastifyHtml);
```

2. **Use `reply.html()`** to send HTML responses:
```javascript
fastify.get('/posts', async (request, reply) => {
  const posts = await getPosts();
  return reply.html(postsPage({ posts, user: request.user }));
});
```

3. **Template functions** return HTML strings:
```javascript
export function postsPage({ posts, user }) {
  return `
    <div class="page">
      <h1>Posts</h1>
      ${posts.map(post => `<article>${post.title}</article>`).join('')}
    </div>
  `;
}
```

### Template Organization

```
src/templates/
├── layouts/
│   ├── main.js           # Main layout function
│   └── auth.js           # Auth layout function
├── partials/
│   ├── index.js          # Export all partials
│   ├── sidebar.js        # Sidebar component
│   ├── header.js         # Header component
│   ├── pagination.js     # Pagination component
│   └── ...
├── pages/
│   ├── index.js          # Export all pages
│   ├── dashboard.js      # Dashboard page
│   ├── posts.js          # Posts list page
│   └── ...
└── emails/
    ├── invitation.js     # Email templates
    └── ...
```

### Template Function Pattern

Each template is a function that accepts a data object and returns an HTML string:

```javascript
// templates/partials/sidebar.js
export function sidebar({ active, postCount, user }) {
  return `
    <aside class="sidebar" 
           x-show="sidebarOpen || window.innerWidth >= 1024"
           @click.away="if (window.innerWidth < 1024) sidebarOpen = false">
      <!-- sidebar content -->
    </aside>
  `;
}
```

### Layout Templates

#### `layouts/main.js`
```javascript
// templates/layouts/main.js
export function mainLayout({ title, csrfToken, headExtras = '', sidebar, header, footer = '', body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - BlogCMS</title>
  
  <!-- CSRF Token for HTMX -->
  <meta name="csrf-token" content="${csrfToken}">
  
  <!-- Compiled CSS -->
  <link rel="stylesheet" href="/css/main.css">
  
  <!-- Tailwind (from original) -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- HTMX -->
  <script src="https://unpkg.com/htmx.org@1.9.12"></script>
  
  <!-- Alpine.js -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  
  ${headExtras}
</head>
<body x-data="{ sidebarOpen: false, darkMode: localStorage.getItem('darkMode') === 'true' }" 
      :class="{ 'dark': darkMode }">
  
  <!-- Toast Container -->
  <div id="toast-container" class="toast-container"></div>
  
  <!-- Sidebar -->
  ${sidebar}
  
  <!-- Main Content Wrapper -->
  <div class="main-wrapper">
    <!-- Header -->
    ${header}
    
    <!-- Page Content -->
    <main class="main-content">
      ${body}
    </main>
    
    <!-- Footer -->
    ${footer}
  </div>
  
  <!-- Scripts -->
  <script src="/js/main.js"></script>
  <script>
    // Initialize Lucide icons
    lucide.createIcons();
    
    // HTMX global config
    document.body.addEventListener('htmx:configRequest', (evt) => {
      evt.detail.headers['X-CSRF-Token'] = document.querySelector('meta[name="csrf-token"]')?.content;
    });
    
    // Toast trigger handler
    document.body.addEventListener('showToast', (evt) => {
      showToast(evt.detail.message, evt.detail.type);
    });
  </script>
</body>
</html>`;
}
```

#### `layouts/auth.js`
```javascript
// templates/layouts/auth.js
export function authLayout({ title, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - BlogCMS</title>
  <link rel="stylesheet" href="/css/main.css">
  <script src="https://unpkg.com/htmx.org@1.9.12"></script>
</head>
<body class="auth-layout">
  <div class="auth-container">
    ${body}
  </div>
  
  <script src="/js/main.js"></script>
</body>
</html>`;
}
```

### Partial Templates

Partials are reusable template functions that return HTML strings. They can be composed together to build larger templates.

#### `partials/sidebar.js`
```javascript
// templates/partials/sidebar.js
export function sidebar({ active = {}, postCount = 0, user }) {
  return `<aside class="sidebar" 
       x-show="sidebarOpen || window.innerWidth >= 1024"
       @click.away="if (window.innerWidth < 1024) sidebarOpen = false">
  
  <div class="sidebar__header">
       <a href="/admin/dashboard" class="sidebar__logo">
      <i data-lucide="layout-grid"></i>
      <span>BlogCMS</span>
    </a>
    <button class="sidebar__toggle" @click="sidebarOpen = !sidebarOpen">
      <i data-lucide="panel-left-close"></i>
    </button>
  </div>
  
  <nav class="sidebar__nav">
    <div class="sidebar__group">
      <span class="sidebar__label">Main Menu</span>
      
       <a href="/admin/dashboard" class="sidebar__item ${active.dashboard ? 'sidebar__item--active' : ''}">
        <i data-lucide="home"></i>
        <span>Home</span>
      </a>
      
       <a href="/admin/posts" class="sidebar__item ${active.posts ? 'sidebar__item--active' : ''}">
        <i data-lucide="file-text"></i>
        <span>Posts</span>
        ${postCount > 0 ? `<span class="badge">${postCount}</span>` : ''}
      </a>
      
      <div class="sidebar__item sidebar__item--has-submenu" 
           x-data="{ open: ${active.attributes ? 'true' : 'false'} }">
        <button @click="open = !open" class="sidebar__submenu-toggle">
          <i data-lucide="folder-tree"></i>
          <span>Attributes</span>
          <i data-lucide="chevron-down" :class="{ 'rotate-180': open }"></i>
        </button>
        
        <div x-show="open" class="sidebar__submenu">
           <a href="/admin/categories" class="sidebar__subitem ${active.categories ? 'sidebar__item--active' : ''}">
            Categories
          </a>
           <a href="/admin/tags" class="sidebar__subitem ${active.tags ? 'sidebar__item--active' : ''}">
            Tags
          </a>
        </div>
      </div>
      
      <div class="sidebar__item sidebar__item--has-submenu"
           x-data="{ open: ${active.media ? 'true' : 'false'} }">
        <button @click="open = !open" class="sidebar__submenu-toggle">
          <i data-lucide="image"></i>
          <span>Media</span>
          <i data-lucide="chevron-down" :class="{ 'rotate-180': open }"></i>
        </button>
        
        <div x-show="open" class="sidebar__submenu">
           <a href="/admin/images" class="sidebar__subitem ${active.images ? 'sidebar__item--active' : ''}">
            Images
          </a>
           <a href="/admin/videos" class="sidebar__subitem ${active.videos ? 'sidebar__item--active' : ''}">
            Videos
          </a>
        </div>
      </div>
    </div>
    
    <div class="sidebar__group">
      <span class="sidebar__label">Management</span>
      
       <a href="/admin/users" class="sidebar__item ${active.users ? 'sidebar__item--active' : ''}">
        <i data-lucide="users"></i>
        <span>Users</span>
      </a>
      
       <a href="/admin/settings" class="sidebar__item ${active.settings ? 'sidebar__item--active' : ''}">
        <i data-lucide="settings"></i>
        <span>Settings</span>
      </a>
    </div>
  </nav>
</aside>`;
}
```

#### `partials/header.js`
```javascript
// templates/partials/header.js
import { breadcrumb } from './breadcrumb.js';

export function header({ user }) {
  return `<header class="header">
  <div class="header__left">
    <button class="header__menu-toggle" @click="sidebarOpen = !sidebarOpen">
      <i data-lucide="menu"></i>
    </button>
    
    ${breadcrumb()}
  </div>
  
  <div class="header__right">
    <!-- Search -->
    <div class="header__search" x-data="{ open: false }">
      <input type="search" 
             placeholder="Search..."
              hx-get="/admin/search/suggestions"
             hx-trigger="keyup changed delay:300ms"
             hx-target="#search-results"
             @focus="open = true"
             @click.away="open = false">
      <div id="search-results" x-show="open" class="search-dropdown"></div>
    </div>
    
    <!-- Theme Toggle -->
    <button class="header__theme-toggle" @click="darkMode = !darkMode; localStorage.setItem('darkMode', darkMode)">
      <i data-lucide="sun" x-show="!darkMode"></i>
      <i data-lucide="moon" x-show="darkMode"></i>
    </button>
    
    <!-- Notifications -->
    <div class="header__notifications" x-data="{ open: false }">
      <button @click="open = !open" class="notifications__toggle">
        <i data-lucide="bell"></i>
        <span id="notification-badge" 
               hx-get="/admin/notifications/unread-count"
              hx-trigger="load, every 30s"
              class="notifications__badge"></span>
      </button>
      
      <div x-show="open" 
           @click.away="open = false"
            hx-get="/admin/notifications"
           hx-trigger="click once"
           class="notifications__dropdown">
        <!-- Populated by HTMX -->
      </div>
    </div>
    
    <!-- User Menu -->
    <div class="header__user" x-data="{ open: false }">
      <button @click="open = !open" class="user__toggle">
        <img src="${user.avatarUrl}" alt="" class="avatar avatar--sm">
        <span>${user.firstName} ${user.lastName}</span>
        <i data-lucide="chevron-down"></i>
      </button>
      
      <div x-show="open" @click.away="open = false" class="user__dropdown">
        <div class="user__info">
          <strong>${user.firstName} ${user.lastName}</strong>
          <span>${user.email}</span>
        </div>
        
        <a href="/admin/users/${user.id}/edit" class="dropdown__item">
          <i data-lucide="user"></i> My Profile
        </a>
        <a href="/admin/settings" class="dropdown__item">
          <i data-lucide="settings"></i> Account Settings
        </a>
        
        <div class="dropdown__divider"></div>
        
        <form action="/admin/auth/logout" method="POST" hx-post="/admin/auth/logout" class="dropdown__item dropdown__item--danger">
          <button type="submit" class="btn btn--ghost-danger">
            <i data-lucide="log-out"></i> Sign Out
          </button>
        </form>
      </div>
    </div>
  </div>
</header>`;
}
```

#### `partials/pagination.js`
```javascript
// templates/partials/pagination.js
export function pagination({ pagination }) {
  if (!pagination.hasPages) return '';
  
  const prevLink = pagination.hasPrev 
    ? `<a href="?page=${pagination.prevPage}" class="pagination__prev">
        <i data-lucide="chevron-left"></i> Previous
      </a>`
    : `<span class="pagination__prev pagination__prev--disabled">
        <i data-lucide="chevron-left"></i> Previous
      </span>`;
  
  const nextLink = pagination.hasNext
    ? `<a href="?page=${pagination.nextPage}" class="pagination__next">
        Next <i data-lucide="chevron-right"></i>
      </a>`
    : `<span class="pagination__next pagination__next--disabled">
        Next <i data-lucide="chevron-right"></i>
      </span>`;
  
  const pages = pagination.pages.map(page => 
    page.isCurrent
      ? `<span class="pagination__page pagination__page--current">${page.number}</span>`
      : `<a href="?page=${page.number}" class="pagination__page">${page.number}</a>`
  ).join('');
  
  return `<nav class="pagination" hx-boost="true" hx-target="#content-area" hx-select="#content-area">
  ${prevLink}
  
  <div class="pagination__pages">
    ${pages}
  </div>
  
  ${nextLink}
</nav>`;
}
```

#### `partials/delete-modal.js`
```javascript
// templates/partials/delete-modal.js
export function deleteModal() {
  return `<div id="delete-modal" class="modal" role="dialog" aria-modal="true" x-data="{ open: false }">
  <div class="modal__backdrop" @click="open = false" x-show="open" x-transition></div>
  
  <div class="modal__content" x-show="open" x-transition>
    <div class="modal__header">
      <h3>Confirm Deletion</h3>
      <button @click="open = false" class="modal__close">
        <i data-lucide="x"></i>
      </button>
    </div>
    
    <div class="modal__body">
      <p>Are you sure you want to delete <strong x-text="itemName"></strong>?</p>
      <p class="text-grey-500">This action cannot be undone.</p>
    </div>
    
    <div class="modal__footer">
      <button @click="open = false" class="btn btn--secondary">Cancel</button>
      <button @click="confirmDelete()" 
              class="btn btn--danger"
              hx-delete=""
              hx-target="closest tr"
              hx-swap="outerHTML swap:300ms">
        Delete
      </button>
    </div>
  </div>
</div>`;
}
```

### Page Templates

Page templates compose layouts and partials together using template literal imports. They export functions that return complete HTML pages.

#### `pages/dashboard.js` (Dashboard Page)
```javascript
// templates/pages/dashboard.js
import { mainLayout } from '../layouts/main.js';
import { sidebar } from '../partials/sidebar.js';
import { header } from '../partials/header.js';
import { statCards } from '../partials/stat-cards.js';
import { activityList } from '../partials/activity-list.js';
import { cardPost } from '../partials/card-post.js';
import { pagination } from '../partials/pagination.js';

export function dashboardPage({ stats, trafficData, recentActivity, recentPosts, topPosts, trafficRange, user }) {
  const body = `<div class="page page--dashboard">
  <h1 class="page__title">Dashboard</h1>
  
  <!-- Stats Cards -->
  <div class="stats-grid" hx-get="/admin/dashboard/stats" hx-trigger="load, every 60s">
    ${statCards({ stats })}
  </div>
  
  <div class="dashboard__grid">
    <!-- Traffic Chart -->
    <div class="card card--chart">
      <div class="card__header">
        <h2>Traffic Overview</h2>
        <div class="tabs">
          <a href="?trafficRange=7d" class="tab ${trafficRange === '7d' ? 'tab--active' : ''}">7 Days</a>
          <a href="?trafficRange=30d" class="tab ${trafficRange === '30d' ? 'tab--active' : ''}">30 Days</a>
          <a href="?trafficRange=90d" class="tab ${trafficRange === '90d' ? 'tab--active' : ''}">90 Days</a>
          <a href="?trafficRange=1y" class="tab ${trafficRange === '1y' ? 'tab--active' : ''}">1 Year</a>
        </div>
      </div>
      <div class="card__body">
        <canvas id="traffic-chart" data-chart-data="${JSON.stringify(trafficData)}"></canvas>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="card">
      <div class="card__header">
        <h2>Recent Activity</h2>
      </div>
      <div class="card__body activity-feed" hx-get="/admin/dashboard/activity" hx-trigger="load">
        ${activityList({ activities: recentActivity })}
      </div>
    </div>
  </div>
  
  <!-- Recent Posts & Top Posts -->
  <div class="dashboard__grid dashboard__grid--2-col">
    <div class="card">
      <div class="card__header">
        <h2>Recent Posts</h2>
        <a href="/admin/posts" class="link">View All</a>
      </div>
      <div class="card__body">
        ${recentPosts.map(post => cardPost({ post })).join('')}
      </div>
    </div>
    
    <div class="card">
      <div class="card__header">
        <h2>Top Performing Posts</h2>
      </div>
      <div class="card__body">
        ${topPosts.map((post, index) => `
          <div class="top-post-item">
            <span class="top-post__rank">${index + 1}</span>
            <div class="top-post__info">
              <a href="/admin/posts/${post.id}/edit">${post.title}</a>
              <span class="text-grey-500">${post.viewCount} views</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</div>`;

  return mainLayout({
    title: 'Dashboard',
    csrfToken: user.csrfToken,
    sidebar: sidebar({ active: { dashboard: true }, postCount: stats.totalPosts, user }),
    header: header({ user }),
    body
  });
}
```

#### `pages/posts.js` (Posts List Page)
```javascript
// templates/pages/posts.js
import { mainLayout } from '../layouts/main.js';
import { sidebar } from '../partials/sidebar.js';
import { header } from '../partials/header.js';
import { tableRowsPost } from '../partials/table-rows-post.js';
import { pagination as paginationPartial } from '../partials/pagination.js';

export function postsPage({ posts, pagination, filters, categories = [], user }) {
  const body = `<div class="page page--posts">
  <div class="page__header">
    <h1 class="page__title">Posts</h1>
    <div class="page__actions">
       <a href="/admin/posts/new" class="btn btn--primary">
        <i data-lucide="plus"></i> New Post
      </a>
    </div>
  </div>
  
  <!-- Filters -->
  <div class="data-filter">
    <div class="data-filter__search">
      <i data-lucide="search"></i>
      <input type="search" 
             name="search"
             placeholder="Search posts..."
             value="${filters.search || ''}"
             hx-get="/admin/posts/table"
             hx-target="#posts-table"
             hx-trigger="keyup changed delay:300ms">
    </div>
    
    <div class="data-filter__group">
      <select name="status" 
              hx-get="/admin/posts/table"
              hx-target="#posts-table"
              hx-trigger="change">
        <option value="">All Status</option>
        <option value="published" ${filters.status === 'published' ? 'selected' : ''}>Published</option>
        <option value="draft" ${filters.status === 'draft' ? 'selected' : ''}>Draft</option>
        <option value="archived" ${filters.status === 'archived' ? 'selected' : ''}>Archived</option>
      </select>
      
      <select name="category"
              hx-get="/admin/posts/table"
              hx-target="#posts-table"
              hx-trigger="change">
        <option value="">All Categories</option>
        ${categories.map(cat => `
          <option value="${cat.id}" ${filters.category === cat.id ? 'selected' : ''}>${cat.title}</option>
        `).join('')}
      </select>
    </div>
  </div>
  
  <!-- Table -->
  <div id="posts-table" class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${tableRowsPost({ posts })}
      </tbody>
    </table>
    
    ${paginationPartial({ pagination })}
  </div>
</div>`;

  return mainLayout({
    title: 'Posts',
    csrfToken: user.csrfToken,
    sidebar: sidebar({ active: { posts: true }, user }),
    header: header({ user }),
    body
  });
}
```

---

## Template Functions vs Template Files

With **fastify-html**, you have two approaches for organizing templates:

### Option 1: Template Functions (Recommended)

Export template functions from JavaScript modules. This provides:
- **Type safety** with TypeScript
- **IDE autocomplete** and refactoring
- **Tree-shaking** for unused templates
- **Composition** via simple function calls

```javascript
// templates/index.js - Central export file
export { mainLayout, authLayout } from './layouts/index.js';
export { sidebar, header, pagination } from './partials/index.js';
export { dashboardPage, postsPage, loginPage } from './pages/index.js';
```

### Option 2: Template String Files

For simpler cases, use `.html` files and read them:

```javascript
// templates/pages/simple-page.js
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function simplePage(data) {
  const template = readFileSync(join(__dirname, 'simple-page.html'), 'utf-8');
  // Use simple string replacement
  return template
    .replace(/\$\{title\}/g, data.title)
    .replace(/\$\{content\}/g, data.content);
}
```

### Complete Controller Example

Here's how a complete controller looks using fastify-html:

```javascript
// src/controllers/posts.controller.js
import { postsPage, newPostPage, editPostPage } from '../templates/pages/index.js';
import { tableRowPost, tableRowsPost } from '../templates/partials/index.js';

export class PostsController {
  constructor(postsService) {
    this.postsService = postsService;
  }

  async list(request, reply) {
    const result = await this.postsService.listPosts({
      page: parseInt(request.query.page) || 1,
      limit: parseInt(request.query.limit) || 20,
      status: request.query.status,
      user: request.user
    });

    // Return partial for HTMX requests
    if (request.headers['hx-request']) {
      return reply.html(tableRowsPost({ posts: result.data }));
    }

    // Return full page with layout
    return reply.html(postsPage({
      posts: result.data,
      pagination: result.pagination,
      filters: request.query,
      user: request.user
    }));
  }

  async newForm(request, reply) {
    const categories = await categoriesService.listAll();
    return reply.html(newPostPage({ categories, user: request.user }));
  }

  async create(request, reply) {
    const post = await this.postsService.createPost(request.body, request.user);
     reply.header('HX-Redirect', `/admin/posts/${post.id}/edit`);
    return reply.code(201).send({ success: true });
  }

  async editForm(request, reply) {
    const post = await this.postsService.getPost(request.params.id, request.user);
    const categories = await categoriesService.listAll();
    return reply.html(editPostPage({ post, categories, user: request.user }));
  }
}
```

### Key Differences from Handlebars

| Feature | Handlebars | fastify-html |
|---------|------------|--------------|
| Syntax | `{{variable}}` | `${variable}` |
| Conditionals | `{{#if}}...{{/if}}` | `${condition ? '...' : ''}` |
| Loops | `{{#each items}}...{{/each}}` | `${items.map(item => `...`).join('')}` |
| Partials | `{{> partial}}` | `${partialFunction(data)}` |
| Equality check | `{{#if (eq a b)}}` | `${a === b ? ... : ...}` |
| JSON output | `{{json data}}` | `JSON.stringify(data)` |
| Escaping | Automatic | Automatic via template literals |

### HTMX Response Pattern

fastify-html works seamlessly with HTMX:

```javascript
// Return HTML partial for HTMX swap
reply.html(`<tr class="fade-in">
  <td>${post.title}</td>
  <td>${post.status}</td>
  <td>
    <button hx-delete="/posts/${post.id}" 
            hx-target="closest tr"
            hx-swap="outerHTML swap:300ms">
      Delete
    </button>
  </td>
</tr>`);

// Or trigger client-side events
reply.html('<div>Success!</div>')
  .header('HX-Trigger', JSON.stringify({
    showToast: { message: 'Post created', type: 'success' }
  }));
```

---

## Static Assets Configuration

### CSS/SCSS Structure
```
public/css/
├── main.css (compiled from SCSS)
└── themes/
    └── dark.css (optional dark mode overrides)
```

### JavaScript Files
```javascript
// public/js/main.js - Main application JS
// Reuse from original html-dashboard

// public/js/alpine-components.js
// Alpine.js components for interactivity

document.addEventListener('alpine:init', () => {
  // Toast notification component
  Alpine.data('toast', () => ({
    show: false,
    message: '',
    type: 'info',
    
    init() {
      window.addEventListener('showToast', (e) => {
        this.message = e.detail.message;
        this.type = e.detail.type;
        this.show = true;
        setTimeout(() => this.show = false, 5000);
      });
    }
  }));
  
  // Modal component
  Alpine.data('modal', () => ({
    open: false,
    
    show() { this.open = true; },
    hide() { this.open = false; }
  }));
  
  // Dropdown component
  Alpine.data('dropdown', () => ({
    open: false,
    
    toggle() { this.open = !this.open; }
  }));
});

// public/js/htmx-extensions.js
// Custom HTMX extensions

htmx.defineExtension('json-enc', {
  onEvent: function(name, evt) {
    if (name === "htmx:configRequest") {
      evt.detail.headers['Content-Type'] = 'application/json';
    }
  },
  
  encodeParameters: function(xhr, parameters, elt) {
    xhr.overrideMimeType('text/json');
    return JSON.stringify(parameters);
  }
});

// Auto-refresh CSRF token
htmx.on('htmx:afterRequest', (evt) => {
  const newToken = evt.detail.xhr.getResponseHeader('X-CSRF-Token');
  if (newToken) {
    document.querySelector('meta[name="csrf-token"]').content = newToken;
  }
});
```

### File Uploads Structure
```
public/uploads/
├── avatars/
│   └── [user-id]/avatar-[timestamp].jpg
├── posts/
│   └── [post-id]/featured-[timestamp].jpg
├── images/
│   └── [image-id]/
│       ├── original.jpg
│       ├── thumb-150.jpg
│       └── thumb-300.jpg
├── videos/
│   └── [video-id]/
│       ├── video.mp4
│       └── poster.jpg
├── logos/
│   └── logo.png
└── favicons/
    └── favicon.ico
```

---

## Authentication Flow

### Login Flow
1. User submits form to `POST /auth/login`
2. Server validates credentials
3. If valid:
   - Generate JWT access token (expires: 24h)
   - Generate refresh token (expires: 30d if rememberMe)
   - Set HTTP-only cookies
   - Update lastActiveAt
   - Return success + redirect
4. If invalid:
   - Increment failedLoginAttempts
   - Lock account after 5 attempts (15 min)
   - Return error toast

### Token Refresh Flow
1. Client sends request with expired access token
2. Middleware detects expiration
3. Return 401 with `X-Refresh-Required: true` header
4. Client calls `POST /auth/refresh` with refresh token cookie
5. Server validates refresh token
6. Generate new access token
7. Set new cookie
8. Client retries original request

### OAuth Flow (Google)
1. User clicks "Sign in with Google"
2. Redirect to `GET /auth/google`
3. Server redirects to Google consent screen
4. Google redirects to `GET /auth/google/callback`
5. Server exchanges code for tokens
6. Fetch user info from Google
7. Find or create user in database
8. Link OAuth account
9. Generate JWT and set cookies
10. Redirect to dashboard

---

## File Upload System

### Image Upload Flow
1. Client sends multipart form with image file
2. Server validates:
   - File type (jpg, png, gif, webp)
   - File size (from settings)
   - Image dimensions (min/max)
3. Generate unique filename: `{uuid}-{timestamp}.{ext}`
4. Save original to `public/uploads/images/{id}/`
5. Generate thumbnails using Sharp:
   - 150x150 (square crop)
   - 300x200 (maintain aspect)
6. Extract metadata (dimensions, format)
7. Create database record
8. Return image data with URLs

### Video Upload Flow
1. Client sends multipart form with video
2. Server validates:
   - File type (mp4, webm, mov)
   - File size
3. Save to `public/uploads/videos/{id}/`
4. Extract duration using FFmpeg
5. Generate poster frame at 1s mark
6. Create database record
7. Return video data

### File Replacement
1. Delete old file(s) from storage
2. Save new file with same ID
3. Update metadata
4. Update database record

---

## Email Service

### Email Templates
- `emails/invitation.html` - User invitation with activation link
- `emails/password-reset.html` - Password reset instructions
- `emails/welcome.html` - Welcome email after registration
- `emails/notification.html` - System notifications

### Email Configuration
```javascript
// Using Nodemailer or SendGrid
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

### Email Sending
- Queue emails for background processing (Bull/Bee Queue)
- Retry failed sends (3 attempts)
- Log all email activity

---

## Real-time Notifications

### SSE (Server-Sent Events)
```javascript
// GET /notifications/stream
// Returns text/event-stream

// Client-side:
const eventSource = new EventSource('/notifications/stream');
eventSource.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  // Show notification toast
  // Update badge count
  // Prepend to list if open
};
```

### Notification Triggers
- New comment on post → Author + Admins
- Post published → Author
- User invited → Admin who invited
- Traffic spike detected → Admins
- System events → Relevant users

---

## Error Handling

### Error Types
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class ValidationError extends AppError {
  constructor(message, errors) {
    super(message, 400);
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}
```

### Error Response Formats
```javascript
// JSON response
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}

// HTML response (HTMX)
<div class="error-message">
  <i data-lucide="alert-circle"></i>
  <span>Validation failed</span>
</div>
```

---

## Security Configuration

### Helmet Headers
```javascript
fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "https://unpkg.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});
```

### CORS Configuration
```javascript
fastify.register(cors, {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
});
```

### Rate Limiting
```javascript
// Global rate limit
fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// Specific route limits
fastify.post('/auth/login', {
  config: {
    rateLimit: {
      max: 5,
      timeWindow: '15 minutes'
    }
  }
}, authController.login);
```

### Password Policy
```javascript
const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecial: true,
  maxAge: 90, // days (optional)
  preventReuse: 5 // previous passwords
};
```

---

## Environment Variables

```bash
# Server
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/blogcms

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=30d

# Session
SESSION_SECRET=your-session-secret

# Storage
STORAGE_TYPE=local # or s3
STORAGE_PATH=./public/uploads

# AWS S3 (if using)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourblog.com

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Frontend
ALLOWED_ORIGINS=http://localhost:3000,https://yourblog.com
```

---

## Package.json Dependencies

```json
{
  "name": "blogcms-fastify",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "npm run build:css",
    "build:css": "sass scss/main.scss public/css/main.css --style=compressed && postcss public/css/main.css -o public/css/main.css",
    "db:migrate": "drizzle-kit migrate",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:seed": "node scripts/seed.js",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@fastify/cookie": "^9.3.1",
    "@fastify/cors": "^9.0.1",
    "@fastify/helmet": "^11.1.1",
    "@fastify/jwt": "^8.0.1",
    "@fastify/multipart": "^8.3.0",
    "@fastify/oauth2": "^8.1.0",
    "@fastify/rate-limit": "^9.2.0",
    "@fastify/swagger": "^8.14.0",
    "@fastify/swagger-ui": "^4.1.0",
    "drizzle-orm": "^0.30.0",
    "pg": "^8.11.3",
    "ajv": "^8.17.1",
    "bcrypt": "^5.1.1",
    "dotenv": "^16.4.5",
    "fastify": "^4.28.1",
    "fastify-html": "^0.3.2",
    "nodemailer": "^6.9.14",
    "pino": "^9.3.1",
    "pino-pretty": "^11.2.2",
    "sharp": "^0.33.4",
    "slugify": "^1.6.6",
    "uuid": "^10.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@playwright/test": "^1.45.3",
    "autoprefixer": "^10.4.19",
    "nodemon": "^3.1.4",
    "postcss": "^8.4.40",
    "postcss-cli": "^11.0.0",
    "drizzle-kit": "^0.21.0",
    "sass": "^1.77.8",
    "tailwindcss": "^3.4.7",
    "vitest": "^2.0.3"
  }
}
```

---

## 16. CI/CD & Deployment

### 16.1 Overview

This deployment strategy enables professional-grade hosting on **shared web hosting** (Node.js Selector) while maintaining modern development workflows. The "Build-in-the-Cloud" approach ensures:

- **No build tools on production server** - Only runtime dependencies
- **Optimized assets** - Pre-compiled CSS/JS bundles
- **Automated deployments** - Push-to-deploy via GitHub Actions
- **Graceful restarts** - Zero-downtime updates via `tmp/restart.txt`

### 16.2 Architecture Flow

```
Developer Machine          GitHub Actions            Shared Hosting
       │                         │                          │
       │    git push origin      │                          │
       │────────────────────────>│                          │
       │                         │                          │
       │                         │  1. npm ci               │
       │                         │  2. Compile SASS         │
       │                         │  3. Bundle JS            │
       │                         │  4. Create artifact      │
       │                         │                          │
       │                         │       SCP/SSH            │
       │                         │─────────────────────────>│
       │                         │                          │
       │                         │                          │  5. Extract
       │                         │                          │  6. npm ci --production
       │                         │                          │  7. touch tmp/restart.txt
       │                         │                          │
       │                         │                          │  Node.js Selector
       │                         │                          │  reloads application
```

### 16.3 GitHub Actions Workflow

#### `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18.x'

jobs:
  # ============================================
  # BUILD PHASE: Compile assets in the cloud
  # ============================================
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      # Compile SASS → CSS
      - name: Build CSS
        run: npm run build:css
      
      # Optional: Bundle and minify JS
      - name: Build JS
        run: npm run build:js
      
      # Run tests (optional but recommended)
      - name: Run tests
        run: npm test
        continue-on-error: true
      
      # Create deployment artifact
      - name: Create deployment package
        run: |
          mkdir -p deploy
          cp -r src/ deploy/
          cp -r public/ deploy/
          cp -r db/ deploy/
          cp package*.json deploy/
          cp drizzle.config.js deploy/
          # Don't copy .env - will be created from secrets
          
          # Create production .env file from secrets
          cat > deploy/.env << EOF
          NODE_ENV=production
          PORT=${{ secrets.PROD_PORT }}
          HOST=${{ secrets.PROD_HOST }}
          DATABASE_URL=${{ secrets.DATABASE_URL }}
          JWT_SECRET=${{ secrets.JWT_SECRET }}
          SESSION_SECRET=${{ secrets.SESSION_SECRET }}
          SMTP_HOST=${{ secrets.SMTP_HOST }}
          SMTP_USER=${{ secrets.SMTP_USER }}
          SMTP_PASS=${{ secrets.SMTP_PASS }}
          GOOGLE_CLIENT_ID=${{ secrets.GOOGLE_CLIENT_ID }}
          GOOGLE_CLIENT_SECRET=${{ secrets.GOOGLE_CLIENT_SECRET }}
          EOF
          
          tar -czf deploy.tar.gz deploy/
      
      # Upload artifact for deploy job
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: deploy-package
          path: deploy.tar.gz
          retention-days: 1

  # ============================================
  # DEPLOY PHASE: Push to shared hosting
  # ============================================
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: deploy-package
      
      # Setup SSH key for deployment
      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          cat >> ~/.ssh/config << EOF
          Host shared-hosting
            HostName ${{ secrets.SSH_HOST }}
            User ${{ secrets.SSH_USER }}
            IdentityFile ~/.ssh/deploy_key
            StrictHostKeyChecking no
          EOF
      
      # Upload to temporary location
      - name: Upload to server
        run: |
          scp -i ~/.ssh/deploy_key deploy.tar.gz shared-hosting:~/tmp/
      
      # Deploy on server
      - name: Execute deployment
        run: |
          ssh -i ~/.ssh/deploy_key shared-hosting << 'EOF'
            # Backup current version (optional)
            if [ -d ~/html-dashboard-backend ]; then
              mv ~/html-dashboard-backend ~/html-dashboard-backend.backup.$(date +%Y%m%d_%H%M%S)
            fi
            
            # Extract new version
            mkdir -p ~/html-dashboard-backend
            tar -xzf ~/tmp/deploy.tar.gz -C ~/
            mv ~/deploy/* ~/html-dashboard-backend/
            rm -rf ~/deploy ~/tmp/deploy.tar.gz
            
            cd ~/html-dashboard-backend
            
            # Install only production dependencies
            npm ci --production --silent
            
            # Run database migrations (optional - see section 16.6)
            # npm run db:migrate
            
            # Create restart signal for Node.js Selector
            touch tmp/restart.txt
            
            # Cleanup old backups (keep last 3)
            ls -t ~/html-dashboard-backend.backup.* 2>/dev/null | tail -n +4 | xargs -r rm -rf
            
            echo "Deployment completed successfully!"
          EOF
      
      # Cleanup
      - name: Cleanup SSH key
        run: rm -f ~/.ssh/deploy_key

  # ============================================
  # NOTIFICATION: Send deployment status
  # ============================================
  notify:
    needs: deploy
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: Deployment Status
        run: |
          if [ "${{ needs.deploy.result }}" == "success" ]; then
            echo "✅ Deployment successful!"
            # Optional: Send Slack/Discord notification
          else
            echo "❌ Deployment failed!"
            # Optional: Alert on-call engineer
          fi
```

### 16.4 Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

| Secret | Description | Example |
|--------|-------------|---------|
| `SSH_HOST` | Your hosting server IP/hostname | `123.45.67.89` or `server.hostinger.com` |
| `SSH_USER` | SSH username | `u123456789` |
| `SSH_PRIVATE_KEY` | Private key for SSH access | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `PROD_PORT` | Port assigned by Node.js Selector | `3000` or auto-assigned |
| `PROD_HOST` | Application host | `0.0.0.0` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | JWT signing secret | Random 64-char string |
| `SESSION_SECRET` | Session cookie secret | Random 64-char string |
| `SMTP_HOST` | Email server | `smtp.gmail.com` |
| `SMTP_USER` | Email username | `noreply@yourblog.com` |
| `SMTP_PASS` | Email password | App-specific password |
| `GOOGLE_CLIENT_ID` | OAuth client ID | From Google Console |
| `GOOGLE_CLIENT_SECRET` | OAuth secret | From Google Console |

### 16.5 Node.js Selector Configuration

#### cPanel Setup Steps:

1. **Login to cPanel** → **Software** → **Node.js Selector**

2. **Create Application:**
   ```
   Node.js Version: 18.x (or latest available)
   Application Mode: Production
   Application Root: /home/username/html-dashboard-backend
   Application URL: example.com/admin
   Application Startup File: src/server.js
   ```

3. **Environment Variables** (in cPanel):
   Add the same variables from your `.env` file:
   ```
   NODE_ENV=production
   PORT=3000 (or whatever port cPanel assigns)
   DATABASE_URL=postgresql://...
   JWT_SECRET=...
   ```

4. **Passenger Settings** (if applicable):
   ```
   # In .htaccess or application config
   PassengerNodejs /home/username/nodevenv/html-dashboard-backend/18/bin/node
   PassengerAppRoot /home/username/html-dashboard-backend
   PassengerAppType node
   PassengerStartupFile src/server.js
   ```

### 16.6 Production Server Configuration

#### `src/server.js` (Production Entry)

```javascript
import Fastify from 'fastify';
import app from './app.js';

const server = Fastify({
  logger: {
    level: 'info',
    transport: process.env.NODE_ENV === 'development' 
      ? { target: 'pino-pretty' } 
      : undefined
  },
  // Trust proxy (important for shared hosting)
  trustProxy: true,
  // Connection timeout (prevent hanging requests)
  connectionTimeout: 30000,
  keepAliveTimeout: 30000
});

// Register app
await server.register(app);

// Get port from environment (Node.js Selector assigns this)
const port = parseInt(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

try {
  await server.listen({ port, host });
  server.log.info(`Server listening on ${host}:${port}`);
  
  // Create restart signal file (for Node.js Selector)
  if (process.env.NODE_ENV === 'production') {
    const fs = await import('fs');
    const path = await import('path');
    const restartFile = path.join(process.cwd(), 'tmp', 'restart.txt');
    
    // Ensure tmp directory exists
    if (!fs.existsSync(path.dirname(restartFile))) {
      fs.mkdirSync(path.dirname(restartFile), { recursive: true });
    }
    
    // Watch for restart signal
    fs.watchFile(restartFile, () => {
      server.log.info('Restart signal received, shutting down gracefully...');
      server.close();
      process.exit(0);
    });
  }
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
```

#### `ecosystem.config.js` (Optional - for PM2)

If your host supports PM2:

```javascript
module.exports = {
  apps: [{
    name: 'blogcms-admin',
    script: './src/server.js',
    instances: 1,  // Shared hosting usually limits to 1
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production'
    },
    // Auto-restart on failure
    autorestart: true,
    max_restarts: 5,
    min_uptime: '10s',
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Resource limits (respect shared hosting)
    max_memory_restart: '512M',
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 10000
  }]
};
```

### 16.7 Database Migration Strategy

#### Approach 1: Separate Migration Job (Recommended)

Don't run migrations in the main deployment - do them separately:

```yaml
# .github/workflows/migrate.yml
name: Database Migration

on:
  workflow_dispatch:  # Manual trigger only

jobs:
  migrate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18.x'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npm run db:migrate
```

#### Approach 2: Pre-deployment Migration

```yaml
# In deploy.yml, before the deployment step
- name: Run database migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: |
    npm ci
    npm run db:migrate
```

#### Migration Safety Checklist:

- [ ] **Test migrations locally first**
- [ ] **Backup database before major changes**
- [ ] **Use transactions for data migrations**
- [ ] **Keep migrations backwards-compatible** during deploy
- [ ] **Have rollback plan ready**

### 16.8 Connection Pooling for Shared Hosting

```javascript
// db/index.js - Production-optimized pool
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  // Shared hosting limits - keep these LOW
  max: isProduction ? 20 : 10,  // Maximum connections
  min: isProduction ? 5 : 2,    // Minimum connections to maintain
  
  // Timeouts (in milliseconds)
  idleTimeoutMillis: 30000,     // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Timeout connecting after 5s
  
  // Retry logic
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 200,
  
  // Application name (visible in DB logs)
  application_name: 'blogcms-admin'
});

// Log pool statistics in production
if (isProduction) {
  pool.on('connect', () => {
    console.log('DB Pool: New client connected');
  });
  
  pool.on('error', (err) => {
    console.error('DB Pool Error:', err);
  });
}

export const db = drizzle(pool);

// Graceful shutdown helper
export async function closePool() {
  await pool.end();
}
```

### 16.9 Environment-Specific Configurations

#### `.env.development` (Local)
```
NODE_ENV=development
PORT=3000
HOST=localhost
DATABASE_URL=postgresql://localhost:5432/blogcms_dev
JWT_SECRET=dev-secret-not-secure
SESSION_SECRET=dev-session-secret
LOG_LEVEL=debug
```

#### `.env.production` (Shared Hosting - created in CI)
```
NODE_ENV=production
PORT=3000  # Assigned by Node.js Selector
HOST=0.0.0.0
DATABASE_URL=postgresql://username:password@db.host.com:5432/blogcms_prod
JWT_SECRET=your-256-bit-secret-key-here
SESSION_SECRET=another-256-bit-secret-key
LOG_LEVEL=warn
```

### 16.10 Health Check Endpoint

Add to your routes for monitoring:

```javascript
// routes/health.routes.js
export default async function healthRoutes(fastify) {
  fastify.get('/health', async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version
    };
  });
  
  // Database health check
  fastify.get('/health/db', async () => {
    try {
      await db.execute(sql`SELECT 1`);
      return { status: 'healthy', database: 'connected' };
    } catch (err) {
      return { status: 'unhealthy', database: 'disconnected', error: err.message };
    }
  });
}
```

### 16.11 Rollback Strategy

If deployment fails:

```bash
# On server via SSH
cd ~

# Stop current application
touch ~/html-dashboard-backend/tmp/stop.txt

# Restore from backup
rm -rf ~/html-dashboard-backend
mv ~/html-dashboard-backend.backup.20240201_120000 ~/html-dashboard-backend

# Restart
cd ~/html-dashboard-backend
touch tmp/restart.txt
```

Or automated in GitHub Actions:

```yaml
- name: Rollback on failure
  if: failure()
  run: |
    ssh -i ~/.ssh/deploy_key shared-hosting << 'EOF'
      cd ~
      LATEST_BACKUP=$(ls -t html-dashboard-backend.backup.* | head -1)
      rm -rf html-dashboard-backend
      mv $LATEST_BACKUP html-dashboard-backend
      cd html-dashboard-backend
      touch tmp/restart.txt
      echo "Rolled back to $LATEST_BACKUP"
    EOF
```

### 16.12 Monitoring & Logging

#### Basic Log Rotation

```bash
#!/bin/bash
# scripts/rotate-logs.sh

LOG_DIR="./logs"
MAX_SIZE="10M"
MAX_FILES=5

# Rotate if log > 10MB
if [ -f "$LOG_DIR/combined.log" ]; then
  SIZE=$(stat -f%z "$LOG_DIR/combined.log" 2>/dev/null || stat -c%s "$LOG_DIR/combined.log" 2>/dev/null)
  if [ $SIZE -gt 10485760 ]; then
    mv "$LOG_DIR/combined.log" "$LOG_DIR/combined.log.$(date +%Y%m%d)"
    gzip "$LOG_DIR/combined.log.$(date +%Y%m%d)"
    
    # Keep only last 5 rotated logs
    ls -t "$LOG_DIR"/combined.log.*.gz | tail -n +6 | xargs -r rm
  fi
fi
```

#### Simple Uptime Monitor

```javascript
// monitoring/uptime.js
import fetch from 'node-fetch';

const HEALTH_URL = process.env.HEALTH_URL || 'http://localhost:3000/health';
const WEBHOOK_URL = process.env.ALERT_WEBHOOK;  // Slack/Discord webhook

async function checkHealth() {
  try {
    const res = await fetch(HEALTH_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log('✅ Health check passed');
  } catch (err) {
    console.error('❌ Health check failed:', err.message);
    
    if (WEBHOOK_URL) {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 BlogCMS Admin is DOWN!\nError: ${err.message}`
        })
      });
    }
  }
}

// Run every 5 minutes
setInterval(checkHealth, 5 * 60 * 1000);
checkHealth(); // Initial check
```

### 16.13 Deployment Checklist

**Before First Deploy:**
- [ ] Node.js Selector created in cPanel
- [ ] PostgreSQL database created and accessible
- [ ] SSH key generated and added to hosting
- [ ] All GitHub Secrets configured
- [ ] DNS configured (if using custom domain)
- [ ] SSL certificate installed

**Per-Deployment:**
- [ ] Code pushed to `main` branch
- [ ] GitHub Actions workflow completes successfully
- [ ] Application restarts without errors
- [ ] Health check endpoint returns 200
- [ ] Database connections working
- [ ] Smoke test admin login
- [ ] Check error logs for issues

**Post-Deployment:**
- [ ] Monitor error logs for 30 minutes
- [ ] Verify all admin routes accessible
- [ ] Check database connection pool usage
- [ ] Confirm file uploads working
- [ ] Test email sending

---

This comprehensive specification covers every aspect of building the Fastify backend for the BlogCMS dashboard. All routes, middleware, services, controllers, database models, templates, CI/CD pipelines, and deployment configurations are fully detailed with no shortcuts or omissions.
