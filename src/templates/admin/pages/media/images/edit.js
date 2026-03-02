// src/templates/admin/pages/media/images/edit.js
// Edit image page template

import { mainLayout } from '../../layouts/main.js';

/**
 * Generate image edit page
 * @param {Object} options - Page options
 * @param {Object} options.user - Current user
 * @param {Object} options.image - Image data
 * @param {Array} options.usage - Posts using this image
 * @param {Array} options.allTags - All available tags
 * @returns {string} - HTML string
 */
export function imagesEditPage({ user, image, usage, allTags }) {
  const content = `
    <div class="edit-image-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header__left">
          <h1 class="page-header__title">Edit Image</h1>
          <p class="page-header__subtitle">${escapeHtml(image.originalName)}</p>
        </div>
        <div class="page-header__actions">
          <a href="/admin/media/images" class="btn btn--outline">
            <i data-lucide="arrow-left"></i>
            Back to Images
          </a>
        </div>
      </div>

      <div class="edit-image-layout">
        <!-- Image Preview -->
        <div class="edit-image-preview">
          <div class="image-preview-card">
            <img 
              src="${image.path}" 
              alt="${escapeHtml(image.altText || image.title)}"
              class="image-preview-card__image"
            />
            <div class="image-preview-card__info">
              <div class="image-preview-card__meta">
                <span><strong>Size:</strong> ${image.sizeFormatted}</span>
                <span><strong>Dimensions:</strong> ${image.width || '?'} × ${image.height || '?'} px</span>
                <span><strong>Type:</strong> ${image.mimeType}</span>
                <span><strong>Uploaded:</strong> ${image.dateFormatted}</span>
              </div>
            </div>
          </div>

          ${usage.length > 0 ? `
            <div class="image-usage">
              <h3 class="image-usage__title">Used in Posts</h3>
              <ul class="image-usage__list">
                ${usage.map(post => `
                  <li class="image-usage__item">
                    <a href="/admin/posts/${post.id}/edit" class="image-usage__link">
                      <i data-lucide="file-text" class="size-4"></i>
                      ${escapeHtml(post.title)}
                    </a>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : `
            <div class="image-usage image-usage--empty">
              <p class="text-grey-500">This image is not used in any posts.</p>
            </div>
          `}
        </div>

        <!-- Edit Form -->
        <div class="edit-image-form">
          <form 
            class="form"
            hx-put="/admin/media/images/${image.id}"
            hx-target="#form-response"
            hx-swap="innerHTML"
          >
            <input type="hidden" name="_csrf" value="${user?.csrfToken || ''}" />

            <!-- Title -->
            <div class="form__group">
              <label for="title" class="form__label">Title</label>
              <input 
                type="text" 
                id="title"
                name="title" 
                class="form__input"
                value="${escapeHtml(image.title || '')}"
                placeholder="Image title"
              />
            </div>

            <!-- Alt Text -->
            <div class="form__group">
              <label for="altText" class="form__label">Alt Text</label>
              <input 
                type="text" 
                id="altText"
                name="altText" 
                class="form__input"
                value="${escapeHtml(image.altText || '')}"
                placeholder="Descriptive text for accessibility"
              />
              <p class="form__help">Describe the image for screen readers and SEO</p>
            </div>

            <!-- Caption -->
            <div class="form__group">
              <label for="caption" class="form__label">Caption</label>
              <input 
                type="text" 
                id="caption"
                name="caption" 
                class="form__input"
                value="${escapeHtml(image.caption || '')}"
                placeholder="Image caption"
              />
            </div>

            <!-- Description -->
            <div class="form__group">
              <label for="description" class="form__label">Description</label>
              <textarea 
                id="description"
                name="description" 
                class="form__textarea"
                rows="3"
                placeholder="Detailed description of the image"
              >${escapeHtml(image.description || '')}</textarea>
            </div>

            <!-- Tag -->
            <div class="form__group">
              <label for="tag" class="form__label">Tag</label>
              <div class="form__input-wrapper">
                <input 
                  type="text" 
                  id="tag"
                  name="tag" 
                  class="form__input"
                  value="${escapeHtml(image.tag || '')}"
                  placeholder="e.g., Nature, Travel, Business"
                  list="existingTags"
                />
                <datalist id="existingTags">
                  ${allTags.map(tag => `<option value="${escapeHtml(tag)}">`).join('')}
                </datalist>
              </div>
              <p class="form__help">Categorize this image for easier searching</p>
            </div>

            <!-- Form Response -->
            <div id="form-response"></div>

            <!-- Actions -->
            <div class="form__actions">
              <button type="submit" class="btn btn--primary">
                <i data-lucide="save"></i>
                Save Changes
              </button>
              <a href="/admin/media/images" class="btn btn--outline">Cancel</a>
            </div>
          </form>

          <!-- Delete Section -->
          <div class="form__section form__section--danger">
            <h3 class="form__section-title">Danger Zone</h3>
            <p class="form__section-text">Once you delete an image, it cannot be recovered.</p>
            <button 
              type="button" 
              class="btn btn--danger btn--outline"
              data-image-id="${image.id}"
              data-image-name="${escapeHtml(image.originalName)}"
              onclick="openDeleteModal(this)"
            >
              <i data-lucide="trash-2"></i>
              Delete Image
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    ${deleteModal(user)}

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
        const modal = document.getElementById('deleteModal');
        if (modal) {
          modal.addEventListener('click', function(e) {
            if (e.target === this || e.target.id === 'modalBackdrop') {
              closeDeleteModal();
            }
          });
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

  return mainLayout({
    title: 'Edit Image',
    description: `Editing ${image.originalName}`,
    content,
    user,
    activeRoute: '/admin/media/images',
    breadcrumbs: [
      { label: 'Dashboard', url: '/admin/dashboard' },
      { label: 'Media', url: '/admin/media/images' },
      { label: 'Images', url: '/admin/media/images' },
      { label: 'Edit', url: `/admin/media/images/${image.id}/edit` },
    ],
  });
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
            hx-target=".edit-image-layout"
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
