import { NextRequest, NextResponse } from 'next/server';
import { validateAuthMiddleware, isAdmin } from '@/lib/auth-middleware';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Validate authentication - GET requires authenticated user
    const { user, error } = await validateAuthMiddleware(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: error || 'Authentication token missing or invalid' },
        { status: 401 }
      );
    }

    const roadmap = [
      {
        id: 'phase-1',
        name: 'Initial Setup',
        schedule: '0 0 * * *',
        description: 'System initialization and health check',
        tasks: ['task-1', 'task-2'],
        isActive: true,
        completedAt: null,
      },
      {
        id: 'phase-2',
        name: 'Data Processing',
        schedule: '0 6 * * *',
        description: 'Batch processing of pending tasks',
        tasks: ['task-3'],
        isActive: false,
        completedAt: null,
      },
      {
        id: 'phase-3',
        name: 'Optimization',
        schedule: '0 12 * * *',
        description: 'System optimization and cache refresh',
        tasks: ['task-4'],
        isActive: false,
        completedAt: null,
      },
      {
        id: 'phase-4',
        name: 'Report Generation',
        schedule: '0 18 * * *',
        description: 'Daily metrics and performance report',
        tasks: [],
        isActive: false,
        completedAt: null,
      },
    ];

    return NextResponse.json(roadmap);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch roadmap' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate authentication - POST (mutations) require admin role
    const { user, error } = await validateAuthMiddleware(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: error || 'Authentication token missing or invalid' },
        { status: 401 }
      );
    }

    // Check for admin role - required for POST operations
    if (!isAdmin(user)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Only admin users can create roadmap items',
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    return NextResponse.json({
      success: true,
      roadmapItem: {
        id: `phase-${Date.now()}`,
        name: body.name || 'New Phase',
        schedule: body.schedule || '0 0 * * *',
        description: body.description || '',
        tasks: body.tasks || [],
        isActive: false,
        completedAt: null,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create roadmap item' },
      { status: 400 }
    );
  }
}
