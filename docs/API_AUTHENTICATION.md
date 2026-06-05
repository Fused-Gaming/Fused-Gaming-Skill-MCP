# API Authentication Guide

Complete guide to authentication and authorization for the Orchestration Panel API.

---

## Overview

The Orchestration Panel API implements a multi-tier authentication and authorization system to protect sensitive swarm management operations. This document covers all protected endpoints, authentication mechanisms, and integration patterns.

### Protected Endpoints

The following endpoints require authentication and are protected by the `enforceFirstLoginPasswordChange` middleware:

| Endpoint | Method | Purpose | Role |
|----------|--------|---------|------|
| `/api/swarm/agents` | GET | List all agents in the swarm | admin, operator |
| `/api/swarm/scale` | POST | Scale swarm up or down | admin |
| `/api/dashboard/overview` | GET | Get dashboard overview data | admin, operator |
| `/api/agents/bootstrap` | POST | Bootstrap 60+ agents | admin |
| `/api/memory/vector` | POST | Add memory vector to HNSW index | admin, operator |

### Public Endpoints (No Authentication Required)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | Initial login with one-time password |
| `/api/auth/change-password` | POST | Change password after first login |
| `/api/auth/status` | GET | Get first-login status |
| `/api/health` | GET | System health check |
| `/api/metrics` | GET | Get system and swarm metrics |
| `/api/metrics/history` | GET | Get metric history |
| `/api/config/topology` | GET | Get swarm topology configuration |
| `/api/agents/status` | GET | Get agent swarm status (read-only) |
| `/api/agents/:agentId` | GET | Get specific agent details (read-only) |
| `/api/memory/search` | POST | Search memory vectors |
| `/api/memory/index` | GET | Get HNSW index statistics |
| `/api/memory/agent/:agentId` | GET | Get agent memory profile |

### What Changed

The API enforces mandatory password changes on first login. Administrators receive a one-time-only root password and must set a strong personal password before accessing any protected endpoints. This ensures:

- No default credentials remain active
- Each administrator has a unique, strong password
- Security audit trail of password changes
- Account lockout protection after repeated failed attempts

---

## Authentication Methods

### 1. One-Time Password (First Login)

**Purpose**: Initial login for new installations

**Endpoint**: `POST /api/auth/login`

**Request Format**:
```json
{
  "password": "Quantum-Phoenix-Stellar-Cascade"
}
```

**Response Format (200 OK)**:
```json
{
  "success": true,
  "message": "Initial login successful. Password change required.",
  "nextStep": "change-password",
  "sessionToken": "eyJpYXQiOjE3MTY2NTQzMjAwMDAsImV4cCI6MTcxNjc0MDcyMDAwMCwidHlwZSI6ImZpcnN0LWxvZ2luLXNlc3Npb24ifQ=="
}
```

**Response Format (401 Unauthorized)**:
```json
{
  "error": "Invalid Credentials",
  "message": "Invalid password. 2 attempts remaining."
}
```

**Curl Example**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "Quantum-Phoenix-Stellar-Cascade"}'
```

### 2. Session Token Authentication

After initial login, you receive a session token valid for 24 hours. Use this token in the `Authorization` header for subsequent requests to protected endpoints.

**Token Format**:
```
Authorization: Bearer <session-token>
```

**Token Structure** (Base64-encoded JSON):
```json
{
  "iat": 1716654320000,
  "exp": 1716740720000,
  "type": "first-login-session"
}
```

**Token Lifespan**: 24 hours from issuance

### 3. Password Change (Mandatory First Login)

**Purpose**: Set your permanent password after initial login

**Endpoint**: `POST /api/auth/change-password`

**Request Format**:
```json
{
  "newPassword": "MySecure!Pass123#Strong",
  "confirmPassword": "MySecure!Pass123#Strong"
}
```

**Password Requirements**:
- Minimum 16 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character: `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`
- No more than 2 repeated characters in a row
- No common patterns: `123`, `456`, `789`, `qwerty`, `password`

**Response Format (200 OK)**:
```json
{
  "success": true,
  "message": "Password changed successfully. You can now access the panel.",
  "nextStep": "dashboard"
}
```

**Response Format (400 Bad Request)**:
```json
{
  "error": "Password Change Failed",
  "message": "Weak password: Password must be at least 16 characters, Password must contain a special character"
}
```

**Curl Example**:
```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "MySecure!Pass123#Strong",
    "confirmPassword": "MySecure!Pass123#Strong"
  }'
