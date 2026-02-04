// src/controllers/auth.controller.js
import { authService } from '../services/auth.service.js';
import { validate, loginSchema } from '../utils/validators.js';
import { validatePasswordStrength, checkRateLimit, clearRateLimit } from '../utils/security.js';

// In-memory rate limit store (use Redis in production)
const loginAttempts = new Map();

/**
 * Auth Controller
 * Handles authentication HTTP requests
 * Following Controller pattern - only handles HTTP layer
 */
class AuthController {
  /**
   * POST /admin/auth/login
   * Handle user login
   */
  async login(request, reply) {
    try {
      // Get client IP for rate limiting
      const clientIp = request.ip;
      
      // Check rate limit
      const rateLimit = checkRateLimit(loginAttempts, clientIp, 5, 15 * 60 * 1000);
      if (rateLimit.blocked) {
        reply.code(429);
        return reply.html(errorPage({
          title: 'Too Many Attempts',
          message: 'Too many login attempts. Please try again in 15 minutes.',
          type: 'error'
        }));
      }
      
      // Validate request body
      const validation = validate(loginSchema, request.body);
      if (!validation.success) {
        reply.code(400);
        return reply.html(errorPage({
          title: 'Validation Error',
          message: validation.errors.join(', '),
          type: 'error'
        }));
      }
      
      const { email, password, rememberMe } = validation.data;
      
      // Validate credentials
      const result = await authService.validateCredentials(email, password);
      
      if (!result.valid) {
        reply.code(401);
        return reply.html(errorPage({
          title: 'Login Failed',
          message: result.error,
          type: 'error'
        }));
      }
      
      // Clear rate limit on successful login
      clearRateLimit(loginAttempts, clientIp);
      
      // Create session
      const session = await authService.createSession(result.user.id, rememberMe);
      
      // Generate JWT token
      const token = await reply.jwtSign(
        { 
          userId: result.user.id,
          email: result.user.email,
          role: result.user.role 
        },
        { expiresIn: rememberMe ? '30d' : '24h' }
      );
      
      // Set HTTP-only cookie
      reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
      });
      
      // Return success with redirect
      reply.header('HX-Redirect', '/admin/dashboard');
      return reply.html(successToast({
        message: 'Login successful! Redirecting...'
      }));
      
    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.html(errorPage({
        title: 'Server Error',
        message: 'An unexpected error occurred. Please try again.',
        type: 'error'
      }));
    }
  }

  /**
   * POST /admin/auth/logout
   * Handle user logout
   */
  async logout(request, reply) {
    try {
      // Get token from cookie
      const token = request.cookies.token;
      
      if (token) {
        // Delete session from database
        await authService.deleteSession(token);
      }
      
      // Clear cookie
      reply.clearCookie('token', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      // Redirect to login
      reply.header('HX-Redirect', '/admin/auth/login');
      return reply.html(successToast({
        message: 'Logged out successfully'
      }));
      
    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.html(errorPage({
        title: 'Error',
        message: 'Error during logout',
        type: 'error'
      }));
    }
  }

  /**
   * GET /admin/auth/me
   * Get current user info
   */
  async getCurrentUser(request, reply) {
    try {
      if (!request.user) {
        reply.code(401);
        return { error: 'Not authenticated' };
      }
      
      return {
        user: request.user
      };
      
    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return { error: 'Server error' };
    }
  }

  /**
   * POST /admin/auth/forgot-password
   * Handle password reset request
   */
  async forgotPassword(request, reply) {
    try {
      const { email } = request.body;
      
      if (!email) {
        reply.code(400);
        return reply.html(errorPage({
          title: 'Error',
          message: 'Email is required',
          type: 'error'
        }));
      }
      
      // Find user
      const user = await authService.findUserByEmail(email);
      
      // Always return success (don't reveal if email exists)
      if (user) {
        // Create reset token
        const token = await authService.createPasswordResetToken(user.id);
        
        // TODO: Send email with reset link
        // In development, just log it
        request.log.info(`Password reset token for ${email}: ${token}`);
      }
      
      return reply.html(successToast({
        message: 'If an account exists with this email, you will receive reset instructions.'
      }));
      
    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.html(errorPage({
        title: 'Error',
        message: 'An error occurred. Please try again.',
        type: 'error'
      }));
    }
  }

  /**
   * POST /admin/auth/reset-password
   * Handle password reset
   */
  async resetPassword(request, reply) {
    try {
      const { token, password, confirmPassword } = request.body;
      
      // Validate passwords match
      if (password !== confirmPassword) {
        reply.code(400);
        return reply.html(errorPage({
          title: 'Error',
          message: 'Passwords do not match',
          type: 'error'
        }));
      }
      
      // Validate password strength
      const passwordCheck = validatePasswordStrength(password);
      if (!passwordCheck.valid) {
        reply.code(400);
        return reply.html(errorPage({
          title: 'Weak Password',
          message: passwordCheck.errors.join('. '),
          type: 'error'
        }));
      }
      
      // Validate token
      const resetData = await authService.validatePasswordResetToken(token);
      
      if (!resetData) {
        reply.code(400);
        return reply.html(errorPage({
          title: 'Invalid Token',
          message: 'This reset link is invalid or has expired.',
          type: 'error'
        }));
      }
      
      // Reset password
      await authService.resetPassword(resetData.user.id, password);
      
      reply.header('HX-Redirect', '/admin/auth/login?reset=success');
      return reply.html(successToast({
        message: 'Password reset successful. Please login with your new password.'
      }));
      
    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return reply.html(errorPage({
        title: 'Error',
        message: 'An error occurred. Please try again.',
        type: 'error'
      }));
    }
  }
}

// Helper functions for responses (will be replaced with actual templates)
function errorPage({ title, message, type }) {
  return `
    <div class="error-message ${type}">
      <h2>${title}</h2>
      <p>${message}</p>
    </div>
  `;
}

function successToast({ message }) {
  return `
    <div class="toast toast-success">
      ${message}
    </div>
  `;
}

// Export singleton
export const authController = new AuthController();
export default authController;
