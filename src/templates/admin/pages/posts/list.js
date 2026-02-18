// src/templates/admin/pages/posts/list.js
// Posts List Page - Exact structure from posts.html

import { mainLayout } from '../../layouts/main.js';

/**
 * Posts List Page Template
 * Display all posts with filters and pagination
 * Structure matches posts.html exactly
 */
export function postsListPage({ posts, total, page, totalPages, categories, filters, user }) {
  const content = `
    <div class="posts">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-header__left">
            <h1 class="page-header__title">Blog Posts</h1>
            <p class="page-header__subtitle">Manage your blog posts</p>
          </div>
        </div>

        <!-- Data Filter -->
        <div class="data-filter">
          <div class="data-filter__search">
            <i data-lucide="search" class="data-filter__search-icon"></i>
            <input
              type="text"
              class="form-field__input form-field__input--icon-left"
              placeholder="Search posts..."
              value="${filters.search || ''}"
              hx-get="/admin/posts"
              hx-target=".table"
              hx-trigger="keyup changed delay:500ms"
              name="search"
            />
          </div>

          <div class="data-filter__controls">
            <!-- Status Filter -->
            <div class="hs-dropdown data-filter__dropdown">
              <button
                id="hs-dropdown-status"
                type="button"
                class="hs-dropdown-toggle data-filter__dropdown-trigger"
              >
                <span>${filters.status || 'Status'}</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="hs-dropdown-menu dropdown__menu dropdown__menu--sm" aria-labelledby="hs-dropdown-status">
                <a href="/admin/posts" class="dropdown__item ${!filters.status ? 'dropdown__item--active' : ''}">All Statuses</a>
                <a href="/admin/posts?status=PUBLISHED" class="dropdown__item ${filters.status === 'PUBLISHED' ? 'dropdown__item--active' : ''}">Published</a>
                <a href="/admin/posts?status=DRAFT" class="dropdown__item ${filters.status === 'DRAFT' ? 'dropdown__item--active' : ''}">Draft</a>
                <a href="/admin/posts?status=SCHEDULED" class="dropdown__item ${filters.status === 'SCHEDULED' ? 'dropdown__item--active' : ''}">Scheduled</a>
                <a href="/admin/posts?status=ARCHIVED" class="dropdown__item ${filters.status === 'ARCHIVED' ? 'dropdown__item--active' : ''}">Archived</a>
              </div>
            </div>

            <!-- Category Filter -->
            <div class="hs-dropdown data-filter__dropdown">
              <button
                id="hs-dropdown-category"
                type="button"
                class="hs-dropdown-toggle data-filter__dropdown-trigger"
              >
                <span>${filters.categoryId ? categories.find((c) => c.id === filters.categoryId)?.title : 'Category'}</span>
                <i data-lucide="chevron-down"></i>
              </button>
              <div class="hs-dropdown-menu dropdown__menu dropdown__menu--sm" aria-labelledby="hs-dropdown-category">
                <a href="/admin/posts" class="dropdown__item ${!filters.categoryId ? 'dropdown__item--active' : ''}">All Categories</a>
                ${categories
                  .map(
                    (cat) => `
                  <a href="/admin/posts?category=${cat.id}" class="dropdown__item ${filters.categoryId === cat.id ? 'dropdown__item--active' : ''}">${cat.title}</a>
                `,
                  )
                  .join('')}
              </div>
            </div>

            <!-- Sort -->
            <button class="btn btn-icon btn--primary">
              <i data-lucide="arrow-up-down"></i>
              <span>Sort</span>
            </button>

            <!-- Add New -->
            <a href="/admin/posts/new" class="btn btn-icon btn--primary">
              <i data-lucide="plus"></i>
              <span>${posts.length === 0 ? 'Create First Post' : 'New Post'}</span>
            </a>
          </div>
        </div>

        ${
          posts.length === 0
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
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody class="table__tbody">
                ${posts
                  .map(
                    (post) => `
                  <tr class="table__tr">
                    <td class="table__td">
                      <span class="table__label">Title</span>
                      <div class="table__title">
                        <a href="/admin/posts/${post.id}/edit">${escapeHtml(post.title)}</a>
                      </div>
                    </td>
                    <td class="table__td">
                      <span class="table__label">Category</span>
                      <span class="badge ${post.category?.colorClass || 'badge--primary'}">${post.category?.title || 'Uncategorized'}</span>
                    </td>
                    <td class="table__td">
                      <span class="table__label">Status</span>
                      ${getStatusBadge(post.status)}
                    </td>
                    <td class="table__td">
                      <span class="table__label">Date</span>
                      ${formatDate(post.publishedAt || post.createdAt)}
                    </td>
                    <td class="table__td table__td--actions">
                      <div class="btn-group__actions">
                        <a href="/admin/posts/${post.id}/edit" class="btn--action btn--action--edit">
                          <i data-lucide="pencil"></i>
                          <span class="btn--action__text">Edit</span>
                        </a>
                        <button 
                          type="button"
                          class="btn--action btn--action--delete"
                          data-post-id="${post.id}"
                          data-post-title="${escapeHtml(post.title)}"
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
        const postId = button.getAttribute('data-post-id');
        const postTitle = button.getAttribute('data-post-title');
        const modal = document.getElementById('deleteModal');
        const form = document.getElementById('deletePostForm');
        const titleElement = document.getElementById('deletePostTitle');
        
        // Update form action
        form.setAttribute('hx-delete', '/admin/posts/' + postId);
        
        // Update title display
        if (titleElement) {
          titleElement.textContent = postTitle;
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

  // Delete Modal - Outside .posts wrapper for proper z-index stacking
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
            <p class="modal__description">This action cannot be undone. The post will be permanently deleted.</p>
          </div>

          <!-- Buttons (stacked, full-width) -->
          <form 
            id="deletePostForm"
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
              Delete Post
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
    title: 'Blog Posts',
    description: 'Manage your blog posts',
    content: content + modal,
    user,
    activeRoute: '/admin/posts',
    breadcrumbs: [
      { label: 'Dashboard', url: '/admin/dashboard' },
      { label: 'Blog Posts', url: '/admin/posts' },
    ],
  });
}

