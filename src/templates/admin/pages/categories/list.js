// src/templates/admin/pages/categories/list.js
// Categories List Page - Exact structure from categories.html

import { mainLayout } from '../../layouts/main.js';

/**
 * Categories List Page Template
 * Display all categories with filters and pagination
 * Structure matches categories.html exactly
 */
export function categoriesListPage({ categories, total, page, totalPages, filters, user }) {
  const content = `
    <div class="categories">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-header__left">
            <h1 class="page-header__title">Categories</h1>
            <p class="page-header__subtitle">Manage your categories</p>
          </div>
          <div class="page-header__toast-container"></div>
        </div>

        <!-- Data Filter -->
        <div class="data-filter">
          <div class="data-filter__search">
            <i data-lucide="search" class="data-filter__search-icon"></i>
            <input
              type="text"
              class="form-field__input form-field__input--icon-left"
              placeholder="Search categories..."
              value="${filters.search || ''}"
              hx-get="/admin/categories"
              hx-target=".table"
              hx-trigger="keyup changed delay:500ms"
              name="search"
            />
          </div>

          <div class="data-filter__controls">
            <!-- Add New -->
            <a href="/admin/categories/new" class="btn btn-icon btn--primary">
              <i data-lucide="plus"></i>
              <span>${categories.length === 0 ? 'Create First Category' : 'New Category'}</span>
            </a>
          </div>
        </div>

        ${
          categories.length === 0
            ? emptyState()
            : `
          <!-- Data List (Table) -->
          <div class="table-container">
            <div class="table">
              <!-- Desktop: Proper HTML Table -->
              <table class="table__table">
                <thead class="table__thead">
                  <tr>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody class="table__tbody">
                  ${categories
                    .map(
                      (category) => `
                    <tr class="table__tr">
                      <td class="table__td">
                        <span class="table__label">Title</span>
                        <div class="table__title">
                          <a href="/admin/categories/${category.id}/edit">${escapeHtml(category.title)}</a>
                        </div>
                      </td>

                      <td class="table__td">
                        <span class="table__label">Slug</span>
                        <div class="table__slug">${category.slug}</div>
                      </td>
                      <td class="table__td">
                        <span class="table__label">Description</span>
                        <div class="table__title">${escapeHtml(category.description) || '-'}</div>
                      </td>
                      <td class="table__td">
                        <span class="table__label">Status</span>
                        ${getStatusBadge(category.status)}
                      </td>
                      <td class="table__td">
                        <span class="table__label">Date</span>
                        ${formatDate(category.updatedAt || category.createdAt)}
                      </td>
                      <td class="table__td table__td--actions">
                        <div class="btn-group__actions">
                          <a href="/admin/categories/${category.id}/edit" class="btn--action btn--action--edit">
                            <i data-lucide="pencil"></i>
                            <span class="btn--action__text">Edit</span>
                          </a>
                          <button 
                            type="button"
                            class="btn--action btn--action--delete"
                            data-category-id="${category.id}"
                            data-category-title="${escapeHtml(category.title)}"
                            onclick="openDeleteModal(this)"
                          >
                            <i data-lucide="trash-2"></i>
                            <span class="btn--action__text">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `,
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${totalPages > 1 ? paginationHtml({ page, totalPages, filters }) : ''}
        `
        }
      </div>
    </div>

    <script>
      // Delete Modal Functions
      function openDeleteModal(button) {
        const categoryId = button.getAttribute('data-category-id');
        const categoryTitle = button.getAttribute('data-category-title');
        const modal = document.getElementById('deleteModal');
        const form = document.getElementById('deleteCategoryForm');
        const titleElement = document.getElementById('deleteCategoryTitle');
        
        // Update form action and re-process for HTMX
        form.setAttribute('hx-delete', '/admin/categories/' + categoryId);
        if (typeof htmx !== 'undefined') {
          htmx.process(form);
        }
        
        // Update title display
        if (titleElement) {
          titleElement.textContent = categoryTitle;
        }
        
        // Show modal
        modal.style.display = 'block';
        document.getElementById('modalBackdrop').style.opacity = '1';
      }
      
      function closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        modal.style.display = 'none';
        document.getElementById('modalBackdrop').style.opacity = '0';
      }
      
      // Close modal on backdrop click
      document.getElementById('deleteModal').addEventListener('click', function(e) {
        if (e.target === this || e.target.id === 'modalBackdrop') {
          closeDeleteModal();
        }
      });
      
      // Close modal on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          closeDeleteModal();
        }
      });
    </script>
  `;

  // Delete Confirmation Modal - Outside .categories wrapper for proper z-index stacking
  const modal = `
    <!-- Delete Confirmation Modal -->
    <div
      id="deleteModal"
      class="hs-overlay hidden"
      role="dialog"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      style="display: none;"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 transition-opacity opacity-0" id="modalBackdrop"></div>

      <!-- Modal Container -->
      <div
        class="fixed inset-0 z-50 flex min-h-full items-center justify-center p-4"
      >
        <div class="modal__content modal__content--confirm">
          <!-- Icon -->
          <div class="pt-8 pb-4">
            <div class="modal__icon modal__icon--danger mx-auto">
              <i data-lucide="alert-triangle" class="size-6"></i>
            </div>
          </div>

          <!-- Body -->
          <div class="px-6 pb-6">
            <h3 id="deleteModalLabel" class="modal__title">Are you sure?</h3>
            <p class="modal__description">This action cannot be undone. The category will be permanently deleted.</p>
          </div>

          <!-- Buttons (stacked, full-width) -->
          <form 
            id="deleteCategoryForm"
            hx-delete=""
            hx-target=".table-container"
            hx-swap="innerHTML"
            class="px-6 pb-6 flex flex-col gap-3"
          >
            <input type="hidden" name="_csrf" value="${user?.csrfToken || ''}" />
            <button 
              type="submit" 
              class="btn btn--danger btn--full"
            >
              Delete Category
            </button>
            <button 
              type="button" 
              class="btn btn--outline btn--full"
              onclick="closeDeleteModal()"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  return mainLayout({
    title: 'Categories',
    description: 'Manage your blog categories',
    content: content + modal,
    user,
    activeRoute: '/admin/categories',
    breadcrumbs: [
      { label: 'Dashboard', url: '/admin/dashboard' },
      { label: 'Categories', url: '/admin/categories' },
    ],
  });
}

// Helper Functions

function emptyState() {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">
        <i data-lucide="folder-tree" class="w-16 h-16 text-grey-400"></i>
      </div>
      <h3 class="empty-state__title">No categories yet</h3>
      <p class="empty-state__description">Create your first category to organize your posts</p>
      <a href="/admin/categories/new" class="btn btn--primary mt-4">
        <i data-lucide="plus"></i>
        Create Category
      </a>
    </div>
  `;
}

function getStatusBadge(status) {
  const statusConfig = {
    PUBLISHED: { class: 'status--success', label: 'Published' },
    DRAFT: { class: 'status--warning', label: 'Draft' },
    ARCHIVED: { class: 'status--neutral', label: 'Archived' },
  };

  const config = statusConfig[status] || statusConfig['DRAFT'];

  return `
    <span class="status ${config.class}">
      <span class="status__dot"></span>
      ${config.label}
    </span>
  `;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function paginationHtml({ page, totalPages, filters }) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);

  const baseQuery = params.toString();
  const queryPrefix = baseQuery ? `&${baseQuery}` : '';

  return `
    <!-- Sticky Footer Pagination -->
    <footer class="page-footer">
      <div class="pagination">
        ${generatePaginationLinks(page, totalPages, queryPrefix)}
      </div>
    </footer>
  `;
}

function generatePaginationLinks(page, totalPages, queryPrefix) {
  let links = '';

  // Previous button
  const prevDisabled = page <= 1 ? 'pagination__item--disabled' : '';
  const prevHref = page > 1 ? `/admin/categories?page=${page - 1}${queryPrefix}` : '#';
  links += `<a href="${prevHref}" class="pagination__item ${prevDisabled}"><i data-lucide="chevron-left"></i></a>`;

  // Page numbers
  let pageNumbers = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else if (page <= 3) {
    pageNumbers = [1, 2, 3, 4, '...', totalPages];
  } else if (page >= totalPages - 2) {
    pageNumbers = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    pageNumbers = [1, '...', page - 1, page, page + 1, '...', totalPages];
  }

  pageNumbers.forEach((p) => {
    if (p === '...') {
      links += '<span class="pagination__ellipsis">...</span>';
    } else {
      const active = p === page ? 'pagination__item--active' : '';
      links += `<a href="/admin/categories?page=${p}${queryPrefix}" class="pagination__item ${active}">${p}</a>`;
    }
  });

  // Next button
  const nextDisabled = page >= totalPages ? 'pagination__item--disabled' : '';
  const nextHref = page < totalPages ? `/admin/categories?page=${page + 1}${queryPrefix}` : '#';
  links += `<a href="${nextHref}" class="pagination__item ${nextDisabled}"><i data-lucide="chevron-right"></i></a>`;

  return links;
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
