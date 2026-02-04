// src/routes/auth.routes.js
import { authController } from '../controllers/auth.controller.js';
import { authenticate, optionalAuth } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/authorize.js';

/**
 * Authentication Routes
 * Defines all auth-related endpoints
 */
export default async function authRoutes(fastify) {
  
  // POST /admin/auth/login
  // Public - no auth required
  fastify.post('/login', {
    handler: authController.login.bind(authController)
  });
  
  // GET /admin/auth/login
  // Serve login page (HTML)
  fastify.get('/login', {
    handler: async (request, reply) => {
      // If already logged in, redirect to dashboard
      const token = request.cookies.token;
      if (token) {
        try {
          await request.jwtVerify(token);
          return reply.redirect('/admin/dashboard');
        } catch {
          // Token invalid, show login page
        }
      }
      
      // Serve login page
      reply.type('text/html');
      return loginPageTemplate();
    }
  });
  
  // POST /admin/auth/logout
  // Protected - requires auth
  fastify.post('/logout', {
    preHandler: authenticate,
    handler: authController.logout.bind(authController)
  });
  
  // GET /admin/auth/me
  // Protected - get current user
  fastify.get('/me', {
    preHandler: authenticate,
    handler: authController.getCurrentUser.bind(authController)
  });
  
  // POST /admin/auth/forgot-password
  // Public - request password reset
  fastify.post('/forgot-password', {
    handler: authController.forgotPassword.bind(authController)
  });
  
  // POST /admin/auth/reset-password
  // Public - reset password with token
  fastify.post('/reset-password', {
    handler: authController.resetPassword.bind(authController)
  });
  
  // GET /admin/auth/reset-password
  // Serve reset password page (HTML)
  fastify.get('/reset-password', {
    handler: async (request, reply) => {
      const { token } = request.query;
      
      if (!token) {
        return reply.redirect('/admin/auth/login');
      }
      
      reply.type('text/html');
      return resetPasswordPageTemplate(token);
    }
  });
}

// Temporary HTML templates (will be moved to proper template files)
function loginPageTemplate() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - BlogCMS Admin</title>
  <script src="https://unpkg.com/htmx.org@1.9.12"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .login-container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h1 {
      margin-bottom: 1.5rem;
      color: #333;
      text-align: center;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-size: 0.9rem;
    }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    input:focus {
      outline: none;
      border-color: #4CAF50;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }
    button:hover {
      background: #45a049;
    }
    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .success-message {
      background: #e8f5e9;
      color: #2e7d32;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <h1>🔐 BlogCMS Admin</h1>
    <form hx-post="/admin/auth/login" hx-target="#response" hx-swap="innerHTML">
      <div id="response"></div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required placeholder="admin@example.com">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required placeholder="••••••••">
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" name="rememberMe" value="true">
          Remember me
        </label>
      </div>
      <button type="submit">Sign In</button>
    </form>
    <p style="text-align: center; margin-top: 1rem; font-size: 0.9rem;">
      <a href="#" style="color: #666;">Forgot password?</a>
    </p>
  </div>
</body>
</html>
  `;
}

function resetPasswordPageTemplate(token) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - BlogCMS Admin</title>
  <script src="https://unpkg.com/htmx.org@1.9.12"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h1 {
      margin-bottom: 1.5rem;
      color: #333;
      text-align: center;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-size: 0.9rem;
    }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }
    button:hover {
      background: #45a049;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔐 Reset Password</h1>
    <form hx-post="/admin/auth/reset-password" hx-target="#response" hx-swap="innerHTML">
      <input type="hidden" name="token" value="${token}">
      <div id="response"></div>
      <div class="form-group">
        <label for="password">New Password</label>
        <input type="password" id="password" name="password" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required>
      </div>
      <button type="submit">Reset Password</button>
    </form>
  </div>
</body>
</html>
  `;
}
