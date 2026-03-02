// src/templates/admin/pages/media/images/list.js
// Images list page template

import { mainLayout } from '../../../layouts/main.js';

/**
 * Generate images list page
 * @param {Object} options - Page options
 * @param {Object} options.user - Current user
 * @param {Array} options.images - Image list
 * @param {Object} options.pagination - Pagination data
 * @param {Object} options.stats - Statistics
 * @param {Object} options.filters - Active filters
 * @param {string} [options.toast] - Toast message
 * @returns {string} - HTML string
 */
export function imagesListPage({ user, images, pagination, stats, filters, toast }) {
  const content = `
    <div class="images-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header__left">
          <h1 class="page-header__title">Images</h1>
          <p class="page-header__subtitle">
            ${stats.total} images (${formatFileSize(stats.totalSize)})
          </p>
        </div>
        <div class="page-header__actions">
          <!-- Upload Form -->
          <form 
            id="uploadForm"
            hx-post="/admin/media/images"
            hx-target="#uploadResponse"
            hx-swap="innerHTML"
            enctype="multipart/form-data"
            class="upload-form"
          >
            <input 
              type="file" 
              name="image" 
              id="imageInput"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style="display: none;"
              onchange="this.form.requestSubmit()"
            />
            <button 
              type="button" 
              class="btn btn--primary btn--icon"
              onclick="document.getElementById('imageInput').click()"
            >
              <i data-lucide="upload"></i>
              Upload
            </button>
          </form>
        </div>
      </div>

      <!-- Upload Response Container -->
      <div id="uploadResponse"></div>

      <!-- Filters -->
      <div class="data-filter">
        <form 
          class="data-filter__form"
          hx-get="/admin/media/images"
          hx-target=".images-grid-container"
          hx-swap="innerHTML"
          hx-trigger="submit, change from:select"
        >
          <div class="data-filter__search">
            <i data-lucide="search" class="data-filter__search-icon"></i>
            <input 
              type="text" 
              name="search" 
              class="data-filter__input"
              placeholder="Search images..."
              value="${filters.search || ''}"
            />
          </div>
          
          ${stats.tags.length > 0 ? `
            <div class="data-filter__select">
              <select name="tag" class="data-filter__input">
                <option value="">All Tags</option>
                ${stats.tags.map(tag => `
                  <option value="${tag}" ${filters.tag === tag ? 'selected' : ''}>${tag}</option>
                `).join('')}
              </select>
            </div>
          ` : ''}
          
          <button type="submit" class="btn btn--secondary">
            <i data-lucide="filter"></i>
            Filter
          </button>
        </form>
      </div>

      <!-- Images Grid -->
      <div class="images-grid-container">
        ${imagesGrid({ images, pagination })}
      </div>
    </div>

    <!-- Delete Modal -->
    ${deleteModal(user)}

    <!-- Toast Script -->
    ${toast ? `
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          if (typeof showToast === 'function') {
            showToast(${JSON.stringify(toast)}, 'success');
          }
        });
      </script>
    ` : ''}

    <script>
      // Delete Modal Functions
      function openDeleteModal(button) {
        const imageId = button.getAttribute('data-image-id');
        const imageName = button.getAttribute('data-image-name');
        const modal = document.getElementById('deleteModal');
        const form = document.getElementById('deleteImageForm');
        const nameElement = document.getElementById('deleteImageName');

        // Update form action
        form.setAttribute('hx-delete', '/admin/media/images/' + imageId);
        if (typeof htmx !== 'undefined') {
          htmx.process(form);
        }

        // Update name display
        if (nameElement) {
          nameElement.textContent = imageName;
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

      // Listen for refresh trigger after upload
      document.body.addEventListener('refreshImages', function() {
        if (typeof htmx !== 'undefined') {
          htmx.ajax('GET', '/admin/media/images', { target: '.images-grid-container', swap: 'innerHTML' });
        }
      });
    </script>
  `;

  return mainLayout({
    title: 'Images',
    description: 'Manage your image library',
    content,
    user,
    activeRoute: '/admin/media/images',
    breadcrumbs: [
      { label: 'Dashboard', url: '/admin/dashboard' },
      { label: 'Media', url: '/admin/media/images' },
      { label: 'Images', url: '/admin/media/images' },
    ],
  });
}

