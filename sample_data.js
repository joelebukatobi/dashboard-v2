/**
 * Sample Data for Modern Blogging CMS Dashboard
 * This file contains mock data for demonstration purposes
 */

const SampleData = {
  // ========================================
  // USER DATA
  // ========================================
  currentUser: {
    id: 1,
    name: 'John Doe',
    email: 'john@blogcms.com',
    avatar: 'https://i.pravatar.cc/150?img=68',
    role: 'Administrator',
    permissions: ['all'],
    lastLogin: '2024-12-16T10:30:00Z',
    preferences: {
      theme: 'system',
      language: 'en',
      emailNotifications: true,
      timezone: 'America/New_York',
    },
  },

  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@blogcms.com',
      avatar: 'https://i.pravatar.cc/150?img=68',
      role: 'Administrator',
      status: 'active',
      postsCount: 45,
      joinedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@blogcms.com',
      avatar: 'https://i.pravatar.cc/150?img=47',
      role: 'Editor',
      status: 'active',
      postsCount: 78,
      joinedAt: '2024-02-20T00:00:00Z',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@blogcms.com',
      avatar: 'https://i.pravatar.cc/150?img=52',
      role: 'Author',
      status: 'active',
      postsCount: 32,
      joinedAt: '2024-03-10T00:00:00Z',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@blogcms.com',
      avatar: 'https://i.pravatar.cc/150?img=23',
      role: 'Contributor',
      status: 'active',
      postsCount: 15,
      joinedAt: '2024-04-05T00:00:00Z',
    },
    {
      id: 5,
      name: 'Alex Turner',
      email: 'alex@blogcms.com',
      avatar: 'https://i.pravatar.cc/150?img=33',
      role: 'Author',
      status: 'inactive',
      postsCount: 8,
      joinedAt: '2024-05-12T00:00:00Z',
    },
  ],

  roles: [
    { id: 'admin', name: 'Administrator', color: 'primary', permissions: ['all'] },
    { id: 'editor', name: 'Editor', color: 'info', permissions: ['posts.manage', 'media.manage', 'comments.manage'] },
    { id: 'author', name: 'Author', color: 'success', permissions: ['posts.create', 'posts.edit_own', 'media.upload'] },
    { id: 'contributor', name: 'Contributor', color: 'warning', permissions: ['posts.create_draft'] },
    { id: 'subscriber', name: 'Subscriber', color: 'secondary', permissions: ['posts.read', 'comments.create'] },
  ],

  // ========================================
  // POST DATA
  // ========================================
  posts: [
    {
      id: 1,
      title: '10 Tips for Better Technical Writing',
      slug: '10-tips-better-technical-writing',
      excerpt: 'Learn how to communicate complex technical concepts clearly and effectively.',
      content: '<p>Technical writing is an essential skill...</p>',
      featuredImage: 'https://picsum.photos/seed/post1/800/400',
      author: { id: 2, name: 'Jane Smith' },
      category: { id: 1, name: 'Writing' },
      tags: ['writing', 'tips', 'technical'],
      status: 'published',
      visibility: 'public',
      publishedAt: '2024-12-15T09:00:00Z',
      createdAt: '2024-12-14T15:30:00Z',
      updatedAt: '2024-12-15T09:00:00Z',
      views: 3245,
      comments: 12,
      likes: 89,
      seo: {
        metaTitle: '10 Tips for Better Technical Writing | BlogCMS',
        metaDescription: 'Master the art of technical writing with these 10 proven tips.',
        focusKeyword: 'technical writing tips',
      },
    },
    {
      id: 2,
      title: 'Understanding CSS Grid Layout',
      slug: 'understanding-css-grid-layout',
      excerpt: 'A comprehensive guide to CSS Grid for modern web layouts.',
      content: '<p>CSS Grid has revolutionized web layout...</p>',
      featuredImage: 'https://picsum.photos/seed/post2/800/400',
      author: { id: 1, name: 'John Doe' },
      category: { id: 2, name: 'CSS' },
      tags: ['css', 'grid', 'layout', 'web-design'],
      status: 'draft',
      visibility: 'public',
      publishedAt: null,
      createdAt: '2024-12-14T11:20:00Z',
      updatedAt: '2024-12-14T16:45:00Z',
      views: 0,
      comments: 0,
      likes: 0,
      seo: {
        metaTitle: '',
        metaDescription: '',
        focusKeyword: '',
      },
    },
    {
      id: 3,
      title: 'JavaScript Performance Optimization',
      slug: 'javascript-performance-optimization',
      excerpt: 'Best practices for writing fast and efficient JavaScript code.',
      content: '<p>Performance matters in web development...</p>',
      featuredImage: 'https://picsum.photos/seed/post3/800/400',
      author: { id: 3, name: 'Mike Johnson' },
      category: { id: 3, name: 'JavaScript' },
      tags: ['javascript', 'performance', 'optimization'],
      status: 'published',
      visibility: 'public',
      publishedAt: '2024-12-13T14:00:00Z',
      createdAt: '2024-12-12T10:15:00Z',
      updatedAt: '2024-12-13T14:00:00Z',
      views: 5678,
      comments: 28,
      likes: 145,
      seo: {
        metaTitle: 'JavaScript Performance Optimization Guide | BlogCMS',
        metaDescription: 'Learn how to optimize your JavaScript code for maximum performance.',
        focusKeyword: 'javascript performance',
      },
    },
    {
      id: 4,
      title: 'Building Accessible Web Applications',
      slug: 'building-accessible-web-applications',
      excerpt: 'How to create web applications that everyone can use.',
      content: '<p>Web accessibility is not optional...</p>',
      featuredImage: 'https://picsum.photos/seed/post4/800/400',
      author: { id: 4, name: 'Sarah Williams' },
      category: { id: 4, name: 'Accessibility' },
      tags: ['accessibility', 'a11y', 'web-development'],
      status: 'published',
      visibility: 'public',
      publishedAt: '2024-12-12T10:00:00Z',
      createdAt: '2024-12-11T09:30:00Z',
      updatedAt: '2024-12-12T10:00:00Z',
      views: 2345,
      comments: 15,
      likes: 67,
      seo: {
        metaTitle: 'Building Accessible Web Applications | BlogCMS',
        metaDescription: 'A complete guide to web accessibility and inclusive design.',
        focusKeyword: 'web accessibility',
      },
    },
    {
      id: 5,
      title: 'Getting Started with React Hooks',
      slug: 'getting-started-react-hooks',
      excerpt: 'Everything you need to know about React Hooks.',
      content: '<p>React Hooks changed how we write components...</p>',
      featuredImage: 'https://picsum.photos/seed/post5/800/400',
      author: { id: 2, name: 'Jane Smith' },
      category: { id: 5, name: 'React' },
      tags: ['react', 'hooks', 'javascript', 'frontend'],
      status: 'published',
      visibility: 'public',
      publishedAt: '2024-12-10T08:00:00Z',
      createdAt: '2024-12-09T14:20:00Z',
      updatedAt: '2024-12-10T08:00:00Z',
      views: 12453,
      comments: 45,
      likes: 234,
      seo: {
        metaTitle: 'Getting Started with React Hooks - Complete Guide | BlogCMS',
        metaDescription: 'Learn React Hooks from scratch with practical examples.',
        focusKeyword: 'react hooks',
      },
    },
    {
      id: 6,
      title: 'The Future of Web Development in 2025',
      slug: 'future-web-development-2025',
      excerpt: 'Predictions and trends for web development in the coming year.',
      content: '<p>The web development landscape continues to evolve...</p>',
      featuredImage: 'https://picsum.photos/seed/post6/800/400',
      author: { id: 1, name: 'John Doe' },
      category: { id: 6, name: 'Industry' },
      tags: ['trends', '2025', 'web-development', 'predictions'],
      status: 'scheduled',
      visibility: 'public',
      publishedAt: '2024-12-20T09:00:00Z',
      createdAt: '2024-12-15T16:00:00Z',
      updatedAt: '2024-12-15T16:00:00Z',
      views: 0,
      comments: 0,
      likes: 0,
      seo: {
        metaTitle: 'Web Development Trends 2025 | BlogCMS',
        metaDescription: 'Discover the top web development trends and predictions for 2025.',
        focusKeyword: 'web development 2025',
      },
    },
  ],

  categories: [
    { id: 1, name: 'Writing', slug: 'writing', count: 15, color: '#6366f1' },
    { id: 2, name: 'CSS', slug: 'css', count: 28, color: '#ec4899' },
    { id: 3, name: 'JavaScript', slug: 'javascript', count: 45, color: '#f59e0b' },
    { id: 4, name: 'Accessibility', slug: 'accessibility', count: 12, color: '#10b981' },
    { id: 5, name: 'React', slug: 'react', count: 34, color: '#3b82f6' },
    { id: 6, name: 'Industry', slug: 'industry', count: 18, color: '#8b5cf6' },
  ],

  tags: [
    { id: 1, name: 'javascript', count: 67 },
    { id: 2, name: 'css', count: 45 },
    { id: 3, name: 'react', count: 38 },
    { id: 4, name: 'web-development', count: 52 },
    { id: 5, name: 'performance', count: 23 },
    { id: 6, name: 'accessibility', count: 18 },
    { id: 7, name: 'tips', count: 31 },
    { id: 8, name: 'tutorial', count: 42 },
  ],

  // ========================================
  // COMMENT DATA
  // ========================================
  comments: [
    {
      id: 1,
      postId: 5,
      postTitle: 'Getting Started with React Hooks',
      author: { name: 'Alex Chen', email: 'alex@example.com', avatar: 'https://i.pravatar.cc/150?img=11' },
      content: 'This is exactly what I needed! The examples are very clear and practical.',
      status: 'approved',
      createdAt: '2024-12-15T14:30:00Z',
      likes: 12,
      replies: 2,
    },
    {
      id: 2,
      postId: 5,
      postTitle: 'Getting Started with React Hooks',
      author: { name: 'Maria Garcia', email: 'maria@example.com', avatar: 'https://i.pravatar.cc/150?img=25' },
      content: 'Could you also cover useReducer in more detail? Great article overall!',
      status: 'approved',
      createdAt: '2024-12-15T16:45:00Z',
      likes: 8,
      replies: 1,
    },
    {
      id: 3,
      postId: 3,
      postTitle: 'JavaScript Performance Optimization',
      author: { name: 'Tom Wilson', email: 'tom@example.com', avatar: 'https://i.pravatar.cc/150?img=12' },
      content: 'The section on memoization was really helpful. Implementing this in my project now.',
      status: 'approved',
      createdAt: '2024-12-14T09:15:00Z',
      likes: 5,
      replies: 0,
    },
    {
      id: 4,
      postId: 1,
      postTitle: '10 Tips for Better Technical Writing',
      author: { name: 'SpamBot3000', email: 'spam@spam.com', avatar: null },
      content: 'Great article! Check out my website for free stuff at...',
      status: 'pending',
      createdAt: '2024-12-15T22:10:00Z',
      likes: 0,
      replies: 0,
    },
    {
      id: 5,
      postId: 4,
      postTitle: 'Building Accessible Web Applications',
      author: { name: 'Lisa Anderson', email: 'lisa@example.com', avatar: 'https://i.pravatar.cc/150?img=32' },
      content: 'As someone with visual impairments, I really appreciate articles like this. Thank you!',
      status: 'approved',
      createdAt: '2024-12-13T11:00:00Z',
      likes: 24,
      replies: 3,
    },
  ],

  // ========================================
  // MEDIA DATA
  // ========================================
  mediaItems: [
    {
      id: 1,
      name: 'hero-image.jpg',
      type: 'image/jpeg',
      size: 245678,
      dimensions: { width: 1920, height: 1080 },
      url: 'https://picsum.photos/seed/media1/1920/1080',
      thumbnail: 'https://picsum.photos/seed/media1/300/200',
      uploadedBy: { id: 1, name: 'John Doe' },
      uploadedAt: '2024-12-15T10:30:00Z',
      folder: 'images',
      alt: 'Hero section background',
      usedIn: 3,
    },
    {
      id: 2,
      name: 'profile-photo.png',
      type: 'image/png',
      size: 89234,
      dimensions: { width: 400, height: 400 },
      url: 'https://picsum.photos/seed/media2/400/400',
      thumbnail: 'https://picsum.photos/seed/media2/300/300',
      uploadedBy: { id: 2, name: 'Jane Smith' },
      uploadedAt: '2024-12-14T15:45:00Z',
      folder: 'avatars',
      alt: 'Team member profile photo',
      usedIn: 1,
    },
    {
      id: 3,
      name: 'product-demo.mp4',
      type: 'video/mp4',
      size: 15234567,
      duration: 125,
      url: '/media/videos/product-demo.mp4',
      thumbnail: 'https://picsum.photos/seed/media3/300/200',
      uploadedBy: { id: 3, name: 'Mike Johnson' },
      uploadedAt: '2024-12-13T09:20:00Z',
      folder: 'videos',
      alt: 'Product demonstration video',
      usedIn: 2,
    },
    {
      id: 4,
      name: 'whitepaper.pdf',
      type: 'application/pdf',
      size: 2345678,
      pages: 24,
      url: '/media/documents/whitepaper.pdf',
      thumbnail: null,
      uploadedBy: { id: 1, name: 'John Doe' },
      uploadedAt: '2024-12-12T14:00:00Z',
      folder: 'documents',
      alt: 'Company whitepaper',
      usedIn: 5,
    },
    {
      id: 5,
      name: 'blog-thumbnail.webp',
      type: 'image/webp',
      size: 45678,
      dimensions: { width: 800, height: 600 },
      url: 'https://picsum.photos/seed/media5/800/600',
      thumbnail: 'https://picsum.photos/seed/media5/300/200',
      uploadedBy: { id: 4, name: 'Sarah Williams' },
      uploadedAt: '2024-12-11T11:30:00Z',
      folder: 'images',
      alt: 'Blog post featured image',
      usedIn: 1,
    },
  ],

  mediaFolders: [
    { id: 1, name: 'images', count: 145, size: 234567890 },
    { id: 2, name: 'videos', count: 23, size: 567890123 },
    { id: 3, name: 'documents', count: 56, size: 89012345 },
    { id: 4, name: 'avatars', count: 34, size: 12345678 },
  ],

  // ========================================
  // ANALYTICS DATA
  // ========================================
  analytics: {
    overview: {
      totalViews: 45234,
      uniqueVisitors: 28456,
      avgSessionDuration: '4:32',
      bounceRate: 42.3,
      pageViewsChange: 12.5,
      visitorsChange: 8.3,
      sessionChange: -2.1,
      bounceChange: -5.7,
    },

    trafficByDay: [
      { date: '2024-12-10', views: 4523, visitors: 2845 },
      { date: '2024-12-11', views: 5234, visitors: 3126 },
      { date: '2024-12-12', views: 4867, visitors: 2934 },
      { date: '2024-12-13', views: 6234, visitors: 3845 },
      { date: '2024-12-14', views: 7123, visitors: 4234 },
      { date: '2024-12-15', views: 8456, visitors: 5123 },
      { date: '2024-12-16', views: 8797, visitors: 5349 },
    ],

    topPages: [
      { path: '/blog/react-hooks-guide', title: 'Getting Started with React Hooks', views: 12453, change: 24 },
      { path: '/blog/css-flexbox', title: 'CSS Flexbox Complete Guide', views: 9876, change: 12 },
      { path: '/blog/typescript-tips', title: 'TypeScript Best Practices', views: 7234, change: -5 },
      { path: '/blog/nodejs-api', title: 'Node.js API Development', views: 5432, change: 8 },
      { path: '/blog/db-optimization', title: 'Database Optimization Tips', views: 4567, change: 15 },
    ],

    trafficSources: [
      { source: 'Organic Search', visitors: 12456, percentage: 43.8 },
      { source: 'Direct', visitors: 8234, percentage: 28.9 },
      { source: 'Social Media', visitors: 4567, percentage: 16.0 },
      { source: 'Referral', visitors: 2345, percentage: 8.2 },
      { source: 'Email', visitors: 854, percentage: 3.0 },
    ],

    deviceBreakdown: [
      { device: 'Desktop', sessions: 15678, percentage: 55.1 },
      { device: 'Mobile', sessions: 10234, percentage: 35.9 },
      { device: 'Tablet', sessions: 2544, percentage: 8.9 },
    ],

    browserBreakdown: [
      { browser: 'Chrome', sessions: 14567, percentage: 51.2 },
      { browser: 'Safari', sessions: 7234, percentage: 25.4 },
      { browser: 'Firefox', sessions: 3456, percentage: 12.1 },
      { browser: 'Edge', sessions: 2345, percentage: 8.2 },
      { browser: 'Other', sessions: 854, percentage: 3.0 },
    ],

    geographicData: [
      { country: 'United States', visitors: 12456, percentage: 43.8 },
      { country: 'United Kingdom', visitors: 4567, percentage: 16.0 },
      { country: 'Germany', visitors: 3234, percentage: 11.4 },
      { country: 'Canada', visitors: 2456, percentage: 8.6 },
      { country: 'Australia', visitors: 1890, percentage: 6.6 },
      { country: 'Other', visitors: 3853, percentage: 13.5 },
    ],
  },

  // ========================================
  // ACTIVITY / NOTIFICATIONS
  // ========================================
  activities: [
    {
      id: 1,
      type: 'post_published',
      icon: 'file-plus',
      user: { id: 2, name: 'Jane Smith' },
      target: { type: 'post', title: '10 Tips for Better Writing' },
      timestamp: '2024-12-16T08:30:00Z',
    },
    {
      id: 2,
      type: 'comment_received',
      icon: 'message-circle',
      user: { id: null, name: 'Mike Johnson' },
      target: { type: 'post', title: 'Getting Started with React' },
      timestamp: '2024-12-16T06:15:00Z',
    },
    {
      id: 3,
      type: 'user_joined',
      icon: 'user-plus',
      user: { id: 5, name: 'Sarah Williams' },
      target: { type: 'subscriber' },
      timestamp: '2024-12-16T04:00:00Z',
    },
    {
      id: 4,
      type: 'post_updated',
      icon: 'edit',
      user: { id: 1, name: 'You' },
      target: { type: 'post', title: 'Dashboard Design Best Practices' },
      timestamp: '2024-12-15T18:45:00Z',
    },
    {
      id: 5,
      type: 'milestone',
      icon: 'trophy',
      user: null,
      target: { type: 'achievement', title: '10,000 subscribers reached!' },
      timestamp: '2024-12-15T12:00:00Z',
    },
  ],

  notifications: [
    {
      id: 1,
      type: 'comment',
      title: 'New comment on your post',
      message: 'Alex Chen commented on "React Hooks Guide"',
      read: false,
      timestamp: '2024-12-16T10:15:00Z',
    },
    {
      id: 2,
      type: 'mention',
      title: 'You were mentioned',
      message: 'Jane Smith mentioned you in a comment',
      read: false,
      timestamp: '2024-12-16T09:30:00Z',
    },
    {
      id: 3,
      type: 'system',
      title: 'Scheduled post published',
      message: '"Web Dev Trends 2025" has been published',
      read: true,
      timestamp: '2024-12-16T09:00:00Z',
    },
  ],

  // ========================================
  // SETTINGS DATA
  // ========================================
  settings: {
    general: {
      siteName: 'BlogCMS',
      tagline: 'A Modern Blogging Platform',
      siteUrl: 'https://blogcms.example.com',
      language: 'en',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
    },

    branding: {
      logo: '/assets/logo.svg',
      favicon: '/assets/favicon.svg',
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
    },

    seo: {
      metaTitle: 'BlogCMS - Modern Blogging Platform',
      metaDescription: 'Create and manage your blog with our powerful CMS platform.',
      socialImage: '/assets/social-share.jpg',
      googleAnalyticsId: 'G-XXXXXXXXXX',
      enableSitemap: true,
      enableRobotsTxt: true,
    },

    email: {
      fromName: 'BlogCMS',
      fromEmail: 'noreply@blogcms.example.com',
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      smtpSecure: true,
    },

    comments: {
      enabled: true,
      moderation: 'manual',
      allowGuests: true,
      requireApproval: true,
      enableSpamFilter: true,
      nestingLevel: 3,
    },

    integrations: [
      { id: 'google-analytics', name: 'Google Analytics', connected: true, icon: 'bar-chart' },
      { id: 'mailchimp', name: 'Mailchimp', connected: true, icon: 'mail' },
      { id: 'slack', name: 'Slack', connected: false, icon: 'message-square' },
      { id: 'github', name: 'GitHub', connected: true, icon: 'github' },
      { id: 'cloudinary', name: 'Cloudinary', connected: false, icon: 'cloud' },
    ],
  },

  // ========================================
  // DASHBOARD STATS
  // ========================================
  dashboardStats: {
    totalPosts: 248,
    totalViews: 45234,
    totalComments: 1423,
    totalSubscribers: 8942,
    postsChange: 12,
    viewsChange: 8,
    commentsChange: -3,
    subscribersChange: 24,
    scheduledPosts: 5,
    draftPosts: 12,
    pendingComments: 5,
  },
};

