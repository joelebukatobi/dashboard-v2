// src/templates/admin/pages/posts/new.js
// New Post Page - Exact structure from new-post.html

import { mainLayout } from '../../layouts/main.js';

/**
 * New Post Page Template
 * Create new blog post
 * Structure matches new-post.html exactly
 */
export function postNewPage({ categories, tags, user }) {
  const content = `
    <div class="content content--new">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header__left">
          <h1 class="page-header__title">New Post</h1>
          <p class="page-header__subtitle">Create and publish a new blog post</p>
        </div>
      </div>

      <!-- New Post Form Container (Scrollable) -->
      <div class="new-form-container">
        <div class="card">
        <div class="card__header">
          <h2 class="card__title">Post Details</h2>
        </div>
        <div class="card__body">
          <form
            class="form"
            id="newPostForm"
            hx-post="/admin/posts"
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
                required
              />
              <input type="hidden" name="slug" id="postSlug" />
            </div>

            <!-- Featured Image -->
            <div class="form__group">
              <label class="form__label">Featured Image</label>
              <div class="image-upload">
                <div class="image-upload__preview" id="imagePreview" style="display: none;">
                  <img src="" alt="Featured image preview" id="previewImg" />
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
              <input type="hidden" name="featuredImageId" id="featuredImageId" />
            </div>

            <!-- Author, Category & Tags Row -->
            <div class="form__row form__row--3col">
              <!-- Author -->
              <div class="form__group">
                <label class="form__label form__label--required">Author</label>
                <div class="hs-dropdown hs-dropdown--full [--placement:bottom-left]">
                  <button id="hs-dropdown-author" type="button" class="hs-dropdown-toggle form__input form__select">
                    <span id="selectedAuthor">${user ? `${user.firstName} ${user.lastName}` : 'Select an author'}</span>
                    <i data-lucide="chevron-down" class="size-4 text-grey-400"></i>
                  </button>
                  <div class="hs-dropdown-menu dropdown__menu dropdown__menu--full" aria-labelledby="hs-dropdown-author">
                    <a href="#" class="dropdown__item" data-value="${user?.id || ''}">${user ? `${user.firstName} ${user.lastName}` : 'Current User'}</a>
                  </div>
                  <input type="hidden" name="authorId" id="postAuthor" value="${user?.id || ''}" />
                </div>
              </div>

              <!-- Category -->
              <div class="form__group">
                <label class="form__label form__label--required">Category</label>
                <div class="hs-dropdown hs-dropdown--full [--placement:bottom-left]">
                  <button id="hs-dropdown-category" type="button" class="hs-dropdown-toggle form__input form__select">
                    <span id="selectedCategory">Select a category</span>
                    <i data-lucide="chevron-down" class="size-4 text-grey-400"></i>
                  </button>
                  <div class="hs-dropdown-menu dropdown__menu dropdown__menu--full" aria-labelledby="hs-dropdown-category">
                    ${categories.map((cat) => `
                      <a href="#" class="dropdown__item" data-value="${cat.id}">${cat.title}</a>
                    `).join('')}
                  </div>
                  <input type="hidden" name="categoryId" id="postCategory" />
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
                />
                <p class="form__hint">Separate tags with commas</p>
              </div>
            </div>

            <!-- Excerpt -->
            <div class="form__group">
              <label class="form__label">Excerpt</label>
              <textarea
                class="form__input form__textarea"
                name="excerpt"
                rows="3"
                placeholder="Brief summary of the post (optional)"
              ></textarea>
            </div>

            <!-- Content (Rich Text Editor) -->
            <div class="form__group">
              <label class="form__label form__label--required">Content</label>
              <div id="editor" style="min-height: 300px;"></div>
              <input type="hidden" name="content" id="contentInput" />
            </div>

            <input type="hidden" name="status" value="DRAFT" />
          </form>
        </div>
        <div class="card__footer">
          <div class="form__field-group">
            <button type="button" class="btn btn--primary" onclick="submitForm('PUBLISHED')">
              <i data-lucide="send"></i>
              Publish Post
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
        })
        .catch(error => {
          console.error('CKEditor initialization failed:', error);
        });

      // Auto-generate slug from title
      const titleInput = document.getElementById('postTitle');
      const slugInput = document.getElementById('postSlug');

      titleInput?.addEventListener('blur', () => {
        if (!slugInput.value && titleInput.value) {
          const slug = titleInput.value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          slugInput.value = slug;
        }
      });

      // Submit form
      function submitForm(status) {
        // Update content from CKEditor
        if (editor) {
          document.getElementById('contentInput').value = editor.getData();
        }

        // Set status
        const statusRadios = document.querySelectorAll('input[name="status"]');
        statusRadios.forEach(radio => {
          radio.checked = radio.value === status;
        });

        // Submit
        document.getElementById('newPostForm').requestSubmit();
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
    title: 'New Post',
    description: 'Create a new blog post',
    content,
    user,
    activeRoute: '/admin/posts',
    breadcrumbs: [
      { label: 'Dashboard', url: '/admin/dashboard' },
      { label: 'Blog Posts', url: '/admin/posts' },
      { label: 'New Post', url: '/admin/posts/new' }
    ]
  });
}
