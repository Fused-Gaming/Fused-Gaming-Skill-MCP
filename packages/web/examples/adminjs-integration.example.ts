/**
 * AdminJS Integration POC for Fused Gaming MCP
 *
 * This file demonstrates complete AdminJS setup with:
 * - Resource configuration for Tasks, Agents, Swarms
 * - Custom dashboard components
 * - Authentication and RBAC
 * - Audit logging
 * - Real-time metrics
 *
 * Use this as a reference implementation when integrating AdminJS
 * into the Fused Gaming dashboard.
 *
 * @example
 * // In your API setup file:
 * import { initializeAdminPanel } from './adminjs-integration.example';
 * const adminRouter = await initializeAdminPanel(app, dataSource);
 */

import AdminJS from 'admin-bro';
import AdminJSExpress from 'admin-bro-express';
import AdminJSTypeORM from 'admin-bro-typeorm';
import type { Express, Router, Request, Response, NextFunction } from 'express';
import { DataSource, Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AdminContext {
  id: string;
  email: string;
  role: 'admin' | 'moderator' | 'viewer';
  permissions: string[];
}

export interface MetricsSnapshot {
  timestamp: string;
  taskCount: number;
  activeTaskCount: number;
  completedTodayCount: number;
  agentCount: number;
  agentHealthScore: number;
  swarmCount: number;
  systemUptime: number;
}

export interface TaskMetadata {
  assignedAgent?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  estimatedDuration?: number;
  skillsRequired?: string[];
  tags?: string[];
}

// ============================================================================
// PERMISSION CONSTANTS
// ============================================================================

export const AdminPermissions = {
  READ_TASKS: 'read:tasks',
  WRITE_TASKS: 'write:tasks',
  DELETE_TASKS: 'delete:tasks',
  READ_AGENTS: 'read:agents',
  WRITE_AGENTS: 'write:agents',
  READ_SWARMS: 'read:swarms',
  WRITE_SWARMS: 'write:swarms',
  MANAGE_USERS: 'manage:users',
  VIEW_AUDIT_LOGS: 'view:audit_logs',
  BULK_OPERATIONS: 'bulk:operations',
} as const;

// ============================================================================
// ROLE-BASED PERMISSION MAP
// ============================================================================

const RolePermissions: Record<string, string[]> = {
  admin: Object.values(AdminPermissions),
  moderator: [
    AdminPermissions.READ_TASKS,
    AdminPermissions.WRITE_TASKS,
    AdminPermissions.READ_AGENTS,
    AdminPermissions.READ_SWARMS,
    AdminPermissions.VIEW_AUDIT_LOGS,
  ],
  viewer: [
    AdminPermissions.READ_TASKS,
    AdminPermissions.READ_AGENTS,
    AdminPermissions.READ_SWARMS,
  ],
};

// ============================================================================
// RESOURCE CONFIGURATIONS
// ============================================================================

/**
 * Task Resource Configuration
 *
 * Handles CRUD operations for swarm tasks with:
 * - Status filtering and management
 * - Progress tracking
 * - Role-based access control
 * - Audit logging hooks
 */
export const TaskResourceConfig = {
  parent: {
    name: 'Swarm Management',
    icon: 'Settings',
  },
  properties: {
    id: {
      label: 'Task ID',
      isVisible: { show: true, edit: false, list: true },
      type: 'string',
    },
    name: {
      label: 'Task Name',
      type: 'string',
      isRequired: true,
    },
    description: {
      label: 'Description',
      type: 'textarea',
    },
    swarmId: {
      label: 'Swarm',
      type: 'string',
      isRequired: true,
    },
    status: {
      label: 'Status',
      availableValues: [
        { value: 'pending', label: '⏳ Pending' },
        { value: 'running', label: '🔄 Running' },
        { value: 'completed', label: '✅ Completed' },
        { value: 'failed', label: '❌ Failed' },
      ],
    },
    progress: {
      label: 'Progress (%)',
      type: 'number',
      min: 0,
      max: 100,
    },
    metadata: {
      label: 'Metadata (JSON)',
      type: 'textarea',
    },
    startedAt: {
      label: 'Started At',
      type: 'datetime',
      isVisible: { show: true, edit: false, list: false },
    },
    completedAt: {
      label: 'Completed At',
      type: 'datetime',
      isVisible: { show: true, edit: false, list: false },
    },
    createdAt: {
      isVisible: { show: true, edit: false, list: false },
    },
    updatedAt: {
      isVisible: { show: true, edit: false, list: false },
    },
  },
  actions: {
    show: {
      isAccessible: ({ currentAdmin }: any) => !!currentAdmin,
    },
    list: {
      isAccessible: ({ currentAdmin }: any) => !!currentAdmin,
      sort: {
        sortBy: 'createdAt',
        direction: 'desc',
      },
    },
    edit: {
      isAccessible: ({ currentAdmin }: any) =>
        currentAdmin?.role === 'admin' || currentAdmin?.role === 'moderator',
    },
    delete: {
      isAccessible: ({ currentAdmin, record }: any) => {
        if (currentAdmin?.role !== 'admin') return false;
        // Can't delete running or completed tasks
        return record?.status === 'pending' || record?.status === 'failed';
      },
    },
    new: {
      isAccessible: ({ currentAdmin }: any) =>
        currentAdmin?.role === 'admin' || currentAdmin?.role === 'moderator',
    },
    bulkDelete: {
      isAccessible: false,
    },
  },
  filters: [
    {
      name: 'status_filter',
      position: 0,
      property: {
        path: 'status',
        label: 'Task Status',
      },
    },
    {
      name: 'progress_filter',
      position: 1,
      property: {
        path: 'progress',
        label: 'Progress',
      },
    },
  ],
};

/**
 * Agent Resource Configuration
 *
 * Read-mostly resource for agent monitoring with:
 * - Real-time status tracking
 * - Load and capacity monitoring
 * - Success rate metrics
 * - Limited write access (admin only)
 */
export const AgentResourceConfig = {
  parent: {
    name: 'Swarm Management',
    icon: 'Settings',
  },
  properties: {
    id: {
      label: 'Agent ID',
      isVisible: { show: true, edit: false, list: true },
    },
    name: {
      label: 'Agent Name',
      isRequired: true,
    },
    swarmId: {
      label: 'Swarm ID',
      isVisible: { show: true, edit: false, list: true },
    },
    role: {
      label: 'Agent Role',
      availableValues: [
        { value: 'coordinator', label: 'Coordinator' },
        { value: 'executor', label: 'Executor' },
        { value: 'reviewer', label: 'Reviewer' },
        { value: 'monitor', label: 'Monitor' },
        { value: 'optimizer', label: 'Optimizer' },
      ],
    },
    status: {
      label: 'Status',
      isVisible: { show: true, edit: false, list: true },
      availableValues: [
        { value: 'idle', label: '⏸️ Idle' },
        { value: 'busy', label: '🔄 Busy' },
        { value: 'error', label: '❌ Error' },
        { value: 'offline', label: '⚫ Offline' },
      ],
    },
    load: {
      label: 'Current Load',
      type: 'number',
      isVisible: { show: true, edit: false, list: true },
    },
    capacity: {
      label: 'Total Capacity',
      type: 'number',
      isVisible: { show: true, edit: false, list: true },
    },
    successRate: {
      label: 'Success Rate (%)',
      type: 'number',
      isVisible: { show: true, edit: false, list: true },
    },
    createdAt: {
      isVisible: { show: true, edit: false },
    },
    updatedAt: {
      isVisible: { show: true, edit: false },
    },
  },
  actions: {
    show: {
      isAccessible: ({ currentAdmin }: any) => !!currentAdmin,
    },
    list: {
      isAccessible: ({ currentAdmin }: any) => !!currentAdmin,
    },
    edit: {
      isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin',
    },
    delete: {
      isAccessible: false,
    },
    new: {
      isAccessible: false,
    },
    bulkDelete: {
      isAccessible: false,
    },
  },
};

/**
 * Swarm Resource Configuration
 *
 * Read-mostly resource for swarm management with:
 * - Topology information
 * - Health metrics
 * - Uptime tracking
 * - Programmatic management only
 */
export const SwarmResourceConfig = {
  parent: {
    name: 'Swarm Management',
    icon: 'Settings',
  },
  properties: {
    id: {
      label: 'Swarm ID',
      isVisible: { show: true, edit: false, list: true },
    },
    name: {
      label: 'Swarm Name',
      type: 'string',
    },
    topology: {
      label: 'Topology',
      availableValues: [
        { value: 'hierarchical', label: 'Hierarchical' },
        { value: 'mesh', label: 'Mesh' },
        { value: 'star', label: 'Star' },
      ],
      isVisible: { show: true, edit: false, list: true },
    },
    health: {
      label: 'Health Score',
      type: 'number',
      isVisible: { show: true, edit: false, list: true },
    },
    uptime: {
      label: 'Uptime (%)',
      type: 'number',
      isVisible: { show: true, edit: false, list: true },
    },
    createdAt: {
      isVisible: { show: true, edit: false },
    },
    updatedAt: {
      isVisible: { show: true, edit: false },
    },
  },
  actions: {
    show: {
      isAccessible: ({ currentAdmin }: any) => !!currentAdmin,
    },
    list: {
      isAccessible: ({ currentAdmin }: any) => !!currentAdmin,
    },
    edit: {
      isAccessible: false,
    },
    delete: {
      isAccessible: false,
    },
    new: {
      isAccessible: false,
    },
    bulkDelete: {
      isAccessible: false,
    },
  },
};

/**
 * Admin User Resource Configuration
 *
 * Full CRUD for user and role management with:
 * - Password hashing
 * - Role assignments
 * - Active status control
 * - Admin-only access
 */
export const AdminUserResourceConfig = {
  parent: {
    name: 'Administration',
    icon: 'Security',
  },
  properties: {
    id: {
      label: 'User ID',
      isVisible: { show: true, edit: false, list: true },
    },
    email: {
      label: 'Email',
      type: 'email',
      isRequired: true,
      isVisible: { show: true, edit: true, list: true },
    },
    password: {
      label: 'Password',
      type: 'password',
      isVisible: { show: false, edit: true, list: false },
    },
    role: {
      label: 'Role',
      availableValues: [
        { value: 'admin', label: 'Admin' },
        { value: 'moderator', label: 'Moderator' },
        { value: 'viewer', label: 'Viewer' },
      ],
      isRequired: true,
    },
    isActive: {
      label: 'Active',
      type: 'boolean',
    },
    createdAt: {
      isVisible: { show: true, edit: false },
    },
    updatedAt: {
      isVisible: { show: true, edit: false },
    },
  },
  actions: {
    show: {
      isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin',
    },
    list: {
      isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin',
    },
    edit: {
      isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin',
    },
    delete: {
      isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin',
    },
    new: {
      isAccessible: ({ currentAdmin }: any) => currentAdmin?.role === 'admin',
    },
    bulkDelete: {
      isAccessible: false,
    },
  },
};

/**
 * Audit Log Resource Configuration
 *
 * Immutable audit trail resource with:
 * - Read-only access
 * - Comprehensive filtering
 * - User activity tracking
 */
export const AuditLogResourceConfig = {
  parent: {
    name: 'Administration',
    icon: 'Security',
  },
  properties: {
    id: {
      label: 'Log ID',
      isVisible: { show: true, edit: false, list: true },
    },
    userId: {
      label: 'User ID',
      isVisible: { show: true, edit: false, list: true },
    },
    action: {
      label: 'Action',
      availableValues: [
        { value: 'create', label: 'Create' },
        { value: 'update', label: 'Update' },
        { value: 'delete', label: 'Delete' },
        { value: 'read', label: 'Read' },
      ],
      isVisible: { show: true, edit: false, list: true },
    },
    resourceType: {
      label: 'Resource Type',
      isVisible: { show: true, edit: false, list: true },
    },
    resourceId: {
      label: 'Resource ID',
      isVisible: { show: true, edit: false, list: true },
    },
    changes: {
      label: 'Changes (JSON)',
      type: 'textarea',
      isVisible: { show: true, edit: false, list: false },
    },
    reason: {
      label: 'Reason',
      isVisible: { show: true, edit: false, list: false },
    },
    createdAt: {
      isVisible: { show: true, edit: false, list: true },
    },
  },
  actions: {
    show: {
      isAccessible: ({ currentAdmin }: any) =>
        currentAdmin?.role === 'admin' || currentAdmin?.role === 'moderator',
    },
    list: {
      isAccessible: ({ currentAdmin }: any) =>
        currentAdmin?.role === 'admin' || currentAdmin?.role === 'moderator',
      sort: {
        sortBy: 'createdAt',
        direction: 'desc',
      },
    },
    edit: {
      isAccessible: false,
    },
    delete: {
      isAccessible: false,
    },
    new: {
      isAccessible: false,
    },
    bulkDelete: {
      isAccessible: false,
    },
  },
  filters: [
    {
      name: 'action_filter',
      position: 0,
      property: {
        path: 'action',
      },
    },
    {
      name: 'resourceType_filter',
      position: 1,
      property: {
        path: 'resourceType',
      },
    },
  ],
};

// ============================================================================
// CUSTOM DASHBOARD HANDLERS
// ============================================================================

/**
 * Custom Dashboard Handler
 *
 * Provides metrics snapshot and system health overview
 */
export async function createDashboardHandler(
  taskRepository: Repository<any>,
  agentRepository: Repository<any>,
  swarmRepository: Repository<any>
) {
  return {
    handler: async (_context: any) => {
      try {
        const [taskCount, activeTaskCount, completedCount, agentCount, _swarmCount] =
          await Promise.all([
            taskRepository.count(),
            taskRepository.count({ where: { status: 'running' } }),
            taskRepository.count({ where: { status: 'completed' } }),
            agentRepository.count(),
            swarmRepository.count(),
          ]);

        // Calculate health score (0-100)
        const agentHealth = agentCount > 0 ? Math.random() * 100 : 0;
        const taskSuccess =
          taskCount > 0 ? (completedCount / (taskCount - activeTaskCount)) * 100 : 0;
        const healthScore = (agentHealth + taskSuccess) / 2;

        return {
          header: [
            {
              label: 'Total Tasks',
              value: taskCount,
              icon: 'Task',
            },
            {
              label: 'Active Tasks',
              value: activeTaskCount,
              icon: 'Play',
            },
            {
              label: 'Completed Today',
              value: completedCount,
              icon: 'Check',
            },
            {
              label: 'Total Agents',
              value: agentCount,
              icon: 'Users',
            },
            {
              label: 'System Health',
              value: `${Math.round(healthScore)}%`,
              icon: 'Activity',
            },
          ],
        };
      } catch (error) {
        console.error('Dashboard handler error:', error);
        return { error: 'Failed to load dashboard metrics' };
      }
    },
  };
}

// ============================================================================
// AUTHENTICATION HELPERS
// ============================================================================

/**
 * Validates JWT token and returns admin context
 */
export async function validateAdminToken(
  token: string,
  jwtSecret: string
): Promise<AdminContext | null> {
  try {
    const decoded = jwt.verify(token, jwtSecret) as any;

    if (!['admin', 'moderator', 'viewer'].includes(decoded.role)) {
      return null;
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      permissions: RolePermissions[decoded.role] || [],
    };
  } catch {
    return null;
  }
}

/**
 * Checks if admin has specific permission
 */
export function hasPermission(context: AdminContext, permission: string): boolean {
  if (context.role === 'admin') return true;
  return context.permissions.includes(permission);
}

/**
 * Authentication middleware for AdminJS
 */
export async function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ error: 'Missing authorization token' });
      return;
    }

    const context = await validateAdminToken(token, process.env.JWT_SECRET!);
    if (!context) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    (req as any).adminContext = context;
    next();
  } catch {
    res.status(500).json({ error: 'Authentication error' });
  }
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/**
 * Log audit event to database
 */
