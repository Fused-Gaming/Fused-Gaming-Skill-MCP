/**
 * License Commands Module
 * CLI commands for license management
 *
 * Commands:
 * - list: List installed licenses
 * - check: Verify license validity
 * - activate: Activate a new license
 * - renew: Renew or extend a license
 * - status: Display license status
 *
 * @packageDocumentation
 */

export * from './types.js';
export { listLicenses } from './list.js';
export { checkLicense } from './check.js';
export { activateLicense } from './activate.js';
export { renewLicense } from './renew.js';
export { statusLicense } from './status.js';
