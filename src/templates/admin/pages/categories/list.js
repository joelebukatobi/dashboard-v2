// src/templates/admin/pages/categories/list.js
// Categories List Page - Exact structure from categories.html

import { mainLayout } from '../../layouts/main.js';

const listToolbarClass = 'mb-[1.6rem] flex shrink-0 flex-row items-center gap-[1.6rem]';
const listToolbarSearchClass = 'relative min-w-0 flex-1';
const listToolbarSearchIconClass = 'pointer-events-none absolute left-[1rem] top-1/2 h-[1.6rem] w-[1.6rem] -translate-y-1/2 text-grey-400 dark:text-grey-500';
const listToolbarInputClass = 'h-[3.2rem] w-full rounded-md border border-grey-100/50 bg-white px-[1.2rem] pl-[4.4rem] text-body-sm text-grey-900 outline-none transition-all duration-200 placeholder:text-body-sm placeholder:text-grey-400 hover:border-grey-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-grey-700 dark:bg-grey-900 dark:text-white dark:placeholder:text-grey-500 dark:hover:border-grey-600';
const listToolbarControlsClass = 'flex shrink-0 items-center gap-[1.2rem]';
const listToolbarButtonClass = 'inline-flex h-[3.2rem] items-center justify-center gap-[0.8rem] rounded-md bg-blue-600 px-[1.2rem] text-body-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:text-white focus:ring-[.08rem] focus:ring-blue-500 focus:ring-offset-2 dark:bg-white dark:text-grey-900 dark:hover:bg-grey-100';
const rowActionGroupClass = 'flex items-center justify-end gap-[1.6rem] lg:gap-[0.64rem]';
const rowActionBaseClass = 'flex cursor-pointer items-center justify-center gap-[0.8rem] rounded-md p-[0.4rem] text-body-sm font-medium text-grey-500 transition-all duration-200 lg:bg-blue-600/5 lg:text-body-xs dark:text-grey-400 dark:lg:bg-grey-50/10';
const rowActionIconClass = 'h-[1.4rem] w-[1.4rem] lg:h-[1.2rem] lg:w-[1.2rem]';
const rowActionTextClass = 'lg:hidden';
const rowActionEditClass = `${rowActionBaseClass} hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20 dark:hover:text-amber-400`;
const rowActionDeleteClass = `${rowActionBaseClass} hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400`;

/**
 * Categories List Page Template
 * Display all categories with filters and pagination
 * Structure matches categories.html exactly
 */
