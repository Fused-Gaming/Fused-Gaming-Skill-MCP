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

    const tasks = [
      {
        id: 'task-1',
        name: 'Process Batch A',
        status: 'running',
        priority: 'high',
        progress: 45,
        swarmId: 'production-swarm',
      },
      {
        id: 'task-2',
        name: 'Analyze Performance',
        status: 'queued',
        priority: 'medium',
        progress: 0,
        swarmId: 'dev-swarm',
      },
      {
        id: 'task-3',
        name: 'Generate Report',
        status: 'completed',
        priority: 'low',
        progress: 100,
        swarmId: 'production-swarm',
      },
      {
        id: 'task-4',
        name: 'Sync Cache',
        status: 'running',
        priority: 'medium',
        progress: 78,
        swarmId: 'dev-swarm',
      },
    ];

    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
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
          message: 'Only admin users can create tasks',
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    return NextResponse.json({
      success: true,
      taskId: `task-${Date.now()}`,
      task: {
        id: `task-${Date.now()}`,
        name: body.name || 'New Task',
        status: 'queued',
        priority: body.priority || 'medium',
        progress: 0,
        swarmId: body.swarmId,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 400 }
    );
  }
}