/**
 * Generate images grid
 * @param {Object} options - Options
 * @param {Array} options.images - Image list
 * @param {Object} options.pagination - Pagination data
 * @returns {string} - HTML string
 */
function imagesGrid({ images, pagination }) {
  if (!images || images.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">
          <i data-lucide="image" class="w-16 h-16 text-grey-400"></i>
        </div>
        <h3 class="empty-state__title">No images yet</h3>
        <p class="empty-state__description">Upload your first image to get started</p>
      </div>
    `;
  }

  const cards = images.map((image) => {
    const extension = image.filename.split('.').pop().toUpperCase();
    
    return `
      <div class="media-card group">
        ${image.tag ? `<span class="media-card__tag">${escapeHtml(image.tag)}</span>` : ''}
        <div class="media-card__thumbnail">
          <img
            src="${image.thumbnailPath || image.path}"
            alt="${escapeHtml(image.altText || image.title)}"
            loading="lazy"
          />
          <div class="media-card__actions">
            <a href="/admin/media/images/${image.id}/edit" class="media-card__action-btn" title="Edit">
              <i data-lucide="pencil" class="size-4"></i>
            </a>
            <button 
              type="button"
              class="media-card__action-btn media-card__action-btn--delete" 
              title="Delete"
              data-image-id="${image.id}"
              data-image-name="${escapeHtml(image.originalName)}"
              onclick="openDeleteModal(this)"
            >
              <i data-lucide="trash-2" class="size-4"></i>
            </button>
          </div>
        </div>
        <div class="media-card__details">
          <h3 class="media-card__title">${escapeHtml(image.originalName)}</h3>
          <span class="media-card__meta">${image.sizeFormatted} • ${extension}</span>
        </div>
      </div>
    `;
  }).join('');

  // Build pagination
  let paginationHtml = '';
  if (pagination.totalPages > 1) {
    const prevLink = pagination.hasPrevPage 
      ? `<a href="?page=${pagination.page - 1}${pagination.tag ? '&tag=' + pagination.tag : ''}${pagination.search ? '&search=' + pagination.search : ''}" class="pagination__item"><i data-lucide="chevron-left"></i></a>`
      : `<span class="pagination__item pagination__item--disabled"><i data-lucide="chevron-left"></i></span>`;
    
    const nextLink = pagination.hasNextPage
      ? `<a href="?page=${pagination.page + 1}${pagination.tag ? '&tag=' + pagination.tag : ''}${pagination.search ? '&search=' + pagination.search : ''}" class="pagination__item"><i data-lucide="chevron-right"></i></a>`
      : `<span class="pagination__item pagination__item--disabled"><i data-lucide="chevron-right"></i></span>`;

    paginationHtml = `
      <div class="pagination">
        ${prevLink}
        <span class="pagination__info">Page ${pagination.page} of ${pagination.totalPages}</span>
        ${nextLink}
      </div>
    `;
  }

  return `
    <div class="media-grid">
      ${cards}
    </div>
    ${paginationHtml}
  `;
}

/**
 * Generate delete confirmation modal
 * @param {Object} user - Current user
 * @returns {string} - HTML string
 */
function deleteModal(user) {
  return `
    <!-- Delete Confirmation Modal -->
    <div
      id="deleteModal"
      class="hs-overlay hidden"
      role="dialog"
      tabindex="-1"
      style="display: none;"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50 transition-opacity opacity-0" id="modalBackdrop"></div>

      <!-- Modal Container -->
      <div class="fixed inset-0 z-50 flex min-h-full items-center justify-center p-4">
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
            <p class="modal__description">
              Are you sure you want to delete "<span id="deleteImageName"></span>"?
            </p>
          </div>

          <!-- Buttons -->
          <form
            id="deleteImageForm"
            hx-delete=""
            hx-target=".images-grid-container"
            hx-swap="innerHTML"
            class="px-6 pb-6 flex flex-col gap-3"
          >
            <input type="hidden" name="_csrf" value="${user?.csrfToken || ''}" />
            <button type="submit" class="btn btn--danger btn--full">
              Delete Image
            </button>
            <button type="button" class="btn btn--outline btn--full" onclick="closeDeleteModal()">
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
