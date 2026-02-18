# Tailwind CSS v4 + Preline UI + SCSS + BEM Setup Guide

This document explains how to set up and use Tailwind CSS v4 with Preline UI components, SCSS preprocessing, and BEM methodology.

## Overview

The build pipeline processes styles in this order:

```
scss/*.scss → sass → .build/components.css → postcss (Tailwind v4) → dist/css/main.css
```

## Directory Structure

```
project/
├── css/
│   ├── index.css         # Tailwind v4 entry point
│   └── theme.css         # Custom theme tokens (@theme block)
├── scss/
│   ├── main.scss         # SCSS entry point
│   ├── base/             # Reset, typography, variables
│   ├── components/       # BEM components (atoms, molecules, organisms)
│   ├── layouts/          # Layout styles
│   └── utilities/        # Helper classes
├── .build/               # Intermediate build output (gitignored)
│   └── components.css    # Compiled SCSS
├── dist/
│   └── css/
│       └── main.css      # Final output (Tailwind + SCSS combined)
└── postcss.config.cjs    # PostCSS configuration
```

## Installation

### Required Dependencies

```bash
# Tailwind CSS v4 and PostCSS
npm install tailwindcss @tailwindcss/postcss postcss postcss-cli postcss-nesting

# SCSS compiler
npm install sass

# Preline UI (optional, for interactive components)
npm install preline
```

## Configuration Files

### postcss.config.cjs

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-nesting': {},
  },
};
```

> **Note**: Use `.cjs` extension for CommonJS compatibility with ESM projects.

### css/index.css (Tailwind v4 Entry Point)

```css
/* Tailwind v4 base import */
@import 'tailwindcss';

/* Custom theme tokens */
@import './theme.css';

/* Compiled SCSS components */
@import '../.build/components.css';

/* Preline UI plugin (optional) */
@plugin "preline/plugin";
```

### css/theme.css (Custom Theme Tokens)

Tailwind v4 uses CSS-based configuration with `@theme` blocks instead of `tailwind.config.js`:

```css
@theme {
  /* Colors */
  --color-primary: #171717;
  --color-secondary: #404040;
  --color-accent: #f5f5f5;
  --color-border: #e5e5e5;
  --color-muted: #737373;

  /* Typography */
  --font-family-sans: 'Schibsted Grotesk', system-ui, sans-serif;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

## SCSS with BEM Methodology

### BEM Naming Convention

```
.block {}
.block__element {}
.block--modifier {}
```

### Example Component (scss/components/atoms/_button.scss)

```scss
// Button Component - Atomic Design Pattern
// Uses BEM methodology with Tailwind utilities

.btn {
  // Base styles using CSS properties (not @apply)
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  cursor: pointer;

  // Size modifiers
  &--sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  &--lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }

  &--full {
    width: 100%;
  }

  // Color modifiers
  &--primary {
    background-color: var(--color-primary);
    color: white;

    &:hover {
      background-color: var(--color-secondary);
    }
  }

  &--secondary {
    background-color: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-primary);

    &:hover {
      background-color: var(--color-accent);
    }
  }

  // State modifiers
  &--disabled,
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Elements
  &__icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  &__text {
    // Text content styling
  }
}
```

### Using Tailwind Classes in SCSS

**Avoid `@apply` in Tailwind v4** - it has limited support. Instead:

1. **Use CSS custom properties** (defined in `@theme`):
   ```scss
   .card {
     border-radius: var(--radius-md);
     box-shadow: var(--shadow-md);
   }
   ```

2. **Use standard CSS**:
   ```scss
   .card {
     display: flex;
     flex-direction: column;
     gap: 1rem;
   }
   ```

3. **Use Tailwind classes directly in HTML** for utility styles:
   ```html
   <div class="card flex flex-col gap-4 p-6">
     <!-- content -->
   </div>
   ```

### SCSS Main Entry Point (scss/main.scss)

```scss
// Base
@use 'base/reset';
@use 'base/typography';

// Components - Atomic Design
@use 'components/atoms/button';
@use 'components/atoms/input';
@use 'components/molecules/form-field';
@use 'components/molecules/card';
@use 'components/organisms/header';
@use 'components/organisms/sidebar';

// Layouts
@use 'layouts/auth';
@use 'layouts/dashboard';

// Utilities
@use 'utilities/helpers';
```

## Build Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "css:scss": "sass scss/main.scss .build/components.css --style=compressed",
    "css:tailwind": "postcss css/index.css -o dist/css/main.css",
    "css:build": "npm run css:scss && npm run css:tailwind",
    "css:watch": "npm-run-all --parallel css:watch:*",
    "css:watch:scss": "sass scss/main.scss .build/components.css --watch",
    "css:watch:tailwind": "postcss css/index.css -o dist/css/main.css --watch"
  }
}
```

## Using Preline UI Components

### Include Preline JS

```html
<script src="/vendor/preline/preline.js"></script>
```

Or via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/preline@latest/dist/preline.min.js"></script>
```