```

### 4. Check Authentication Status

**Endpoint**: `GET /api/auth/status`

**Response Format**:
```json
{
  "enabled": true,
  "changeRequired": false,
  "createdAt": "2025-05-25T10:00:00.000Z",
  "expiresAt": "2025-05-26T10:00:00.000Z",
  "changedAt": "2025-05-25T10:15:00.000Z",
  "attempts": 0,
  "maxAttempts": 5
}
```

---

## API Endpoints

### Protected Endpoints

#### 1. GET /api/swarm/agents

**Description**: List all agents currently active in the swarm

**Authentication**: Required (Bearer token)

**Request**:
```bash
curl -X GET http://localhost:3000/api/swarm/agents \
  -H "Authorization: Bearer <session-token>"
```

**Response (200 OK)**:
```json
{
  "totalAgents": 4,
  "healthyAgents": 3,
  "agents": [
    {
      "id": "agent-1",
      "name": "Coordinator-01",
      "role": "coordinator",
      "status": "healthy",
      "capacity": 10,
      "currentLoad": 3,
      "successRate": 0.98,
      "lastHeartbeat": "2025-05-25T14:30:45.000Z"
    },
    {
      "id": "agent-2",
      "name": "Executor-01",
      "role": "executor",
      "status": "healthy",
      "capacity": 20,
      "currentLoad": 15,
      "successRate": 0.95,
      "lastHeartbeat": "2025-05-25T14:30:43.000Z"
    }
  ]
}
```

**Response (401 Unauthorized)**:
```json
{
  "error": "Unauthorized"
}
```

**Response (403 Forbidden)**:
```json
{
  "error": "First Login Password Change Required",
  "nextStep": "change-password",
  "message": "You must change your password before accessing the panel"
}
```

---

#### 2. POST /api/swarm/scale

**Description**: Scale the swarm to a specific number of agents

**Authentication**: Required (Bearer token, admin role)

**Request**:
```bash
curl -X POST http://localhost:3000/api/swarm/scale \
  -H "Authorization: Bearer <session-token>" \
  -H "Content-Type: application/json" \
  -d '{"targetAgents": 24}'
```

**Request Format**:
```json
{
  "targetAgents": 24
}
```

**Validation**:
- `targetAgents` must be an integer between 1 and 60

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Scaling swarm to 24 agents",
  "currentAgents": 12,
  "targetAgents": 24,
  "scalingInProgress": true
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "Invalid target",
  "message": "Target agent count must be between 1 and 60"
}
```

**Response (401 Unauthorized)**:
```json
{
  "error": "Unauthorized"
}
```

---

#### 3. GET /api/dashboard/overview

**Description**: Get comprehensive dashboard overview data

**Authentication**: Required (Bearer token)

**Request**:
```bash
curl -X GET http://localhost:3000/api/dashboard/overview \
  -H "Authorization: Bearer <session-token>"
```

**Response (200 OK)**:
```json
{
  "swarmStatus": {
    "activeAgents": 12,
    "maxAgents": 60,
    "totalTasks": 1245,
    "successRate": 0.96
  },
  "systemHealth": {
    "cpuUsage": 28.5,
    "memoryUsage": 42.3,
    "diskUsage": 35,
    "status": "healthy"
  },
  "recentActivity": {
    "tasksCompleted": 45,
    "tasksInProgress": 8,
    "tasksFailed": 2,
    "averageResponseTime": 2340
  },
  "performanceMetrics": {
    "throughput": 18.5,
    "latencyP50": 1200,
    "latencyP95": 4500,
    "latencyP99": 7200
  }
}
```

**Response (401 Unauthorized)**:
```json
{
  "error": "Unauthorized"
}
```

---

#### 4. POST /api/agents/bootstrap

**Description**: Bootstrap 60+ agents for the swarm

**Authentication**: Required (Bearer token, admin role)

**Request**:
```bash
curl -X POST http://localhost:3000/api/agents/bootstrap \
  -H "Authorization: Bearer <session-token>" \
  -H "Content-Type: application/json"
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Bootstrapped 64 agents",
  "agents": [
    {
      "id": "agent-core-001",
      "role": "coordinator",
      "group": "coreAgents",
      "status": "healthy",
      "tasksCompleted": 0,
      "memoryUsageMB": 128,
      "lastHeartbeat": "2025-05-25T14:35:00.000Z"
    }
  ],
  "metrics": {
    "totalBootstrapped": 64,
    "totalMemoryMB": 8192,
    "averageTaskLatency": 45
  }
}
```

