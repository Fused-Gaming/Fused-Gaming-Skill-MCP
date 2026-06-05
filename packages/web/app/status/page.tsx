'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Target,
  Code,
  GitBranch,
  BarChart3,
  Users
} from 'lucide-react';

interface StatusResponse {
  status: string;
  timestamp: string;
  project: {
    name: string;
    version: string;
    description: string;
  };
  release: {
    target: string;
    releaseDate: string;
    completionPercentage: number;
    status: string;
  };
  branches: {
    [key: string]: {
      name: string;
      branch: string;
      tag: string;
      completion: number;
      status: string;
      deliverables: {
        completed: string[];
        inProgress: string[];
        planned: string[];
      };
      nextSteps: string[];
    };
  };
  metrics: {
    version: string;
    releaseTarget: string;
    completionPercentage: number;
    branches: {
      total: number;
      active: number;
      readyForMerge: number;
    };
    deliverables: {
      total: number;
      filesChanged: number;
      commits: number;
    };
    qualityMetrics: {
      testCoverage: string;
      documentation: string;
      codeReviewReady: boolean;
    };
  };
  swarm: {
    agents: {
      count: number;
      agents: Array<{
        id: string;
        type: string;
        status: string;
        health: string;
        role: string;
      }>;
      topology: string;
      maxCapacity: number;
    };
    state: {
      id: string;
      status: string;
      topology: string;
      maxAgents: number;
      createdAt: string;
    } | null;
  };
  guidance: {
    currentPhase: string;
    recommendation: string;
    blockers: string[];
    nextActions: string[];
  };
  sessionGoals?: {
    sessionId: string;
    timestamp: string;
    branch: string;
    goals: Array<{
      id: string;
      title: string;
      status: string;
      priority: string;
    }>;
    mergeChecklist: {
      [key: string]: {
        [key: string]: boolean;
      };
    };
    progress: {
      goalsCompleted: number;
      checklistItemsCompleted: number;
      overallProgress: number;
    };
    commits: Array<{
      timestamp: string;
      message: string;
      filesChanged: string[];
    }>;
  };
}

