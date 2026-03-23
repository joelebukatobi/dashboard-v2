# Tailwind CSS v4 + Preline UI + SCSS + BEM Setup Guide

This document explains the CSS build pipeline and architecture for the BlogCMS Admin Dashboard.

## Overview

The project uses a **two-stage build pipeline** that combines SCSS with BEM methodology and Tailwind CSS v4:

```
Stage 1: SCSS Compilation
scss/main.scss → sass → .build/components.css

Stage 2: PostCSS Processing  
css/index.css → postcss → dist/css/main.css
```

## Architecture

### How It Works

1. **SCSS files** (`scss/**/*.scss`) use BEM naming with `@apply` directives to pull in Tailwind utilities
2. **Sass compiles** SCSS to `.build/components.css` (intermediate output)
3. **CSS entry** (`css/index.css`) imports:
   - Tailwind CSS v4 base
   - Custom theme tokens (`theme.css`)
   - Compiled SCSS components (`.build/components.css`)
4. **PostCSS processes** the final CSS with Tailwind v4, nesting, and autoprefixer

### Directory Structure

```
project/
├── css/
│   ├── index.css         # Main entry point (imports Tailwind, theme, SCSS)
│   └── theme.css         # Custom theme tokens (@theme block)
├── scss/
│   ├── main.scss         # SCSS entry point
│   ├── base/             # Typography, base styles
│   │   ├── _typography.scss
│   │   └── _base.scss
│   ├── components/       # BEM components (atomic design)
│   │   ├── atoms/        # Buttons, inputs, badges, etc.
│   │   ├── molecules/    # Forms, breadcrumbs, etc.
│   │   └── organisms/    # Sidebar, header, tables, etc.
│   ├── layouts/          # Layout styles
│   └── pages/            # Page-specific styles
├── .build/               # Intermediate build output (gitignored)
│   └── components.css    # Compiled SCSS from Stage 1
├── dist/css/
│   └── main.css          # Final output (Stage 2)
└── postcss.config.cjs    # PostCSS configuration
```

## Configuration

### postcss.config.cjs

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // Tailwind CSS v4
    'postcss-nesting': {},        // CSS nesting support
    'autoprefixer': {},           // Vendor prefixes
  },
};
```

### css/index.css (Main Entry Point)

```css
/*
 * Main CSS Entry Point
 * Combines Tailwind CSS v4 with compiled SCSS components
 */

/* Tailwind CSS v4 base, components, and utilities */
@import "tailwindcss";

/* Enable class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));

/* Custom theme tokens (colors, shadows, animations) */
@import "./theme.css";

/* Compiled SCSS components (BEM classes with @apply) */
@import "../.build/components.css";
```

### css/theme.css (Custom Theme)

```css
/* Import Preline UI variants for Tailwind v4 */
@import "preline/variants.css";

@theme {
  /* Layout */
  --sidebar-width: 24rem;
  --header-height: 5.6rem;

  /* Font family */
  --font-family-sans: 'Schibsted Grotesk', system-ui, sans-serif;
  
  /* Grey color palette */
  --color-grey-50: #e9e9e9;
  --color-grey-100: #d3d3d3;
  --color-grey-500: #7a7a7a;
  --color-grey-900: #212121;

  /* Sidebar theme colors */
  --color-bg-sidebar: #1e3a8a;
  --color-bg-sidebar-hover: #1d4ed8;
  
  /* Border radius (8-point scale) */
  --radius-sm: 0.24rem;  /* 2.4px */
  --radius-md: 0.4rem;   /* 4px */
  --radius-lg: 0.8rem;   /* 8px */
  --radius-xl: 1.6rem;   /* 16px */
  
  /* Box shadows */
  --shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07);
  --shadow-card: 0 0 20px 0 rgba(76, 87, 125, 0.02);
}

/* Custom utilities */
@utility text-body-sm {
  font-size: var(--font-size-body-sm);
}

@utility scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: var(--color-grey-300) var(--color-grey-100);
}

