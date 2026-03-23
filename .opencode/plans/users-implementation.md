# Users Management Implementation Plan

## Overview
Implement full user management system for BlogCMS Admin Dashboard with role-based access control, invitation workflow, and user lifecycle management.

---

## ✅ Completed This Session (March 22, 2026)

### Video Management System - FULLY IMPLEMENTED

**Backend Infrastructure:**
- [x] FFmpeg installed and configured on system
- [x] `fluent-ffmpeg` npm package installed
- [x] `src/routes/videos.routes.js` - 6 CRUD routes
- [x] `src/services/videos.service.js` - FFmpeg integration for thumbnails and metadata
- [x] `src/controllers/videos.controller.js` - Full CRUD with HTMX support
- [x] Routes registered in `src/app.js` at `/admin/media/videos`
- [x] Sidebar navigation updated with Videos link

**Templates:**
- [x] `src/templates/admin/pages/media/videos/list.js` - Video grid with duration badges
- [x] `src/templates/admin/pages/media/videos/new.js` - Upload form with video preview
- [x] `src/templates/admin/pages/media/videos/edit.js` - Edit form with video player
- [x] `src/templates/admin/pages/media/videos/index.js` - Barrel exports

**Styling:**
- [x] `scss/components/_video-preview.scss` - Blurred background effect with Ken Burns animation
- [x] CSS built and integrated

**Features:**
- [x] Real video metadata extraction (duration, width, height) via FFmpeg
- [x] Automatic thumbnail generation at 1-second mark
- [x] Duration badges on video cards (MM:SS format)
- [x] Blurred background video effect (10px blur)
- [x] Synchronized playback between main and background videos
- [x] Responsive design (background disabled on mobile < 768px)
- [x] Video preview player on edit page

**Seeding:**
- [x] `scripts/seed-videos.js` - Seeds 8 videos with real metadata
- [x] Source video at `public/uploads/videos/seeder-video.mp4`
- [x] Thumbnails generated automatically

### Other Improvements

**Documentation:**
- [x] Updated `docs/TAILWIND-SCSS-BEM-SETUP.md` - Corrected contradictions, actual implementation details

**Bug Fixes:**
- [x] Changed admin password from `admin123` to `Admin@123`
- [x] Fixed `/admin` redirect to properly handle authenticated/unauthenticated users
- [x] Moved dashboard from `/admin/dashboard` to `/admin` (removed redundant path)
- [x] Updated all internal links from `/admin/dashboard` to `/admin`

---

## Current Status

### Completed Systems:
1. ✅ **Authentication** - Login/logout with JWT
2. ✅ **Dashboard** - Statistics, charts, activity feed
3. ✅ **Posts** - Full CRUD with categories/tags
4. ✅ **Categories** - Management with post counts
5. ✅ **Tags** - Management with post counts
6. ✅ **Media Images** - Upload, thumbnails, management
7. ✅ **Media Videos** - Upload, FFmpeg processing, blurred background preview
8. ✅ **Database** - Migrated and seeded with test data

### Pending Systems:
- 🔄 **Users Management** - This plan
- ⏳ **Settings** - Site configuration
- ⏳ **Notifications** - In-app notifications

---

## Current State Analysis

### Existing Users Table (from schema.js)
- `id` (uuid, primary key)
- `firstName` (varchar)
- `lastName` (varchar)
- `email` (varchar, unique)
- `password` (varchar, hashed)
- `role` (enum: ADMIN, EDITOR, AUTHOR, VIEWER)
- `status` (enum: ACTIVE, INVITED, SUSPENDED) - needs to be added
- `avatar` (varchar, optional)
- `lastActiveAt` (timestamp)
- `createdAt`, `updatedAt` (timestamps)

### Database Migration Needed
- Add `status` column to users table
- Create `invitations` table for tracking pending invites
- Optional: Add `avatar` column if not present

## Implementation Phases

