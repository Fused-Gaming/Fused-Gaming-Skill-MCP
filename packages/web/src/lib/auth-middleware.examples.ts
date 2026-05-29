/**
 * JWT Auth Middleware Usage Examples
 *
 * This file demonstrates how to integrate the authentication middleware
 * with Next.js API routes, protecting endpoints and enforcing role-based access control.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthToken,
  verifyAuthToken,
  createAuthValidator,
  hasRole,
  isAdmin,
  type AuthenticatedUser,
} from './auth-middleware';

/**
 * EXAMPLE 1: Protected Admin Endpoint
 *
 * Only users with 'admin' role can access this endpoint
 * Returns 403 Forbidden for non-admin users
 *
 * Usage: export const GET = withAuth(getAdminPanel, { requiredRole: 'admin' });
 */
export const getAdminPanel = async (
  request: NextRequest,
  user: AuthenticatedUser
): Promise<NextResponse> => {
  return NextResponse.json(
    {
      message: 'Welcome to admin panel',
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
      },
    },
    { status: 200 }
  );
};

/**
 * EXAMPLE 2: Protected User Endpoint
 *
 * Any authenticated user can access, regardless of role
 * Returns 401 Unauthorized if not authenticated
 *
 * Usage: export const GET = withAuth(getUserProfile);
 */
export const getUserProfile = async (
  request: NextRequest,
  user: AuthenticatedUser
): Promise<NextResponse> => {
  return NextResponse.json(
    {
      id: user.userId,
      email: user.email,
      role: user.role,
      passwordChanged: user.passwordChanged,
    },
    { status: 200 }
  );
};

/**
 * EXAMPLE 3: Optional Authentication
 *
 * Works for both authenticated and unauthenticated requests
 * Returns user data if authenticated, null otherwise
 *
 * Usage: export const GET = withOptionalAuth(getPublicProfile);
 */
export const getPublicProfile = async (
  request: NextRequest,
  user: AuthenticatedUser | null
): Promise<NextResponse> => {
  if (!user) {
    return NextResponse.json(
      { message: 'Public profile - sign in for more details' },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      message: 'Authenticated profile',
      user: {
        id: user.userId,
        email: user.email,
      },
    },
    { status: 200 }
  );
};

/**
 * EXAMPLE 4: Custom Middleware Logic
 *
 * Manually validate auth and apply custom business logic
 * Useful for complex authorization scenarios
 */
export const customAuthHandler = async (request: NextRequest): Promise<NextResponse> => {
  const token = getAuthToken(request);
  const user = verifyAuthToken(token);

  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Custom authorization logic
  if (!isAdmin(user)) {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }

  // Business logic here
  return NextResponse.json(
    { message: 'Admin action completed', user: user.userId },
    { status: 200 }
  );
};

/**
 * EXAMPLE 5: Using Auth Validator
 *
 * Create reusable validator for multiple endpoints
 * Useful for middleware chains and custom auth patterns
 */
export const createProtectedEndpoint = () => {
  const validator = createAuthValidator({ requiredRole: 'admin' });

  return async (request: NextRequest): Promise<NextResponse> => {
    const user = validator.extractUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: 'Protected data', admin: user.email },
      { status: 200 }
    );
  };
};

/**
 * EXAMPLE 6: Role-Based Resource Access
 *
 * Different behavior based on user role
 * Admins get full details, users get limited view
 */
export const getResource = async (
  request: NextRequest,
  user: AuthenticatedUser
): Promise<NextResponse> => {
  const resourceId = request.nextUrl.searchParams.get('id');

  // Mock resource data
  const resource = {
    id: resourceId,
    name: 'Example Resource',
    owner: 'admin@example.com',
    createdAt: new Date(),
    _apiKey: 'secret-key-12345', // Sensitive data
  };

  // Admin gets full details
  if (isAdmin(user)) {
    return NextResponse.json(resource, { status: 200 });
  }

  // Regular user gets sanitized data
  const { _apiKey, ...publicData } = resource;
  return NextResponse.json(publicData, { status: 200 });
};

/**
 * EXAMPLE 7: POST Endpoint with Auth
 *
 * Protected endpoint that creates data
 * Only authenticated users can create
 */
export const createItem = async (
  request: NextRequest,
  user: AuthenticatedUser
): Promise<NextResponse> => {
  // Parse request body
  const body = await request.json();

  // Validate input
  if (!body.name) {
    return NextResponse.json(
      { error: 'Name is required' },
      { status: 400 }
    );
  }

  // Create item associated with user
  const item = {
    id: `item_${Date.now()}`,
    name: body.name,
    ownerId: user.userId,
    createdAt: new Date(),
  };

  return NextResponse.json(item, { status: 201 });
};

// Usage: export const POST = withAuth(createItem);

