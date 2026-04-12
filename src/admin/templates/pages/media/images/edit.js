// Edit image page template - Exact clone of new.js with prefilled data

import { mainLayout } from '../../../layouts/main.js';

/**
 * Generate image edit page
 * @param {Object} options - Page options
 * @param {Object} options.user - Current user
 * @param {Object} options.image - Image data
 * @param {Array} options.posts - Posts for attachment dropdown
 * @returns {string} - HTML string
 */
export function imagesEditPage({ user, image, posts }) {
  const content = `
    <div class="media">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-header__left">
            <h1 class="page-header__title">Edit Image</h1>
            <p class="page-header__subtitle">${escapeHtml(image.originalName)}</p>
          </div>
          <div class="page-header__toast-container"></div>
        </div>

        <!-- Edit Form Layout -->
        <div class="media-layout items-start">
          <!-- Left: Image Preview -->
          <div class="media-layout__content flex items-start">
            <div class="upload-zone upload-zone--preview w-full">
              <img 
                class="upload-zone__preview block" 
                src="${image.path}"
                alt="${escapeHtml(image.altText || image.title || '')}"
              />
            </div>
          </div>

          <!-- Right: Form -->
          <div class="media-layout__sidebar">
            <div class="card card__panel">
              <form 
                id="editForm"
                hx-put="/admin/media/images/${image.id}"
                hx-target="#form-response"
                hx-swap="innerHTML"
              >
                <input type="hidden" name="_csrf" value="${user?.csrfToken || ''}" />
                
                <!-- File Name -->
                <div class="form__group">
                  <label class="label">File Name</label>
                  <input 
                    type="text" 
                    name="title" 
                    id="fileName" 
                    class="input"
                    value="${escapeHtml(image.title || '')}"
                    placeholder="Enter file name"
                    required 
                  />
                </div>

                <!-- Alt Text -->
                <div class="form__group">
                  <label class="label">Alt Text *</label>
                  <input 
                    type="text" 
                    name="altText" 
                    class="input"
                    value="${escapeHtml(image.altText || '')}"
                    placeholder="Describe the image for accessibility"
                    required 
                  />
                  <p class="form-feedback form-feedback--hint">Describe the image for screen readers</p>
                </div>

                <!-- Attach to Post -->
                <div class="form__group form__group--spaced">
                  <label class="label">Attach to Post (Optional)</label>
                  <select 
                    name="postId" 
                    class="hidden"
                    data-hs-select='{
                      "hasSearch": true,
                      "searchPlaceholder": "Search posts...",
                      "placeholder": "None",
                      "toggleClasses": "form__select-toggle",
                      "dropdownClasses": "form__select-dropdown",
                      "optionClasses": "form__select-option",
                      "searchClasses": "form__select-search__input"
                    }'
                  >
                    <option value="">None</option>
                    ${posts.map(post => `
                      <option value="${post.id}">${escapeHtml(post.title)}</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Form Response -->
                <div id="form-response"></div>

                <!-- Submit Button -->
                <div class="form__group mb-0 mt-6">
                  <button type="submit" class="btn btn--primary btn--full">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    class="btn btn--danger btn--outline btn--full mt-[1.6rem]"
                    onclick="openDeleteModal(event)"
                  >
                    Delete Image
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      id="deleteModal"
      class="hs-overlay hidden"
      role="dialog"
      tabindex="-1"
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
          <div class="px-6 modal__body--padded-bottom">
            <h3 class="modal__title">Are you sure you want to delete?</h3>
            <p class="modal__description">
              Are you sure you want to delete "<span id="deleteImageName">${escapeHtml(image.originalName)}</span>"?
            </p>
          </div>

          <!-- Buttons -->
          <form
            id="deleteImageForm"
            hx-delete="/admin/media/images/${image.id}"
            hx-redirect="/admin/media/images"
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

    <script>
      function openDeleteModal(event) {
        if (event) {
          event.preventDefault();
        }
        const modal = document.getElementById('deleteModal');
        const backdrop = document.getElementById('modalBackdrop');
        if (!modal) return;
        modal.classList.remove('hidden');
        if (backdrop) {
          requestAnimationFrame(() => {
            backdrop.classList.remove('opacity-0');
          });
        }
      }

      function closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        const backdrop = document.getElementById('modalBackdrop');
        if (!modal) return;
        if (backdrop) {
          backdrop.classList.add('opacity-0');
        }
        setTimeout(() => {
          modal.classList.add('hidden');
        }, 200);
      }

      document.addEventListener('DOMContentLoaded', function() {
        const modal = document.getElementById('deleteModal');
        if (!modal) return;

        modal.addEventListener('click', function(e) {
          if (e.target === modal || e.target.id === 'modalBackdrop') {
            closeDeleteModal();
          }
        });
      });

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
      { label: 'Dashboard', url: '/admin' },
      { label: 'Media', url: '/admin/media/images' },
      { label: 'Images', url: '/admin/media/images' },
      { label: image.title || 'Edit', url: `/admin/media/images/${image.id}/edit` },
    ],
  });
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
