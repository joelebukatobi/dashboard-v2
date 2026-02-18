// src/templates/admin/pages/dashboard.js
// Dashboard page template

import { mainLayout } from '../layouts/main.js';

/**
 * Dashboard Page Template
 * Displays quick stats, traffic chart, recent activity, and top posts
 *
 * @param {Object} options
 * @param {Object} options.user - Current user data
 * @param {Object} options.stats - Dashboard statistics
 * @param {number} options.stats.totalPosts - Total post count
 * @param {number} options.stats.totalViews - Total page views
 * @param {number} options.stats.totalComments - Total comments
 * @param {number} options.stats.totalSubscribers - Total subscribers
 * @param {Array} options.activity - Recent activity items
 * @param {Array} options.recentPosts - Recent posts list
 * @param {Array} options.topPosts - Top performing posts
 * @returns {string} Complete HTML page
 */
export function dashboardPage({ user, stats = {}, activity = [], recentPosts = [], topPosts = [] }) {
  const {
    totalPosts = 248,
    totalViews = '45.2K',
    totalComments = 1423,
    totalSubscribers = 8942
  } = stats;

  const content = `
    <div class="content content--dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-header__title">Dashboard</h1>
        <p class="page-header__subtitle">Welcome back, ${user?.firstName || 'User'}! Here's what's happening with your blog today.</p>
      </div>
      <div class="page-header__actions">
        <!-- New Post Dropdown -->
        <div class="hs-dropdown [--placement:bottom-right]">
          <button id="hs-dropdown-new" type="button" class="hs-dropdown-toggle btn btn--primary">
            <i data-lucide="plus"></i>
            New Post
            <i data-lucide="chevron-down" class="dropdown__chevron"></i>
          </button>
          <div
            class="hs-dropdown-menu dropdown__menu dropdown__menu--md dropdown__menu--left"
            role="menu"
            aria-labelledby="hs-dropdown-new"
          >
            <a class="dropdown__item" href="/admin/posts/new">
              <i data-lucide="file-edit"></i>
              New Blog Post
            </a>
            <a class="dropdown__item" href="#">
              <i data-lucide="newspaper"></i>
              New Article
            </a>
            <a class="dropdown__item" href="#">
              <i data-lucide="image"></i>
              New Gallery
            </a>
            <div class="dropdown__divider"></div>
            <a class="dropdown__item" href="#">
              <i data-lucide="upload"></i>
              Import Content
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats">
      <div class="quick-stat">
        <div class="quick-stat__icon quick-stat__icon--posts">
          <i data-lucide="file-text"></i>
        </div>
        <div class="quick-stat__content">
          <span class="quick-stat__label">Total Posts</span>
          <span class="quick-stat__value">${totalPosts}</span>
          <span class="quick-stat__change quick-stat__change--up">
            <i data-lucide="trending-up"></i>
            12% from last month
          </span>
        </div>
      </div>

      <div class="quick-stat">
        <div class="quick-stat__icon quick-stat__icon--views">
          <i data-lucide="eye"></i>
        </div>
        <div class="quick-stat__content">
          <span class="quick-stat__label">Page Views</span>
          <span class="quick-stat__value">${totalViews}</span>
          <span class="quick-stat__change quick-stat__change--up">
            <i data-lucide="trending-up"></i>
            8% from last month
          </span>
        </div>
      </div>

      <div class="quick-stat">
        <div class="quick-stat__icon quick-stat__icon--comments">
          <i data-lucide="message-square"></i>
        </div>
        <div class="quick-stat__content">
          <span class="quick-stat__label">Comments</span>
          <span class="quick-stat__value">${totalComments}</span>
          <span class="quick-stat__change quick-stat__change--down">
            <i data-lucide="trending-down"></i>
            3% from last month
          </span>
        </div>
      </div>

      <div class="quick-stat">
        <div class="quick-stat__icon quick-stat__icon--users">
          <i data-lucide="users"></i>
        </div>
        <div class="quick-stat__content">
          <span class="quick-stat__label">Subscribers</span>
          <span class="quick-stat__value">${totalSubscribers}</span>
          <span class="quick-stat__change quick-stat__change--up">
            <i data-lucide="trending-up"></i>
            24% from last month
          </span>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Grid -->
    <div class="dashboard-grid dashboard-grid--main">
      <!-- Traffic Chart -->
      <div class="widget">
        <div class="widget__header widget__header--traffic">
          <div>
            <h3 class="widget__title">Traffic Overview</h3>
            <p class="widget__subtitle">Page views and unique visitors</p>
          </div>
          <!-- Chart Range Tabs -->
          <nav class="chart-range" aria-label="Chart range" role="tablist">
            <button
              type="button"
              class="chart-range__item"
              id="chart-range-7d"
              aria-selected="false"
              data-hs-tab="#chart-panel-7d"
              aria-controls="chart-panel-7d"
              role="tab"
              hx-get="/admin/dashboard/traffic?range=7d"
              hx-target="#chart-panel-30d"
              hx-swap="outerHTML"
            >
              7 Days
            </button>
            <button
              type="button"
              class="chart-range__item active"
              id="chart-range-30d"
              aria-selected="true"
              data-hs-tab="#chart-panel-30d"
              aria-controls="chart-panel-30d"
              role="tab"
            >
              30 Days
            </button>
            <button
              type="button"
              class="chart-range__item"
              id="chart-range-90d"
              aria-selected="false"
              data-hs-tab="#chart-panel-90d"
              aria-controls="chart-panel-90d"
              role="tab"
              hx-get="/admin/dashboard/traffic?range=90d"
              hx-target="#chart-panel-30d"
              hx-swap="outerHTML"
            >
              90 Days
            </button>
            <button
              type="button"
              class="chart-range__item"
              id="chart-range-1y"
              aria-selected="false"
              data-hs-tab="#chart-panel-1y"
              aria-controls="chart-panel-1y"
              role="tab"
              hx-get="/admin/dashboard/traffic?range=1y"
              hx-target="#chart-panel-30d"
              hx-swap="outerHTML"
            >
              1 Year
            </button>
          </nav>
        </div>
        <hr class="divider" />
        <div class="widget__body">
          <!-- Chart Container -->
          <div id="chart-panel-30d" role="tabpanel" aria-labelledby="chart-range-30d">
            <div class="chart-container__chart">
              <div class="text-center text-gray-500 py-8">
                <i data-lucide="bar-chart-2" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
                <p>Traffic chart will be displayed here</p>
                <p class="text-sm">Connect to database to view analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="widget">
        <div class="widget__header">
          <h3 class="widget__title">Recent Activity</h3>
          <a href="#" class="widget__link">View all</a>
        </div>
        <hr class="divider" />
        <div class="widget__body">
          <div class="activity-timeline" id="activity-timeline">
            ${getActivityItems(activity)}
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Grid -->
    <div class="dashboard-grid dashboard-grid--equal">
      <!-- Recent Posts -->
      <div class="widget widget--flush">
        <div class="widget__header">
          <h3 class="widget__title">Recent Posts</h3>
          <div class="hs-dropdown [--placement:bottom-right]">
            <button id="hs-dropdown-add-post" type="button" class="hs-dropdown-toggle btn btn--md btn--ghost">
              Add New
              <i data-lucide="chevron-down" class="dropdown__chevron"></i>
            </button>
            <div
              class="hs-dropdown-menu dropdown__menu dropdown__menu--sm"
              role="menu"
              aria-labelledby="hs-dropdown-add-post"
            >
              <a class="dropdown__item" href="/admin/posts/new">
                <i data-lucide="file-edit"></i>
                New Post
              </a>
              <a class="dropdown__item" href="#">
                <i data-lucide="copy"></i>
                Duplicate Last
              </a>
              <a class="dropdown__item" href="#">
                <i data-lucide="upload"></i>
                Import
              </a>
            </div>
          </div>
        </div>
        <hr class="divider" />
        <div class="widget__body">
          <div class="recent-posts">
            ${getRecentPosts(recentPosts)}
          </div>
        </div>
      </div>

      <!-- Top Posts -->
      <div class="widget widget--flush">
        <div class="widget__header">
          <h3 class="widget__title">Top Posts</h3>
          <a href="#" class="widget__link">View all</a>
        </div>
        <hr class="divider" />
        <div class="widget__body">
          <div class="top-list">
            ${getTopPosts(topPosts)}
          </div>
        </div>
      </div>
    </div>
    </div>
  `;

  return mainLayout({
    title: 'Dashboard',
    description: 'BlogCMS Dashboard - Overview',
    content,
    user,
    activeRoute: '/admin/dashboard'
  });
}

