// src/templates/admin/partials/sidebar.js
// Sidebar navigation component

/**
 * Sidebar Partial
 * Displays navigation menu with logo, groups, and submenus
 *
 * @param {Object} options
 * @param {string} options.activeRoute - Currently active route for highlighting
 * @param {Object} [options.user] - Current user data (for future features)
 * @param {string} options.user.email - User email
 * @returns {string} Sidebar HTML
 */
export function sidebar({ activeRoute = '/', user } = {}) {
  const isActive = (route) => activeRoute.startsWith(route) ? 'sidebar__item--active' : '';

  return `
    <aside class="sidebar">
      <!-- Sidebar Header / Logo -->
      <div class="sidebar__header">
        <a href="/admin/dashboard" class="sidebar__logo">
          <div class="sidebar__logo-icon">
            <i data-lucide="square-library"></i>
          </div>
          <span class="sidebar__logo-text">BlogCMS</span>
        </a>
        <!-- Desktop: Collapse toggle -->
        <button class="sidebar__toggle" id="sidebarToggle" title="Toggle sidebar">
          <i data-lucide="chevron-left" class="sidebar__toggle-icon"></i>
        </button>
        <!-- Mobile: Close button -->
        <button class="sidebar__close" id="sidebarClose" title="Close sidebar">
          <i data-lucide="chevron-left" class="sidebar__close-icon"></i>
        </button>
      </div>

      <!-- Sidebar Navigation -->
      <nav class="sidebar__nav">
        <!-- Main Navigation Group -->
        <div class="sidebar__group">
          <div class="sidebar__group-title">Main Menu</div>
          <ul class="sidebar__menu">
            <li>
              <a href="/admin/dashboard" class="sidebar__item ${isActive('/dashboard')}">
                <span class="sidebar__item-icon">
                  <i data-lucide="layout-dashboard"></i>
                </span>
                <span class="sidebar__item-text">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/admin/posts" class="sidebar__item ${isActive('/posts')}">
                <span class="sidebar__item-icon">
                  <i data-lucide="file-text"></i>
                </span>
                <span class="sidebar__item-text">Posts</span>
                <span class="sidebar__item-badge">12</span>
              </a>
            </li>
            <li>
              <div class="sidebar__item sidebar__item--has-submenu ${isActive('/categories') || isActive('/tags') ? 'sidebar__item--active' : ''}">
                <span class="sidebar__item-icon">
                  <i data-lucide="files"></i>
                </span>
                <span class="sidebar__item-text">Attributes</span>
                <span class="sidebar__item-arrow">
                  <i data-lucide="chevron-right"></i>
                </span>
              </div>
              <ul class="sidebar__submenu ${isActive('/categories') || isActive('/tags') ? 'sidebar__submenu--open' : ''}">
                <li>
                  <a href="/admin/categories" class="sidebar__submenu-item ${isActive('/categories')}">Categories</a>
                </li>
                <li>
                  <a href="/admin/tags" class="sidebar__submenu-item ${isActive('/tags')}">Tags</a>
                </li>
              </ul>
            </li>
            <li>
              <div class="sidebar__item sidebar__item--has-submenu">
                <span class="sidebar__item-icon">
                  <i data-lucide="image"></i>
                </span>
                <span class="sidebar__item-text">Media</span>
                <span class="sidebar__item-arrow">
                  <i data-lucide="chevron-right"></i>
                </span>
              </div>
              <ul class="sidebar__submenu">
                <li>
                  <a href="/admin/images" class="sidebar__submenu-item ${isActive('/images')}">Images</a>
                </li>
                <li>
                  <a href="/admin/videos" class="sidebar__submenu-item ${isActive('/videos')}">Videos</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <!-- Management Group -->
        <div class="sidebar__group">
          <div class="sidebar__group-title">Management</div>
          <ul class="sidebar__menu">
            <li>
              <a href="/admin/users" class="sidebar__item ${isActive('/users')}">
                <span class="sidebar__item-icon">
                  <i data-lucide="user-cog"></i>
                </span>
                <span class="sidebar__item-text">Users</span>
              </a>
            </li>
            <li>
              <a href="/admin/settings" class="sidebar__item ${isActive('/settings')}">
                <span class="sidebar__item-icon">
                  <i data-lucide="settings"></i>
                </span>
                <span class="sidebar__item-text">Settings</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  `;
}
