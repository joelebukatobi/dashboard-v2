import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyRateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.development' });

export default async function app(fastify, opts) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Register security plugins
  await fastify.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://unpkg.com"],
        scriptSrc: ["'self'", "https://unpkg.com", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
      }
    },
    // Disable HSTS in development - it forces HTTPS which breaks localhost
    strictTransportSecurity: isDevelopment ? false : {
      maxAge: 15552000,
      includeSubDomains: true
    }
  });
  
  await fastify.register(fastifyCookie);
  await fastify.register(fastifyCors, {
    origin: process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : false,
    credentials: true
  });
  
  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    cookie: {
      cookieName: 'token',
      signed: false
    }
  });
  
  await fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  // Register static file serving
  await fastify.register(import('@fastify/static'), {
    root: path.join(__dirname, '../public'),
    prefix: '/',
    decorateReply: false
  });

  // Health check endpoint
  fastify.get('/health', async () => {
    return { 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  });

  // Register admin routes
  await fastify.register(import('./routes/auth.routes.js'), { prefix: '/admin/auth' });
  // await fastify.register(import('./routes/dashboard.routes.js'), { prefix: '/admin/dashboard' });
  // await fastify.register(import('./routes/posts.routes.js'), { prefix: '/admin/posts' });
  // await fastify.register(import('./routes/categories.routes.js'), { prefix: '/admin/categories' });
  // await fastify.register(import('./routes/tags.routes.js'), { prefix: '/admin/tags' });
  // await fastify.register(import('./routes/users.routes.js'), { prefix: '/admin/users' });
  // await fastify.register(import('./routes/images.routes.js'), { prefix: '/admin/images' });
  // await fastify.register(import('./routes/videos.routes.js'), { prefix: '/admin/videos' });
  // await fastify.register(import('./routes/settings.routes.js'), { prefix: '/admin/settings' });
  // await fastify.register(import('./routes/notifications.routes.js'), { prefix: '/admin/notifications' });

  // 404 handler
  fastify.setNotFoundHandler(async (request, reply) => {
    reply.code(404);
    return {
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
      statusCode: 404
    };
  });
}
