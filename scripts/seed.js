// scripts/seed.js
import { db, users, categories, tags, settings } from '../src/db/index.js';
import { hash } from 'bcrypt';
import { config } from 'dotenv';

config({ path: '.env.development' });

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = await hash('admin123', 10);
    await db.insert(users).values({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    }).onConflictDoNothing();
    console.log('✅ Admin user created\n');

    // Create default categories
    console.log('Creating default categories...');
    await db.insert(categories).values([
      { title: 'Development', slug: 'development', description: 'Software development articles', status: 'PUBLISHED' },
      { title: 'Design', slug: 'design', description: 'UI/UX and graphic design', status: 'PUBLISHED' },
      { title: 'CSS', slug: 'css', description: 'CSS tutorials and tips', status: 'PUBLISHED' },
      { title: 'JavaScript', slug: 'javascript', description: 'JavaScript and Node.js', status: 'PUBLISHED' },
      { title: 'Tutorials', slug: 'tutorials', description: 'Step-by-step guides', status: 'PUBLISHED' },
      { title: 'News', slug: 'news', description: 'Latest updates and announcements', status: 'PUBLISHED' },
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

    console.log('🎉 Database seeding completed!');
    console.log('\nDefault admin credentials:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