// Helper function for activity items
function getActivityItems(items) {
  if (!items || items.length === 0) {
    return `
      <div class="text-center py-8 text-gray-500">
        <i data-lucide="activity" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
        <p>No recent activity</p>
      </div>
    `;
  }

  return items.map(item => `
    <div class="activity-timeline__item">
      <div class="activity-timeline__dot activity-timeline__dot--${item.type}">
        <i data-lucide="${item.icon}"></i>
      </div>
      <div class="activity-timeline__content">
        <p class="activity-timeline__text">${item.text}</p>
        <span class="activity-timeline__time">${item.time}</span>
      </div>
    </div>
  `).join('');
}

// Helper function for recent posts
function getRecentPosts(posts) {
  if (!posts || posts.length === 0) {
    return `
      <div class="text-center py-8 text-gray-500">
        <i data-lucide="file-text" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
        <p>No posts yet</p>
        <a href="/admin/posts/new" class="btn btn--primary btn--sm mt-4">Create your first post</a>
      </div>
    `;
  }

  return posts.map(post => `
    <div class="recent-posts__item">
      <div class="recent-posts__image">
        <img src="${post.thumbnail || 'https://picsum.photos/seed/post1/200/150'}" alt="${post.title}" />
      </div>
      <div class="recent-posts__content">
        <h4 class="recent-posts__title">${post.title}</h4>
        <div class="recent-posts__meta">
          <span>${post.author || 'Unknown'}</span>
          <span>•</span>
          <span>${post.date || 'No date'}</span>
        </div>
      </div>
      <span class="badge badge--${post.status === 'published' ? 'success' : 'warning'}">${post.status || 'Draft'}</span>
    </div>
  `).join('');
}

// Helper function for top posts
function getTopPosts(posts) {
  if (!posts || posts.length === 0) {
    return `
      <div class="text-center py-8 text-gray-500">
        <i data-lucide="trending-up" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
        <p>No top posts yet</p>
      </div>
    `;
  }

  return posts.map((post, index) => `
    <div class="top-list__item">
      <div class="top-list__left">
        <span class="top-list__rank top-list__rank--${index + 1}">${index + 1}</span>
        <div class="top-list__info">
          <p class="top-list__title">${post.title}</p>
          <span class="top-list__url">${post.url || '/blog/' + post.slug}</span>
        </div>
      </div>
      <div class="top-list__right">
        <span class="top-list__value">${post.views || 0}</span>
        <span class="top-list__change top-list__change--${post.trend === 'up' ? 'up' : 'down'}">
          <i data-lucide="${post.trend === 'up' ? 'trending-up' : 'trending-down'}"></i>
          ${post.change || 0}%
        </span>
      </div>
    </div>
  `).join('');
}
