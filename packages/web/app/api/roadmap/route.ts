import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
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
