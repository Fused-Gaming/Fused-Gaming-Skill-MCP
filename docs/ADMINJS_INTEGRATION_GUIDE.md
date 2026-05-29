# AdminJS Integration Guide for Fused Gaming MCP

## Overview

AdminJS is a Node.js admin framework that generates a complete admin panel UI from your application models. This guide demonstrates how to integrate AdminJS with the Fused Gaming MCP's Next.js and Express-based architecture to provide:

- **Resource Management**: Tasks, swarms, agents, and workflow automation dashboards
- **Role-Based Access Control (RBAC)**: Admin, moderator, and user role management
- **Audit Logging**: Track all administrative actions and changes
- **Real-time Metrics**: Agent monitoring, task execution status, and swarm health
- **User/Role Management**: Manage team members and their permissions

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Installation & Setup](#installation--setup)
3. [Next.js Integration](#nextjs-integration)
4. [Express Integration](#express-integration)
5. [Resource Configuration](#resource-configuration)
6. [Authentication & Authorization](#authentication--authorization)
7. [Custom Components](#custom-components)
8. [Audit Logging](#audit-logging)
9. [Performance Optimization](#performance-optimization)
10. [Deployment Considerations](#deployment-considerations)

---

## Architecture Overview

### Component Topology

```
┌─────────────────────────────────────────────────────────────┐
│  Browser / Admin User                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js App Router (/admin)                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ AdminJS React Components (SSR)                          ││
│  │ - Dashboard                                             ││
│  │ - Resource Lists (Tasks, Swarms, Agents)               ││
│  │ - Detail Views & Forms                                 ││
│  │ - Custom Charts & Metrics                              ││
│  └─────────────────────────────────────────────────────────┘│
└──────────────────────┬──────────────────────────────────────┘
                       │ API Calls
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  AdminJS API Layer (/api/admin/*)                           │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Authentication & Authorization Middleware              ││
│  │ - JWT verification                                     ││
│  │ - Role-based access checks                            ││
│  │ - Audit logging hooks                                 ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Resource Handlers                                       ││
│  │ - Tasks (CRUD + bulk operations)                       ││
│  │ - Swarms (read-only metrics + limited mutations)      ││
│  │ - Agents (monitoring & status updates)                 ││
│  │ - Users & Roles (full CRUD)                           ││
│  │ - Audit Logs (read-only)                              ││
│  └─────────────────────────────────────────────────────────┘│
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
    ┌─────────────┐         ┌──────────────────┐
    │  Database   │         │ Event Bus / Pub  │
    │  (Postgres) │         │ Sub (for metrics)│
    └─────────────┘         └──────────────────┘
```

### Key Design Decisions

1. **Next.js as Primary Interface**: Uses Next.js App Router for SSR and streaming
2. **API Route Handlers**: AdminJS API mounted at `/api/admin/*` routes
3. **Stateless Auth**: JWT-based authentication with role-based checks
4. **Event-Driven Metrics**: Real-time metrics streamed via Server-Sent Events (SSE)
5. **Audit Trail**: All mutations logged to database with user/timestamp metadata

---

## Installation & Setup

### 1. Install Dependencies

```bash
npm install admin-bro
npm install --save-dev @types/admin-bro
```

For specific adapters:

```bash
# For Express.js backend
npm install admin-bro-express

# For TypeORM integration (recommended for Postgres)
npm install admin-bro-typeorm typeorm

# For Prisma integration (alternative)
npm install admin-bro-prisma prisma

# Optional: For file uploads
npm install admin-bro-upload
```

### 2. Update Workspace Dependency in `packages/web/package.json`

```json
{
  "dependencies": {
    "admin-bro": "^6.8.0",
    "admin-bro-express": "^7.0.0",
    "express": "^4.18.0",
    "@types/express": "^4.17.0"
  },
  "devDependencies": {
    "@types/admin-bro": "^6.8.0",
    "@types/express": "^4.17.0"
  }
}
```

### 3. Environment Configuration

Create `.env.local`:

```bash
# AdminJS Configuration
ADMIN_PANEL_ENABLED=true
ADMIN_PANEL_PATH=/admin
ADMIN_COOKIE_NAME=adminjs_session
ADMIN_COOKIE_SECRET=your-secure-random-string-min-32-chars
ADMIN_SESSION_TIMEOUT=86400000  # 24 hours in ms

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/fused_gaming

# Feature Flags
ENABLE_AUDIT_LOGGING=true
ENABLE_METRICS_STREAMING=true
ENABLE_BULK_OPERATIONS=true
```

---

## Next.js Integration

### 1. Create AdminJS Instance Module

**File: `packages/web/lib/admin/adminjs-instance.ts`**

```typescript
import AdminJS from 'admin-bro';
import AdminJSExpress from 'admin-bro-express';
import express, { Express, Router } from 'express';
import {
  DataSource,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import bcrypt from 'bcrypt';

// ============================================================================
// Entity Definitions
// ============================================================================

@Entity('swarm_tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  swarmId: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending',
  })
  status: 'pending' | 'running' | 'completed' | 'failed';

  @Column('jsonb', { default: {} })
  metadata: Record<string, any>;

  @Column({ default: 0 })
  progress: number;

  @Column({ type: 'timestamptz', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('swarm_agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  swarmId: string;

  @Column()
  role: 'coordinator' | 'executor' | 'reviewer' | 'monitor' | 'optimizer';

  @Column({
    type: 'enum',
    enum: ['idle', 'busy', 'error', 'offline'],
    default: 'idle',
  })
  status: string;

  @Column({ default: 0 })
  load: number;

  @Column({ default: 10 })
  capacity: number;

  @Column('decimal', { precision: 5, scale: 4, default: 1.0 })
  successRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('swarms')
export class Swarm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  topology: 'hierarchical' | 'mesh' | 'star';

  @Column('decimal', { precision: 3, scale: 2, default: 0.0 })
  health: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0.0 })
  uptime: number;

  @OneToMany(() => Agent, (agent) => agent.swarmId)
  agents: Agent[];

  @OneToMany(() => Task, (task) => task.swarmId)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('admin_users')
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'moderator', 'viewer'],
    default: 'viewer',
  })
  role: 'admin' | 'moderator' | 'viewer';

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  action: string; // create, update, delete, etc.

  @Column()
  resourceType: string; // Task, Agent, Swarm, etc.

  @Column()
  resourceId: string;

  @Column('jsonb')
  changes: Record<string, any>; // { field: { before, after } }

  @Column({ nullable: true })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}

// ============================================================================
// AdminJS Instance Configuration
// ============================================================================

export interface AdminJSConfig {
  dataSource: DataSource;
  adminSecret: string;
  cookieName: string;
  adminRoute: string;
}

export class AdminJSManager {
  static admin: AdminJS;
  static router: Router;

  static async initialize(config: AdminJSConfig): Promise<void> {
    const { dataSource, adminSecret, cookieName, adminRoute } = config;

    // Register entities
    AdminJS.registerAdapter({
      Resource: require('admin-bro-typeorm').Resource,
      Database: require('admin-bro-typeorm').Database,
    });

    const dataSourceInstance = await dataSource.initialize();

    // Create AdminJS instance
    this.admin = new AdminJS({
      resources: [
        {
          resource: Task,
          options: {
            properties: {
              status: {
                availableValues: [
                  { value: 'pending', label: 'Pending' },
                  { value: 'running', label: 'Running' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'failed', label: 'Failed' },
                ],
              },
              metadata: {
                type: 'textarea',
                custom: {
                  // Custom JSON editor
                },
              },
            },
            actions: {
              // Disable delete for completed tasks
              delete: { isAccessible: this.canDeleteTask },
              bulkDelete: { isAccessible: false },
            },
          },
        },
        {
          resource: Agent,
          options: {
            properties: {
              role: {
                availableValues: [
                  { value: 'coordinator', label: 'Coordinator' },
                  { value: 'executor', label: 'Executor' },
                  { value: 'reviewer', label: 'Reviewer' },
                  { value: 'monitor', label: 'Monitor' },
                  { value: 'optimizer', label: 'Optimizer' },
                ],
              },
              status: { isVisible: { show: true, edit: false } }, // Read-only
            },
            actions: {
              // Agents are mostly read-only
              edit: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === 'admin' },
              delete: { isAccessible: false },
            },
          },
        },
        {
          resource: Swarm,
          options: {
            actions: {
              // Swarms should be managed programmatically
              delete: { isAccessible: false },
              bulkDelete: { isAccessible: false },
            },
          },
        },
        {
          resource: AdminUser,
          options: {
            before: {
              create: (request) => this.hashAdminPassword(request),
              update: (request) => this.hashAdminPassword(request),
            },
            properties: {
              password: { type: 'password', isVisible: { show: false } },
            },
          },
        },
        {
          resource: AuditLog,
          options: {
            actions: {
              // Audit logs are immutable
              new: { isAccessible: false },
              edit: { isAccessible: false },
              delete: { isAccessible: false },
              bulkDelete: { isAccessible: false },
            },
          },
        },
      ],
      branding: {
        companyName: 'Fused Gaming',
        logo: '/logo.png',
      },
      locale: {
        language: 'en',
        translations: {
          messages: {
            loginWelcome: 'Welcome to Fused Gaming Admin',
          },
        },
      },
    });

    // Build and initialize router
    this.router = AdminJSExpress.buildRouter(this.admin, {
      authenticate: this.authenticateAdmin.bind(this),
      cookieName,
      cookiePassword: adminSecret,
    });
  }

  /**
   * Authentication handler for AdminJS
   */
  private static async authenticateAdmin(email: string, password: string) {
    // Implementation depends on your user store
    // Example with database lookup:
    /*
    const user = await dataSource
      .getRepository(AdminUser)
      .findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    */
    return null;
  }

  /**
   * Hash password before storing
   */
  private static hashAdminPassword(request: any) {
    if (request.payload.record.password) {
      request.payload.record.password = bcrypt.hashSync(
        request.payload.record.password,
        10
      );
    }
    return request;
  }

  /**
   * Access control: Can delete task?
   */
  private static canDeleteTask = ({ currentAdmin, record }: any) => {
    if (currentAdmin?.role !== 'admin') return false;
    if (record?.status === 'running') return false;
    return true;
  };

  /**
   * Get the configured router
   */
  static getRouter(): Router {
    if (!this.router) {
      throw new Error('AdminJS not initialized. Call initialize() first.');
    }
    return this.router;
  }

  /**
   * Get the AdminJS instance
   */
  static getInstance(): AdminJS {
    if (!this.admin) {
      throw new Error('AdminJS not initialized. Call initialize() first.');
    }
    return this.admin;
  }
}
```

### 2. Create Next.js API Route Handler

**File: `packages/web/app/api/admin/[...adminjs]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import express, { Express } from 'express';
import { validateAuthMiddleware, isAdmin } from '@/lib/auth-middleware';
import { AdminJSManager } from '@/lib/admin/adminjs-instance';

// Initialize Express app for AdminJS
const adminApp: Express = express();

// Lazy load AdminJS on first request
let adminInitialized = false;

async function initializeAdminJS() {
  if (adminInitialized) return;

  // Initialize with database connection
  // This depends on your ORM setup (TypeORM, Prisma, etc.)
  await AdminJSManager.initialize({
    dataSource: getDataSource(), // Your data source
    adminSecret: process.env.ADMIN_COOKIE_SECRET!,
    cookieName: process.env.ADMIN_COOKIE_NAME || 'adminjs_session',
    adminRoute: process.env.ADMIN_PANEL_PATH || '/admin',
  });

  const adminRouter = AdminJSManager.getRouter();
  adminApp.use(adminRouter);

  adminInitialized = true;
}

/**
 * Middleware to verify admin access
 */
async function requireAdminAccess(request: NextRequest): Promise<boolean> {
  const { user } = await validateAuthMiddleware(request);
  return isAdmin(user);
}

/**
 * Convert Next.js request to Express request-like object
 */
async function nextToExpressRequest(
  request: NextRequest,
  pathname: string
): Promise<{
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
}> {
  const method = request.method;
  const headers: Record<string, string> = {};

  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let body;
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      body = await request.json();
    } catch {
      // If not JSON, try text or form data
      body = await request.text();
    }
  }

  return {
    method,
    url: pathname,
    headers,
    body,
  };
}

/**
 * Main API handler
 */
export async function handler(
  request: NextRequest,
  { params }: { params: { adminjs: string[] } }
) {
  try {
    // Check admin access
    const hasAccess = await requireAdminAccess(request);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Initialize AdminJS on first call
    await initializeAdminJS();

    // Get the requested path
    const pathname = `/admin/${params.adminjs?.join('/') || ''}`;

    // Convert and forward request to AdminJS Express router
    const expressRequest = await nextToExpressRequest(request, pathname);

    // This is a simplified approach; in production, you'd use
    // a proper Next.js -> Express adapter or AdminJS Next.js plugin
    // See next section for a better approach

    return NextResponse.json({
      message: 'AdminJS endpoint',
      path: pathname,
      method: expressRequest.method,
    });
  } catch (error) {
    console.error('AdminJS handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
```

### 3. Better Approach: Use AdminJS React Components Directly

**File: `packages/web/app/admin/page.tsx`** (Recommended)

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { validateAuthMiddleware } from '@/lib/auth-middleware';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authorization client-side
    // In production, use proper session/token validation
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          router.push('/auth/login');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <AdminDashboard />
    </div>
  );
}
```

---

## Express Integration

### 1. Standalone Express Server with AdminJS

**File: `packages/api/src/admin-server.ts`** (New Express Backend)

```typescript
import express, { Express } from 'express';
import AdminJS from 'admin-bro';
import AdminJSExpress from 'admin-bro-express';
import AdminJSTypeORM from 'admin-bro-typeorm';
import { DataSource } from 'typeorm';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';

// Register AdminJS adapter
AdminJS.registerAdapter({
  Resource: AdminJSTypeORM.Resource,
  Database: AdminJSTypeORM.Database,
});

/**
 * Initialize AdminJS Express server
 */
export async function initializeAdminServer(
  app: Express,
  dataSource: DataSource
): Promise<void> {
  // Initialize TypeORM data source
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  // ========================================================================
  // Session Configuration
  // ========================================================================

  app.use(cookieParser());

  app.use(
    session({
      secret: process.env.ADMIN_COOKIE_SECRET || 'default-secret-change-me',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // ========================================================================
  // AdminJS Configuration
  // ========================================================================

  const adminJs = new AdminJS({
    databases: [dataSource],
    rootPath: '/admin',
    logoutPath: '/admin/logout',
    loginPath: '/admin/login',
    branding: {
      companyName: 'Fused Gaming MCP',
      logo: '/logo.png',
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
    dashboard: {
      handler: async ({ resource, action }, response, context) => {
        return {
          totalTasks: 152,
          activeTasks: 12,
          completedToday: 45,
          systemHealth: 95.2,
          uptime: 99.98,
        };
      },
    },
    resources: [
      {
        resource: Task,
        options: {
          parent: {
            name: 'Swarm Management',
          },
          properties: {
            id: { isVisible: { show: true, edit: false, list: true } },
            status: {
              availableValues: [
                { value: 'pending', label: 'Pending' },
                { value: 'running', label: 'Running' },
                { value: 'completed', label: 'Completed' },
                { value: 'failed', label: 'Failed' },
              ],
            },
            metadata: { type: 'textarea' },
            progress: { type: 'number' },
          },
          actions: {
            show: { isAccessible: true },
            list: { isAccessible: true },
            edit: { isAccessible: checkRole('admin', 'moderator') },
            delete: { isAccessible: checkRole('admin') },
            new: { isAccessible: checkRole('admin', 'moderator') },
          },
        },
      },
      {
        resource: Agent,
        options: {
          parent: {
            name: 'Swarm Management',
          },
          actions: {
            edit: { isAccessible: checkRole('admin') },
            delete: { isAccessible: false },
            new: { isAccessible: false },
          },
        },
      },
      {
        resource: Swarm,
        options: {
          parent: {
            name: 'Swarm Management',
          },
          actions: {
            edit: { isAccessible: checkRole('admin') },
            delete: { isAccessible: false },
            new: { isAccessible: false },
          },
        },
      },
      {
        resource: AdminUser,
        options: {
          parent: {
            name: 'Admin Panel',
          },
          actions: {
            edit: { isAccessible: checkRole('admin') },
            delete: { isAccessible: checkRole('admin') },
            new: { isAccessible: checkRole('admin') },
          },
        },
      },
      {
        resource: AuditLog,
        options: {
          parent: {
            name: 'Admin Panel',
          },
          actions: {
            edit: { isAccessible: false },
            delete: { isAccessible: false },
            new: { isAccessible: false },
          },
        },
      },
    ],
  });

  // ========================================================================
  // Authentication Middleware
  // ========================================================================

  const authenticate = async (
    email: string,
    password: string
  ): Promise<AdminUser | null> => {
    const adminUserRepository = dataSource.getRepository(AdminUser);
    const user = await adminUserRepository.findOne({
      where: { email, isActive: true },
    });

    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);
    return passwordMatch ? user : null;
  };

  // ========================================================================
  // Build and Mount AdminJS Router
  // ========================================================================

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate,
      cookieName: 'adminjs_auth',
      cookiePassword: process.env.ADMIN_COOKIE_SECRET!,
    },
    null, // Use in-memory session store for demo
    {
      resave: false,
      saveUninitialized: false,
    }
  );

  app.use(adminJs.options.rootPath, adminRouter);

  console.log(`AdminJS initialized at ${adminJs.options.rootPath}`);
}

/**
 * Helper: Check role for access control
 */
function checkRole(...roles: string[]) {
  return async ({ currentAdmin }: any) => {
    if (!currentAdmin) return false;
    return roles.includes(currentAdmin.role);
  };
}

/**
 * Entity Definitions (same as Next.js section)
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('swarm_tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  swarmId: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending',
  })
  status: 'pending' | 'running' | 'completed' | 'failed';

  @Column('jsonb', { default: {} })
  metadata: Record<string, any>;

  @Column({ default: 0 })
  progress: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('swarm_agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  swarmId: string;

  @Column()
  role: string;

  @Column({ default: 'idle' })
  status: string;

  @Column({ default: 0 })
  load: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('swarms')
export class Swarm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  topology: string;

  @Column('decimal', { default: 0 })
  health: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('admin_users')
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'moderator', 'viewer'],
    default: 'viewer',
  })
  role: 'admin' | 'moderator' | 'viewer';

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  action: string;

  @Column()
  resourceType: string;

  @Column()
  resourceId: string;

  @Column('jsonb')
  changes: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
```

### 2. Initialize in Main Express App

**File: `packages/api/src/server.ts`** (Updated)

```typescript
import express from 'express';
import { DataSource } from 'typeorm';
import { initializeAdminServer } from './admin-server';

const app = express();

// Create TypeORM data source
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'fused_gaming',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [
    'src/entities/*.ts', // or specify entities explicitly
  ],
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize AdminJS
AppDataSource.initialize()
  .then(async () => {
    await initializeAdminServer(app, AppDataSource);

    // Other routes
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    // Start server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`AdminJS available at http://localhost:${PORT}/admin`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

export default app;
```

---

## Resource Configuration

### Task Management Resource

```typescript
{
  resource: Task,
  options: {
    parent: { name: 'Swarm Management' },
    properties: {
      id: {
        label: 'Task ID',
        isVisible: { show: true, edit: false, list: true },
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
        isVisible: { show: true, edit: true, list: true },
      },
      metadata: {
        label: 'Metadata',
        type: 'textarea',
        custom: {
          // Custom JSON editor component
        },
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
        isAccessible: ({ currentAdmin }) => !!currentAdmin,
      },
      list: {
        isAccessible: ({ currentAdmin }) => !!currentAdmin,
        sort: {
          sortBy: 'createdAt',
          direction: 'desc',
        },
      },
      edit: {
        isAccessible: ({ currentAdmin, record }) => {
          return currentAdmin?.role === 'admin';
        },
      },
      delete: {
        isAccessible: ({ currentAdmin, record }) => {
          // Can't delete running tasks
          return (
            currentAdmin?.role === 'admin' && record?.status !== 'running'
          );
        },
      },
      new: {
        isAccessible: ({ currentAdmin }) => {
          return ['admin', 'moderator'].includes(currentAdmin?.role);
        },
      },
      bulkDelete: {
        isAccessible: false, // Disable bulk delete for safety
      },
    },
    filters: [
      {
        name: 'status',
        position: 0,
        property: {
          path: 'status',
          filter: {
            condition: 'EQUAL',
            value: 'running',
          },
        },
      },
    ],
  },
}
```

---

## Authentication & Authorization

### JWT-based Admin Auth

```typescript
export interface AdminContext {
  id: string;
  email: string;
  role: 'admin' | 'moderator' | 'viewer';
  permissions: string[];
}

export async function validateAdminToken(
  token: string
): Promise<AdminContext | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Verify admin role
    if (!['admin', 'moderator', 'viewer'].includes(decoded.role)) {
      return null;
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || [],
    };
  } catch {
    return null;
  }
}

export function hasPermission(
  context: AdminContext,
  permission: string
): boolean {
  if (context.role === 'admin') return true; // Admins have all permissions
  return context.permissions.includes(permission);
}

export const adminPermissions = {
  READ_TASKS: 'read:tasks',
  WRITE_TASKS: 'write:tasks',
  DELETE_TASKS: 'delete:tasks',
  READ_AGENTS: 'read:agents',
  WRITE_AGENTS: 'write:agents',
  READ_SWARMS: 'read:swarms',
  WRITE_SWARMS: 'write:swarms',
  MANAGE_USERS: 'manage:users',
  VIEW_AUDIT_LOGS: 'view:audit_logs',
};
```

---

## Custom Components

### Custom Dashboard Widget

```typescript
// packages/web/components/admin/CustomMetricsWidget.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

export interface MetricsData {
  timestamp: string;
  taskCount: number;
  agentCount: number;
  systemHealth: number;
  tasksCompleted: number;
}

export function CustomMetricsWidget() {
  const [metrics, setMetrics] = useState<MetricsData[]>([]);
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
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">System Metrics</h3>
      <LineChart width={600} height={300} data={metrics}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Line type="monotone" dataKey="systemHealth" stroke="#0ea5e9" />
        <Line type="monotone" dataKey="taskCount" stroke="#8b5cf6" />
      </LineChart>
    </div>
  );
}
```

### Custom List Filter

```typescript
{
  resource: Task,
  options: {
    actions: {
      list: {
        before: async (request, context) => {
          // Add custom filtering logic
          if (request.query?.statusGroup === 'active') {
            request.query.status = ['pending', 'running'];
          }
          return request;
        },
      },
    },
  },
}
```

---

## Audit Logging

### Automatic Audit Trail

```typescript
export async function logAuditEvent(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  changes?: Record<string, any>,
  reason?: string
): Promise<void> {
  const auditRepository = AppDataSource.getRepository(AuditLog);

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
    });
  }
}

// Hook into AdminJS resource actions
{
  resource: Task,
  options: {
    before: {
      create: async (request, context) => {
        // Task will be created
        return request;
      },
      update: async (request, context) => {
        // Track what changed
        const before = request.record; // original
        const after = request.payload.record; // new values

        await logAuditEvent(
          context.currentAdmin.id,
          'update',
          'Task',
          request.record.id,
          {
            before,
            after,
          }
        );

        return request;
      },
      delete: async (request, context) => {
        await logAuditEvent(
          context.currentAdmin.id,
          'delete',
          'Task',
          request.record.id,
          { deleted: request.record }
        );

        return request;
      },
    },
  },
}
```

---

## Performance Optimization

### 1. Database Query Optimization

```typescript
{
  resource: Task,
  options: {
    properties: {
      // Don't load large JSON by default
      metadata: {
        isVisible: { show: true, edit: true, list: false },
      },
    },
  },
}
```

### 2. Pagination Configuration

```typescript
{
  resource: Task,
  options: {
    defaultPerPage: 25,
    actions: {
      list: {
        paginate: true,
        pageSize: 25,
      },
    },
  },
}
```

### 3. Caching Strategy

```typescript
// Cache frequently accessed resources
const cache = new Map<string, any>();

export function getCachedResource(key: string) {
  return cache.get(key);
}

export function setCachedResource(
  key: string,
  value: any,
  ttlMs: number = 300000
) {
  cache.set(key, value);
  setTimeout(() => cache.delete(key), ttlMs);
}
```

### 4. Real-time Metrics via SSE

```typescript
// packages/web/app/api/admin/metrics/stream/route.ts
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send metrics every 5 seconds
      const interval = setInterval(async () => {
        const metrics = await fetchLatestMetrics();
        const data = `data: ${JSON.stringify(metrics)}\n\n`;
        controller.enqueue(encoder.encode(data));
      }, 5000);

      // Cleanup on disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

async function fetchLatestMetrics() {
  return {
    timestamp: new Date().toISOString(),
    taskCount: 152,
    agentCount: 48,
    systemHealth: 95.2,
    tasksCompleted: 1240,
  };
}
```

---

## Deployment Considerations

### 1. Environment Variables

```bash
# .env.production
ADMIN_PANEL_ENABLED=true
ADMIN_PANEL_PATH=/admin
ADMIN_COOKIE_SECRET=<use-strong-random-string>
ADMIN_SESSION_TIMEOUT=86400000

DATABASE_URL=postgresql://user:password@prod-db.example.com/fused_gaming
JWT_SECRET=<use-strong-random-string>
JWT_EXPIRY=24h

AUDIT_LOGGING_ENABLED=true
AUDIT_SERVICE_URL=https://audit.example.com/log

NODE_ENV=production
```

### 2. Security Best Practices

- [ ] Enable HTTPS only
- [ ] Set secure, HTTP-only cookies
- [ ] Implement rate limiting on admin routes
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable CORS restrictions for admin panel
- [ ] Require MFA for admin accounts
- [ ] Audit log all admin actions
- [ ] Regular security audits of admin permissions

### 3. Docker Configuration

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

### 4. Monitoring & Alerts

```typescript
// Monitor admin panel health
export async function healthCheck() {
  try {
    // Verify database connectivity
    const dbConnection = await AppDataSource.query('SELECT 1');

    // Check admin user count
    const adminCount = await AppDataSource.getRepository(AdminUser).count();

    return {
      status: 'healthy',
      database: 'connected',
      adminCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: (error as Error).message,
      timestamp: new Date().toISOString(),
    };
  }
}
```

---

## Troubleshooting

### Common Issues

**Issue**: AdminJS not loading
- Check that all entities are properly registered with TypeORM
- Verify database connection is active
- Check browser console for CORS errors

**Issue**: Slow admin panel
- Reduce default page size for large tables
- Add database indexes on frequently filtered columns
- Enable query caching for read-only views

**Issue**: Authentication failures
- Verify JWT secret is set correctly
- Check session cookie settings (SameSite, Secure)
- Validate user roles in database

---

## References

- [AdminJS Official Documentation](https://admin-bro.com)
- [TypeORM Integration](https://github.com/admin-bro/admin-bro-typeorm)
- [Prisma Integration](https://github.com/admin-bro/admin-bro-prisma)
- [Next.js Integration Patterns](https://nextjs.org/docs)
- [Express.js Best Practices](https://expressjs.com/)