**Response (500 Internal Server Error)**:
```json
{
  "error": "Failed to bootstrap agents",
  "details": "Insufficient memory available"
}
```

---

#### 5. POST /api/memory/vector

**Description**: Add a memory vector to the HNSW (Hierarchical Navigable Small World) index

**Authentication**: Required (Bearer token)

**Request**:
```bash
curl -X POST http://localhost:3000/api/memory/vector \
  -H "Authorization: Bearer <session-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent-1",
    "embedding": [0.1, 0.2, 0.3, 0.4, 0.5],
    "contextSize": 512
  }'
```

**Request Format**:
```json
{
  "agentId": "agent-1",
  "embedding": [0.1, 0.2, 0.3, 0.4, 0.5],
  "contextSize": 512
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "vectorId": "vec-1716654320000",
  "indexStatus": {
    "totalVectors": 1234,
    "indexSize": "5.2 MB",
    "lastUpdated": "2025-05-25T14:35:00.000Z",
    "averageSearchLatency": "12 ms"
  }
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "Invalid request",
  "message": "agentId and embedding array are required"
}
```

---

### Public Endpoints (Reference)

#### GET /api/memory/search

**Description**: Search for nearest memory vectors

**Authentication**: None required

**Request**:
```bash
curl -X POST http://localhost:3000/api/memory/search \
  -H "Content-Type: application/json" \
  -d '{
    "embedding": [0.1, 0.2, 0.3, 0.4, 0.5],
    "k": 5,
    "maxDistance": 2.0
  }'
```

**Response (200 OK)**:
```json
{
  "resultsCount": 5,
  "results": [
    {
      "vectorId": "vec-1716654320000",
      "agentId": "agent-1",
      "distance": 0.15,
      "contextSize": 512
    }
  ],
  "indexStatus": {
    "totalVectors": 1234,
    "indexSize": "5.2 MB"
  }
}
```

---

## Error Handling

### 401 Unauthorized

Returned when:
- No token is provided
- Token is invalid or malformed
- Token has expired
- Session has been invalidated

**Response Format**:
```json
{
  "error": "Unauthorized"
}
```

**Recovery Steps**:
1. Log in again with one-time password: `POST /api/auth/login`
2. Change your password: `POST /api/auth/change-password`
3. Include new session token in Authorization header

**Curl Example**:
```bash
# Step 1: Login with one-time password
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "Quantum-Phoenix-Stellar-Cascade"}' \
  > login_response.json

# Extract sessionToken
TOKEN=$(jq -r '.sessionToken' login_response.json)

# Step 2: Change password
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "MySecure!Pass123#Strong",
    "confirmPassword": "MySecure!Pass123#Strong"
  }'

# Step 3: Use token in protected endpoint
curl -X GET http://localhost:3000/api/swarm/agents \
  -H "Authorization: Bearer $TOKEN"
```

---

### 403 Forbidden

Returned when:
- Password change is required but not completed
- User does not have sufficient permissions for the operation
- Account is locked due to too many failed login attempts

**Response Format**:
```json
{
  "error": "First Login Password Change Required",
  "nextStep": "change-password",
  "message": "You must change your password before accessing the panel"
}
```

**Recovery Steps**:
1. Complete mandatory password change: `POST /api/auth/change-password`
2. Retry the protected endpoint request

**Example Flow**:
```bash
# Get current status
curl -X GET http://localhost:3000/api/auth/status

# If changeRequired is true, change password first
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "MySecure!Pass123#Strong",
    "confirmPassword": "MySecure!Pass123#Strong"
  }'

# Then access protected endpoint
curl -X GET http://localhost:3000/api/swarm/agents \
  -H "Authorization: Bearer <session-token>"
```

---

### 400 Bad Request

Returned when:
- Required fields are missing
- Validation fails (e.g., invalid target agents count)
- Request body is malformed

**Response Format**:
```json
{
  "error": "Invalid request",
  "message": "Detailed description of what went wrong"
}
```

---

### 500 Internal Server Error

Returned when:
- Server encounters an unexpected error
- Database is unavailable
- System resource limits are exceeded

**Response Format**:
```json
{
  "error": "Failed to [operation]",
  "details": "Specific error message"
}
```

---

## Migration Guide

### Updating Client Code

#### JavaScript/TypeScript

**Before (No Authentication)**:
```typescript
// Old code without authentication
async function getSwarmAgents() {
  const response = await fetch('http://localhost:3000/api/swarm/agents');
  const data = await response.json();
  return data;
}
```