### Phase 1: Database & Backend Foundation
**Priority: HIGH**

- [ ] Database migration: Add status column, create invitations table
- [ ] Create `src/routes/users.routes.js` (6 routes)
- [ ] Create `src/services/users.service.js` (8 methods)
- [ ] Create `src/controllers/users.controller.js` (8 methods)
- [ ] Register routes in `src/app.js`

**Routes needed:**
```
GET    /admin/users              → List users
GET    /admin/users/new          → Create form
POST   /admin/users              → Create user
GET    /admin/users/:id/edit     → Edit form
PUT    /admin/users/:id          → Update user
DELETE /admin/users/:id          → Delete user
```

### Phase 2: Templates
**Priority: HIGH**

- [ ] Create `src/templates/admin/pages/users/list.js`
  - Page header with filters
  - Search bar (HTMX enabled)
  - Role/Status dropdowns
  - Responsive table
  - Action buttons per row
  - Pagination

- [ ] Create `src/templates/admin/pages/users/new.js`
  - Form: firstName, lastName, email
  - Role selector
  - Submit/Cancel buttons

- [ ] Create `src/templates/admin/pages/users/edit.js`
  - User profile display
  - Editable fields
  - Status toggle buttons
  - Delete confirmation

- [ ] Create `src/templates/admin/pages/users/index.js`
  - Barrel exports

### Phase 3: Styling
**Priority: MEDIUM**

- [ ] Create `scss/pages/_users.scss` (if needed)
  - Reuse existing table styles from _media.scss
  - Role badge colors (Admin=blue, Editor=purple, Author=cyan, Viewer=amber)
  - Status indicators with colored dots

### Phase 4: Email & Invitation Flow
**Priority: MEDIUM**

- [ ] Create invitation email template
- [ ] Implement invitation service
- [ ] Create invitation acceptance page (public)
- [ ] Token validation middleware
- [ ] Set password flow

### Phase 5: Security & Permissions
**Priority: HIGH**

- [ ] Admin-only middleware for user routes
- [ ] Prevent self-deletion
- [ ] Prevent removing last admin
- [ ] Audit logging

### Phase 6: Testing & Seeding
**Priority: LOW**

- [ ] Create `scripts/seed-users.js`
  - 5-8 sample users
  - Mix of roles and statuses
  - Use existing avatar images

## UI Specifications

### Role Badge Colors
- **Admin**: Primary (blue) - `badge--primary`
- **Editor**: Purple - `badge--purple`
- **Author**: Info (cyan) - `badge--info`
- **Viewer**: Warning (amber) - `badge--warning`

### Status Indicators
- **Active**: Green dot + "Active" - `status--success`
- **Invited**: Yellow dot + "Invited" - `status--warning`
- **Suspended**: Red dot + "Suspended" - `status--danger`

### Table Columns
1. User (avatar + name + email)
2. Role (badge)
3. Status (indicator)
4. Date Joined
5. Last Active
6. Actions (edit/delete/contextual)

## Open Questions

1. **Status Column**: Does it exist in current schema? Need migration?
2. **Avatar Storage**: Use existing media system or Gravatar/external?
3. **Email SMTP**: Use existing .env SMTP config for invitations?
4. **Invitation Expiry**: 7 days? 24 hours?
5. **Self-Service**: Can users edit their own profile?
6. **Activity Logging**: Track who changed what?

## Estimated Effort

- Phase 1: 2-3 hours
- Phase 2: 3-4 hours
- Phase 3: 1 hour
- Phase 4: 2-3 hours
- Phase 5: 1-2 hours
- Phase 6: 1 hour

**Total: 10-14 hours**

## Next Steps (When Ready)

1. Answer open questions above
2. Run database migration if needed
3. Start with Phase 1 (routes + service + controller)
4. Build list page first (highest value)
5. Add new/edit forms
6. Implement email/invitation flow
7. Add seeding for testing