### Preline Components with BEM

Preline uses data attributes for JavaScript functionality. Combine with BEM:

```html
<!-- Modal with BEM classes and Preline data attributes -->
<div 
  id="my-modal" 
  class="modal hs-overlay hidden"
  tabindex="-1"
  aria-labelledby="my-modal-title"
>
  <div class="modal__dialog">
    <div class="modal__content">
      <div class="modal__header">
        <h3 id="my-modal-title" class="modal__title">Modal Title</h3>
        <button type="button" class="modal__close" data-hs-overlay="#my-modal">
          <span class="sr-only">Close</span>
          <svg><!-- close icon --></svg>
        </button>
      </div>
      <div class="modal__body">
        <!-- Modal content -->
      </div>
    </div>
  </div>
</div>

<!-- Trigger button -->
<button type="button" data-hs-overlay="#my-modal" class="btn btn--primary">
  Open Modal
</button>
```

### SCSS for Preline Components

```scss
// Modal Component
.modal {
  // Preline handles show/hide via hs-overlay classes
  
  &__dialog {
    max-width: 32rem;
    margin: 1.75rem auto;
  }

  &__content {
    background-color: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
  }

  &__body {
    padding: 1.5rem;
  }

  &__close {
    padding: 0.5rem;
    border-radius: var(--radius-sm);
    
    &:hover {
      background-color: var(--color-accent);
    }
  }
}
```

## Development Workflow

1. **Start watchers** in separate terminals or use `npm-run-all`:
   ```bash
   npm run css:watch
   ```

2. **Write SCSS** using BEM methodology in `scss/components/`

3. **Use Tailwind utilities** directly in HTML for layout/spacing

4. **Use custom theme tokens** for consistent design values

5. **Test Preline components** by adding appropriate data attributes

## Troubleshooting

### `@apply` Not Working

Tailwind v4 has limited `@apply` support. Use:
- CSS custom properties from `@theme`
- Standard CSS
- Tailwind classes directly in HTML

### Styles Not Appearing

1. Check build output exists: `ls dist/css/main.css`
2. Verify SCSS compiled: `ls .build/components.css`
3. Check for SCSS syntax errors in terminal
4. Ensure HTML imports the correct CSS file

### Preline Components Not Working

1. Verify `preline.js` is loaded after DOM
2. Check data attributes are correct (`hs-overlay`, `hs-collapse`, etc.)
3. Ensure the target element IDs match

## Migration from Tailwind v3

1. **Remove** `tailwind.config.js`
2. **Create** `css/index.css` with `@import 'tailwindcss'`
3. **Move** theme config to `css/theme.css` using `@theme` block
4. **Update** `postcss.config.js` to use `@tailwindcss/postcss`
5. **Replace** `@apply` in SCSS with CSS custom properties or standard CSS
6. **Update** build scripts for two-step pipeline

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Preline UI Components](https://preline.co/docs)
- [BEM Methodology](https://getbem.com/)
- [Sass Documentation](https://sass-lang.com/documentation)