**After (With Authentication)**:
```typescript
// New code with authentication flow
class OrchestrationClient {
  private sessionToken: string | null = null;
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  // Step 1: Initial login with one-time password
  async login(oneTimePassword: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: oneTimePassword })
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.sessionToken = data.sessionToken;
    console.log('Login successful. Next step:', data.nextStep);
  }

  // Step 2: Change password (mandatory first login)
  async changePassword(newPassword: string, confirmPassword: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword, confirmPassword })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Password change failed: ${error.message}`);
    }

    console.log('Password changed successfully');
  }

  // Step 3: Make authenticated requests
  private async makeRequest(
    endpoint: string,
    options?: RequestInit
  ): Promise<Response> {
    if (!this.sessionToken) {
      throw new Error('Not authenticated. Call login() first.');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Bearer ${this.sessionToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Handle 401 - token expired
    if (response.status === 401) {
      this.sessionToken = null;
      throw new Error('Session expired. Please login again.');
    }

    // Handle 403 - password change required
    if (response.status === 403) {
      const error = await response.json();
      throw new Error(`${error.error}: ${error.message}`);
    }

    return response;
  }

  // Now all API calls use authentication
  async getSwarmAgents() {
    const response = await this.makeRequest('/api/swarm/agents');
    return response.json();
  }

  async scaleSwarm(targetAgents: number) {
    const response = await this.makeRequest('/api/swarm/scale', {
      method: 'POST',
      body: JSON.stringify({ targetAgents })
    });
    return response.json();
  }

  async getDashboardOverview() {
    const response = await this.makeRequest('/api/dashboard/overview');
    return response.json();
  }
}

// Usage Example
async function main() {
  const client = new OrchestrationClient();

  try {
    // Step 1: Login
    await client.login('Quantum-Phoenix-Stellar-Cascade');

    // Step 2: Change password
    await client.changePassword(
      'MySecure!Pass123#Strong',
      'MySecure!Pass123#Strong'
    );

    // Step 3: Make authenticated requests
    const agents = await client.getSwarmAgents();
    console.log('Agents:', agents);

    const overview = await client.getDashboardOverview();
    console.log('Dashboard:', overview);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

#### Axios Helper

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

class AuthorizedAxiosClient {
  private client: AxiosInstance;
  private sessionToken: string | null = null;

  constructor(baseURL: string = 'http://localhost:3000') {
    this.client = axios.create({
      baseURL,
      headers: { 'Content-Type': 'application/json' }
    });

    // Add request interceptor to include token
    this.client.interceptors.request.use((config) => {
      if (this.sessionToken) {
        config.headers.Authorization = `Bearer ${this.sessionToken}`;
      }
      return config;
    });

    // Add response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          console.error('Session expired. Please login again.');
          this.sessionToken = null;
        }
        return Promise.reject(error);
      }
    );
  }

  async login(password: string) {
    const response = await this.client.post('/api/auth/login', { password });
    this.sessionToken = response.data.sessionToken;
    return response.data;
  }

  async changePassword(newPassword: string, confirmPassword: string) {
    return this.client.post('/api/auth/change-password', {
      newPassword,
      confirmPassword
    });
  }

  async getSwarmAgents() {
    return this.client.get('/api/swarm/agents');
  }

  async scaleSwarm(targetAgents: number) {
    return this.client.post('/api/swarm/scale', { targetAgents });
  }
}
```

---

### React Hook Example

```typescript
import { useState, useCallback } from 'react';

