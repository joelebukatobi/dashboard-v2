// src/templates/admin/partials/header.js
// Header component with search, notifications, and user menu

/**
 * Header Partial
 * Displays top navigation bar with mobile menu toggle, search, theme toggle,
 * notifications, and user dropdown
 *
 * @param {Object} options
 * @param {Object} options.user - Current user data
 * @param {string} options.user.firstName - User's first name
 * @param {string} options.user.lastName - User's last name
 * @param {string} options.user.email - User's email
 * @param {string} options.user.avatarUrl - User's avatar URL
 * @returns {string} Header HTML
 */
export function header({ user, breadcrumbs = [] }) {
  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0]
    : 'User';
  const avatarUrl = user?.avatarUrl || 'https://i.pravatar.cc/150?img=68';

  // Generate breadcrumb HTML with chevrons
  const breadcrumbHtml =
    breadcrumbs.length > 0
      ? breadcrumbs
          .map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const separator =
              index > 0 ? '<span class="breadcrumb__separator"><i data-lucide="chevron-right"></i></span>' : '';
            return `${separator}<a href="${crumb.url}" class="breadcrumb__item ${isLast ? 'breadcrumb__item--current' : ''}">${crumb.label}</a>`;
          })
          .join('')
      : '<a href="/admin/dashboard" class="breadcrumb__item breadcrumb__item--current">Dashboard</a>';

  return `
    <header class="header">
      <div class="header__left">
        <button class="header__menu-toggle" id="mobileMenuToggle">
          <i data-lucide="menu"></i>
        </button>

        <!-- Breadcrumb (hidden on mobile) -->
        <nav class="breadcrumb">
          ${breadcrumbHtml}
        </nav>
      </div>

      <div class="header__right">
        <!-- Mobile Search Toggle -->
        <button class="header__search-toggle" id="mobileSearchToggle" title="Search">
          <i data-lucide="search"></i>
        </button>

        <!-- Desktop Search -->
        <div class="form__group form__group--search !m-0 hidden lg:block">
          <div class="form__wrapper">
            <i data-lucide="search" class="input__icon input__icon--left"></i>
            <input
              type="text"
              class="input input--icon-left"
              placeholder="Search..."
            />
          </div>
        </div>

        <!-- Theme Toggle -->
        <button class="header__action" id="themeToggle" title="Toggle theme">
          <i data-lucide="sun" class="theme-icon-light"></i>
          <i data-lucide="moon" class="theme-icon-dark"></i>
        </button>

        <!-- Notifications -->
        <div class="hs-dropdown [--placement:bottom-right]">
          <button
            id="hs-dropdown-notifications"
            type="button"
            class="hs-dropdown-toggle header__action header__action--badge"
            data-count="3"
          >
            <i data-lucide="bell"></i>
          </button>
          <div
            class="hs-dropdown-menu dropdown__menu dropdown__menu--lg"
            role="menu"
            aria-labelledby="hs-dropdown-notifications"
          >
            <div class="notifications__header">
              <h4 class="notifications__title">Notifications</h4>
              <a href="#" class="notifications__action">Mark all as read</a>
            </div>
            <div class="notifications__list">
              <a href="#" class="notifications__item notifications__item--unread">
                <div class="notifications__icon notifications__icon--comment">
                  <i data-lucide="message-circle"></i>
                </div>
                <div class="notifications__content">
                  <p class="notifications__text"><strong>New comment</strong> on your post</p>
                  <p class="notifications__time">2 minutes ago</p>
                </div>
              </a>
              <a href="#" class="notifications__item notifications__item--unread">
                <div class="notifications__icon notifications__icon--user">
                  <i data-lucide="user-plus"></i>
                </div>
                <div class="notifications__content">
                  <p class="notifications__text"><strong>New subscriber</strong> joined</p>
                  <p class="notifications__time">1 hour ago</p>
                </div>
              </a>
              <a href="#" class="notifications__item notifications__item--unread">
                <div class="notifications__icon notifications__icon--alert">
                  <i data-lucide="trending-up"></i>
                </div>
                <div class="notifications__content">
                  <p class="notifications__text"><strong>Traffic spike</strong> detected</p>
                  <p class="notifications__time">3 hours ago</p>
                </div>
              </a>
            </div>
            <div class="notifications__footer">
              <a href="#" class="notifications__view-all">View all notifications</a>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <div class="hs-dropdown [--placement:bottom-right]">
          <button id="hs-dropdown-user" type="button" class="hs-dropdown-toggle header__user-btn">
            <div class="avatar avatar--sm">
              <img src="${avatarUrl}" alt="${displayName}" />
            </div>
            <span class="header__user-name">${displayName}</span>
            <i data-lucide="chevron-down" class="dropdown__chevron"></i>
          </button>
          <div
            class="hs-dropdown-menu dropdown__menu dropdown__menu--md"
            role="menu"
            aria-labelledby="hs-dropdown-user"
          >
            <div class="dropdown__header">
              <p class="dropdown__header-name">${displayName}</p>
              <p class="dropdown__header-email">${user?.email || ''}</p>
            </div>
            <a class="dropdown__item" href="#">
              <i data-lucide="user"></i>
              My Profile
            </a>
            <a class="dropdown__item" href="/admin/settings">
              <i data-lucide="settings"></i>
              Account Settings
            </a>
            <div class="dropdown__divider"></div>
            <a class="dropdown__item dropdown__item--danger" href="#" onclick="handleLogout()">
              <i data-lucide="log-out"></i>
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Search Bar -->
    <div class="mobile-search" id="mobileSearch">
      <div class="form__group form__group--search form__group--search-mobile !m-0 w-full max-w-full">
        <div class="form__wrapper w-full">
          <i data-lucide="search" class="input__icon input__icon--left"></i>
          <input
            type="text"
            class="input input--icon-left w-full"
            placeholder="Search posts, pages, users..."
          />
        </div>
      </div>
    </div>
  `;
}
