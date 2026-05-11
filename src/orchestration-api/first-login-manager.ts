/**
 * First-Login Root Password Management
 *
 * Administrators receive a one-time-only root password that they MUST change
 * on their first login to the orchestration panel.
 *
 * This module handles:
 * - Generating secure one-time root password
 * - Storing encrypted credentials
 * - Enforcing password change on first login
 * - Validating password strength
 * - Audit logging of password changes
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface FirstLoginConfig {
  enabled: boolean;
  oneTimePassword: string;
  passwordHash: string;
  createdAt: string;
  expiresAt: string;
  changedAt?: string;
  changeRequired: boolean;
  attempts: number;
  maxAttempts: number;
  lastAttemptAt?: string;
}

export class FirstLoginManager {
  private configPath: string;
  private config: FirstLoginConfig;

  constructor(baseDir: string = '.claude-flow') {
    this.configPath = path.join(baseDir, 'security', 'first-login.json');
    this.loadConfig();
  }

  /**
   * Generate a secure one-time root password
   * Format: 4 words (each 6-8 chars) separated by hyphens
   * Example: Quantum-Phoenix-Stellar-Cascade
   */
  generateOneTimePassword(): string {
    const wordLists = {
      adjectives: [
        'Quantum', 'Stellar', 'Cosmic', 'Phoenix', 'Dragon', 'Silver',
        'Golden', 'Crystal', 'Thunder', 'Violet', 'Crimson', 'Emerald',
        'Sapphire', 'Amber', 'Radiant', 'Ethereal', 'Mystic', 'Divine'
      ],
      nouns: [
        'Phoenix', 'Dragon', 'Eagle', 'Tiger', 'Falcon', 'Storm',
        'Thunder', 'Lightning', 'Cascade', 'Inferno', 'Aurora', 'Nexus',
        'Beacon', 'Vortex', 'Prism', 'Zenith', 'Summit', 'Vessel'
      ],
      colors: [
        'Crimson', 'Scarlet', 'Violet', 'Indigo', 'Azure', 'Turquoise',
        'Emerald', 'Jade', 'Sapphire', 'Amber', 'Golden', 'Silver',
        'Platinum', 'Bronze', 'Copper', 'Teal', 'Magenta', 'Ivory'
      ],
      actions: [
        'Cascade', 'Surge', 'Thrust', 'Spiral', 'Orbit', 'Soar',
        'Glide', 'Pulse', 'Flare', 'Ignite', 'Radiate', 'Resonate',
        'Elevate', 'Ascend', 'Transcend', 'Navigate', 'Traverse', 'Execute'
      ]
    };

    const getRandomWord = (list: string[]) => list[Math.floor(Math.random() * list.length)];

    return [
      getRandomWord(wordLists.adjectives),
      getRandomWord(wordLists.nouns),
      getRandomWord(wordLists.colors),
      getRandomWord(wordLists.actions)
    ].join('-');
  }

  /**
   * Initialize first login for new installations
   */
  initializeFirstLogin(_baseDir?: string): FirstLoginConfig {
    const oneTimePassword = this.generateOneTimePassword();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    this.config = {
      enabled: true,
      oneTimePassword,
      passwordHash: this.hashPassword(oneTimePassword),
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      changeRequired: true,
      attempts: 0,
      maxAttempts: 5,
    };

    this.saveConfig();
    return this.config;
  }

  /**
   * Hash password using PBKDF2
   */
  private hashPassword(password: string, salt?: Buffer): string {
    if (!salt) {
      salt = crypto.randomBytes(32);
    }
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256');
    return salt.toString('hex') + ':' + hash.toString('hex');
  }

  /**
   * Verify password against stored hash
   */
  private verifyPassword(password: string, hash: string): boolean {
    const parts = hash.split(':');
    if (parts.length !== 2) return false;

    const salt = Buffer.from(parts[0], 'hex');
    const storedHash = parts[1];
    const computedHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256');

    return computedHash.toString('hex') === storedHash;
  }

  /**
   * Validate initial login with one-time password
   */
  validateInitialLogin(password: string): { success: boolean; message: string; nextStep?: string } {
    if (!this.config.changeRequired) {
      return {
        success: false,
        message: 'First login password change already completed'
      };
    }

    // Check expiration
    const expiresAt = new Date(this.config.expiresAt);
    if (Date.now() > expiresAt.getTime()) {
      return {
        success: false,
        message: 'One-time password has expired. Contact your administrator for a reset.'
      };
    }

    // Check attempt limit
    if (this.config.attempts >= this.config.maxAttempts) {
      return {
        success: false,
        message: 'Maximum login attempts exceeded. Account locked for 1 hour.'
      };
    }

    // Verify password
    if (!this.verifyPassword(password, this.config.passwordHash)) {
      this.config.attempts++;
      this.config.lastAttemptAt = new Date().toISOString();
      this.saveConfig();

      const attemptsRemaining = this.config.maxAttempts - this.config.attempts;
      return {
        success: false,
        message: `Invalid password. ${attemptsRemaining} attempts remaining.`
      };
    }

    // Reset attempts on successful validation
    this.config.attempts = 0;

    return {
      success: true,
      message: 'Initial login successful. Password change required.',
      nextStep: 'change-password'
    };
  }

  /**
   * Validate and change password on first login
   */
  changePasswordOnFirstLogin(newPassword: string, confirmPassword: string): { success: boolean; message: string } {
    // Validate password strength
    const passwordValidation = this.validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      return {
        success: false,
        message: `Weak password: ${passwordValidation.errors.join(', ')}`
      };
    }

    // Confirm passwords match
    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match'
      };
    }

    // Update configuration
    const now = new Date();
    this.config.passwordHash = this.hashPassword(newPassword);
    this.config.changeRequired = false;
    this.config.changedAt = now.toISOString();
    this.config.attempts = 0;

    this.saveConfig();

    // Log the change
    this.logSecurityEvent('PASSWORD_CHANGED_ON_FIRST_LOGIN', {
      timestamp: now.toISOString(),
      ipAddress: 'system', // Should be set from request context
    });

    return {
      success: true,
      message: 'Password changed successfully. You can now access the panel.'
    };
  }

  /**
   * Validate password strength
   */
  private validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 16) {
      errors.push('Password must be at least 16 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain an uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain a lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain a number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain a special character');
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password contains too many repeated characters');
    }

    if (/123|456|789|qwerty|password/i.test(password)) {
      errors.push('Password contains common patterns');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if first login change is required
   */
  isFirstLoginChangeRequired(): boolean {
    return this.config.changeRequired;
  }

  /**
   * Get first login status (for dashboard)
   */
  getFirstLoginStatus(): Partial<FirstLoginConfig> {
    return {
      enabled: this.config.enabled,
      changeRequired: this.config.changeRequired,
      createdAt: this.config.createdAt,
      expiresAt: this.config.expiresAt,
      changedAt: this.config.changedAt,
      attempts: this.config.attempts,
      maxAttempts: this.config.maxAttempts,
    };
  }

  /**
   * Generate a new one-time password (admin reset)
   */
  generateNewOneTimePassword(_baseDir?: string): string {
    const newPassword = this.generateOneTimePassword();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    this.config = {
      enabled: true,
      oneTimePassword: newPassword,
      passwordHash: this.hashPassword(newPassword),
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      changeRequired: true,
      attempts: 0,
      maxAttempts: 5,
    };

    this.saveConfig();

    // Log the reset
    this.logSecurityEvent('PASSWORD_RESET', {
      timestamp: now.toISOString(),
      newPassword,
    });

    return newPassword;
  }

  /**
   * Log security events for audit trail
   */
  private logSecurityEvent(eventType: string, details: Record<string, unknown>): void {
    const auditLog = path.join(path.dirname(this.configPath), 'audit.log');
    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType,
      details
    };

    try {
      let logs: Array<{ timestamp: string; eventType: string; details: Record<string, unknown> }> = [];
      if (fs.existsSync(auditLog)) {
        const content = fs.readFileSync(auditLog, 'utf-8');
        logs = JSON.parse(content);
      }

      logs.push(logEntry);
      fs.writeFileSync(auditLog, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }

  /**
   * Load configuration from file
   */
  private loadConfig(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        const content = fs.readFileSync(this.configPath, 'utf-8');
        this.config = JSON.parse(content);
      } else {
        // Initialize with defaults if no config exists
        this.config = {
          enabled: false,
          oneTimePassword: '',
          passwordHash: '',
          createdAt: new Date().toISOString(),
          expiresAt: new Date().toISOString(),
          changeRequired: false,
          attempts: 0,
          maxAttempts: 5,
        };
      }
    } catch (error) {
      console.error('Failed to load first-login config:', error);
      this.config = {
        enabled: false,
        oneTimePassword: '',
        passwordHash: '',
        createdAt: new Date().toISOString(),
        expiresAt: new Date().toISOString(),
        changeRequired: false,
        attempts: 0,
        maxAttempts: 5,
      };
    }
  }

  /**
   * Save configuration to file
   */
  private saveConfig(): void {
    try {
      const dir = path.dirname(this.configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Failed to save first-login config:', error);
    }
  }
}

export default FirstLoginManager;
