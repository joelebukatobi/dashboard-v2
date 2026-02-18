// scripts/seed.js
// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure dotenv BEFORE importing anything that uses env vars
config({ path: join(__dirname, '..', '.env.development') });

// Now import modules that depend on environment variables
import { db, users, categories, tags, settings, posts } from '../src/db/index.js';
import { eq } from 'drizzle-orm';
import { hash } from 'bcrypt';

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await hash('admin123', 10);
    const [adminUser] = await db.insert(users).values({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    }).onConflictDoNothing().returning();
    
    // Get admin user ID (either newly created or existing)
    let adminId;
    if (adminUser) {
      adminId = adminUser.id;
    } else {
      const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin@example.com')).limit(1);
      adminId = existingAdmin[0]?.id;
    }
    console.log('✅ Admin user created\n');

    // Create default categories with auto-assigned colors
    console.log('Creating default categories...');
    const categoryColors = [
      'badge--primary',
      'badge--purple',
      'badge--info',
      'badge--warning',
      'badge--success',
      'badge--danger',
      'badge--pink',
      'badge--neutral'
    ];
    
    await db.insert(categories).values([
      { title: 'Development', slug: 'development', description: 'Software development articles', status: 'PUBLISHED', colorClass: categoryColors[0] },
      { title: 'Design', slug: 'design', description: 'UI/UX and graphic design', status: 'PUBLISHED', colorClass: categoryColors[1] },
      { title: 'CSS', slug: 'css', description: 'CSS tutorials and tips', status: 'PUBLISHED', colorClass: categoryColors[2] },
      { title: 'JavaScript', slug: 'javascript', description: 'JavaScript and Node.js', status: 'PUBLISHED', colorClass: categoryColors[3] },
      { title: 'Tutorials', slug: 'tutorials', description: 'Step-by-step guides', status: 'PUBLISHED', colorClass: categoryColors[4] },
      { title: 'News', slug: 'news', description: 'Latest updates and announcements', status: 'PUBLISHED', colorClass: categoryColors[5] },
    ]).onConflictDoNothing();
    console.log('✅ Default categories created\n');

    // Create default tags
    console.log('Creating default tags...');
    await db.insert(tags).values([
      { name: 'Tutorial', slug: 'tutorial', description: 'How-to guides' },
      { name: 'Best Practices', slug: 'best-practices', description: 'Recommended approaches' },
      { name: 'Tips & Tricks', slug: 'tips-tricks', description: 'Quick helpful tips' },
      { name: 'Beginner', slug: 'beginner', description: 'For beginners' },
      { name: 'Advanced', slug: 'advanced', description: 'Advanced topics' },
      { name: 'Performance', slug: 'performance', description: 'Performance optimization' },
      { name: 'Security', slug: 'security', description: 'Security topics' },
      { name: 'Tools', slug: 'tools', description: 'Development tools' },
    ]).onConflictDoNothing();
    console.log('✅ Default tags created\n');

    // Create default settings
    console.log('Creating default settings...');
    await db.insert(settings).values([
      { key: 'siteName', value: 'My Blog', group: 'GENERAL', type: 'STRING' },
      { key: 'siteTagline', value: 'A modern blog built with Fastify', group: 'GENERAL', type: 'STRING' },
      { key: 'siteUrl', value: 'http://localhost:3000', group: 'GENERAL', type: 'STRING' },
      { key: 'timezone', value: 'UTC', group: 'GENERAL', type: 'STRING' },
      { key: 'dateFormat', value: 'MM/DD/YYYY', group: 'GENERAL', type: 'STRING' },
      { key: 'language', value: 'en', group: 'GENERAL', type: 'STRING' },
      { key: 'postsPerPage', value: '10', group: 'CONTENT', type: 'NUMBER' },
      { key: 'defaultPostStatus', value: 'DRAFT', group: 'CONTENT', type: 'STRING' },
      { key: 'maxUploadSize', value: '10', group: 'CONTENT', type: 'NUMBER' },
      { key: 'require2FA', value: 'false', group: 'SECURITY', type: 'BOOLEAN' },
      { key: 'passwordMinLength', value: '8', group: 'SECURITY', type: 'NUMBER' },
      { key: 'sessionTimeout', value: '60', group: 'SECURITY', type: 'NUMBER' },
    ]).onConflictDoNothing();
    console.log('✅ Default settings created\n');

    // Fetch category IDs (UUIDs) after they're created
    console.log('Fetching category IDs...');
    const allCategories = await db.select({ id: categories.id, slug: categories.slug }).from(categories);
    const getCategoryId = (slug) => allCategories.find(c => c.slug === slug)?.id;
    
    const jsCategoryId = getCategoryId('javascript');
    const cssCategoryId = getCategoryId('css');
    const devCategoryId = getCategoryId('development');
    const designCategoryId = getCategoryId('design');
    
    // Create demo posts
    console.log('Creating demo posts...');
    await db.insert(posts).values([
      {
        title: 'Getting Started with React Hooks',
        slug: 'getting-started-with-react-hooks',
        content: '<p>React Hooks have revolutionized how we write React components. In this comprehensive guide, we will explore the most commonly used hooks and how to leverage them in your applications.</p><h2>What are Hooks?</h2><p>Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and have since become the standard way to write React components.</p><h2>useState and useEffect</h2><p>The useState hook allows you to add state to functional components. The useEffect hook lets you perform side effects. Together, they provide powerful capabilities for functional components.</p><p>By mastering these hooks, you will be able to write cleaner, more maintainable React code.</p>',
        excerpt: 'Learn how to use React Hooks to write cleaner, more maintainable components.',
        status: 'PUBLISHED',
        authorId: adminId,
        categoryId: jsCategoryId,
        viewCount: 12453,
        publishedAt: new Date('2024-01-15'),
      },
      {
        title: 'CSS Grid Layout: A Complete Guide',
        slug: 'css-grid-layout-complete-guide',
        content: '<p>CSS Grid Layout is a two-dimensional layout system for the web. It lets you lay out items in rows and columns, and has many features that make building complex layouts straightforward.</p><h2>Basic Grid Setup</h2><p>To create a grid container, you simply set the display property to grid and define your columns and rows.</p><h2>Grid Template Areas</h2><p>One of the most powerful features of CSS Grid is the ability to name grid areas and place items by name.</p><h2>Responsive Grids</h2><p>CSS Grid makes responsive design incredibly easy. You can use the minmax() function and auto-fit keyword to create grids that adapt to any screen size.</p>',
        excerpt: 'Master CSS Grid Layout with this comprehensive guide covering everything from basics to advanced techniques.',
        status: 'PUBLISHED',
        authorId: adminId,
        categoryId: cssCategoryId,
        viewCount: 9876,
        publishedAt: new Date('2024-01-10'),
      },
      {
        title: 'Building Scalable APIs with Fastify',
        slug: 'building-scalable-apis-fastify',
        content: '<p>Fastify is a high-performance web framework for Node.js. It is designed to be developer-friendly while maintaining excellent performance characteristics.</p><h2>Why Fastify?</h2><p>Fastify offers several advantages over other Node.js frameworks including exceptional performance, schema-based validation, plugin architecture, and better developer experience.</p><h2>Getting Started</h2><p>Creating a basic Fastify server is simple. You can set up routes, add plugins, and organize your code in a modular way.</p><h2>Route Prefixing</h2><p>Fastify makes it easy to organize your routes with prefixes, creating a modular architecture that scales well as your application grows.</p>',
        excerpt: 'Learn how to build high-performance APIs using Fastify with this comprehensive guide.',
        status: 'PUBLISHED',
        authorId: adminId,
        categoryId: devCategoryId,
        viewCount: 7234,
        publishedAt: new Date('2024-01-05'),
      },
      {
        title: 'Advanced TypeScript Patterns',
        slug: 'advanced-typescript-patterns',
        content: '<p>TypeScript provides powerful type system features that can significantly improve code quality and developer productivity when used correctly.</p><h2>Conditional Types</h2><p>Conditional types allow you to create types that depend on other types, enabling powerful type-level programming.</p><h2>Template Literal Types</h2><p>Template literal types enable you to create types from string literals, opening up new possibilities for type-safe string manipulation.</p><h2>Type Guards</h2><p>Type guards help TypeScript understand type narrowing, allowing you to write more precise and safe code.</p>',
        excerpt: 'Explore advanced TypeScript patterns to write more maintainable and type-safe code.',
        status: 'DRAFT',
        authorId: adminId,
        categoryId: jsCategoryId,
        viewCount: 0,
        publishedAt: null,
      },
      {
        title: 'UI Design Principles for Developers',
        slug: 'ui-design-principles-developers',
        content: '<p>Good UI design is not just for designers. As a developer, understanding basic design principles can help you create better user experiences.</p><h2>Hierarchy</h2><p>Visual hierarchy guides users through your interface. Use size, color, and spacing to establish importance.</p><h2>Consistency</h2><p>Maintain consistency in colors, typography, spacing, layout, and interaction patterns throughout your application.</p><h2>White Space</h2><p>Do not be afraid of empty space. White space helps content breathe and improves readability significantly.</p><p>By following these principles, you can create interfaces that are both functional and aesthetically pleasing.</p>',
        excerpt: 'Learn essential UI design principles that every developer should know.',
        status: 'PUBLISHED',
        authorId: adminId,
        categoryId: designCategoryId,
        viewCount: 5432,
        publishedAt: new Date('2024-01-03'),
      },
      {
        title: 'Mastering Flexbox for Modern Layouts',
        slug: 'mastering-flexbox-modern-layouts',
        content: '<p>Flexbox is a powerful layout system that simplifies the creation of flexible and responsive layouts. It is especially useful for one-dimensional layouts.</p><h2>Understanding Flex Container</h2><p>A flex container expands items to fill available free space or shrinks them to prevent overflow. This makes it perfect for component-level layouts.</p><h2>Common Use Cases</h2><p>Flexbox excels at centering elements, creating navigation bars, card layouts, and form alignments. Once you understand the basics, you will use it everywhere.</p>',
        excerpt: 'Master Flexbox to create flexible and responsive one-dimensional layouts with ease.',
        status: 'PUBLISHED',
        authorId: adminId,
        categoryId: cssCategoryId,
        viewCount: 8765,
        publishedAt: new Date('2024-01-20'),
      },
      {
        title: 'Docker for Beginners: Containerization Basics',
        slug: 'docker-beginners-containerization-basics',
        content: '<p>Docker has revolutionized how we deploy applications. Understanding containerization is essential for modern development workflows.</p><h2>What is Containerization?</h2><p>Containers package your application with all its dependencies, ensuring consistency across different environments.</p><h2>Docker Basics</h2><p>Learn to write Dockerfiles, build images, and run containers. Docker makes it easy to share your development environment with your team.</p>',
        excerpt: 'Get started with Docker and learn the fundamentals of containerization.',
        status: 'PUBLISHED',
        authorId: adminId,
        categoryId: devCategoryId,
        viewCount: 6543,
        publishedAt: new Date('2024-01-18'),
      },
      {
        title: 'Introduction to PostgreSQL',
        slug: 'introduction-to-postgresql',
        content: '<p>PostgreSQL is a powerful, open-source relational database system. It has a strong reputation for reliability, feature robustness, and performance.</p><h2>Why PostgreSQL?</h2><p>PostgreSQL offers advanced features like JSON support, full-text search, and complex queries that make it suitable for modern applications.</p><h2>Getting Started</h2><p>Learn the basics of creating databases, tables, and performing CRUD operations. PostgreSQL is a great choice for any application.</p>',
        excerpt: 'Learn the fundamentals of PostgreSQL, a powerful open-source relational database.',
        status: 'PUBLISHED',
        authorId: adminId,
        categoryId: devCategoryId,
        viewCount: 7890,
        publishedAt: new Date('2024-01-12'),
      },
      {
        title: 'Web Security Best Practices',
        slug: 'web-security-best-practices',
        content: '<p>Security should never be an afterthought. Implementing security best practices from the start can save you from major headaches later.</p><h2>Common Vulnerabilities</h2><p>Learn about XSS, CSRF, SQL injection, and other common attacks. Understanding these threats is the first step to preventing them.</p><h2>Security Headers</h2><p>HTTP security headers like CSP, HSTS, and X-Frame-Options add an extra layer of protection to your applications.</p>',
        excerpt: 'Protect your web applications by implementing essential security best practices.',
        status: 'PUBLISHED',
        authorId: adminId,
        categoryId: devCategoryId,
        viewCount: 4321,
        publishedAt: new Date('2024-01-08'),
      },
      {
        title: 'Async/Await in JavaScript',
        slug: 'async-await-javascript',
        content: '<p>Async/await has made asynchronous programming in JavaScript much more readable and maintainable. It builds on top of Promises to provide syntactic sugar.</p><h2>Understanding Promises</h2><p>Before diving into async/await, it is important to understand Promises. They form the foundation of modern asynchronous JavaScript.</p><h2>Error Handling</h2><p>Proper error handling with try/catch blocks makes async code much easier to debug and maintain compared to traditional callbacks.</p>',
        excerpt: 'Simplify asynchronous JavaScript code with async/await syntax.',
        status: 'DRAFT',
        authorId: adminId,
        categoryId: jsCategoryId,
        viewCount: 0,
        publishedAt: null,
      },
      {
        title: 'Responsive Design Patterns',
        slug: 'responsive-design-patterns',
        content: '<p>Creating websites that work well on all devices is essential. Responsive design ensures your content looks great from mobile phones to desktop monitors.</p><h2>Mobile-First Approach</h2><p>Starting with mobile styles and progressively enhancing for larger screens creates a solid foundation for responsive designs.</p><h2>Media Queries</h2><p>Media queries allow you to apply different styles based on device characteristics. Learn when and how to use them effectively.</p>',
        excerpt: 'Learn responsive design patterns to create websites that work on any device.',
        status: 'PUBLISHED',
        authorId: adminId,
        categoryId: designCategoryId,
        viewCount: 6789,
        publishedAt: new Date('2024-01-25'),
      },
      {
        title: 'Git Workflow Strategies',
        slug: 'git-workflow-strategies',
        content: '<p>Choosing the right Git workflow can improve team collaboration and code quality. Different projects require different approaches.</p><h2>Git Flow</h2><p>Git Flow is a robust workflow with dedicated branches for features, releases, and hotfixes. It works well for scheduled release cycles.</p><h2>GitHub Flow</h2><p>For continuous deployment, GitHub Flow offers a simpler alternative with just main and feature branches.</p>',
        excerpt: 'Explore different Git workflows to find the best strategy for your team.',
        status: 'PUBLISHED',
        authorId: adminId,
        categoryId: devCategoryId,
        viewCount: 5678,
        publishedAt: new Date('2024-01-22'),
      },
      {
        title: 'Node.js Performance Optimization',
        slug: 'nodejs-performance-optimization',
        content: '<p>Performance optimization is crucial for Node.js applications. Learn techniques to make your apps faster and more efficient.</p><h2>Profiling and Monitoring</h2><p>Before optimizing, you need to identify bottlenecks. Tools like Clinic.js and Node.js built-in profiler can help.</p><h2>Caching Strategies</h2><p>Implementing proper caching can dramatically improve response times. Learn about Redis, in-memory caching, and CDN strategies.</p>',
        excerpt: 'Optimize your Node.js applications for better performance and scalability.',
        status: 'DRAFT',
        authorId: adminId,
        categoryId: devCategoryId,
        viewCount: 0,
        publishedAt: null,
      },
      {
        title: 'Color Theory for Web Designers',
        slug: 'color-theory-web-designers',
        content: '<p>Color plays a vital role in web design. Understanding color theory helps create visually appealing and effective interfaces.</p><h2>Color Harmonies</h2><p>Learn about complementary, analogous, and triadic color schemes. These fundamental concepts help create balanced color palettes.</p><h2>Accessibility Considerations</h2><p>Ensure your color choices meet WCAG contrast requirements. Good color contrast is essential for users with visual impairments.</p>',
        excerpt: 'Master color theory to create beautiful and accessible web designs.',
        status: 'PUBLISHED',
        authorId: adminId,
        categoryId: designCategoryId,
        viewCount: 3456,
        publishedAt: new Date('2024-01-28'),
      },
      {
        title: 'REST API Design Guidelines',
        slug: 'rest-api-design-guidelines',
        content: '<p>Designing good APIs requires careful planning. Well-designed APIs are intuitive, consistent, and easy to use.</p><h2>Resource Naming</h2><p>Use nouns for resources and plural forms consistently. Good naming makes your API self-documenting.</p><h2>HTTP Methods</h2><p>Follow REST conventions for HTTP methods. GET for retrieval, POST for creation, PUT/PATCH for updates, DELETE for removal.</p>',
        excerpt: 'Learn best practices for designing clean and intuitive REST APIs.',
        status: 'PUBLISHED',
        authorId: adminId,
        categoryId: devCategoryId,
        viewCount: 7891,
        publishedAt: new Date('2024-01-30'),
      },
    ]).onConflictDoNothing();
    console.log('✅ 15 demo posts created\n');

    console.log('🎉 Database seeding completed!');
    console.log('\nDefault admin credentials:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');
    console.log('\nDemo posts created: 15');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
