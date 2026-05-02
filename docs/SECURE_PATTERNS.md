# 🔒 Secure Coding Patterns

**Best Practices and Reference Implementations for Secure Code**

---

## Overview

This document provides concrete, copy-paste-ready code patterns for implementing common security requirements in Fused Gaming MCP.

---

## 1. Input Validation Patterns

### 1.1 Basic Validation with Zod

```typescript
import { z } from 'zod';

// Define schema
const UserIdSchema = z.string()
  .uuid('Must be valid UUID')
  .describe('User unique identifier');

const CreateUserSchema = z.object({
  id: UserIdSchema,
  email: z.string().email('Invalid email'),
  username: z.string()
    .min(3, 'Min 3 characters')
    .max(20, 'Max 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscore'),
  age: z.number()
    .int('Must be integer')
    .min(13, 'Must be 13 or older')
    .max(150, 'Must be realistic age'),
  role: z.enum(['USER', 'ADMIN', 'MODERATOR']),
});

type CreateUser = z.infer<typeof CreateUserSchema>;

// Use in handler
export async function createUser(input: unknown): Promise<void> {
  const validated = CreateUserSchema.parse(input);
  // validated is now safely typed as CreateUser
  await db.users.create(validated);
}

// With error handling
export async function createUserSafe(input: unknown): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const validated = CreateUserSchema.parse(input);
    await db.users.create(validated);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Log details internally
      logger.warn('Validation failed', { 
        issues: error.issues 
      });
      // Return generic message
      return { 
        success: false, 
        error: 'Invalid input provided' 
      };
    }
    throw error;
  }
}
```

### 1.2 Array Validation

```typescript
const CreateBulkUsersSchema = z.object({
  users: z.array(CreateUserSchema)
    .min(1, 'At least 1 user')
    .max(100, 'Maximum 100 users per request'),
});

// Batch operations with size limits
export async function createBulkUsers(input: unknown) {
  const validated = CreateBulkUsersSchema.parse(input);
  
  // Process in chunks
  const CHUNK_SIZE = 10;
  for (let i = 0; i < validated.users.length; i += CHUNK_SIZE) {
    const chunk = validated.users.slice(i, i + CHUNK_SIZE);
    await Promise.all(chunk.map(u => db.users.create(u)));
  }
}
```

### 1.3 Conditional Validation

```typescript
const UpdateUserSchema = z.object({
  id: UserIdSchema,
  email: z.string().email().optional(),
  password: z.string()
    .min(12, 'Min 12 chars')
    .regex(/[A-Z]/, 'Needs uppercase')
    .regex(/[0-9]/, 'Needs number')
    .optional(),
}).refine(
  (data) => {
    // If password provided, require email confirmation
    if (data.password && !data.email) {
      return false;
    }
    return true;
  },
  {
    message: 'Email required when changing password',
    path: ['email'],
  }
);
```

---

## 2. Path Validation Patterns

### 2.1 Safe File Path Handling

```typescript
import path from 'path';
import { existsSync } from 'fs';

const ALLOWED_BASE = '/app/user-files';

export function securePath(userPath: string): string {
  const baseResolved = path.resolve(ALLOWED_BASE);
  const resolved = path.resolve(baseResolved, userPath);
  
  // Check existence BEFORE resolving symlinks to avoid ENOENT leaking paths
  if (!existsSync(resolved)) {
    throw new NotFoundError('File not found');
  }
  
  // Verify within bounds using realpath to resolve symlinks
  const realBase = fs.realpathSync(baseResolved);
  let realPath: string;
  try {
    realPath = fs.realpathSync(resolved);
  } catch (error) {
    throw new SecurityError('Path cannot be accessed');
  }
  
  // Check that resolved path is within the allowed base
  // Must use path separator to avoid sibling prefix bypass
  if (!realPath.startsWith(realBase + path.sep) && realPath !== realBase) {
    throw new SecurityError('Path traversal attempt detected');
  }
  
  return realPath;
}

// Usage
export async function readUserFile(filepath: string): Promise<Buffer> {
  const safePath = securePath(filepath);
  return fs.promises.readFile(safePath);
}
```

### 2.2 Directory Traversal Protection

```typescript
// ❌ UNSAFE - allows ../../../etc/passwd
router.get('/file/:name', (req, res) => {
  const file = path.join('/uploads', req.params.name);
  res.sendFile(file);
});

// ✅ SAFE - prevents directory traversal
router.get('/file/:name', (req, res) => {
  const basename = path.basename(req.params.name);
  if (basename !== req.params.name) {
    return res.status(400).send('Invalid file name');
  }
  
  const file = path.join('/uploads', basename);
  
  const realpath = fs.realpathSync(file);
  if (!realpath.startsWith('/uploads/')) {
    return res.status(400).send('Path traversal detected');
  }
  
  res.sendFile(realpath);
});
```

---

