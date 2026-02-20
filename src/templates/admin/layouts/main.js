// src/templates/admin/layouts/main.js
// Main Dashboard Layout
// Used for authenticated pages: dashboard, posts, users, settings, etc.

import { sidebar } from '../partials/sidebar.js';
import { header } from '../partials/header.js';

/**
 * Main Dashboard Layout Template
 * Sidebar + Header + Main Content layout
 *
 * @param {Object} options
 * @param {string} options.title - Page title
 * @param {string} options.description - Meta description
 * @param {string} options.content - Main page content
 * @param {Object} options.user - Current user data
 * @param {string} options.user.firstName - User's first name
 * @param {string} options.user.lastName - User's last name
 * @param {string} options.user.email - User's email
 * @param {string} options.user.avatarUrl - User's avatar URL
 * @param {string} options.user.role - User's role (ADMIN, EDITOR, AUTHOR, VIEWER)
 * @param {string} [options.activeRoute] - Currently active route for sidebar highlighting
 * @returns {string} Complete HTML page
 */
export function mainLayout({ title = 'Dashboard', description = 'BlogCMS Dashboard', content, user, activeRoute = '/', breadcrumbs = [] }) {
  return `<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - BlogCMS Dashboard</title>
    <meta name="description" content="${description}" />

    <!-- Favicon -->
    <link rel="icon" href="/dist/favicon.svg" type="image/x-icon" />

    <!-- Preconnect to external resources -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Google Fonts - Schibsted Grotesk -->
    <link
      href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
      rel="stylesheet"
    />

    <!-- Compiled CSS -->
    <link rel="stylesheet" href="/dist/css/main.css" />

    <!-- Lucide Icons -->
    <script src="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.js"></script>

    <!-- HTMX -->
    <script src="https://unpkg.com/htmx.org@1.9.12"></script>
  </head>
  <body class="app">
    <!-- Layout wrapper -->
    <div class="layout">
      <!-- Sidebar -->
      ${sidebar({ activeRoute, user })}

      <!-- Main Content Area -->
      <main class="main">
        <!-- Header -->
        ${header({ user, breadcrumbs })}

        <!-- Main Content -->
        ${content}
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- ApexCharts CSS & JS -->
    <link rel="stylesheet" href="/vendor/apexcharts/apexcharts.css">
    <script src="/vendor/apexcharts/apexcharts.min.js"></script>

    <!-- Preline UI JS -->
    <script src="https://cdn.jsdelivr.net/npm/preline@2.0.3/dist/preline.min.js"></script>

    <!-- Dashboard JavaScript -->
    <script>
      // Initialize Lucide Icons
      document.addEventListener('DOMContentLoaded', () => {
        lucide.createIcons();

        // Re-initialize icons when Preline dropdowns open
        document.querySelectorAll('.hs-dropdown').forEach((dropdown) => {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.attributeName === 'class') {
                const menu = dropdown.querySelector('.hs-dropdown-menu');
                if (menu && !menu.classList.contains('hidden')) {
                  lucide.createIcons();
                }
              }
            });
          });
          observer.observe(dropdown, { attributes: true });
        });
      });

      // Theme Toggle
      const themeToggle = document.getElementById('themeToggle');
      const html = document.documentElement;
      const savedTheme = localStorage.getItem('theme');

      // Theme initialization
      if (savedTheme === null) {
        // First visit - check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          html.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          localStorage.setItem('theme', 'light');
        }
      } else if (savedTheme === 'dark') {
        // Returning visitor with saved preference
        html.classList.add('dark');
      }

      themeToggle?.addEventListener('click', () => {
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
      });

      // Sidebar Toggle (Desktop)
      const sidebarToggle = document.getElementById('sidebarToggle');
      const layout = document.querySelector('.layout');
      const sidebar = document.querySelector('.sidebar');
      const sidebarLogo = document.querySelector('.sidebar__logo');

      sidebarToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar--collapsed');
        layout.classList.toggle('layout--sidebar-collapsed');
      });

      sidebarLogo?.addEventListener('click', (e) => {
        if (sidebar.classList.contains('sidebar--collapsed')) {
          e.preventDefault();
          sidebar.classList.remove('sidebar--collapsed');
          layout.classList.remove('layout--sidebar-collapsed');
        }
      });

      // Mobile Menu Toggle
      const mobileMenuToggle = document.getElementById('mobileMenuToggle');
      const sidebarOverlay = document.getElementById('sidebarOverlay');
      const sidebarClose = document.getElementById('sidebarClose');

      const closeMobileSidebar = () => {
        sidebar.classList.remove('sidebar--mobile-open');
        layout.classList.remove('layout--sidebar-open');
        sidebarOverlay?.classList.remove('active');
      };

      mobileMenuToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar--mobile-open');
        layout.classList.toggle('layout--sidebar-open');
        sidebarOverlay?.classList.toggle('active');
      });

      sidebarClose?.addEventListener('click', closeMobileSidebar);
      sidebarOverlay?.addEventListener('click', closeMobileSidebar);

      // Mobile Search Toggle
      const mobileSearchToggle = document.getElementById('mobileSearchToggle');
      const mobileSearch = document.getElementById('mobileSearch');

      mobileSearchToggle?.addEventListener('click', () => {
        mobileSearch?.classList.toggle('mobile-search--open');
        if (mobileSearch?.classList.contains('mobile-search--open')) {
          mobileSearch?.querySelector('input')?.focus();
        }
      });

      document.addEventListener('click', (e) => {
        if (
          mobileSearch?.classList.contains('mobile-search--open') &&
          !mobileSearch?.contains(e.target) &&
          !mobileSearchToggle?.contains(e.target)
        ) {
          mobileSearch?.classList.remove('mobile-search--open');
        }
      });

      // Submenu Toggle
      const submenuTriggers = document.querySelectorAll('.sidebar__item--has-submenu');

      submenuTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const parent = trigger.parentElement;
          const submenu = parent.querySelector('.sidebar__submenu');

          document.querySelectorAll('.sidebar__submenu--open').forEach((openSubmenu) => {
            if (openSubmenu !== submenu) {
              openSubmenu.classList.remove('sidebar__submenu--open');
              openSubmenu.previousElementSibling?.classList.remove('sidebar__item--expanded');
            }
          });

          trigger.classList.toggle('sidebar__item--expanded');
          submenu.classList.toggle('sidebar__submenu--open');
        });
      });

      // HTMX event handlers
      document.body.addEventListener('htmx:afterRequest', function(evt) {
        const redirectUrl = evt.detail.xhr.getResponseHeader('HX-Redirect');
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }

        // Re-initialize icons after HTMX content swap
        lucide.createIcons();
      });

      // Handle chart initialization after HTMX swaps
      document.body.addEventListener('htmx:afterSwap', function(evt) {
        // Re-initialize icons
        lucide.createIcons();
        
        // Charts that need initialization will have inline scripts that run automatically
        // This event ensures any global cleanup/setup happens after swap
      });

      // Logout handler
      window.handleLogout = async function() {
        try {
          const response = await fetch('/admin/auth/logout', {
            method: 'POST'
          });
          if (response.ok) {
            window.location.href = '/admin/auth/login';
          }
        } catch (error) {
          console.error('Logout failed:', error);
        }
      };

      // Handle HTMX trigger events for Preline toasts
      document.body.addEventListener('htmx:toast', function(evt) {
        if (evt.detail) {
          // Try Preline's HSToast first
          if (typeof HSToast !== 'undefined') {
            HSToast.show({
              title: evt.detail.type === 'success' ? 'Success' : 'Error',
              message: evt.detail.message,
              variant: evt.detail.type || 'success',
              duration: 3000
            });
          } else {
            // Fallback: Create a simple toast using Preline's alert styles
            const toastContainer = document.getElementById('toast-container');
            if (toastContainer) {
              const toast = document.createElement('div');
              const isSuccess = evt.detail.type === 'success';
              const bgClass = isSuccess ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800';
              const iconSvg = isSuccess 
                ? '<svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>'
                : '<svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';
              
              toast.className = 'max-w-xs border rounded-lg shadow-lg mb-3 transform transition-all duration-300 translate-x-full ' + bgClass;
              toast.innerHTML = '<div class="flex items-center gap-3 px-4 py-3">' + iconSvg + '<span class="text-sm font-medium">' + evt.detail.message + '</span></div>';
              
              toastContainer.appendChild(toast);
              
              // Animate in
              requestAnimationFrame(function() {
                toast.classList.remove('translate-x-full');
              });
              
              // Remove after 3 seconds
              setTimeout(function() {
                toast.classList.add('translate-x-full', 'opacity-0');
                setTimeout(function() { toast.remove(); }, 300);
              }, 3000);
            }
          }
        }
      });
    </script>

    <!-- Preline Toast Container -->
    <div class="fixed top-4 right-4 z-50" id="toast-container"></div>
  </body>
</html>`;
}
