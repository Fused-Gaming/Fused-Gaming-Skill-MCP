import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Resolve the actual repository root (not the workspace directory)
function getRepoRoot(): string {
  const workspaceRoot = process.cwd();

  // If we're in the web workspace (packages/web), go up to repo root
  if (workspaceRoot.endsWith('packages/web') || workspaceRoot.endsWith('packages\\web')) {
    return path.resolve(workspaceRoot, '../../');
  }

  // Otherwise, try to find the repo root by walking up to find .claude-flow
  let current = workspaceRoot;
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(current, '.claude-flow'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break; // Reached filesystem root
    current = parent;
  }

  // Fallback to workspace root
  return workspaceRoot;
}

export async function GET(_request: NextRequest) {
  try {
    const projectRoot = getRepoRoot();

    // Load project metadata
    const versionJsonPath = path.join(projectRoot, 'VERSION.json');
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const agentsStorePath = path.join(projectRoot, '.claude-flow', 'agents', 'store.json');
    const swarmStatePath = path.join(projectRoot, '.claude-flow', 'swarm', 'swarm-state.json');
    const sessionGoalsPath = path.join(projectRoot, '.claude-flow', 'cache', 'session-goals.json');

    let projectVersion = '1.0.0';
    let packageInfo: any = {};
    let agentsInfo: any = { count: 0, agents: [] };
    let swarmInfo: any = null;
    let sessionGoals: any = null;

    // Load version info
    if (fs.existsSync(versionJsonPath)) {
      const versionData = JSON.parse(fs.readFileSync(versionJsonPath, 'utf-8'));
      projectVersion = versionData.version || '1.0.0';
    }

    // Load package info
    if (fs.existsSync(packageJsonPath)) {
      const pkgData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      packageInfo = {
        name: pkgData.name,
        version: pkgData.version,
        description: pkgData.description,
      };
    }

    // Load swarm agents info
    if (fs.existsSync(agentsStorePath)) {
      try {
        const agentsData = JSON.parse(fs.readFileSync(agentsStorePath, 'utf-8'));
        const agents = Object.values(agentsData.agents || {});
        agentsInfo = {
          count: agents.length,
          agents: (agents as any[]).map(agent => ({
            id: agent.agentId.slice(-6),
            type: agent.agentType,
            status: agent.status,
            health: (agent.health * 100).toFixed(0) + '%',
            role: agent.config.role,
          })),
          topology: agentsData.swarmMetadata?.topology || 'hierarchical-mesh',
          maxCapacity: agentsData.swarmMetadata?.maxAgents || 15,
        };
      } catch {
        // Swarm data not available
      }
    }

    // Load swarm state
    if (fs.existsSync(swarmStatePath)) {
      try {
        const stateData = JSON.parse(fs.readFileSync(swarmStatePath, 'utf-8'));
        const swarmId = Object.keys(stateData.swarms)[0];
        if (swarmId && stateData.swarms[swarmId]) {
          const swarm = stateData.swarms[swarmId];
          swarmInfo = {
            id: swarmId,
            status: swarm.status,
            topology: swarm.topology,
            maxAgents: swarm.maxAgents,
            createdAt: swarm.createdAt || stateData.timestamp,
          };
        }
      } catch {
        // Swarm state not available
      }
    }

    // Load session goals
    if (fs.existsSync(sessionGoalsPath)) {
      try {
        sessionGoals = JSON.parse(fs.readFileSync(sessionGoalsPath, 'utf-8'));
      } catch {
        // Session goals not available
      }
    }

    // v1.2.0 Feature Branches Status
    const releaseBranches = {
      designSystem: {
        name: 'Design System Orchestration',
        branch: 'claude/design-system-orchestration-kLw4W',
        tag: 'v1.2.0-design.1',
        completion: 75,
        status: 'in-development',
        deliverables: {
          completed: ['Design tools integration', 'License system implementation', 'Phase 1 completion', 'Phase 2 completion'],
          inProgress: ['Comprehensive test suite', 'Documentation finalization'],
          planned: ['PR review preparation'],
        },
        nextSteps: [
          'Complete test suite',
          'Finalize documentation',
          'Code quality review',
        ],
      },
      limjPackage: {
        name: 'LIMJ Package Implementation',
        branch: 'claude/implement-limj-package-6WZpc',
        tag: 'v1.2.0-limj.1',
        completion: 70,
        status: 'in-development',
        deliverables: {
          completed: ['Ecosystem infrastructure consolidation', 'LIMJ package scaffolding', 'Cross-ecosystem integration patterns'],
          inProgress: ['Full implementation', 'Integration tests'],
          planned: ['Performance benchmarks', 'Documentation suite'],
        },
        nextSteps: [
          'Complete LIMJ implementation',
          'Add integration tests',
          'Performance benchmarks',
        ],
      },
      swarmSession: {
        name: 'Swarm Session Initialization',
        branch: 'claude/setup-swarm-session-98Rwz',
        tag: 'v1.2.0-swarm.1',
        completion: 85,
        status: 'ready-for-testing',
        deliverables: {
          completed: [
            'Swarm initialization script (npm run swarm)',
            '3-agent swarm configuration',
            'RuFlo → syncpulse renaming (5 files)',
            'Skills checklist (70 skills mapped)',
            'Session startup auto-initialization',
            'Hook-handler swarm integration',
            'Version tags and documentation',
          ],
          inProgress: ['Comprehensive test suite', 'Integration tests', 'Performance benchmarks'],
          planned: ['PR submission and review', 'Final documentation polish'],
        },
        nextSteps: [
          'Add comprehensive tests',
          'Run full validation',
          'Create PR with evidence',
        ],
      },
    };

    // Overall project metrics
    const projectMetrics = {
      version: projectVersion,
      releaseTarget: 'v1.2.0 (June 1, 2026)',
      completionPercentage: 76,
      branches: {
        total: 3,
        active: 3,
        readyForMerge: 0,
      },
      deliverables: {
        total: 44,
        filesChanged: 44,
        commits: 27,
      },
      qualityMetrics: {
        testCoverage: '50%',
        documentation: '95%',
        codeReviewReady: false,
      },
    };

    // Session info
    const sessionInfo = {
      initialized: true,
      timestamp: new Date().toISOString(),
      swarmStatus: swarmInfo?.status || 'not-initialized',
      agentsActive: agentsInfo.agents?.filter((a: any) => a.status === 'running').length || 0,
      agentsAvailable: agentsInfo.count || 0,
    };

    // Timeline
    const timeline = {
      phase1: {
        name: 'Individual Validation',
        start: '2026-05-18',
        end: '2026-05-22',
        status: 'pending',
      },
      phase2: {
        name: 'Integration Testing',
        start: '2026-05-22',
        end: '2026-05-28',
        status: 'pending',
      },
      phase3: {
        name: 'Release Preparation',
        start: '2026-05-28',
        end: '2026-05-31',
        status: 'pending',
      },
      phase4: {
        name: 'Release & Merge',
        start: '2026-06-01',
        end: '2026-06-01',
        status: 'pending',
      },
    };

    // User guidance
    const guidance = {
      currentPhase: 'Individual Branch Validation',
      recommendation:
        'The Swarm Session branch (85% complete) is ready for testing. Focus on adding comprehensive test suites and preparing PR submission.',
      blockers: [
        'Test coverage needs to reach 80%+',
        'Lint and typecheck issues in Design System branch',
        'Build optimization needed for performance',
      ],
      nextActions: [
        'Add comprehensive test suites to all branches',
        'Run performance benchmarks',
        'Resolve quality gate failures',
        'Submit PRs with test evidence',
      ],
    };

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      project: {
        name: packageInfo.name,
        version: packageInfo.version,
        description: packageInfo.description,
      },
      release: {
        target: 'v1.2.0',
        releaseDate: '2026-06-01',
        completionPercentage: projectMetrics.completionPercentage,
        status: 'in-development',
      },
      branches: releaseBranches,
      metrics: projectMetrics,
      swarm: {
        agents: agentsInfo,
        state: swarmInfo,
      },
      session: sessionInfo,
      sessionGoals: sessionGoals || {
        sessionId: 'not-initialized',
        timestamp: new Date().toISOString(),
        branch: 'unknown',
        goals: [],
        mergeChecklist: {},
        progress: { goalsCompleted: 0, checklistItemsCompleted: 0, overallProgress: 0 },
        commits: [],
      },
      timeline,
      guidance,
    });
  } catch (error) {
    console.error('Status endpoint error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to retrieve status',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