export function categoriesListPage({ categories, total, page, totalPages, filters, user, toast }) {
  // Build toast script if toast param is present
  const toastScript = toast ? `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const toastMessages = {
          deleted: 'Category deleted successfully!',
        };
        const message = toastMessages['${toast}'] || '${toast}';
        document.body.dispatchEvent(new CustomEvent('htmx:toast', {
          detail: { message: message, type: 'success' }
        }));
        // Clean up URL (remove toast param)
        const url = new URL(window.location);
        url.searchParams.delete('toast');
        window.history.replaceState({}, '', url);
      });
    </script>
  ` : '';

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
        <div class="${listToolbarClass}">
          <div class="${listToolbarSearchClass}">
            <i data-lucide="search" class="${listToolbarSearchIconClass}"></i>
            <input
              type="text"
              class="${listToolbarInputClass}"
              placeholder="Search categories..."
              value="${filters.search || ''}"
              hx-get="/admin/categories"
              hx-target=".categories__table-content"
              hx-trigger="keyup changed delay:500ms"
              name="search"
            />
          </div>

          <div class="${listToolbarControlsClass}">
            <!-- Add New -->
            <a href="/admin/categories/new" class="${listToolbarButtonClass}">
              <span>${categories.length === 0 ? 'Create First Category' : 'New Category'}</span>
            </a>
          </div>
        </div>

        <div class="categories__table-content">
        ${
          categories.length === 0
            ? emptyState()
            : `
          <!-- Data List (Table) -->
          <table class="table">
              <thead class="table__thead">
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Description</th>
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
                      <span class="table__label">Desc</span>
                      <div class="table__title">${escapeHtml(category.description) || '-'}</div>
                    </td>
                    <td class="table__td">
                      <span class="table__label">Date</span>
                      ${formatDate(category.updatedAt || category.createdAt)}
                    </td>
                    <td class="table__td table__td--actions">
                      <div class="${rowActionGroupClass}">
                        <a href="/admin/categories/${category.id}/edit" class="${rowActionEditClass}">
                          <i data-lucide="pencil" class="${rowActionIconClass}"></i>
                          <span class="${rowActionTextClass}">Edit</span>
                        </a>
                        <button
                          type="button"
                          class="${rowActionDeleteClass}"
                          data-category-id="${category.id}"
                          data-category-title="${escapeHtml(category.title)}"
                          data-post-count="${category.postCount || 0}"
                          onclick="openDeleteModal(this)"
                        >
                          <i data-lucide="trash-2" class="${rowActionIconClass}"></i>
                          <span class="${rowActionTextClass}">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                `,
                  )
                  .join('')}
              </tbody>
          </table>

          ${totalPages > 1 ? paginationHtml({ page, totalPages, filters }) : ''}
        `
        }
        </div>
      </div>
    </div>

    <script>
      // Delete Modal Functions
      function openDeleteModal(button) {
        const categoryId = button.getAttribute('data-category-id');
        const categoryTitle = button.getAttribute('data-category-title');
        const postCount = parseInt(button.getAttribute('data-post-count') || '0', 10);
        const modal = document.getElementById('deleteModal');
        const form = document.getElementById('deleteCategoryForm');

        // Update form action and re-process for HTMX
        form.setAttribute('hx-delete', '/admin/categories/' + categoryId);
        if (typeof htmx !== 'undefined') {
          htmx.process(form);
        }

        // Show appropriate message based on post count
        const withPostsMsg = document.getElementById('deleteWithPosts');
        const noPostsMsg = document.getElementById('deleteNoPosts');
        
        if (withPostsMsg && noPostsMsg) {
          if (postCount > 0) {
            // Show "with posts" message, hide "no posts" message
            withPostsMsg.style.display = 'block';
            noPostsMsg.style.display = 'none';
            // Update category name
            withPostsMsg.querySelector('.category-name').textContent = categoryTitle;
            // Update post count
            withPostsMsg.querySelector('.post-count').textContent = postCount;
            // Handle pluralization
            withPostsMsg.querySelector('.post-plural').textContent = postCount === 1 ? '' : 's';
          } else {
            // Show "no posts" message, hide "with posts" message
            withPostsMsg.style.display = 'none';
            noPostsMsg.style.display = 'block';
          }
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
      
      // Close modal after HTMX swap (successful delete)
      document.body.addEventListener('htmx:afterSwap', function(evt) {
        if (evt.detail.target.classList.contains('table')) {
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
      aria-labelledby="deleteCategoryTitle"
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
          <div class="px-6" style="padding-bottom: 16px;">
            <h3 class="modal__title">Are you sure you want to delete?</h3>
            <!-- Message shown when category has posts -->
            <p id="deleteWithPosts" class="modal__description" style="display: none; margin-bottom: 0;">
              The <strong><span class="category-name"></span> category</strong> has <strong><span class="post-count">0</span> post<span class="post-plural">s</span></strong>. 
              They will be moved to <strong>Uncategorized</strong>.
            </p>
            <!-- Message shown when category has no posts -->
            <p id="deleteNoPosts" class="modal__description" style="margin-bottom: 0;">
              This action cannot be undone. The category will be permanently deleted.
            </p>
          </div>

          <!-- Buttons (stacked, full-width) -->
          <form 
            id="deleteCategoryForm"
            hx-delete=""
            hx-target=".table"
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
    content: content + modal + toastScript,
    user,
    activeRoute: '/admin/categories',
    breadcrumbs: [
      { label: 'Dashboard', url: '/admin' },
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
        Create Category
      </a>
    </div>
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