export default function StatusPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (!response.ok) throw new Error('Failed to fetch status');
        const data = await response.json();
        setStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-center">Loading project status...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!status) return <div className="p-8 text-center">No status data</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 border-b border-slate-700 pb-8">
          <h1 className="text-4xl font-bold mb-2">{status.project.name}</h1>
          <p className="text-slate-400 mb-4">{status.project.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-slate-400">Current Version</div>
              <div className="text-2xl font-bold">{status.project.version}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Release Target</div>
              <div className="text-2xl font-bold">{status.release.releaseDate}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Overall Progress</div>
              <div className="text-2xl font-bold">{status.release.completionPercentage}%</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Status</div>
              <div className="text-2xl font-bold text-yellow-400">{status.release.status}</div>
            </div>
          </div>
        </div>

        {/* Guidance Section */}
        <div className="mb-8 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold">Current Phase: {status.guidance.currentPhase}</h2>
          </div>
          <p className="text-slate-300 mb-4">{status.guidance.recommendation}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h3 className="font-semibold text-red-400">Blockers</h3>
              </div>
              <ul className="space-y-1 text-sm">
                {status.guidance.blockers.map((blocker, i) => (
                  <li key={i} className="text-slate-300">
                    • {blocker}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold text-green-400">Next Actions</h3>
              </div>
              <ul className="space-y-1 text-sm">
                {status.guidance.nextActions.map((action, i) => (
                  <li key={i} className="text-slate-300">
                    • {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Session Goals & Merge Checklist */}
        {status.sessionGoals && status.sessionGoals.sessionId !== 'not-initialized' && (
          <div className="mb-8 bg-purple-900 bg-opacity-30 border border-purple-700 rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold">Session Goals ({status.sessionGoals.branch})</h2>
                </div>
                <p className="text-slate-400 text-sm">Session ID: {status.sessionGoals.sessionId}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-400">{status.sessionGoals.progress.overallProgress}%</div>
                <div className="text-xs text-slate-400">Overall Progress</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-5 h-5 text-purple-300" />
                  <h3 className="font-semibold text-purple-300">Session Objectives</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  {status.sessionGoals.goals.map((goal) => (
                    <li key={goal.id} className="flex items-start gap-2">
                      {goal.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      ) : goal.status === 'in-progress' ? (
                        <Clock className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <div className="text-slate-300">{goal.title}</div>
                        <div className="text-xs text-slate-500">{goal.priority} priority</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-purple-300" />
                  <h3 className="font-semibold text-purple-300">Merge Checklist</h3>
                </div>
                <div className="space-y-3 text-sm">
                  {Object.entries(status.sessionGoals.mergeChecklist).map(([section, items]) => {
                    const checkedCount = Object.values(items as any).filter(Boolean).length;
                    const totalCount = Object.keys(items).length;
                    return (
                      <div key={section}>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300 capitalize">{section.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-xs text-slate-400">{checkedCount}/{totalCount}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-purple-400"
                            style={{ width: `${(checkedCount / totalCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {status.sessionGoals.commits.length > 0 && (
              <div className="mt-6 border-t border-purple-700 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-5 h-5 text-purple-300" />
                  <h3 className="font-semibold text-purple-300">Session Commits ({status.sessionGoals.commits.length})</h3>
                </div>
                <ul className="space-y-2 text-xs">
                  {status.sessionGoals.commits.slice(-5).map((commit, i) => (
                    <li key={i} className="text-slate-400">
                      <div className="font-mono text-slate-500">{commit.message.split('\n')[0]}</div>
                      <div className="text-slate-600">{commit.filesChanged.length} files changed</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Branches */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <GitBranch className="w-7 h-7 text-blue-400" />
            <h2 className="text-3xl font-bold">Release Branches (v1.2.0)</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(status.branches).map(([key, branch]) => (
              <div
                key={key}
                className={`rounded-lg p-6 border-l-4 ${
                  branch.completion >= 85
                    ? 'border-l-green-500 bg-green-900 bg-opacity-20'
                    : branch.completion >= 70
                      ? 'border-l-yellow-500 bg-yellow-900 bg-opacity-20'
                      : 'border-l-blue-500 bg-blue-900 bg-opacity-20'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{branch.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{branch.tag}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{branch.completion}%</div>
                    <div className="text-xs text-slate-400">{branch.status}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        branch.completion >= 85 ? 'bg-green-500' : branch.completion >= 70 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${branch.completion}%` }}
                    />
                  </div>
                </div>

                <div className="mb-4 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-semibold">{branch.deliverables.completed.length}</span>
                    <span className="text-slate-400">completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">{branch.deliverables.inProgress.length}</span>
                    <span className="text-slate-400">in progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 font-semibold">{branch.deliverables.planned.length}</span>
                    <span className="text-slate-400">planned</span>
                  </div>
                </div>

                <div className="border-t border-slate-600 pt-3">
                  <div className="text-xs text-slate-400 mb-2">Next Steps:</div>
                  <ul className="text-xs space-y-1">
                    {branch.nextSteps.map((step, i) => (
                      <li key={i} className="text-slate-300">
                        {i + 1}. {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Swarm Status */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-7 h-7 text-cyan-400" />
            <h2 className="text-3xl font-bold">Swarm Orchestration</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="font-bold text-lg mb-4">Agents ({status.swarm.agents.count})</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {status.swarm.agents.agents.map((agent, i) => (
                  <div key={i} className="bg-slate-700 p-3 rounded text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold">{agent.type}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          agent.status === 'running' ? 'bg-green-600' : agent.status === 'idle' ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>
                    <div className="text-slate-400 mb-1">Health: {agent.health}</div>
                    <div className="text-slate-400 text-xs">Role: {agent.role}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="font-bold text-lg mb-4">Configuration</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-slate-400">Topology</div>
                  <div className="font-semibold">{status.swarm.agents.topology}</div>
                </div>
                <div>
                  <div className="text-slate-400">Max Capacity</div>
                  <div className="font-semibold">{status.swarm.agents.maxCapacity} agents</div>
                </div>
                {status.swarm.state && (
                  <>
                    <div>
                      <div className="text-slate-400">Swarm Status</div>
                      <div
                        className={`font-semibold ${status.swarm.state.status === 'running' ? 'text-green-400' : 'text-yellow-400'}`}
                      >
                        {status.swarm.state.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">Created</div>
                      <div className="font-semibold text-xs">{new Date(status.swarm.state.createdAt).toLocaleDateString()}</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-7 h-7 text-orange-400" />
            <h2 className="text-3xl font-bold">Project Metrics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
              <div className="text-slate-400 text-sm mb-2">Total Commits</div>
              <div className="text-3xl font-bold">{status.metrics.deliverables.commits}+</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
              <div className="text-slate-400 text-sm mb-2">Files Changed</div>
              <div className="text-3xl font-bold">{status.metrics.deliverables.filesChanged}+</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
              <div className="text-slate-400 text-sm mb-2">Test Coverage</div>
              <div className="text-3xl font-bold">{status.metrics.qualityMetrics.testCoverage}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
              <div className="text-slate-400 text-sm mb-2">Documentation</div>
              <div className="text-3xl font-bold">{status.metrics.qualityMetrics.documentation}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
              <div className="text-slate-400 text-sm mb-2">Active Branches</div>
              <div className="text-3xl font-bold">{status.metrics.branches.active}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 pt-6 text-center text-slate-400 text-sm">
          <p>Last updated: {new Date(status.timestamp).toLocaleTimeString()}</p>
          <p>Next refresh: 30 seconds</p>
        </div>
      </div>
    </div>
  );
}
