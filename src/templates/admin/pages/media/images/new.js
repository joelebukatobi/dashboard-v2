// New image page template - Structure from edit-image.html adapted

import { mainLayout } from '../../../layouts/main.js';

/**
 * Generate new image page
 * @param {Object} options - Page options
 * @param {Object} options.user - Current user
 * @param {Array} options.posts - Posts for attachment dropdown
 * @returns {string} - HTML string
 */
export function imagesNewPage({ user, posts }) {
  const content = `
    <div class="media">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-header__left">
            <h1 class="page-header__title">New Image</h1>
            <p class="page-header__subtitle">Upload and configure your image</p>
          </div>
          <div class="page-header__toast-container"></div>
        </div>

        <!-- Upload Form Layout -->
        <div class="media-layout items-start">
          <!-- Left: Upload Zone -->
          <div class="media-layout__content flex items-start">
            <div class="upload-zone w-full cursor-pointer" id="dropZone" onclick="document.getElementById('imageInput').click()">
              <input 
                type="file" 
                name="image" 
                id="imageInput" 
                form="uploadForm"
                accept="image/jpeg,image/png,image/webp,image/gif" 
                required
                class="hidden"
                onchange="handleFileSelect(this)"
              />
              <div class="upload-placeholder" id="uploadPlaceholder">
                <p style="color: var(--color-grey-600); margin-bottom: 0.5rem; font-size: 1rem;">Drag & Drop or Click to Upload</p>
                <p style="color: var(--color-grey-400); font-size: 0.875rem;">JPEG, PNG, WebP, GIF up to 10MB</p>
              </div>
              <img id="imagePreview" class="upload-zone__preview hidden" />
            </div>
          </div>

          <!-- Right: Form -->
          <div class="media-layout__sidebar">
            <div class="card card__panel">
              <form 
                id="uploadForm"
                hx-post="/admin/media/images" 
                enctype="multipart/form-data"
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
                    placeholder="Describe the image for accessibility"
                    required 
                  />
                  <p class="form-feedback form-feedback--hint">Describe the image for screen readers</p>
                </div>

                <!-- Attach to Post -->
                <div class="form__group" style="margin-top: 1.6rem;">
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
                  <p class="form-feedback form-feedback--hint">Sets this as the post's featured image</p>
                </div>

                <!-- Form Response -->
                <div id="form-response"></div>

                <!-- Submit Button -->
                <div class="form__group mb-0 mt-6">
                  <button type="submit" class="btn btn--primary btn--full">
                    Upload Image
                  </button>
                  <a href="/admin/media/images" class="btn btn--outline btn--full btn--cancel mt-[1.6rem]">Cancel</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      // Handle file selection
      function handleFileSelect(input) {
        const file = input.files[0];
        if (!file) return;

        // Update filename input
        document.getElementById('fileName').value = file.name;

        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
          const preview = document.getElementById('imagePreview');
          const placeholder = document.getElementById('uploadPlaceholder');
          preview.src = e.target.result;
          preview.classList.remove('hidden');
          placeholder.classList.add('hidden');
        };
        reader.readAsDataURL(file);
      }

      // Drag and drop
      const dropZone = document.getElementById('dropZone');
      
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('upload-zone--dragover');
      });

      dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('upload-zone--dragover');
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('upload-zone--dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          const input = document.getElementById('imageInput');
          input.files = files;
          handleFileSelect(input);
        }
      });
    </script>
  `;

  return mainLayout({
    title: 'New Image',
    description: 'Upload a new image to the media library',
    content,
    user,
    activeRoute: '/admin/media/images',
    breadcrumbs: [
      { label: 'Dashboard', url: '/admin' },
      { label: 'Media', url: '/admin/media/images' },
      { label: 'Images', url: '/admin/media/images' },
      { label: 'New', url: '/admin/media/images/new' },
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
