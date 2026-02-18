// src/templates/admin/pages/posts/edit.js
// Edit Post Page - Exact structure from edit-post.html

import { mainLayout } from '../../layouts/main.js';

/**
 * Edit Post Page Template
 * Edit existing blog post
 * Structure matches edit-post.html exactly
 */
export function postEditPage({ categories, tags, post, user }) {
  const content = `
    <div class="content content--edit">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header__left">
          <h1 class="page-header__title">Edit Post</h1>
          <p class="page-header__subtitle">Update your blog post</p>
        </div>
      </div>

      <!-- Edit Post Form Container (Scrollable) -->
      <div class="edit-form-container">
        <div class="card">
        <div class="card__header">
          <h2 class="card__title">Post Details</h2>
        </div>
        <div class="card__body">
          <form
            class="form"
            id="editPostForm"
            hx-put="/admin/posts/${post.id}"
            hx-target="#form-response"
            hx-swap="innerHTML"
          >
            <div id="form-response"></div>

            <!-- Title -->
            <div class="form__group">
              <label class="form__label form__label--required">Post Title</label>
              <input
                type="text"
                class="form__input"
                id="postTitle"
                name="title"
                placeholder="Enter post title"
                value="${escapeHtml(post.title)}"
                required
              />
            </div>

            <!-- Slug -->
            <div class="form__group">
              <label class="form__label">Slug</label>
              <input
                type="text"
                class="form__input"
                name="slug"
                id="postSlug"
                value="${post.slug}"
                placeholder="auto-generated-from-title"
              />
              <p class="form__hint">Auto-generated from title. Editable if needed.</p>
            </div>

            <!-- Featured Image -->
            <div class="form__group">
              <label class="form__label">Featured Image</label>
              <div class="image-upload">
                <div class="image-upload__preview" id="imagePreview" style="${post.featuredImageId ? '' : 'display: none;'}">
                  <img src="${post.featuredImageUrl || ''}" alt="Featured image preview" id="previewImg" />
                  <button type="button" class="image-upload__remove" id="removeImage" title="Remove image">
                    <i data-lucide="x" class="size-4"></i>
                  </button>
                </div>
                <div class="image-upload__dropzone" id="dropzone">
                  <i data-lucide="image-plus" class="image-upload__icon"></i>
                  <p class="image-upload__text">Click to upload or drag and drop</p>
                  <p class="image-upload__hint">PNG, JPG, WebP up to 10MB</p>
                  <input type="file" id="imageInput" accept="image/*" hidden />
                </div>
              </div>
              <input type="hidden" name="featuredImageId" id="featuredImageId" value="${post.featuredImageId || ''}" />
            </div>

            <!-- Author, Category & Tags Row -->
            <div class="form__row form__row--3col">
              <!-- Author -->
              <div class="form__group">
                <label class="form__label form__label--required">Author</label>
                <div class="hs-dropdown hs-dropdown--full [--placement:bottom-left]">
                  <button id="hs-dropdown-author" type="button" class="hs-dropdown-toggle form__input form__select">
                    <span id="selectedAuthor">${post.author ? `${post.author.firstName} ${post.author.lastName}` : (user ? `${user.firstName} ${user.lastName}` : 'Select an author')}</span>
                    <i data-lucide="chevron-down" class="size-4 text-grey-400"></i>
                  </button>
                  <div class="hs-dropdown-menu dropdown__menu dropdown__menu--full" aria-labelledby="hs-dropdown-author">
                    <a href="#" class="dropdown__item" data-value="${post.authorId}">${post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Current User'}</a>
                  </div>
                  <input type="hidden" name="authorId" id="postAuthor" value="${post.authorId}" />
                </div>
              </div>

              <!-- Category -->
              <div class="form__group">
                <label class="form__label form__label--required">Category</label>
                <div class="hs-dropdown hs-dropdown--full [--placement:bottom-left]">
                  <button id="hs-dropdown-category" type="button" class="hs-dropdown-toggle form__input form__select">
                    <span id="selectedCategory">${post.category?.title || 'Select a category'}</span>
                    <i data-lucide="chevron-down" class="size-4 text-grey-400"></i>
                  </button>
                  <div class="hs-dropdown-menu dropdown__menu dropdown__menu--full" aria-labelledby="hs-dropdown-category">
                    ${categories.map((cat) => `
                      <a href="#" class="dropdown__item" data-value="${cat.id}">${cat.title}</a>
                    `).join('')}
                  </div>
                  <input type="hidden" name="categoryId" id="postCategory" value="${post.categoryId || ''}" />
                </div>
              </div>

              <!-- Tags -->
              <div class="form__group">
                <label class="form__label">Tags</label>
                <input
                  type="text"
                  class="form__input"
                  name="tags"
                  id="postTags"
                  placeholder="e.g. react, frontend, web"
                  value="${post.tags ? post.tags.map((t) => t.name).join(', ') : ''}"
                />
                <p class="form__hint">Separate tags with commas</p>
              </div>
            </div>

            <!-- Content (Rich Text Editor) -->
            <div class="form__group">
              <label class="form__label form__label--required">Content</label>
              <div id="editor" style="min-height: 300px;"></div>
              <input type="hidden" name="content" id="contentInput" value="${escapeHtml(post.content)}" />
            </div>

            <input type="hidden" name="status" id="postStatus" value="${post.status}" />
          </form>

          <!-- Toast Container -->
          <div id="toast-container" class="mt-4"></div>
        </div>
        <div class="card__footer">
          <div class="form__field-group">
            <button type="button" class="btn btn--primary" onclick="submitForm('PUBLISHED')">
              <i data-lucide="send"></i>
              ${post.status === 'PUBLISHED' ? 'Update Post' : 'Publish Post'}
            </button>
            <button type="button" class="btn btn--outline-primary" onclick="submitForm('DRAFT')">
              <i data-lucide="save"></i>
              Save Draft
            </button>
            <a href="/admin/posts" class="btn btn--ghost btn--cancel">Cancel</a>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- CKEditor 5 Styles -->
    <link rel="stylesheet" href="https://cdn.ckeditor.com/ckeditor5/43.0.0/ckeditor5.css" />

    <!-- CKEditor 5 JS -->
    <script src="https://cdn.ckeditor.com/ckeditor5/43.0.0/ckeditor5.umd.js"></script>

    <script>
      const { ClassicEditor, Essentials, Bold, Italic, Underline, Strikethrough, Heading,
              List, Link, SourceEditing, Paragraph, BlockQuote, Image, ImageToolbar,
              ImageCaption, ImageStyle, ImageResize, ImageUpload, SimpleUploadAdapter,
              Alignment, SpecialCharacters, MediaEmbed } = CKEDITOR;

      let editor;

      // Initialize CKEditor 5
      ClassicEditor
        .create(document.querySelector('#editor'), {
          plugins: [Essentials, Bold, Italic, Underline, Strikethrough, Heading,
                    List, Link, SourceEditing, Paragraph, BlockQuote, Image, ImageToolbar,
                    ImageCaption, ImageStyle, ImageResize, ImageUpload, SimpleUploadAdapter,
                    Alignment, SpecialCharacters, MediaEmbed],
          toolbar: {
            items: [
              'heading',
              '|',
              'bold', 'italic', 'underline', 'strikethrough',
              '|',
              'alignment',
              '|',
              'bulletedList', 'numberedList', 'blockQuote',
              '|',
              'link', 'imageUpload', 'mediaEmbed',
              '|',
              'specialCharacters',
              '|',
              'sourceEditing'
            ]
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
              { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
              { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
          },
          simpleUpload: {
            uploadUrl: '/admin/posts/upload-image'
          },
          image: {
            toolbar: [
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              '|',
              'toggleImageCaption',
              'imageTextAlternative'
            ]
          },
          placeholder: 'Write your post content here...'
        })
        .then(newEditor => {
          editor = newEditor;
          
          // Set initial content
          const initialContent = document.getElementById('contentInput').value;
          if (initialContent) {
            editor.setData(initialContent);
          }
        })
        .catch(error => {
          console.error('CKEditor initialization failed:', error);
        });

      // Submit form
      function submitForm(status) {
        // Update content from CKEditor
        if (editor) {
          document.getElementById('contentInput').value = editor.getData();
        }

        // Set status in hidden field
        document.getElementById('postStatus').value = status;

        // Submit
        document.getElementById('editPostForm').requestSubmit();
      }

      // Image upload handling
      const dropzone = document.getElementById('dropzone');
      const imageInput = document.getElementById('imageInput');
      const imagePreview = document.getElementById('imagePreview');
      const previewImg = document.getElementById('previewImg');
      const removeImage = document.getElementById('removeImage');
      const featuredImageId = document.getElementById('featuredImageId');

      dropzone?.addEventListener('click', () => imageInput.click());

      imageInput?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
          const response = await fetch('/admin/posts/upload-image', {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            const data = await response.json();
            previewImg.src = data.url;
            featuredImageId.value = data.id;
            imagePreview.style.display = 'block';
            lucide.createIcons();
          }
        } catch (error) {
          console.error('Upload failed:', error);
        }
      });

      removeImage?.addEventListener('click', () => {
        imageInput.value = '';
        featuredImageId.value = '';
        imagePreview.style.display = 'none';
      });
    </script>
  `;

  return mainLayout({
    title: 'Edit Post',
    description: 'Edit blog post',
    content,
    user,
    activeRoute: '/admin/posts',
    breadcrumbs: [
      { label: 'Dashboard', url: '/admin/dashboard' },
      { label: 'Blog Posts', url: '/admin/posts' },
      { label: post.title.substring(0, 30) + (post.title.length > 30 ? '...' : ''), url: `/admin/posts/${post.id}/edit` }
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