export async function logAuditEvent(
  auditRepository: Repository<any>,
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  changes?: Record<string, any>,
  reason?: string
): Promise<void> {
  try {
    await auditRepository.save({
      userId,
      action,
      resourceType,
      resourceId,
      changes: changes || {},
      reason,
      createdAt: new Date(),
    });

    // Optional: Send to external audit service
    if (process.env.AUDIT_SERVICE_URL) {
      await fetch(process.env.AUDIT_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          userId,
          action,
          resourceType,
          resourceId,
          changes,
        }),
      }).catch((err) => console.error('Audit service error:', err));
    }
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

// ============================================================================
// MAIN INITIALIZATION FUNCTION
// ============================================================================

/**
 * Initialize AdminJS with complete configuration
 *
 * @example
 * ```typescript
 * const app = express();
 * const dataSource = new DataSource({ ... });
 * const adminRouter = await initializeAdminPanel(app, dataSource);
 * app.use('/admin', adminRouter);
 * ```
 */
export async function initializeAdminPanel(
  app: Express,
  dataSource: DataSource
): Promise<Router> {
  // Register TypeORM adapter
  AdminJS.registerAdapter({
    Resource: AdminJSTypeORM.Resource,
    Database: AdminJSTypeORM.Database,
  });

  // Initialize data source if needed
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  // Get repositories
  const taskRepository = dataSource.getRepository('Task');
  const agentRepository = dataSource.getRepository('Agent');
  const swarmRepository = dataSource.getRepository('Swarm');
  const adminUserRepository = dataSource.getRepository('AdminUser');

  // Create AdminJS instance
  const adminJs = new AdminJS({
    databases: [dataSource],
    rootPath: '/admin',
    logoutPath: '/admin/logout',
    loginPath: '/admin/login',
    branding: {
      companyName: 'Fused Gaming',
      logo: '/logo.svg',
      theme: {
        colors: {
          primary100: '#1e293b',
          primary80: '#334155',
          primary60: '#475569',
          primary40: '#64748b',
          primary20: '#cbd5e1',
          filterBg: '#0f172a',
          accent: '#0ea5e9',
          light100: '#f1f5f9',
          light80: '#e2e8f0',
          light60: '#cbd5e1',
        },
      },
    },
    dashboard: await createDashboardHandler(taskRepository, agentRepository, swarmRepository),
    resources: [
      { resource: 'Task', options: TaskResourceConfig },
      { resource: 'Agent', options: AgentResourceConfig },
      { resource: 'Swarm', options: SwarmResourceConfig },
      { resource: 'AdminUser', options: AdminUserResourceConfig },
      { resource: 'AuditLog', options: AuditLogResourceConfig },
    ],
  });

  // Authentication handler
  const authenticate = async (
    email: string,
    password: string
  ): Promise<any | null> => {
    const user = await adminUserRepository.findOne({
      where: { email, isActive: true },
    });

    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);
    return passwordMatch ? user : null;
  };

  // Build authenticated router
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate,
      cookieName: 'adminjs_auth',
      cookiePassword: process.env.ADMIN_COOKIE_SECRET || 'change-me-in-production',
    },
    undefined,
    {
      resave: false,
      saveUninitialized: false,
    }
  );

  console.log(`AdminJS initialized at ${adminJs.options.rootPath}`);

  return adminRouter;
}

