# BlogCMS Admin Dashboard - Agent Context

> This file provides comprehensive context for AI agents working on this codebase.

## Quick Reference

| Aspect | Value |
|--------|-------|
| **Project** | BlogCMS Admin Dashboard |
| **Stack** | Fastify + Node.js + HTMX + Tailwind CSS v4 + SCSS (BEM) + Preline UI v4 |
| **Database** | PostgreSQL via Drizzle ORM |
| **Template Engine** | fastify-html (template literals) |
| **Node Version** | >=18.0.0 |
| **Package Manager** | npm |

---

## Key Documentation Files

| File | Purpose | When to Read |
|------|---------|--------------|
| `AGENTS.md` | Project overview and context (this file) | Start of every session |
| `docs/backend-specification.md` | Complete API specification with all routes, request/response formats, database schema, middleware, and service layer details | When implementing routes, controllers, services, or database operations |
| `docs/TAILWIND-SCSS-BEM-SETUP.md` | CSS architecture guide covering the Tailwind v4 + SCSS + BEM setup, build pipeline, and styling conventions | When working on styles, adding components, or debugging CSS issues |

---

## Architecture Overview

This is a **Hypermedia-Driven Application (HDA)**:
- Server renders HTML using template literals (fastify-html)
- HTMX handles dynamic updates via HTML fragment swaps
- Preline UI provides pre-built components (modals, dropdowns, etc.)
- Alpine.js for client-side interactivity where needed
- No SPA framework - traditional server-rendered approach

---

## Directory Structure

```
dashboard/
├── src/                           # Backend source code
│   ├── server.js                  # Entry point
│   ├── app.js                     # Fastify app factory
│   ├── routes/                    # Route handlers
│   │   └── auth.routes.js         # Auth routes (login, logout, etc.)
│   ├── controllers/               # Business logic + template rendering
│   │   └── auth.controller.js     # Auth controller with HTMX responses
│   ├── services/                  # Data access layer
│   │   └── auth.service.js        # Auth service (bcrypt, JWT)
│   ├── middleware/                # Express-style middleware
│   │   ├── authenticate.js        # JWT verification
│   │   └── authorize.js           # Role-based access control
│   ├── templates/                 # HTML templates (fastify-html)
│   │   └── admin/
│   │       ├── layouts/           # Page layouts
│   │       │   ├── auth.js        # Auth layout (login/reset pages)
│   │       │   └── index.js       # Layout exports
│   │       ├── pages/             # Full page templates
│   │       │   ├── login.js       # Login page with modals
│   │       │   ├── reset-password.js
│   │       │   └── index.js       # Page exports
│   │       └── partials/          # Reusable components (TODO)
│   ├── db/                        # Database
│   │   ├── schema.js              # Drizzle schema definitions
│   │   ├── index.js               # Database connection
│   │   └── migrations/            # SQL migrations
│   └── utils/                     # Utility functions
│       ├── validators.js          # Input validation helpers
│       └── security.js            # Security utilities
├── css/                           # Tailwind CSS v4 source
│   ├── index.css                  # Entry point (imports tailwindcss + theme + components)
│   └── theme.css                  # @theme block + custom utilities + animations
├── scss/                          # SCSS source (BEM methodology)
│   ├── main.scss                  # Entry point (imports all partials)
│   ├── base/                      # Variables, typography, base styles
│   ├── components/                # Atomic Design structure
│   │   ├── atoms/                 # Buttons, badges, inputs, etc.
│   │   ├── molecules/             # Forms, pagination, breadcrumbs
│   │   └── organisms/             # Cards, tables, modals, sidebar
│   ├── layouts/                   # Layout-specific styles
│   └── pages/                     # Page-specific styles
├── .build/                        # Intermediate build output
│   └── components.css             # Compiled SCSS (sass output)
├── dist/                          # Final build output
│   └── css/
│       └── main.css               # Final CSS (~240KB, ready for browser)
├── public/                        # Static assets
│   └── css/
│       └── main.css               # Symlink/copy to dist/css/main.css
├── docs/                          # Documentation
│   ├── backend-specification.md   # Full API specification
│   └── TAILWIND-SCSS-BEM-SETUP.md # CSS architecture guide
├── package.json                   # Dependencies and scripts
├── postcss.config.cjs             # PostCSS configuration
└── drizzle.config.js              # Drizzle ORM configuration
```

---

## CSS Build Pipeline

### How It Works

```
scss/main.scss → sass → .build/components.css → 
css/index.css (imports tailwindcss + theme.css + components.css) → 
postcss (@tailwindcss/postcss) → dist/css/main.css
```

### Build Commands

```bash
npm run build:css    # Full build: sass + postcss → dist/css/main.css
npm run watch:css    # Watch mode for development
```