// Helper Functions

function emptyState() {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">
        <i data-lucide="file-text" class="w-16 h-16 text-grey-400"></i>
      </div>
      <h3 class="empty-state__title">No posts yet</h3>
    </div>
  `;
}

function getStatusBadge(status) {
  const statusConfig = {
    PUBLISHED: { class: 'status--success', label: 'Published' },
    DRAFT: { class: 'status--warning', label: 'Draft' },
    SCHEDULED: { class: 'status--info', label: 'Scheduled' },
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
  if (filters.categoryId) params.set('category', filters.categoryId);
  if (filters.search) params.set('search', filters.search);

  const baseQuery = params.toString();
  const queryPrefix = baseQuery ? `&${baseQuery}` : '';

  // Generate page numbers
  let pageNumbers = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (page <= 3) {
      pageNumbers = [1, 2, 3, 4, '...', totalPages];
    } else if (page >= totalPages - 2) {
      pageNumbers = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      pageNumbers = [1, '...', page - 1, page, page + 1, '...', totalPages];
    }
  }

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
  const prevHref = page > 1 ? `/admin/posts?page=${page - 1}${queryPrefix}` : '#';
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
      links += `<a href="/admin/posts?page=${p}${queryPrefix}" class="pagination__item ${active}">${p}</a>`;
    }
  });

  // Next button
  const nextDisabled = page >= totalPages ? 'pagination__item--disabled' : '';
  const nextHref = page < totalPages ? `/admin/posts?page=${page + 1}${queryPrefix}` : '#';
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
