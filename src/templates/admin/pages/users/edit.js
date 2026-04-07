// src/templates/admin/pages/users/edit.js
// Edit User Page - Two column layout with avatar upload

import { mainLayout } from '../../layouts/main.js';
import { getInitials } from '../../utils/helpers.js';

/**
 * Edit User Page Template
 * Two column layout: Left (form + avatar), Right (profile card with stats)
 */
export function usersEditPage({ editUser, user, userStats = {}, errors = {} }) {
  // Check if editing self
  const isSelf = user?.id === editUser?.id;
  // Check if this is the last admin
  const canChangeRole = !(isSelf && editUser?.role === 'ADMIN');
  
  // Get initials for avatar placeholder
  const initials = getInitials(editUser.firstName, editUser.lastName);

  const content = `
    <div class="users">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-header__left">
            <h1 class="page-header__title">Edit User</h1>
            <p class="page-header__subtitle">Update user details and permissions</p>
          </div>
          <div class="page-header__toast-container"></div>
        </div>

        <div class="form__row">
          <!-- Left Column: Avatar Upload + Edit Form -->
          <div class="form__col">
            <div class="card">
              <div class="card__header">
                <h2 class="card__title">User Details</h2>
              </div>
              <div class="card__body">
                <form
                  class="form"
                  id="editUserForm"
                  hx-put="/admin/users/${editUser.id}"
                  hx-target="#form-response"
                  hx-swap="innerHTML"
                >
                  <div id="form-response"></div>

                  <!-- Avatar Upload Section -->
                  <div class="form__group">
                    <div class="form__avatar-group form__avatar-group--centered">
                      <div id="avatarPreview" class="form__avatar-preview">
                        ${editUser.avatarUrl 
                          ? `<img src="${editUser.avatarUrl}" alt="${escapeHtml(editUser.firstName)}" />`
                          : `<div class="form__avatar-placeholder"><span>${initials}</span></div>`
                        }
                      </div>
                      <div class="form__avatar-actions">
                        <input 
                          type="file" 
                          id="avatarInput" 
                          name="avatar" 
                          accept="image/jpeg,image/png,image/jpg" 
                          class="hidden" 
                          hx-post="/admin/users/${editUser.id}/avatar"
                          hx-target="#avatarPreview"
                          hx-swap="innerHTML"
                          hx-encoding="multipart/form-data"
                          hx-trigger="change"
                        />
                        <button
                          type="button"
                          class="btn btn--outline btn--sm"
                          onclick="document.getElementById('avatarInput').click()"
                        >
                          Change Photo
                        </button>
                        <p class="form__hint">JPG, PNG. Max 10MB.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Divider -->
                  <hr class="form__divider" />

                  <!-- First Name & Last Name Row -->
                  <div class="form__row form__row--2col">
                    <div class="form__group ${errors.firstName ? 'form__group--error' : ''}">
                      <label class="label label--required">First Name</label>
                      <input
                        type="text"
                        class="input"
                        id="userFirstName"
                        name="firstName"
                        value="${escapeHtml(editUser.firstName)}"
                        required
                      />
                      ${errors.firstName ? `<p class="form-feedback form-feedback--error">${errors.firstName}</p>` : ''}
                    </div>
                    <div class="form__group ${errors.lastName ? 'form__group--error' : ''}">
                      <label class="label label--required">Last Name</label>
                      <input
                        type="text"
                        class="input"
                        id="userLastName"
                        name="lastName"
                        value="${escapeHtml(editUser.lastName)}"
                        required
                      />
                      ${errors.lastName ? `<p class="form-feedback form-feedback--error">${errors.lastName}</p>` : ''}
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="form__group ${errors.email ? 'form__group--error' : ''}">
                    <label class="label label--required">Email Address</label>
                    <input
                      type="email"
                      class="input"
                      id="userEmail"
                      name="email"
                      value="${escapeHtml(editUser.email)}"
                      required
                    />
                    ${errors.email ? `<p class="form-feedback form-feedback--error">${errors.email}</p>` : ''}
                  </div>

                  <!-- Role -->
                  <div class="form__group ${errors.role ? 'form__group--error' : ''}">
                    <label class="label label--required">Role</label>
                    <input 
                      type="text" 
                      class="input" 
                      value="${editUser.role === 'ADMIN' ? 'Admin - Full System Access' : editUser.role === 'EDITOR' ? 'Editor - Can Publish and Manage All Content' : editUser.role === 'AUTHOR' ? 'Author - Can Create and Edit Own Posts' : 'Viewer - Read-Only Access'}" 
                      disabled 
                    />
                    ${!canChangeRole 
                      ? `<p class="form-feedback form-feedback--hint">You cannot change your own admin role. Another admin must do this.</p>` 
                      : `<p class="form-feedback form-feedback--hint">
                          <strong>Admin:</strong> Full access | <strong>Editor:</strong> Manage all content | 
                          <strong>Author:</strong> Own content only | <strong>Viewer:</strong> Read only
                        </p>`
                    }
                    ${errors.role ? `<p class="form-feedback form-feedback--error">${errors.role}</p>` : ''}
                  </div>

                  <!-- Divider -->
                  <hr class="form__divider" />

                  <!-- Account Information -->
                  <div class="form__group">
                    <h4 class="form__info-box-title form__info-box-title--mb">Account Information</h4>
                    <div class="form__details-list">
                      <div class="form__details-item">
                        <span class="form__details-item-label">Joined</span>
                        <span class="form__details-item-value">${formatDate(editUser.createdAt)}</span>
                      </div>
                      <hr class="form__divider form__divider--sm" />
                      <div class="form__details-item">
                        <span class="form__details-item-label">Last Active</span>
                        <span class="form__details-item-value">${editUser.lastActiveAt ? formatRelativeTime(editUser.lastActiveAt) : 'Never'}</span>
                      </div>
                      <hr class="form__divider form__divider--sm" />
                      <div class="form__details-item">
                        <span class="form__details-item-label">Status</span>
                        <span class="form__details-item-value form__details-item-value--${getStatusClass(editUser.status)}">${editUser.status}</span>
                      </div>
                      <hr class="form__divider form__divider--sm" />
                      <div class="form__details-item">
                        <span class="form__details-item-label">Posts Created</span>
                        <span class="form__details-item-value">${userStats.postsCount || 0} Posts</span>
                      </div>
                      <hr class="form__divider form__divider--sm" />
                      <div class="form__details-item">
                        <span class="form__details-item-label">Tags Created</span>
                        <span class="form__details-item-value">${userStats.tagsCount || 0} Tags</span>
                      </div>
                      <hr class="form__divider form__divider--sm" />
                      <div class="form__details-item">
                        <span class="form__details-item-label">Categories Created</span>
                        <span class="form__details-item-value">${userStats.categoriesCount || 0} Categories</span>
                      </div>
                      <hr class="form__divider form__divider--sm" />
                      <div class="form__details-item">
                        <span class="form__details-item-label">Users Created</span>
                        <span class="form__details-item-value">${userStats.usersCount || 0} Users</span>
                      </div>
                    </div>
                  </div>

                  <input type="hidden" name="_csrf" value="${user?.csrfToken || ''}" />
                </form>
              </div>
              <div class="card__footer">
                <div class="form__field-group">
                  <button type="button" class="btn btn--primary" onclick="submitForm()">
                    Save Changes
                  </button>
                  <a href="/admin/users" class="btn btn--ghost btn--cancel">Cancel</a>
                </div>
              </div>
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
      aria-labelledby="deleteModalLabel"
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
          <div class="px-6 pb-6">
            <h3 id="deleteModalLabel" class="modal__title">Delete User?</h3>
            <p class="modal__description">This action cannot be undone. <span id="deleteUserName"></span> will lose all access to the system.</p>
          </div>

          <!-- Buttons (stacked, full-width) -->
          <form 
            id="deleteUserForm"
            hx-delete=""
            hx-target="#form-response"
            hx-swap="innerHTML"
            class="px-6 pb-6 flex flex-col gap-3"
          >
            <input type="hidden" name="_csrf" value="${user?.csrfToken || ''}" />
            <button 
              type="submit" 
              class="btn btn--danger btn--full"
            >
              Delete User
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

    <script>
      function submitForm() {
        htmx.trigger('#editUserForm', 'submit');
      }

      function confirmDelete(userId, userName) {
        document.getElementById('deleteUserName').textContent = userName;
        
        // Set up the form for HTMX
        const form = document.getElementById('deleteUserForm');
        form.setAttribute('hx-delete', '/admin/users/' + userId);
        
        // Re-initialize HTMX on the form
        if (typeof htmx !== 'undefined') {
          htmx.process(form);
        }
        
        // Show modal
        const modal = document.getElementById('deleteModal');
        modal.style.display = 'block';
        modal.classList.remove('hidden');
        
        // Animate backdrop
        setTimeout(() => {
          document.getElementById('modalBackdrop').classList.remove('opacity-0');
          modal.querySelector('.modal__content').classList.add('hs-overlay-open:scale-100');
        }, 10);
      }
      
      function closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        const backdrop = document.getElementById('modalBackdrop');
        
        backdrop.classList.add('opacity-0');
        
        setTimeout(() => {
          modal.classList.add('hidden');
          modal.style.display = 'none';
        }, 200);
      }
    </script>
  `;

  return mainLayout({
    title: 'Edit User',
    description: 'Manage user details and permissions',
    content,
    user,
    activeRoute: '/admin/users',
    breadcrumbs: [
      { label: 'Dashboard', url: '/admin' },
      { label: 'Users', url: '/admin/users' },
      { label: `${editUser.firstName} ${editUser.lastName}`, url: `/admin/users/${editUser.id}/edit` }
    ]
  });
}

/**
 * Get badge class for role
 */
function getRoleBadgeClass(role) {
  const classes = {
    'ADMIN': 'primary',
    'EDITOR': 'purple',
    'AUTHOR': 'info',
    'VIEWER': 'warning'
  };
  return classes[role] || 'default';
}

/**
 * Get status class
 */
function getStatusClass(status) {
  const classes = {
    'ACTIVE': 'success',
    'INVITED': 'warning',
    'SUSPENDED': 'danger'
  };
  return classes[status] || 'default';
}

/**
 * Format date
 */
function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Format relative time
 */
function formatRelativeTime(dateString) {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  return formatDate(dateString);
}

/**
 * Escape HTML to prevent XSS
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