/* Dark mode overrides */
.dark {
  --color-bg-sidebar: #181818;
  color-scheme: dark;
}
```

## SCSS with BEM + @apply

### BEM Naming Convention

```
.block {}           // Block
.block__element {}  // Element
.block--modifier {} // Modifier
```

### Using @apply in SCSS

**Important:** The codebase uses `@apply` extensively with Tailwind v4. It works perfectly fine:

```scss
// scss/components/atoms/_button.scss
.btn {
  @apply inline-flex items-center justify-center gap-[0.8rem];
  @apply px-[1.2rem] text-body-sm font-medium rounded-md cursor-pointer h-[3.2rem];
  @apply transition-all duration-200;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;

  // Primary variant
  &--primary {
    @apply bg-blue-600 text-white;
    @apply hover:bg-blue-700 active:bg-blue-800;
    
    .dark & {
      @apply bg-white text-grey-900;
    }
  }

  // Sizes
  &--sm {
    @apply px-[1.2rem] py-[0.4rem] text-body-xs;
  }

  &--lg {
    @apply px-[2.4rem] py-[1.2rem] text-body;
  }
}
```

### Key Patterns

1. **Use `@apply` for Tailwind utilities** - It's fully supported in v4
2. **CSS variables** for theme values: `var(--color-grey-500)`
3. **Dark mode** with `.dark &` nesting
4. **BEM modifiers** for component variants

## Build Scripts

### package.json scripts

```json
{
  "scripts": {
    "build:css": "sass scss/main.scss .build/components.css --no-source-map && postcss css/index.css -o dist/css/main.css",
    "watch:css": "chokidar 'scss/**/*.scss' -c 'npm run build:css' --initial",
    "dev": "concurrently \"npm run dev:server\" \"npm run watch:css\""
  }
}
```

### Commands

```bash
# Development (watch SCSS + run server)
npm run dev

# Build CSS once
npm run build:css

# Watch SCSS changes only
npm run watch:css

# Run server only
npm run dev:server
```

## Using Preline UI

Preline UI is included via CSS variants:

```css
/* In css/theme.css */
@import "preline/variants.css";
```

Preline components use data attributes for JavaScript functionality:

```html
<!-- Modal with BEM classes and Preline data attributes -->
<div 
  id="my-modal" 
  class="modal"
  data-hs-overlay="true"
>
  <!-- Modal content -->
</div>

<!-- Trigger button -->
<button type="button" data-hs-overlay="#my-modal" class="btn btn--primary">
  Open Modal
</button>
```

## Development Workflow

1. **Start dev server:** `npm run dev` (watches SCSS + starts server)

2. **Write SCSS:** Add components in `scss/components/` using:
   - BEM naming (`.btn`, `.btn--primary`)
   - `@apply` for Tailwind utilities
   - CSS variables from `@theme`

3. **Use BEM classes in HTML:**
   ```html
   <button class="btn btn--primary">Submit</button>
   ```

4. **Build required:** CSS is NOT compiled automatically on save - use `npm run watch:css` or `npm run dev`

## Key Differences from Tailwind v3

- **No `tailwind.config.js`** - Configuration is in `css/theme.css` via `@theme`
- **`@import "tailwindcss"`** instead of `@tailwind` directives
- **`@theme` block** for custom design tokens
- **`@utility`** for custom utility classes
- **CSS variables** used everywhere instead of `theme()`

## Troubleshooting

### CSS Not Updating

1. Check if build ran: `ls -la dist/css/main.css`
2. Check intermediate output: `ls -la .build/components.css`
3. Look for SCSS syntax errors in terminal
4. Re-run build: `npm run build:css`

### Missing Styles

1. Verify component is imported in `scss/main.scss`
2. Check for CSS specificity issues
3. Ensure `.build/components.css` is being imported in `css/index.css`

### Preline Components Not Working

1. Verify Preline JS is loaded
2. Check data attributes match (`data-hs-overlay`, `data-hs-collapse`, etc.)
3. Ensure target element IDs match

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Preline UI Components](https://preline.co/docs)
- [BEM Methodology](https://getbem.com/)
- [Sass Documentation](https://sass-lang.com/documentation)