export function useOrchestrationAPI(baseUrl: string = 'http://localhost:3000') {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(
    async (endpoint: string, method = 'GET', body?: Record<string, unknown>) => {
      if (!sessionToken) {
        throw new Error('Not authenticated');
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method,
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json'
          },
          body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        return await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [sessionToken, baseUrl]
  );

  const login = useCallback(
    async (password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        setSessionToken(data.sessionToken);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [baseUrl]
  );

  const changePassword = useCallback(
    async (newPassword: string, confirmPassword: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${baseUrl}/api/auth/change-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword, confirmPassword })
        });

        if (!response.ok) {
          throw new Error('Password change failed');
        }

        return await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Password change failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [baseUrl]
  );

  const getSwarmAgents = useCallback(
    () => makeRequest('/api/swarm/agents'),
    [makeRequest]
  );

  const getDashboardOverview = useCallback(
    () => makeRequest('/api/dashboard/overview'),
    [makeRequest]
  );

  return {
    sessionToken,
    isLoading,
    error,
    login,
    changePassword,
    getSwarmAgents,
    getDashboardOverview,
    makeRequest
  };
}
```

---

### Common Issues and Solutions

#### Issue 1: "Unauthorized" on Protected Endpoint

**Symptom**: GET request to `/api/swarm/agents` returns `{ "error": "Unauthorized" }`

**Solutions**:
1. Verify token is included in Authorization header: `Authorization: Bearer <token>`
2. Check token hasn't expired (24-hour lifespan)
3. Ensure token format is correct (not wrapped in extra quotes)
4. Re-login if token is invalid: `POST /api/auth/login`

```bash
# Check if token is valid
TOKEN="your-session-token"
curl -v -X GET http://localhost:3000/api/swarm/agents \
  -H "Authorization: Bearer $TOKEN"

# Should see 200 with agents data, not 401
```

---

#### Issue 2: "First Login Password Change Required"

**Symptom**: Protected endpoints return `{ "error": "First Login Password Change Required" }`

**Solutions**:
1. Complete mandatory password change first
2. Change password must meet requirements (16+ chars, uppercase, lowercase, digit, special)

```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "MySecure!Pass123#Strong",
    "confirmPassword": "MySecure!Pass123#Strong"
  }'
```

---

#### Issue 3: Password Too Weak

**Symptom**: 400 error with multiple validation failures

**Solutions**:
- Ensure 16+ characters
- Include uppercase letter
- Include lowercase letter
- Include number
- Include special character: `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`
- No more than 2 repeated characters
- Avoid common patterns: `123`, `qwerty`, `password`

**Valid Password Examples**:
- `MySecure!Pass123#Strong`
- `Quantum@Tiger2025#Nexus`
- `Phoenix!Dragon99$Ascend`

**Invalid Password Examples**:
- `Pass123` (too short)
- `password123!@#` (common pattern)
- `MyPassword123!!!` (repeated characters)

---

## Security Best Practices

### 1. Never Expose Tokens in Logs

**Bad**:
```typescript
console.log('Token:', sessionToken);  // Never do this
localStorage.setItem('token', sessionToken);  // Never store in localStorage
```

**Good**:
```typescript
console.log('Authentication successful');
sessionStorage.setItem('token', sessionToken);  // Use sessionStorage (cleared on browser close)
// Or better: use HttpOnly cookies (backend sets)
```

---

### 2. Use HTTPS Only (Production)

**Development**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "one-time-password"}'
```

**Production**:
```bash
# Always use HTTPS
curl -X POST https://api.example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "one-time-password"}'
```

**Environment Variables**:
```env
# .env.production
API_BASE_URL=https://api.example.com
ENABLE_TLS=true
```

---

### 3. Token Rotation Schedule

**Token Lifespan**: 24 hours

**Recommended Rotation**:
- Rotate tokens daily in automated systems
- Prompt users to re-login after 24 hours
- Invalidate tokens on server during security incidents

**Implementation**:
```typescript
// Check token expiration before making requests
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return Date.now() > payload.exp;
  } catch {
    return true;
  }
}

// Refresh if needed
if (isTokenExpired(sessionToken)) {
  await login(oneTimePassword);
}
```

---

### 4. Account Lockout Protection

The authentication system automatically locks accounts after 5 failed login attempts.

**Lockout Duration**: Until administrator resets the password

**Recovery**:
1. Administrator must generate new one-time password: `generateNewOneTimePassword()`
2. Provide new password to locked-out user
3. User logs in with new one-time password
4. Complete mandatory password change flow

---

### 5. Password Storage

Passwords are stored using PBKDF2 with:
- **Algorithm**: SHA-256
- **Iterations**: 10,000
- **Salt**: 32 random bytes
- **Hash Size**: 64 bytes

**Storage Format**:
```
<salt-hex>:<hash-hex>
```

---

### 6. Audit Logging

All security events are logged to:
- **Location**: `.claude-flow/security/audit.log`
- **Events**:
  - `LOGIN_ATTEMPT`
  - `LOGIN_FAILED`
  - `PASSWORD_CHANGED_ON_FIRST_LOGIN`
  - `PASSWORD_RESET`
  - `ACCOUNT_LOCKED`

**Example Audit Entry**:
```json
{
  "timestamp": "2025-05-25T14:35:00.000Z",
  "eventType": "PASSWORD_CHANGED_ON_FIRST_LOGIN",
  "details": {
    "timestamp": "2025-05-25T14:35:00.000Z",
    "ipAddress": "192.168.1.100"
  }
}
```

---

### 7. If Token is Compromised

**Immediate Steps**:
1. Stop all API requests using the compromised token
2. Contact administrator to invalidate the token
3. Attempt to log in again: `POST /api/auth/login`
4. If account is locked, request password reset

**Remediation**:
```bash
# Administrator: Generate new one-time password
# Then user must complete full login flow again

