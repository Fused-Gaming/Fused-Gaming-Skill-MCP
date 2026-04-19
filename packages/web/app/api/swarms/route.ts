import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const swarms = [
      {
        id: 'production-swarm',
        name: 'Production Swarm',
        topology: 'hierarchical',
        health: 0.95,
        uptime: 99.5,
        agents: [
          { id: 'q1', name: 'Queen', role: 'coordinator', status: 'idle', load: 2, capacity: 10, successRate: 0.98 },
          { id: 'e1', name: 'Executor A', role: 'executor', status: 'busy', load: 8, capacity: 10, successRate: 0.96 },
          { id: 'r1', name: 'Reviewer', role: 'reviewer', status: 'idle', load: 3, capacity: 10, successRate: 0.97 },
          { id: 'o1', name: 'Optimizer', role: 'optimizer', status: 'idle', load: 1, capacity: 10, successRate: 0.95 },
        ],
        activeTasks: 1,
      },
      {
        id: 'dev-swarm',
        name: 'Dev Swarm',
        topology: 'mesh',
        health: 0.88,
        uptime: 85.2,
        agents: [
          { id: 'd1', name: 'Dev A', role: 'executor', status: 'idle', load: 4, capacity: 10, successRate: 0.92 },
          { id: 'd2', name: 'Dev B', role: 'executor', status: 'busy', load: 7, capacity: 10, successRate: 0.91 },
          { id: 'd3', name: 'Monitor', role: 'monitor', status: 'idle', load: 2, capacity: 10, successRate: 0.94 },
        ],
        activeTasks: 1,
      },
    ];

    return NextResponse.json(swarms);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch swarms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: 'Swarm action executed',
      action: body.action,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process swarm action' },
      { status: 400 }
    );
  }
}
