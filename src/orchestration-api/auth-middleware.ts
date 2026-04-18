/**
 * Authentication Middleware for Orchestration Panel
 *
 * Enforces mandatory password change on first login.
 * Redirects to password change form until administrator updates their password.
 */

import { NextFunction, Request, Response } from 'express';
import FirstLoginManager from './first-login-manager.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'admin' | 'operator';
        firstLoginCompleted: boolean;
      };
    }
  }
}

export class AuthMiddleware {
  private firstLoginManager: FirstLoginManager;

  constructor(baseDir: string = '.claude-flow') {
    this.firstLoginManager = new FirstLoginManager(baseDir);
  }

  /**
   * Middleware: Check if first-login password change is required
   */
  enforceFirstLoginPasswordChange = (req: Request, res: Response, next: NextFunction) => {
    // Skip these routes from first-login check
    const exemptRoutes = [
      '/api/auth/login',
      '/api/auth/change-password',
      '/api/auth/status',
      '/api/health',
      '/',
    ];

    const isExempt = exemptRoutes.some(route => req.path.startsWith(route));

    if (isExempt) {
      return next();
    }

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if first login change is required
    if (this.firstLoginManager.isFirstLoginChangeRequired()) {
      return res.status(403).json({
        error: 'First Login Password Change Required',
        nextStep: 'change-password',
        message: 'You must change your password before accessing the panel'
      });
    }

    next();
  };

  /**
   * Handle initial login with one-time password
   */
  handleInitialLogin = (req: Request, res: Response) => {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    const validation = this.firstLoginManager.validateInitialLogin(password);

    if (!validation.success) {
      return res.status(401).json({
        error: 'Invalid Credentials',
        message: validation.message
      });
    }

    // Generate session token
    const sessionToken = this.generateSessionToken();

    res.status(200).json({
      success: true,
      message: validation.message,
      nextStep: validation.nextStep,
      sessionToken,
      requiresPasswordChange: true
    });
  };

  /**
   * Handle password change on first login
   */
  handleChangePasswordFirstLogin = (req: Request, res: Response) => {
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both newPassword and confirmPassword are required'
      });
    }

    const result = this.firstLoginManager.changePasswordOnFirstLogin(newPassword, confirmPassword);

    if (!result.success) {
      return res.status(400).json({
        error: 'Password Change Failed',
        message: result.message
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
      nextStep: 'dashboard'
    });
  };

  /**
   * Get first login status
   */
  getFirstLoginStatus = (req: Request, res: Response) => {
    const status = this.firstLoginManager.getFirstLoginStatus();
    res.status(200).json(status);
  };

  /**
   * Generate a session token (in production, use JWT with proper claims)
   */
  private generateSessionToken(): string {
    return Buffer.from(JSON.stringify({
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000,
      type: 'first-login-session'
    })).toString('base64');
  }
}

export default AuthMiddleware;
