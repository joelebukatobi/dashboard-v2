// src/templates/admin/pages/categories/edit.js
// Edit Category Page - Exact structure from edit-category.html

import { mainLayout } from '../../layouts/main.js';

/**
 * Edit Category Page Template
 * Edit existing category
 * Structure matches edit-category.html exactly
 */
export function categoryEditPage({ category, user, errors = {} }) {
  const content = `
    <div class="content">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header__left">
          <h1 class="page-header__title">Edit Category</h1>
          <p class="page-header__subtitle">Update category details</p>
        </div>
        <div class="page-header__toast-container"></div>
      </div>

      <!-- Edit Category Form -->
      <div class="card">
        <div class="card__header">
          <h2 class="card__title">Category Details</h2>
        </div>
        <div class="card__body">
          <form
            class="form"
            id="editCategoryForm"
            hx-put="/admin/categories/${category.id}"
            hx-target="#form-response"
            hx-swap="innerHTML"
          >
            <div id="form-response"></div>

            <!-- Title & Slug Row -->
            <div class="form__row form__row--2col">
              <!-- Title -->
              <div class="form__group">
                <label class="form__label form__label--required">Title</label>
                <input
                  type="text"
                  class="form__input ${errors.title ? 'form__input--error' : ''}"
                  id="categoryTitle"
                  name="title"
                  value="${escapeHtml(category.title)}"
                  required
                />
                ${errors.title ? `<p class="form__error">${errors.title}</p>` : ''}
              </div>
              <!-- Slug -->
              <div class="form__group">
                <label class="form__label">Slug</label>
                <input
                  type="text"
                  class="form__input form__input--readonly ${errors.slug ? 'form__input--error' : ''}"
                  id="categorySlug"
                  name="slug"
                  value="${category.slug}"
                  readonly
                />
                <p class="form__hint">Auto-generated from title. Contact admin to change.</p>
                ${errors.slug ? `<p class="form__error">${errors.slug}</p>` : ''}
              </div>
            </div>

            <!-- Description -->
            <div class="form__group">
              <label class="form__label">Description</label>
              <textarea
                class="form__input"
                id="categoryDescription"
                name="description"
                rows="4"
              >${escapeHtml(category.description || '')}</textarea>
            </div>

            <input type="hidden" name="_csrf" value="${user?.csrfToken || ''}" />
          </form>
        </div>
        <div class="card__footer">
          <div class="form__field-group">
            <button type="button" class="btn btn--primary" onclick="submitForm()">
              <i data-lucide="check"></i>
              Update Category
            </button>
            <a href="/admin/categories" class="btn btn--ghost btn--cancel">Cancel</a>
          </div>
        </div>
      </div>
    </div>

    <script>
      // Submit form using HTMX trigger
      function submitForm() {
        htmx.trigger('#editCategoryForm', 'submit');
      }
    </script>
  `;

  return mainLayout({
    title: 'Edit Category',
    description: 'Edit category',
    content,
    user,
    activeRoute: '/admin/categories',
    breadcrumbs: [
      { label: 'Dashboard', url: '/admin/dashboard' },
      { label: 'Categories', url: '/admin/categories' },
      { label: escapeHtml(category.title), url: `/admin/categories/${category.id}/edit` }
    ]
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
