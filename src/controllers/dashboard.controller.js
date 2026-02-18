// src/controllers/dashboard.controller.js
// Dashboard controller - handles dashboard HTTP requests

import { postsService } from '../services/posts.service.js';

/**
 * Dashboard Controller
 * Handles dashboard-related HTTP requests
 * Following Controller pattern - only handles HTTP layer
 */
class DashboardController {
  /**
   * GET /admin/dashboard
   * Serve dashboard page
   */
  async showDashboard(request, reply) {
    try {
      const user = request.user;

      // Get real dashboard statistics from database
      const totalPosts = await postsService.getPostsCount();
      const publishedPosts = await postsService.getPostsCount({ status: 'PUBLISHED' });
      const draftPosts = await postsService.getPostsCount({ status: 'DRAFT' });

      const stats = {
        totalPosts,
        totalViews: '0', // TODO: Implement analytics tracking
        totalComments: 0, // TODO: Implement comments service
        totalSubscribers: 0 // TODO: Implement subscribers service
      };

      // Get recent posts from database
      const recentPostsData = await postsService.getRecentPosts(3);
      const recentPosts = recentPostsData.map(post => ({
        title: post.title,
        author: post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown',
        date: post.publishedAt || post.createdAt,
        status: post.status.toLowerCase(),
        thumbnail: post.featuredImageUrl || 'https://picsum.photos/seed/post' + post.id + '/200/150'
      }));

      // Get top posts by view count
      const topPostsData = await postsService.getTopPosts(5);
      const topPosts = topPostsData.map(post => ({
        title: post.title,
        url: `/blog/${post.slug}`,
        views: post.viewCount,
        trend: 'up', // TODO: Calculate trend from analytics
        change: 0
      }));

      // Get recent activity (placeholder - TODO: implement activity service)
      const activity = [
        {
          type: 'post',
          icon: 'file-plus',
          text: '<strong>System</strong> initialized. Start creating your first post!',
          time: 'Just now'
        }
      ];

      // Import dashboard page template
      const { dashboardPage } = await import('../templates/admin/pages/index.js');

      // Render dashboard page
      return reply.type('text/html').send(dashboardPage({
        user,
        stats,
        activity,
        recentPosts,
        topPosts
      }));

    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load dashboard. Please try again.'
      }));
    }
  }

  /**
   * GET /admin/dashboard/stats
   * Get dashboard statistics (HTMX fragment)
   */
  async getStats(request, reply) {
    try {
      const stats = {
        totalPosts: 248,
        totalViews: '45.2K',
        totalComments: 1423,
        totalSubscribers: 8942
      };

      return reply.type('text/html').send(statsFragment(stats));

    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load statistics.'
      }));
    }
  }

  /**
   * GET /admin/dashboard/activity
   * Get recent activity feed (HTMX fragment)
   */
  async getActivity(request, reply) {
    try {
      const activity = [
        {
          type: 'post',
          icon: 'file-plus',
          text: '<strong>Jane Smith</strong> published a new post: <a href="#">"10 Tips for Better Writing"</a>',
          time: '2 hours ago'
        },
        {
          type: 'comment',
          icon: 'message-circle',
          text: 'New comment on <a href="#">"Getting Started with React"</a> by <strong>Mike Johnson</strong>',
          time: '4 hours ago'
        },
        {
          type: 'user',
          icon: 'user-plus',
          text: '<strong>Sarah Williams</strong> joined as a new subscriber',
          time: '6 hours ago'
        },
        {
          type: 'post',
          icon: 'edit',
          text: '<strong>You</strong> updated <a href="#">"Dashboard Design Best Practices"</a>',
          time: 'Yesterday'
        }
      ];

      return reply.type('text/html').send(activityFragment(activity));

    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load activity.'
      }));
    }
  }

  /**
   * GET /admin/dashboard/top-posts
   * Get top performing posts (HTMX fragment)
   */
  async getTopPosts(request, reply) {
    try {
      const topPosts = [
        {
          title: 'Getting Started with React Hooks',
          url: '/blog/react-hooks-guide',
          views: 12453,
          trend: 'up',
          change: 24
        },
        {
          title: 'CSS Flexbox Complete Guide',
          url: '/blog/css-flexbox',
          views: 9876,
          trend: 'up',
          change: 12
        },
        {
          title: 'TypeScript Best Practices',
          url: '/blog/typescript-tips',
          views: 7234,
          trend: 'down',
          change: 5
        },
        {
          title: 'Node.js API Development',
          url: '/blog/nodejs-api',
          views: 5432,
          trend: 'up',
          change: 8
        },
        {
          title: 'Database Optimization Tips',
          url: '/blog/db-optimization',
          views: 4567,
          trend: 'up',
          change: 15
        }
      ];

      return reply.type('text/html').send(topPostsFragment(topPosts));

    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load top posts.'
      }));
    }
  }

  /**
   * GET /admin/dashboard/traffic
   * Get traffic chart data (HTMX fragment)
   */
  async getTraffic(request, reply) {
    try {
      const { range = '30d' } = request.query;

      // Return chart container with appropriate message
      return reply.type('text/html').send(`
        <div class="chart-container__chart">
          <div class="text-center text-gray-500 py-8">
            <i data-lucide="bar-chart-2" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
            <p>Traffic chart for ${range}</p>
            <p class="text-sm">Connect to database to view analytics</p>
          </div>
        </div>
      `);

    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.type('text/html').send(errorFragment({
        message: 'Failed to load traffic data.'
      }));
    }
  }
}

// Helper function for error fragment
function errorFragment({ message }) {
  return `
    <div class="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800" role="alert">
      <i data-lucide="alert-circle" class="w-5 h-5 shrink-0"></i>
      <span class="text-sm font-medium">${message}</span>
    </div>
  `;
}

// Helper function for stats fragment (for HTMX refresh)
function statsFragment(stats) {
  return `
    <div class="quick-stats">
      <div class="quick-stat">
        <div class="quick-stat__icon quick-stat__icon--posts">
          <i data-lucide="file-text"></i>
        </div>
        <div class="quick-stat__content">
          <span class="quick-stat__label">Total Posts</span>
          <span class="quick-stat__value">${stats.totalPosts}</span>
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
          <span class="quick-stat__value">${stats.totalViews}</span>
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
          <span class="quick-stat__value">${stats.totalComments}</span>
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
          <span class="quick-stat__value">${stats.totalSubscribers}</span>
          <span class="quick-stat__change quick-stat__change--up">
            <i data-lucide="trending-up"></i>
            24% from last month
          </span>
        </div>
      </div>
    </div>
  `;
}

// Helper function for activity fragment
function activityFragment(items) {
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

// Helper function for top posts fragment
function topPostsFragment(posts) {
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
          <span class="top-list__url">${post.url}</span>
        </div>
      </div>
      <div class="top-list__right">
        <span class="top-list__value">${post.views}</span>
        <span class="top-list__change top-list__change--${post.trend}">
          <i data-lucide="${post.trend === 'up' ? 'trending-up' : 'trending-down'}"></i>
          ${post.change}%
        </span>
      </div>
    </div>
  `).join('');
}

// Export singleton
export const dashboardController = new DashboardController();
export default dashboardController;