## 3. Authentication & Authorization Patterns

### 3.1 JWT Token Management

```typescript
import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '15m'; // Short expiry
const REFRESH_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  permissions: string[];
  iat: number;
  exp: number;
}

export function generateTokens(userId: string, permissions: string[]) {
  const now = Date.now() / 1000;
  
  const accessToken = jwt.sign(
    { userId, permissions, iat: now },
    TOKEN_SECRET!,
    { expiresIn: TOKEN_EXPIRY }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh', iat: now },
    TOKEN_SECRET!,
    { expiresIn: REFRESH_EXPIRY }
  );
  
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    const payload = jwt.verify(token, TOKEN_SECRET!) as any;
    
    // Reject refresh tokens when access token is required
    if (payload.type === 'refresh') {
      throw new AuthenticationError('Refresh token cannot be used for API access');
    }
    
    return payload as TokenPayload;
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
}

// Middleware
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization' });
  }
  
  try {
    const token = header.slice(7);
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

### 3.2 Role-Based Access Control

```typescript
export type Role = 'USER' | 'MODERATOR' | 'ADMIN';

export const PERMISSIONS: Record<Role, string[]> = {
  USER: ['READ_OWN_DATA', 'CREATE_POST', 'READ_PUBLIC'],
  MODERATOR: ['READ_OWN_DATA', 'CREATE_POST', 'READ_PUBLIC', 'MODERATE_POSTS', 'VIEW_REPORTS'],
  ADMIN: ['*'], // All permissions
};

// Middleware
export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { userId: string; permissions: string[] };
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const has = user.permissions.includes('*') || 
                user.permissions.includes(permission);
    
    if (!has) {
      logger.warn('Permission denied', { userId: user.userId, permission });
      return res.status(403).json({ error: 'Permission denied' });
    }
    
    next();
  };
}

// Usage in routes
router.delete('/users/:id', 
  authMiddleware,
  requirePermission('DELETE_USER'),
  deleteUserHandler
);
```

### 3.3 Session Management

```typescript
import crypto from 'crypto';

export interface Session {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  userAgent: string;
  ipAddress: string;
  revoked: boolean;
}

export function createSession(userId: string, userAgent: string, ip: string): Session {
  return {
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    userAgent,
    ipAddress: ip,
    revoked: false,
  };
}

export async function validateSession(sessionId: string, userAgent: string, ip: string) {
  const session = await db.sessions.findById(sessionId);
  
  if (!session) {
    throw new SessionError('Session not found');
  }
  
  if (session.revoked) {
    throw new SessionError('Session revoked');
  }
  
  if (new Date() > session.expiresAt) {
    await db.sessions.delete(sessionId);
    throw new SessionError('Session expired');
  }
  
  // Detect suspicious activity
  if (session.userAgent !== userAgent || session.ipAddress !== ip) {
    logger.warn('Session mismatch', { sessionId, userId: session.userId });
    // Could require re-authentication
  }
  
  return session;
}
```

---

## 4. Data Protection Patterns

### 4.1 Password Hashing

```typescript
import bcrypt from 'bcrypt';

const HASH_ROUNDS = 12; // Adjust based on performance needs

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, HASH_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Usage
export async function createUser(username: string, password: string) {
  // Validate password strength
  if (password.length < 12) {
    throw new ValidationError('Password must be 12+ characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    throw new ValidationError('Password must contain uppercase');
  }
  
  if (!/[0-9]/.test(password)) {
    throw new ValidationError('Password must contain number');
  }
  
  const hashedPassword = await hashPassword(password);
  return db.users.create({ username, password: hashedPassword });
}

export async function authenticate(username: string, password: string) {
  const user = await db.users.findByUsername(username);
  
  if (!user) {
    // ✅ GOOD: Generic message, log details
    logger.warn('Auth failed: user not found', { username });
    throw new AuthenticationError('Invalid credentials');
  }
  
  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    // ✅ GOOD: Generic message, log details
    logger.warn('Auth failed: invalid password', { userId: user.id });
    throw new AuthenticationError('Invalid credentials');
  }
  
  return user;
}
```

### 4.2 Sensitive Data Encryption

```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
const ALGORITHM = 'aes-256-gcm';

export function encryptSensitive(plaintext: string): {
  encrypted: string;
  iv: string;
  authTag: string;
} {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted: encrypted.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

export function decryptSensitive(
  encrypted: string,
  iv: string,
  authTag: string
): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'hex')),
    decipher.final(),
  ]);
  
  return decrypted.toString('utf8');
}

