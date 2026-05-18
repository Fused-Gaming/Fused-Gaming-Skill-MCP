/**
 * Icon Registry
 * Maps icon names to their SVG content for efficient rendering
 */

import type { IconName, IconDefinition } from '../types/icons.js';

// Navigation Icons
const homeIcon = '<path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/>';
const dashboardIcon = '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>';
const settingsIcon = '<circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>';
const helpIcon = '<circle cx="12" cy="12" r="10"/><path d="M12 17v.01"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>';
const logoutIcon = '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>';

// Status Icons
const activeIcon = '<circle cx="12" cy="12" r="8"/>';
const inactiveIcon = '<circle cx="12" cy="12" r="8"/>';
const pendingIcon = '<circle cx="12" cy="12" r="9"/><path d="M12 7v5" stroke-dasharray="2,2" opacity="0.7"/>';
const errorIcon = '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>';
const warningIcon = '<path d="M12 2l10.39 18H1.61L12 2z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>';
const successIcon = '<polyline points="20 6 9 17 4 12"/>';

// Action Icons
const playIcon = '<polygon points="5 3 19 12 5 21"/>';
const pauseIcon = '<rect x="6" y="4" width="3" height="16"/><rect x="15" y="4" width="3" height="16"/>';
const stopIcon = '<rect x="4" y="4" width="16" height="16"/>';
const retryIcon = '<path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 0 1 14.85-4.3L23 10M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10"/>';
const rollbackIcon = '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.7 2.8L3 13"/>';
const deleteIcon = '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>';
const editIcon = '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L21 3z"/>';

// Agent Icons
const orchestratorIcon = '<path d="M12 2l3.464 2v4l3.464 2v4l-3.464 2v4l-3.464 2-3.464-2v-4l-3.464-2v-4l3.464-2v-4z"/><circle cx="12" cy="12" r="2" fill="currentColor"/>';
const sentinelIcon = '<path d="M12 1l7 4v7c0 5-7 7-7 7s-7-2-7-7V5z"/><circle cx="12" cy="11" r="2"/>';
const analystIcon = '<path d="M3 9l2-2 2 3 3-4 2 2 4-5 2 2v8H3z"/><path d="M3 17h18"/><path d="M3 21h18"/>';
const executorIcon = '<path d="M13 2v8l5-5"/><path d="M13 10v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2z"/>';

// Utility Icons
const bellIcon = '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>';
const userIcon = '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>';

/**
 * Icon registry containing all available icons
 */
export const iconRegistry: Record<IconName, IconDefinition> = {
  // Navigation
  home: {
    name: 'home',
    viewBox: '0 0 24 24',
    path: homeIcon,
    strokeWidth: 1.5,
    category: 'navigation',
  },
  dashboard: {
    name: 'dashboard',
    viewBox: '0 0 24 24',
    path: dashboardIcon,
    strokeWidth: 1.5,
    category: 'navigation',
  },
  settings: {
    name: 'settings',
    viewBox: '0 0 24 24',
    path: settingsIcon,
    strokeWidth: 1.5,
    category: 'navigation',
  },
  help: {
    name: 'help',
    viewBox: '0 0 24 24',
    path: helpIcon,
    strokeWidth: 1.5,
    category: 'navigation',
  },
  logout: {
    name: 'logout',
    viewBox: '0 0 24 24',
    path: logoutIcon,
    strokeWidth: 1.5,
    category: 'navigation',
  },

  // Status
  active: {
    name: 'active',
    viewBox: '0 0 24 24',
    path: activeIcon,
    category: 'status',
  },
  inactive: {
    name: 'inactive',
    viewBox: '0 0 24 24',
    path: inactiveIcon,
    strokeWidth: 2,
    category: 'status',
  },
  pending: {
    name: 'pending',
    viewBox: '0 0 24 24',
    path: pendingIcon,
    strokeWidth: 2,
    category: 'status',
  },
  error: {
    name: 'error',
    viewBox: '0 0 24 24',
    path: errorIcon,
    strokeWidth: 2,
    category: 'status',
  },
  warning: {
    name: 'warning',
    viewBox: '0 0 24 24',
    path: warningIcon,
    strokeWidth: 1.5,
    category: 'status',
  },
  success: {
    name: 'success',
    viewBox: '0 0 24 24',
    path: successIcon,
    strokeWidth: 2,
    category: 'status',
  },

  // Actions
  play: {
    name: 'play',
    viewBox: '0 0 24 24',
    path: playIcon,
    category: 'action',
  },
  pause: {
    name: 'pause',
    viewBox: '0 0 24 24',
    path: pauseIcon,
    category: 'action',
  },
  stop: {
    name: 'stop',
    viewBox: '0 0 24 24',
    path: stopIcon,
    category: 'action',
  },
  retry: {
    name: 'retry',
    viewBox: '0 0 24 24',
    path: retryIcon,
    strokeWidth: 1.5,
    category: 'action',
  },
  rollback: {
    name: 'rollback',
    viewBox: '0 0 24 24',
    path: rollbackIcon,
    strokeWidth: 1.5,
    category: 'action',
  },
  delete: {
    name: 'delete',
    viewBox: '0 0 24 24',
    path: deleteIcon,
    strokeWidth: 1.5,
    category: 'action',
  },
  edit: {
    name: 'edit',
    viewBox: '0 0 24 24',
    path: editIcon,
    strokeWidth: 1.5,
    category: 'action',
  },

  // Agents
  orchestrator: {
    name: 'orchestrator',
    viewBox: '0 0 24 24',
    path: orchestratorIcon,
    strokeWidth: 1.5,
    category: 'agent',
  },
  sentinel: {
    name: 'sentinel',
    viewBox: '0 0 24 24',
    path: sentinelIcon,
    strokeWidth: 1.5,
    category: 'agent',
  },
  analyst: {
    name: 'analyst',
    viewBox: '0 0 24 24',
    path: analystIcon,
    strokeWidth: 1.5,
    category: 'agent',
  },
  executor: {
    name: 'executor',
    viewBox: '0 0 24 24',
    path: executorIcon,
    strokeWidth: 1.5,
    category: 'agent',
  },

  // Utility
  bell: {
    name: 'bell',
    viewBox: '0 0 24 24',
    path: bellIcon,
    strokeWidth: 1.5,
    category: 'utility',
  },
  user: {
    name: 'user',
    viewBox: '0 0 24 24',
    path: userIcon,
    strokeWidth: 1.5,
    category: 'utility',
  },
};

/**
 * Get icon definition by name
 */
export const getIcon = (name: IconName): IconDefinition | undefined => {
  return iconRegistry[name];
};

/**
 * Get all icons of a specific category
 */
export const getIconsByCategory = (category: IconDefinition['category']): IconDefinition[] => {
  return Object.values(iconRegistry).filter((icon) => icon.category === category);
};

/**
 * Get all available icon names
 */
export const getAllIconNames = (): IconName[] => {
  return Object.keys(iconRegistry) as IconName[];
};