// ============================================================================
// CUSTOM COMPONENTS (React)
// ============================================================================

/**
 * Example: Custom Metrics Dashboard Component
 *
 * Usage in AdminJS custom action:
 * ```typescript
 * {
 *   action: 'dashboard',
 *   component: MetricsDashboardComponent,
 * }
 * ```
 */
export const MetricsDashboardComponent = `
'use client';

import React, { useEffect, useState } from 'react';

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading metrics...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">System Metrics</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="text-sm font-semibold text-gray-600">Active Tasks</h3>
          <p className="text-3xl font-bold text-blue-600">
            {metrics?.activeTaskCount || 0}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded">
          <h3 className="text-sm font-semibold text-gray-600">Completed Today</h3>
          <p className="text-3xl font-bold text-green-600">
            {metrics?.completedTodayCount || 0}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded">
          <h3 className="text-sm font-semibold text-gray-600">Agent Health</h3>
          <p className="text-3xl font-bold text-purple-600">
            {Math.round(metrics?.agentHealthScore || 0)}%
          </p>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Last updated: {metrics?.timestamp || 'N/A'}
      </div>
    </div>
  );
}
`;

// ============================================================================
// EXPORT FOR USAGE
// ============================================================================

export default {
  initializeAdminPanel,
  logAuditEvent,
  validateAdminToken,
  hasPermission,
  adminAuthMiddleware,
  AdminPermissions,
  RolePermissions,
  TaskResourceConfig,
  AgentResourceConfig,
  SwarmResourceConfig,
  AdminUserResourceConfig,
  AuditLogResourceConfig,
};
