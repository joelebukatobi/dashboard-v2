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
    <div class="content content-main">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header__left">
          <h1 class="page-header__title">Edit Post</h1>
          <p class="page-header__subtitle">Update your blog post</p>
        </div>
        <div class="page-header__toast-container"></div>
      </div>

      <!-- Edit Post Form Container (Scrollable) -->
      <div class="page-main">
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

            <!-- Featured Image -->
            <div class="form__group">
              <label class="form__label">Featured Image</label>
              <div class="image-upload">
                <div class="image-upload__preview has-image" id="imagePreview">
                  <img src="${post.featuredImageUrl || '/public/uploads/images/featured-posts.jpg'}" alt="Featured image preview" id="previewImg" />
                  <div class="image-upload__dropzone image-upload__dropzone--overlay" id="dropzone">
                    <i data-lucide="image-plus" class="image-upload__icon"></i>
                    <p class="image-upload__text">Click to upload or drag and drop</p>
                    <p class="image-upload__hint">PNG, JPG, WebP up to 10MB</p>
                    <input type="file" id="imageInput" accept="image/*" hidden />
                  </div>
                </div>
              </div>
              <input type="hidden" name="featuredImageId" id="featuredImageId" value="${post.featuredImageId || ''}" />
            </div>

            <!-- Title & Slug Row -->
            <div class="form__row form__row--2col">
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
            </div>

            <!-- Author, Category & Tags Row -->
            <div class="form__row form__row--3col">
              <!-- Author -->
              <div class="form__group">
                <label class="form__label form__label--required">Author</label>
                <select
                  name="authorId"
                  id="postAuthor"
                  data-hs-select='{
                    "placeholder": "Select an author...",
                    "toggleClasses": "form__select-toggle",
                    "dropdownClasses": "form__select-dropdown",
                    "optionClasses": "form__select-option"
                  }'
                  class="hidden"
                >
                  <option value="${post.authorId || ''}" selected>${post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Current User'}</option>
                </select>
              </div>

              <!-- Category -->
              <div class="form__group">
                <label class="form__label form__label--required">Category</label>
                <select
                  name="categoryId"
                  id="postCategory"
                  data-hs-select='{
                    "placeholder": "Select a category...",
                    "toggleClasses": "form__select-toggle",
                    "dropdownClasses": "form__select-dropdown",
                    "optionClasses": "form__select-option"
                  }'
                  class="hidden"
                >
                  <option value="">Uncategorized</option>
                  ${categories.map((cat) => `
                    <option value="${cat.id}" ${post.categoryId === cat.id ? 'selected' : ''}>${cat.title}</option>
                  `).join('')}
                </select>
              </div>

              <!-- Tags -->
              <div class="form__group">
                <label class="form__label">Tags</label>
                <select
                  name="tagIds"
                  id="postTags"
                  multiple
                  data-hs-select='{
                    "placeholder": "Select tags...",
                    "toggleClasses": "form__select-toggle",
                    "dropdownClasses": "form__select-dropdown",
                    "optionClasses": "form__select-option"
                  }'
                  class="hidden"
                >
                  ${tags.map((tag) => `
                    <option value="${tag.id}" ${post.tags?.some((t) => t.id === tag.id) ? 'selected' : ''}>${tag.name}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Short Description -->
            <div class="form__group">
              <label class="form__label">Short Description</label>
              <textarea
                class="form__input form__textarea"
                name="excerpt"
                rows="3"
                placeholder="Brief summary of the post (optional)"
              >${escapeHtml(post.excerpt || '')}</textarea>
            </div>

            <!-- Content (Rich Text Editor) -->
            <div class="form__group">
              <label class="form__label form__label--required">Content</label>
              <div id="editor" class="post-editor"></div>
              <input type="hidden" name="content" id="contentInput" value="${escapeHtml(post.content)}" />
            </div>

            <input type="hidden" name="status" id="postStatus" value="${post.status}" />
          </form>
        </div>
        <div class="card__footer">
          <div class="form__field-group">
            <button type="button" class="btn btn--primary" onclick="submitForm('PUBLISHED')">
              ${post.status === 'PUBLISHED' ? 'Update Post' : 'Publish Post'}
            </button>
            <button type="button" class="btn btn--outline-primary" onclick="submitForm('DRAFT')">
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

        // Submit using HTMX trigger
        htmx.trigger('#editPostForm', 'submit');
      }

      // Image upload handling
      const dropzone = document.getElementById('dropzone');
      const imageInput = document.getElementById('imageInput');
      const previewImg = document.getElementById('previewImg');
      const featuredImageId = document.getElementById('featuredImageId');

      // Handle click on overlay
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
            lucide.createIcons();
          }
        } catch (error) {
          console.error('Upload failed:', error);
        }
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
