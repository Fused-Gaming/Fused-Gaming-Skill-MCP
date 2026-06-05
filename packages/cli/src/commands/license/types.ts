/**
 * License Command Types
 * Interface definitions for license command options and results
 */

/**
 * Format options for list command output
 */
export type OutputFormat = 'table' | 'json' | 'csv';

/**
 * License status filter options
 */
export type LicenseStatus = 'active' | 'expired' | 'pending' | 'suspended';

/**
 * Arguments for license list command
 */
export interface ListCommandArgs {
  format?: OutputFormat;
  status?: LicenseStatus;
  verbose?: boolean;
}

/**
 * Arguments for license check command
 */
export interface CheckCommandArgs {
  key: string;
  verbose?: boolean;
}

/**
 * Arguments for license activate command
 */
export interface ActivateCommandArgs {
  key: string;
  interactive?: boolean;
}

/**
 * Arguments for license renew command
 */
export interface RenewCommandArgs {
  key?: string;
  token?: string;
}

/**
 * Arguments for license status command
 */
export interface StatusCommandArgs {
  format?: 'text' | 'json';
  key?: string;
}

/**
 * Command handler signature
 */
export type CommandHandler<T = unknown> = (args: T) => Promise<void>;

/**
 * License command result
 */
export interface CommandResult {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}