### Key Files

| File | Purpose |
|------|---------|
| `css/index.css` | Tailwind v4 entry point |
| `css/theme.css` | Custom theme tokens (@theme block), utilities, animations |
| `scss/main.scss` | SCSS components entry (BEM methodology) |
| `.build/components.css` | Intermediate sass output |
| `dist/css/main.css` | Final compiled CSS |
| `postcss.config.cjs` | PostCSS with @tailwindcss/postcss |

### Tailwind CSS v4 Notes

- Uses `@theme` block for custom tokens (NOT tailwind.config.js)
- CSS variables for colors, shadows, etc. (e.g., `var(--color-grey-500)`)
- Custom utilities defined with `@utility` directive
- Preline v4 variants imported via `@import "preline/variants.css"`

**Important**: Tailwind v4 does NOT support the `theme()` function from v3. Use CSS variables instead.

```css
/* v3 (deprecated) */
border-color: theme('colors.gray.200');

/* v4 (correct) */
border-color: var(--color-gray-200);
/* or hardcoded: */
border-color: #e5e7eb;
```

---

## Template System

### Architecture

Templates use **fastify-html** (tagged template literals):

```javascript
// src/templates/admin/pages/login.js
export const loginPage = (data) => `
  <!DOCTYPE html>
  <html>
    <head>...</head>
    <body>
      ${loginForm(data)}
      ${forgotPasswordModal()}
    </body>
  </html>
`;
```

### Template Flow

```
Route (auth.routes.js) → Controller (auth.controller.js) → Template (login.js)
     ↓
Handler calls controller method
     ↓
Controller renders template with data
     ↓
Template returns HTML string
     ↓
Fastify sends to client
```

### Example: Login Page

```javascript
// Route: src/routes/auth.routes.js
fastify.get('/admin/auth/login', authController.showLoginPage);

// Controller: src/controllers/auth.controller.js
async showLoginPage(request, reply) {
  return reply.type('text/html').send(
    authLayout({
      title: 'Sign In',
      content: loginPage({ csrfToken: generateCsrf() })
    })
  );
}

// Template: src/templates/admin/pages/login.js
export const loginPage = ({ csrfToken }) => `
  <form hx-post="/admin/auth/login" ...>
    <input type="hidden" name="_csrf" value="${csrfToken}">
    ...
  </form>
`;
```

---

## Authentication Flow

### Login Process

1. User visits `/admin/auth/login`
2. GET renders login page with CSRF token
3. User submits form (HTMX POST to `/admin/auth/login`)
4. Controller validates credentials via AuthService
5. On success: Set JWT cookie, return HX-Redirect header
6. On failure: Return error HTML fragment

### JWT Strategy

- HTTP-only cookies (not localStorage)
- Access token expires in 15 minutes (configurable)
- Remember me extends to 7 days
- Refresh token mechanism for long sessions

### Key Files

- `src/routes/auth.routes.js` - Route definitions
- `src/controllers/auth.controller.js` - Auth logic
- `src/services/auth.service.js` - JWT/bcrypt operations
- `src/middleware/authenticate.js` - JWT verification
- `src/middleware/authorize.js` - Role-based access

---

## Database (Drizzle ORM)

### Schema Location

`src/db/schema.js` - All table definitions using Drizzle's PostgreSQL dialect

### Key Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts (admin, editor, author, viewer) |
| `sessions` | Active login sessions |
| `posts` | Blog posts with content, status, SEO |
| `categories` | Post categories |
| `tags` | Post tags (many-to-many via `post_tags`) |
| `media_items` | Images and videos |
| `notifications` | User notifications |
| `settings` | System configuration |

### Commands

```bash
npm run db:generate  # Generate migrations from schema
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to DB (dev only)
npm run db:seed      # Seed database
npm run db:studio    # Open Drizzle Studio GUI
```

---

## HTMX Patterns

### Form Submission

```html
<form 
  hx-post="/admin/auth/login"
  hx-target="#error-container"
  hx-swap="innerHTML"
  hx-indicator="#loading-spinner"
>
```

### Modals (Preline UI)

```html
<!-- Trigger -->
<button data-hs-overlay="#forgot-password-modal">Forgot Password?</button>

<!-- Modal -->
<div id="forgot-password-modal" class="hs-overlay hidden ...">
  <div class="hs-overlay-open:animate-fade-in ...">
    <!-- Modal content -->
  </div>
</div>
```

### Server Responses

```javascript
// Success with redirect
reply.header('HX-Redirect', '/admin/dashboard');
return reply.send('');

// Error fragment
return reply.type('text/html').send(`
  <div class="alert alert--error">Invalid credentials</div>
`);

// OOB swap (update multiple elements)
reply.header('HX-Trigger', 'refreshNotifications');
```