// Helper functions for working with the data
const DataHelpers = {
  /**
   * Format a date string to a human-readable format
   */
  formatDate(dateString, format = 'short') {
    const date = new Date(dateString);
    const options = {
      short: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
      time: { hour: 'numeric', minute: '2-digit', hour12: true },
    };
    return date.toLocaleDateString('en-US', options[format] || options.short);
  },

  /**
   * Get relative time string (e.g., "2 hours ago")
   */
  getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return this.formatDate(dateString);
  },

  /**
   * Format file size to human-readable format
   */
  formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let size = bytes;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  },

  /**
   * Format number with abbreviation (e.g., 1.2K, 3.4M)
   */
  formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  },

  /**
   * Get posts by status
   */
  getPostsByStatus(status) {
    return SampleData.posts.filter((post) => post.status === status);
  },

  /**
   * Get comments by status
   */
  getCommentsByStatus(status) {
    return SampleData.comments.filter((comment) => comment.status === status);
  },

  /**
   * Get unread notifications count
   */
  getUnreadNotificationsCount() {
    return SampleData.notifications.filter((n) => !n.read).length;
  },

  /**
   * Search posts by title or content
   */
  searchPosts(query) {
    const lowerQuery = query.toLowerCase();
    return SampleData.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SampleData, DataHelpers };
}
