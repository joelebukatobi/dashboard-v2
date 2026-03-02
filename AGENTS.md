# BlogCMS Admin Dashboard - Agent Guide

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Use plan mode for verification steps, not just building

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- One focused task per subagent

### 3. Self-Improvement Loop
- After ANY correction: update `tasks/lessons.md` with the pattern
- Write rules to prevent the same mistake
- Review lessons at session start

### 4. Verification Before Done
- Never mark complete without proving it works
- Run tests, check logs, demonstrate correctness
- Ask: "Would a staff engineer approve this?"

### 5. Core Principles
- **Simplicity First**: Minimal code changes, minimal impact
- **No Laziness**: Find root causes, no temporary fixes
- **Elegance**: Pause and ask "is there a better way?"

## Development Tools

This codebase is equipped with AI-powered code intelligence tools:

**Grepika** - Semantic code search and navigation
- 125 files indexed for intelligent search
- Natural language queries supported
- Fast symbol and pattern finding

**Serena** - Symbolic code editing
- Precise code modifications at symbol level
- Code analysis and refactoring support
- Relationship tracking between symbols

---

## Quick Reference

| Aspect | Value |
|--------|-------|
| **Stack** | Fastify + Node.js + HTMX + Tailwind CSS v4 + SCSS (BEM) + PostgreSQL (Drizzle ORM) |
| **Template Engine** | fastify-html (template literals) |
| **Node Version** | >=18.0.0 |

## Essential Commands

```bash
# Development
npm run dev              # Start dev server + CSS watcher
npm run dev:server       # Start server only (nodemon)
npm run watch:css        # Watch SCSS changes

# Build (REQUIRED after SCSS changes)
npm run build:css        # Compile SCSS → CSS

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Drizzle Studio

# Testing
npm test                 # Run all vitest tests
npm test -- src/services/auth.service.test.js  # Run single test
npm test -- --reporter=verbose                  # Verbose output
npm run test:e2e         # Run Playwright E2E tests
```

## Code Style

**Imports:**
- ES modules with `.js` extensions: `import { authService } from '../services/auth.service.js'`
- Group: external → internal → utils

**Naming:**
- Files: kebab-case (`auth.controller.js`)
- Classes: PascalCase (`AuthController`)
- Functions/Variables: camelCase (`getUserById`)
- Database: snake_case (`created_at`)

**Formatting:**
- 2-space indentation, single quotes, semicolons required
- Max line length: 100 characters

**Error Handling (Controllers):**
```javascript
async login(request, reply) {
  try {
    const result = await authService.validateCredentials(email, password);
    if (!result.valid) {
      reply.code(401);
      return reply.type('text/html').send(errorToast({ message: 'Invalid credentials' }));
    }
  } catch (error) {
    request.log.error(error);
    reply.code(500);
    return reply.type('text/html').send(errorToast({ message: 'An error occurred' }));
  }
}
```

**JSDoc:** All service methods need `@param` and `@returns`

## Architecture

**Controller Pattern:**
- Handle HTTP layer only
- Delegate to services
- Return HTML fragments (HTMX) or full pages

**Service Pattern:**
- Business logic only
- Return data, never HTTP responses

**File Structure:**
```
src/
├── controllers/     # HTTP handlers
├── services/        # Business logic  
├── routes/          # Route definitions
├── templates/       # HTML templates (fastify-html)
├── db/             # Database schema & connection
└── middleware/     # Auth, validation
```

## CSS/Styling

**BEM Methodology:**
```scss
.block { }
.block__element { }
.block--modifier { }
```

**Tailwind v4 Rules:**
- Use `@apply` in SCSS
- CSS variables: `var(--color-grey-500)` (NOT `theme()`)
- Build required: `npm run build:css` after SCSS changes

**Border Radius Scale:**
- `rounded-sm`: 2.4px | `rounded-md`: 4px | `rounded-lg`: 8px | `rounded-xl`: 16px

## HTMX Patterns

```html
<form hx-post="/admin/posts" hx-target="#form-response" hx-swap="innerHTML">
```

```javascript
// Redirect
reply.header('HX-Redirect', '/admin/dashboard');

// OOB updates
reply.header('HX-Trigger', 'refreshNotifications');
```

## Testing

```javascript
// Test file: *.test.js
import { describe, it, expect } from 'vitest';

describe('AuthService', () => {
  it('should validate credentials', async () => {
    const result = await authService.validateCredentials('test@example.com', 'password');
    expect(result.valid).toBe(true);
  });
});
```

**Run single test:** `npm test -- src/services/auth.service.test.js`

## Key Documentation

- `docs/backend-specification.md` - API specs, database schema, detailed patterns
- `docs/TAILWIND-SCSS-BEM-SETUP.md` - CSS architecture guide
- `README.md` - Setup instructions

## Session Checklist

1. Review AGENTS.md (this file)
2. Check `docs/backend-specification.md` for relevant API specs
3. Run `npm run build:css` if working on styles
4. Run `npm run db:migrate` if schema changed

## Common Issues

**CSS not updating?** → `npm run build:css`

**Database connection?** → Check `.env.development` DATABASE_URL, run `npm run db:studio`

**Test failing?** → `npm test -- --reporter=verbose`