---

## Current Implementation Status

### Completed

- [x] Project setup (Fastify, HTMX, Drizzle)
- [x] Tailwind CSS v4 migration
- [x] CSS build pipeline (SCSS + Tailwind)
- [x] Login page template
- [x] Auth layout
- [x] Forgot password modal
- [x] Request access modal
- [x] Database schema
- [x] Auth routes structure
- [x] Auth controller skeleton

### In Progress

- [ ] Auth service implementation
- [ ] JWT middleware
- [ ] CSRF protection

### TODO

- [ ] Dashboard page (post-login)
- [ ] Posts CRUD (routes, controller, templates)
- [ ] Categories CRUD
- [ ] Tags CRUD
- [ ] Users management
- [ ] Images gallery
- [ ] Videos gallery
- [ ] Settings page
- [ ] Notifications system

---

## Common Patterns

### Adding a New Page

1. Create template in `src/templates/admin/pages/`
2. Export from `src/templates/admin/pages/index.js`
3. Create controller method in appropriate controller
4. Add route in `src/routes/`
5. Add page-specific SCSS in `scss/pages/` (if needed)

### Adding a New Component

1. Create SCSS file in `scss/components/atoms|molecules|organisms/`
2. Add `@use` statement in `scss/main.scss`
3. Run `npm run build:css`

### HTMX Response Patterns

```javascript
// Full page (non-HTMX)
return reply.type('text/html').send(layoutTemplate(pageTemplate(data)));

// HTMX fragment
return reply.type('text/html').send(partialTemplate(data));

// Redirect after action
reply.header('HX-Redirect', '/admin/posts');
return reply.send('');

// Trigger event
reply.header('HX-Trigger', 'showToast');
```

---

## Dependencies

### Core

| Package | Version | Purpose |
|---------|---------|---------|
| fastify | ^4.28.1 | Web framework |
| fastify-html | ^0.3.2 | Template engine |
| drizzle-orm | ^0.30.0 | PostgreSQL ORM |
| pg | ^8.11.3 | PostgreSQL driver |
| bcrypt | ^5.1.1 | Password hashing |
| @fastify/jwt | ^8.0.1 | JWT authentication |
| @fastify/cookie | ^9.3.1 | Cookie handling |
| zod | ^3.23.8 | Schema validation |

### CSS/Build

| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | ^4.1.18 | Utility CSS framework |
| @tailwindcss/postcss | ^4.1.18 | PostCSS plugin for Tailwind v4 |
| sass | ^1.77.8 | SCSS compiler |
| preline | ^4.0.1 | UI component library |

---

## Environment Variables

```env
# Server
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/blogcms

# Auth
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Email (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=password
```

---

## Troubleshooting

### CSS Not Updating

1. Check if sass ran: `ls -la .build/components.css`
2. Check postcss output: `ls -la dist/css/main.css`
3. Full rebuild: `npm run build:css`

### Tailwind Classes Not Working

1. Ensure using Tailwind v4 syntax (not v3)
2. Check if class exists in `dist/css/main.css`
3. Custom classes must be in `@theme` block or `@utility`

### Database Connection Issues

1. Verify `DATABASE_URL` in `.env`
2. Run `npm run db:studio` to test connection
3. Check PostgreSQL service is running

### HTMX Not Swapping

1. Check `hx-target` exists in DOM
2. Verify server returns correct Content-Type (`text/html`)
3. Check browser console for errors
4. Ensure Preline JS is loaded for modal/dropdown interactivity

---

## Useful Commands

```bash
# Development
npm run dev          # Start server with nodemon
npm run watch:css    # Watch CSS changes

# Database
npm run db:studio    # Open Drizzle Studio
npm run db:push      # Push schema to DB

# Build
npm run build:css    # Compile CSS
npm run build:js     # Bundle client JS (esbuild)

# Testing
npm test            # Run vitest
npm run test:e2e    # Run Playwright tests
```

---

## Session Continuation Prompt

Use this prompt when starting a new session:

```
I'm working on a BlogCMS Admin Dashboard in /home/joelebukatobi/projects/dashboard

Stack: Fastify + Node.js + HTMX + Tailwind CSS v4 + SCSS (BEM) + Preline UI v4 + PostgreSQL (Drizzle ORM)

Key context:
1. Read AGENTS.md for full project documentation
2. Read docs/backend-specification.md for API specs
3. CSS build: `npm run build:css` (scss → sass → postcss → dist/css/main.css)
4. Templates are in src/templates/admin/ using fastify-html (template literals)
5. Login page is working at /admin/auth/login
6. Tailwind v4 uses CSS variables, not theme() function

Current task: [INSERT TASK]

Please review AGENTS.md before proceeding.
```