// Usage
export async function storeApiKey(userId: string, apiKey: string) {
  const { encrypted, iv, authTag } = encryptSensitive(apiKey);
  
  return db.apiKeys.create({
    userId,
    encrypted,
    iv,
    authTag,
  });
}
```

---

## 5. Error Handling Patterns

### 5.1 Secure Error Messages

```typescript
// ✅ GOOD: Non-revealing error response
export async function loginUser(username: string, password: string) {
  try {
    const user = await db.users.findByUsername(username);
    if (!user) {
      logger.info('Login failed: user not found', { username });
      return { error: 'Invalid credentials' }; // Generic message
    }
    
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      logger.info('Login failed: wrong password', { userId: user.id });
      return { error: 'Invalid credentials' }; // Generic message
    }
    
    return { success: true, userId: user.id };
  } catch (error) {
    logger.error('Login error', { error: error.message, username });
    return { error: 'An error occurred' }; // Generic message
  }
}

// ❌ BAD: Information disclosure
export async function badLoginUser(username: string, password: string) {
  try {
    const user = await db.users.findByUsername(username);
    if (!user) {
      return { error: 'User not found' }; // Reveals user doesn't exist!
    }
    
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return { error: 'Wrong password' }; // Reveals password is wrong!
    }
    
    return { success: true };
  } catch (error) {
    return { error: error.message }; // Stack traces exposed!
  }
}
```

### 5.2 Custom Error Classes

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public userMessage: string,
    message?: string
  ) {
    super(message || userMessage);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, 'Invalid input', message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, 'Invalid credentials', message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Permission denied') {
    super(403, 'You do not have permission', message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, 'Resource not found', `${resource} not found`);
  }
}

// Express error handler
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    logger.warn('App error', {
      statusCode: err.statusCode,
      message: err.message,
      path: req.path,
    });
    
    return res.status(err.statusCode).json({
      error: err.userMessage,
    });
  }
  
  // Unexpected error
  logger.error('Unexpected error', { error: err.message });
  res.status(500).json({
    error: 'An unexpected error occurred',
  });
}
```

---

## 6. Safe Command Execution Patterns

### 6.1 Safe Child Process Execution

```typescript
import { execFile, spawn } from 'child_process';
import { promisify } from 'util';

const execFilePromise = promisify(execFile);

// ✅ GOOD: execFile without shell
export async function runLinter(filePath: string) {
  try {
    const { stdout } = await execFilePromise('eslint', [filePath]);
    return stdout;
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      throw new Error('eslint not found');
    }
    throw error;
  }
}

// ✅ GOOD: Spawn with arguments array
export async function buildProject() {
  return new Promise((resolve, reject) => {
    const build = spawn('npm', ['run', 'build'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      timeout: 60000, // 60 second timeout
    });
    
    build.on('error', reject);
    build.on('close', (code) => {
      if (code === 0) resolve(void 0);
      else reject(new Error(`Build failed with code ${code}`));
    });
  });
}

// ❌ DANGEROUS: Shell injection possible
// exec(`npm run ${command}`); // User can inject commands!

// ❌ DANGEROUS: spawn with shell:true
// spawn('command', { shell: true }); // Shell allows injection
```

---

## 7. Rate Limiting Patterns

### 7.1 Rate Limiting with Distributed Store (Production)

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from 'redis';

const redisClient = redis.createClient();

// General API rate limit with Redis store
const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:api:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: false,
  legacyHeaders: false,
});

// Strict rate limit for auth endpoints with Redis
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rate-limit:auth:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 min
  skipSuccessfulRequests: true, // Only count failures
  message: 'Too many login attempts, please try again later',
});

// ⚠️ SINGLE-INSTANCE ONLY: In-memory store (development only)
// DO NOT use this for production multi-instance deployments
// const devLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   // No store specified = process-local memory
// });

// Usage
app.use('/api/', apiLimiter);
app.post('/auth/login', authLimiter, loginHandler);
```

---

## 8. Common Pitfalls & Solutions

### Pitfall 1: Using `any` Type

```typescript
// ❌ BAD
function processData(data: any) {
  return data.value * 2; // What if data doesn't have value?
}

// ✅ GOOD
interface DataInput {
  value: number;
}

function processData(data: DataInput) {
  return data.value * 2;
}
```

### Pitfall 2: Synchronous Crypto

```typescript
import { promisify } from 'util';
import crypto from 'crypto';

// ❌ BAD: Blocks event loop
const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');

// ✅ GOOD: Non-blocking with promisify
const pbkdf2Async = promisify(crypto.pbkdf2);
const hash = await pbkdf2Async(password, salt, 100000, 64, 'sha512');
```

### Pitfall 3: Missing Input Validation in Loops

```typescript
// ❌ BAD: No length validation
function processItems(items: any[]) {
  return items.map(item => expensive operation);
}

// ✅ GOOD: Validate size
function processItems(items: any[]) {
  if (items.length > 1000) {
    throw new Error('Too many items');
  }
  return items.map(item => expensiveOperation(item));
}
```

---

**Last Updated**: 2026-05-02  
**Maintained By**: Fused Gaming Security Team  
**Version**: 1.0.0