/**
 * EXAMPLE 8: Middleware for Protecting Multiple Routes
 *
 * Reusable middleware that validates JWT before route handler
 */
export async function authMiddlewareFactory(
  request: NextRequest,
  options: { requiredRole?: 'admin' | 'user'; optional?: boolean } = {}
): Promise<{ authorized: boolean; user: AuthenticatedUser | null; response?: NextResponse }> {
  const token = getAuthToken(request);
  const user = verifyAuthToken(token);

  // Optional auth allows null user
  if (options.optional && !user) {
    return { authorized: true, user: null };
  }

  // Check authentication
  if (!user) {
    return {
      authorized: false,
      user: null,
      response: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
    };
  }

  // Check role requirement
  if (options.requiredRole && !hasRole(user, options.requiredRole)) {
    return {
      authorized: false,
      user: null,
      response: NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user };
}

/**
 * EXAMPLE 9: Creating Auth Headers for Calling Other APIs
 *
 * Use validator to create properly formatted auth headers
 * when making requests to protected API endpoints
 */
export const callProtectedAPI = async (token: string): Promise<Response> => {
  const validator = createAuthValidator();
  const headers = validator.createAuthHeader(token);

  const response = await fetch('https://api.example.com/protected-endpoint', {
    method: 'GET',
    headers,
  });

  return response;
};

/**
 * EXAMPLE 10: Testing Authentication Logic
 *
 * Demonstration of testing auth middleware behavior
 */
export const testAuthExamples = {
  /**
   * Test: Valid token should pass authentication
   */
  async validTokenTest() {
    const validator = createAuthValidator();
    const token = 'valid.jwt.token'; // In real scenario, create with SessionStore
    const user = validator.validate(token);
    return user !== null; // Should be true
  },

  /**
   * Test: Invalid token should fail authentication
   */
  async invalidTokenTest() {
    const validator = createAuthValidator();
    const token = 'invalid.token';
    const user = validator.validate(token);
    return user === null; // Should be true
  },

  /**
   * Test: Role enforcement should work
   */
  async roleEnforcementTest() {
    const adminValidator = createAuthValidator({ requiredRole: 'admin' });
    // This would use a real admin token in practice
    const user = adminValidator.validate('user.token');
    return user === null; // Non-admin token should fail
  },
};

/**
 * EXAMPLE 11: Session Refresh and Token Extension
 *
 * Check if password needs to be changed after authentication
 */
export const checkPasswordStatus = async (
  request: NextRequest,
  user: AuthenticatedUser
): Promise<NextResponse> => {
  const needsPasswordChange = !user.passwordChanged;

  if (needsPasswordChange) {
    return NextResponse.json(
      {
        message: 'Password change required',
        redirectTo: '/auth/change-password',
      },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { message: 'Session valid', user: user.userId },
    { status: 200 }
  );
};

// Usage: export const GET = withAuth(checkPasswordStatus);

/**
 * EXAMPLE 12: Bulk Operations with Role Checking
 *
 * Admin endpoint that processes multiple items
 */
export const bulkUpdateUsers = async (
  request: NextRequest,
  user: AuthenticatedUser
): Promise<NextResponse> => {
  if (!isAdmin(user)) {
    return NextResponse.json(
      { error: 'Only admins can perform bulk updates' },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { userIds, updates } = body;

  if (!Array.isArray(userIds) || !updates) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  // Perform bulk update
  const results = userIds.map(id => ({
    id,
    updated: true,
  }));

  return NextResponse.json(
    {
      message: 'Bulk update completed',
      count: results.length,
      results,
    },
    { status: 200 }
  );
};

// Usage: export const PUT = withAuth(bulkUpdateUsers, { requiredRole: 'admin' });

/**
 * EXAMPLE 13: WebSocket Authentication (Simulated)
 *
 * Validate auth token before establishing WebSocket connection
 */
export const validateWebSocketAuth = async (request: NextRequest): Promise<boolean> => {
  const token = getAuthToken(request);
  const user = verifyAuthToken(token);

  if (!user) {
    console.error('WebSocket auth failed: invalid token');
    return false;
  }

  console.log(`WebSocket authenticated for user: ${user.email}`);
  return true;
};

/**
 * Integration Summary
 *
 * 1. Use withAuth() for protected endpoints requiring authentication
 * 2. Use withOptionalAuth() for endpoints that work with or without auth
 * 3. Use createAuthValidator() for custom auth logic
 * 4. Check isAdmin() and hasRole() for authorization decisions
 * 5. Use getAuthToken() to extract tokens from requests
 * 6. Use verifyAuthToken() to validate and decode tokens
 * 7. Handle both Authorization header and sessionToken cookie
 * 8. Return appropriate HTTP status codes (401, 403)
 * 9. Include user context in API responses when helpful
 * 10. Log authentication failures for security auditing
 */