# User: Provide new one-time password and change password
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "New-One-Time-Password"}'
```

---

## Integration Examples

### Command-Line Tool

```bash
#!/bin/bash

API_URL="http://localhost:3000"
ONE_TIME_PASSWORD="Quantum-Phoenix-Stellar-Cascade"
NEW_PASSWORD="MySecure!Pass123#Strong"

# Step 1: Login and extract token
TOKEN=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"password\": \"$ONE_TIME_PASSWORD\"}" | jq -r '.sessionToken')

echo "Logged in. Token: ${TOKEN:0:20}..."

# Step 2: Change password
curl -s -X POST "$API_URL/api/auth/change-password" \
  -H "Content-Type: application/json" \
  -d "{\"newPassword\": \"$NEW_PASSWORD\", \"confirmPassword\": \"$NEW_PASSWORD\"}"

echo "Password changed successfully"

# Step 3: Make authenticated requests
echo "Getting swarm agents..."
curl -s -X GET "$API_URL/api/swarm/agents" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

### Docker Container Integration

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install orchestration client
RUN npm install orchestration-api-client

COPY . .

# Set API endpoint via environment variable
ENV API_BASE_URL=http://localhost:3000
ENV ONE_TIME_PASSWORD=Quantum-Phoenix-Stellar-Cascade

CMD ["node", "orchestration-client.js"]
```

---

### GitHub Actions CI/CD

```yaml
name: Deploy with Orchestration API

on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Authenticate with Orchestration API
        run: |
          TOKEN=$(curl -s -X POST ${{ secrets.API_URL }}/api/auth/login \
            -H "Content-Type: application/json" \
            -d "{\"password\": \"${{ secrets.ONE_TIME_PASSWORD }}\"}" | jq -r '.sessionToken')
          
          echo "API_TOKEN=$TOKEN" >> $GITHUB_ENV

      - name: Scale Swarm
        run: |
          curl -X POST ${{ secrets.API_URL }}/api/swarm/scale \
            -H "Authorization: Bearer ${{ env.API_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"targetAgents": 24}'
```

---

## Support and Troubleshooting

### Check API Status

```bash
# Health check (no auth required)
curl http://localhost:3000/api/health

# Expected response:
# {
#   "status": "ok",
#   "agents": [...],
#   "systemMetrics": {...}
# }
```

### View Audit Logs

```bash
# Administrator: Check security audit log
cat .claude-flow/security/audit.log | jq '.'

# Filter by event type
cat .claude-flow/security/audit.log | jq '.[] | select(.eventType == "PASSWORD_CHANGED_ON_FIRST_LOGIN")'
```

### Debug Token Issues

```typescript
// Decode and inspect token
function inspectToken(token: string) {
  try {
    const payload = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(payload);
  } catch {
    console.error('Invalid token format');
  }
}

const decoded = inspectToken(sessionToken);
console.log('Token expires at:', new Date(decoded.exp));
console.log('Token type:', decoded.type);
```

---

## API Reference Summary

| Operation | Endpoint | Method | Auth | Purpose |
|-----------|----------|--------|------|---------|
| Login | `/api/auth/login` | POST | No | Initial login with one-time password |
| Change Password | `/api/auth/change-password` | POST | No | Set permanent password |
| Auth Status | `/api/auth/status` | GET | No | Check first-login status |
| List Agents | `/api/swarm/agents` | GET | Yes | Get all swarm agents |
| Scale Swarm | `/api/swarm/scale` | POST | Yes | Scale agent count |
| Dashboard | `/api/dashboard/overview` | GET | Yes | Get dashboard data |
| Bootstrap | `/api/agents/bootstrap` | POST | Yes | Bootstrap agents |
| Add Memory | `/api/memory/vector` | POST | Yes | Add vector to HNSW |
| Search Memory | `/api/memory/search` | POST | No | Search vectors |

---

**Last Updated**: 2025-05-25
**Version**: 1.0.0
**API Version**: 1.0.0
