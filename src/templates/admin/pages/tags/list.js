// src/templates/admin/pages/tags/list.js
// Tags List Page

import { mainLayout } from '../../layouts/main.js';

/**
 * Tags List Page Template
 * Display all tags with filters and pagination
 */
export function tagsListPage({ tags, total, page, totalPages, filters, user, toast }) {
  // Build toast script if toast param is present
  const toastScript = toast ? `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const toastMessages = {
          deleted: 'Tag deleted successfully!',
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
    <div class="tags">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-header__left">
            <h1 class="page-header__title">Tags</h1>
            <p class="page-header__subtitle">Manage your tags</p>
          </div>
          <div class="page-header__toast-container"></div>
        </div>

        <!-- Data Filter -->
        <div class="data-filter">
          <div class="data-filter__search">
            <i data-lucide="search" class="data-filter__search-icon"></i>
            <input
              type="text"
              class="input input--icon-left"
              placeholder="Search tags..."
              value="${filters.search || ''}"
              hx-get="/admin/tags"
              hx-target=".tags__table-content"
              hx-trigger="keyup changed delay:500ms"
              name="search"
            />
          </div>

          <div class="data-filter__controls">
            <!-- Add New -->
            <a href="/admin/tags/new" class="btn btn-icon btn--primary">
              <i data-lucide="plus"></i>
              <span>${tags.length === 0 ? 'Create First Tag' : 'New Tag'}</span>
            </a>
          </div>
        </div>

        <div class="tags__table-content">
        ${
          tags.length === 0
            ? emptyState()
            : `
          <!-- Data List (Table) -->
          <!-- Desktop: Proper HTML Table -->
          <table class="table">
              <thead class="table__thead">
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Posts</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody class="table__tbody">
                ${tags
                  .map(
                    (tag) => `
                  <tr class="table__tr">
                    <td class="table__td">
                      <span class="table__label">Name</span>
                      <div class="table__title">
                        <a href="/admin/tags/${tag.id}/edit">${escapeHtml(tag.name)}</a>
                      </div>
                    </td>

                    <td class="table__td">
                      <span class="table__label">Slug</span>
                      <div class="table__slug">${tag.slug}</div>
                    </td>
                    <td class="table__td">
                      <span class="table__label">Desc</span>
                      <div class="table__title">${escapeHtml(tag.description) || '-'}</div>
                    </td>
                    <td class="table__td">
                      <span class="table__label">Posts</span>
                      <span class="badge badge--neutral">${tag.postCount || 0}</span>
                    </td>
                    <td class="table__td">
                      <span class="table__label">Date</span>
                      ${formatDate(tag.updatedAt || tag.createdAt)}
                    </td>
                    <td class="table__td table__td--actions">
                      <div class="btn-group__actions">
                        <a href="/admin/tags/${tag.id}/edit" class="btn--action btn--action--edit">
                          <i data-lucide="pencil"></i>
                          <span class="btn--action__text">Edit</span>
                        </a>
                        <button 
                          type="button"
                          class="btn--action btn--action--delete"
                          data-tag-id="${tag.id}"
                          data-tag-name="${escapeHtml(tag.name)}"
                          data-post-count="${tag.postCount || 0}"
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

          ${totalPages > 1 ? paginationHtml({ page, totalPages, filters }) : ''}
        `
        }
        </div>
      </div>
    </div>

    <script>
      // Delete Modal Functions
      function openDeleteModal(button) {
        const tagId = button.getAttribute('data-tag-id');
        const tagName = button.getAttribute('data-tag-name');
        const postCount = parseInt(button.getAttribute('data-post-count') || '0', 10);
        const modal = document.getElementById('deleteModal');
        const form = document.getElementById('deleteTagForm');

        // Update form action and re-process for HTMX
        form.setAttribute('hx-delete', '/admin/tags/' + tagId);
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
            // Update tag name
            withPostsMsg.querySelector('.tag-name').textContent = tagName;
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
      
      // Close modal on backdrop click - using event delegation after DOM is ready
      document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('deleteModal').addEventListener('click', function(e) {
          if (e.target === this || e.target.id === 'modalBackdrop') {
            closeDeleteModal();
          }
        });
      });
      
      // Close modal on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          closeDeleteModal();
        }
      });
    </script>
  `;

  // Delete Confirmation Modal
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
          <div class="px-6" style="padding-bottom: 16px;">
            <h3 class="modal__title">Are you sure you want to delete?</h3>
            <!-- Message shown when tag has posts -->
            <p id="deleteWithPosts" class="modal__description" style="display: none; margin-bottom: 0;">
              The <strong><span class="tag-name"></span> tag</strong> has <strong><span class="post-count">0</span> post<span class="post-plural">s</span></strong>. 
              They will be affected.
            </p>
            <!-- Message shown when tag has no posts -->
            <p id="deleteNoPosts" class="modal__description" style="margin-bottom: 0;">
              This action cannot be undone. The tag will be permanently deleted.
            </p>
          </div>

          <!-- Buttons -->
          <form
            id="deleteTagForm"
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
              Delete Tag
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
    title: 'Tags',
    description: 'Manage your blog tags',
    content: content + modal + toastScript,
    user,
    activeRoute: '/admin/tags',
    breadcrumbs: [
      { label: 'Dashboard', url: '/admin/dashboard' },
      { label: 'Tags', url: '/admin/tags' },
    ],
  });
}

// Helper Functions

function emptyState() {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">
        <i data-lucide="tag" class="w-16 h-16 text-grey-400"></i>
      </div>
      <h3 class="empty-state__title">No tags yet</h3>
      <p class="empty-state__description">Create your first tag to organize your posts</p>
      <a href="/admin/tags/new" class="btn btn--primary mt-4">
        <i data-lucide="plus"></i>
        Create Tag
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
  const prevHref = page > 1 ? `/admin/tags?page=${page - 1}${queryPrefix}` : '#';
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
      links += `<a href="/admin/tags?page=${p}${queryPrefix}" class="pagination__item ${active}">${p}</a>`;
    }
  });

  // Next button
  const nextDisabled = page >= totalPages ? 'pagination__item--disabled' : '';
  const nextHref = page < totalPages ? `/admin/tags?page=${page + 1}${queryPrefix}` : '#';
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
