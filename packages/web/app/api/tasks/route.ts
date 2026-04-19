import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
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
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 400 }
    );
  }
}
