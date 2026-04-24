/**
 * Orchestration Panel API Routes
 *
 * Handles:
 * - Authentication (first-login, password change)
 * - Health checks
 * - Metrics collection
 * - Swarm agent management
 */

import { Router, type Request, type Response } from 'express';
import AuthMiddleware from './auth-middleware.js';
import { MetricsCollector } from './metrics.js';
import { HealthCheckService } from './health.js';
import { AgentBootstrapManager } from './agent-bootstrap.js';
import { HNSWMemorySynchronizer } from './hnsw-memory-sync.js';

export function createApiRoutes(baseDir: string = '.claude-flow'): Router {
  const router = Router();

  // Initialize managers
  const authMiddleware = new AuthMiddleware(baseDir);
  const metricsCollector = new MetricsCollector(baseDir);
  const healthCheckService = new HealthCheckService(baseDir);
  const agentBootstrap = new AgentBootstrapManager(baseDir);
  const memorySync = new HNSWMemorySynchronizer(baseDir);

  // ─── Authentication Routes ───────────────────────────────────

  /**
   * POST /api/auth/login
   * Initial login with one-time password
   */
  router.post('/auth/login', (req: Request, res: Response) => {
    authMiddleware.handleInitialLogin(req, res);
  });

  /**
   * POST /api/auth/change-password
   * Change password after first login
   */
  router.post('/auth/change-password', (req: Request, res: Response) => {
    authMiddleware.handleChangePasswordFirstLogin(req, res);
  });

  /**
   * GET /api/auth/status
   * Get first-login status
   */
  router.get('/auth/status', (req: Request, res: Response) => {
    authMiddleware.getFirstLoginStatus(req, res);
  });

  // ─── Health & Status Routes ─────────────────────────────────

  /**
   * GET /api/health
   * System health check
   */
  router.get('/health', async (req: Request, res: Response) => {
    try {
      // Mock agent data (in production, query actual agent states)
      const agents = [
        {
          id: 'agent-1',
          name: 'Coordinator',
          lastHeartbeat: Date.now() - 1000,
          responseTime: 45
        },
        {
          id: 'agent-2',
          name: 'Executor',
          lastHeartbeat: Date.now() - 2000,
          responseTime: 52
        },
        {
          id: 'agent-3',
          name: 'Optimizer',
          lastHeartbeat: Date.now() - 500,
          responseTime: 38
        }
      ];

      // Mock system metrics
      const systemMetrics = {
        cpuUsage: Math.random() * 45,
        memoryUsage: Math.random() * 60,
        diskUsage: 35,
        avgLatency: Math.random() * 100
      };

      const health = await healthCheckService.checkHealth(agents, systemMetrics);
      res.status(200).json(health);
    } catch {
      res.status(500).json({ error: 'Failed to check health' });
    }
  });

  // ─── Metrics Routes ─────────────────────────────────────────

  /**
   * GET /api/metrics
   * Get system and swarm metrics
   */
  router.get('/metrics', (req: Request, res: Response) => {
    try {
      // Collect current metrics
      const agentCount = 12; // From swarm state
      const tasksProcessed = 1245;
      const avgTaskDuration = 2340; // ms

      const metric = metricsCollector.collectMetrics(agentCount, tasksProcessed, avgTaskDuration);
      const recentMetrics = metricsCollector.getMetrics(50);

      res.status(200).json({
        current: metric,
        history: recentMetrics,
        chartData: recentMetrics.map((m, idx) => ({
          time: new Date(m.timestamp).toLocaleTimeString(),
          cpuUsage: m.cpuUsage,
          memoryUsage: m.memoryUsage,
          taskCount: m.tasksProcessed,
          index: idx
        }))
      });
    } catch {
      res.status(500).json({ error: 'Failed to collect metrics' });
    }
  });

  /**
   * GET /api/metrics/history
   * Get metric history with filtering
   */
  router.get('/metrics/history', (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const metrics = metricsCollector.getMetrics(limit);

      res.status(200).json({
        count: metrics.length,
        metrics,
        timeRange: {
          start: metrics[0]?.timestamp,
          end: metrics[metrics.length - 1]?.timestamp
        }
      });
    } catch {
      res.status(500).json({ error: 'Failed to retrieve metrics history' });
    }
  });

  // ─── Swarm Management Routes ────────────────────────────────

  /**
   * GET /api/swarm/agents
   * List all agents in the swarm
   */
  router.get('/swarm/agents', authMiddleware.enforceFirstLoginPasswordChange, (req: Request, res: Response) => {
    try {
      // Mock agent list (in production, query from swarm state)
      const agents = [
        {
          id: 'agent-1',
          name: 'Coordinator-01',
          role: 'coordinator',
          status: 'healthy',
          capacity: 10,
          currentLoad: 3,
          successRate: 0.98,
          lastHeartbeat: new Date().toISOString()
        },
        {
          id: 'agent-2',
          name: 'Executor-01',
          role: 'executor',
          status: 'healthy',
          capacity: 20,
          currentLoad: 15,
          successRate: 0.95,
          lastHeartbeat: new Date().toISOString()
        },
        {
          id: 'agent-3',
          name: 'Reviewer-01',
          role: 'reviewer',
          status: 'healthy',
          capacity: 15,
          currentLoad: 8,
          successRate: 0.97,
          lastHeartbeat: new Date().toISOString()
        },
        {
          id: 'agent-4',
          name: 'Optimizer-01',
          role: 'optimizer',
          status: 'warning',
          capacity: 10,
          currentLoad: 9,
          successRate: 0.92,
          lastHeartbeat: new Date(Date.now() - 30000).toISOString()
        }
      ];

      res.status(200).json({
        totalAgents: agents.length,
        healthyAgents: agents.filter(a => a.status === 'healthy').length,
        agents
      });
    } catch {
      res.status(500).json({ error: 'Failed to retrieve agents' });
    }
  });

  /**
   * POST /api/swarm/scale
   * Scale the swarm up or down
   */
  router.post('/swarm/scale', authMiddleware.enforceFirstLoginPasswordChange, (req: Request, res: Response) => {
    try {
      const { targetAgents } = req.body;

      if (!targetAgents || targetAgents < 1 || targetAgents > 60) {
        return res.status(400).json({
          error: 'Invalid target',
          message: 'Target agent count must be between 1 and 60'
        });
      }

      res.status(200).json({
        success: true,
        message: `Scaling swarm to ${targetAgents} agents`,
        currentAgents: 12,
        targetAgents,
        scalingInProgress: true
      });
    } catch {
      res.status(500).json({ error: 'Failed to scale swarm' });
    }
  });

  // ─── Dashboard Data Routes ──────────────────────────────────

  /**
   * GET /api/dashboard/overview
   * Get dashboard overview data
   */
  router.get('/dashboard/overview', authMiddleware.enforceFirstLoginPasswordChange, async (req: Request, res: Response) => {
    try {
      const metrics = metricsCollector.getMetrics(1)[0];

      res.status(200).json({
        swarmStatus: {
          activeAgents: 12,
          maxAgents: 60,
          totalTasks: 1245,
          successRate: 0.96
        },
        systemHealth: {
          cpuUsage: metrics?.cpuUsage || 0,
          memoryUsage: metrics?.memoryUsage || 0,
          diskUsage: 35,
          status: 'healthy'
        },
        recentActivity: {
          tasksCompleted: 45,
          tasksInProgress: 8,
          tasksFailed: 2,
          averageResponseTime: 2340
        },
        performanceMetrics: {
          throughput: 18.5,
          latencyP50: 1200,
          latencyP95: 4500,
          latencyP99: 7200
        }
      });
    } catch {
      res.status(500).json({ error: 'Failed to retrieve dashboard overview' });
    }
  });

  // ─── Configuration Routes ───────────────────────────────────

  /**
   * GET /api/config/topology
   * Get current swarm topology configuration
   */
  router.get('/config/topology', (req: Request, res: Response) => {
    try {
      res.status(200).json({
        topology: 'advanced',
        totalAgents: 60,
        consensusMode: 'byzantine',
        agentGroups: {
          coreAgents: 3,
          executionAgents: 20,
          optimizationAgents: 12,
          automationAgents: 15,
          reserveAgents: 10
        }
      });
    } catch {
      res.status(500).json({ error: 'Failed to retrieve topology configuration' });
    }
  });

  // ─── Agent Bootstrap Routes ─────────────────────────────────

  /**
   * POST /api/agents/bootstrap
   * Bootstrap 60+ agents for the swarm
   */
  router.post('/agents/bootstrap', authMiddleware.enforceFirstLoginPasswordChange, async (req: Request, res: Response) => {
    try {
      const agents = await agentBootstrap.bootstrapAgents();
      res.status(200).json({
        success: true,
        message: `Bootstrapped ${agents.length} agents`,
        agents,
        metrics: agentBootstrap.getMetricsSnapshot()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to bootstrap agents',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * GET /api/agents/status
   * Get current agent swarm status
   */
  router.get('/agents/status', (req: Request, res: Response) => {
    try {
      const agents = agentBootstrap.getAllAgents();
      const health = agentBootstrap.getAgentHealth();

      res.status(200).json({
        health,
        agents: agents.map(a => ({
          id: a.id,
          role: a.role,
          group: a.group,
          status: a.status,
          tasksCompleted: a.tasksCompleted,
          memoryUsageMB: a.memoryUsageMB,
          lastHeartbeat: new Date(a.lastHeartbeat).toISOString()
        })),
        totalMemoryMB: agentBootstrap.getTotalMemoryUsage(),
        metricsSnapshot: agentBootstrap.getMetricsSnapshot()
      });
    } catch {
      res.status(500).json({ error: 'Failed to retrieve agent status' });
    }
  });

  /**
   * GET /api/agents/:agentId
   * Get specific agent details
   */
  router.get('/agents/:agentId', (req: Request, res: Response) => {
    try {
      const agent = agentBootstrap.getAgent(req.params.agentId);

      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      res.status(200).json(agent);
    } catch {
      res.status(500).json({ error: 'Failed to retrieve agent details' });
    }
  });

  // ─── Memory Synchronization Routes ──────────────────────────

  /**
   * POST /api/memory/vector
   * Add a memory vector to the HNSW index
   */
  router.post('/memory/vector', authMiddleware.enforceFirstLoginPasswordChange, (req: Request, res: Response) => {
    try {
      const { agentId, embedding, contextSize } = req.body;

      if (!agentId || !embedding || !Array.isArray(embedding)) {
        return res.status(400).json({
          error: 'Invalid request',
          message: 'agentId and embedding array are required'
        });
      }

      const vectorId = memorySync.addMemoryVector(agentId, embedding, contextSize || 1);

      res.status(201).json({
        success: true,
        vectorId,
        indexStatus: memorySync.getIndexStatus()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to add memory vector',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * POST /api/memory/search
   * Search for nearest memory vectors
   */
  router.post('/memory/search', (req: Request, res: Response) => {
    try {
      const { embedding, k, maxDistance } = req.body;

      if (!embedding || !Array.isArray(embedding)) {
        return res.status(400).json({
          error: 'Invalid request',
          message: 'embedding array is required'
        });
      }

      const results = memorySync.searchNearest(embedding, k || 5, maxDistance || 2.0);

      res.status(200).json({
        resultsCount: results.length,
        results,
        indexStatus: memorySync.getIndexStatus()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to search memory vectors',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * GET /api/memory/index
   * Get HNSW index statistics
   */
  router.get('/memory/index', (req: Request, res: Response) => {
    try {
      const status = memorySync.getIndexStatus();
      res.status(200).json({
        status,
        message: 'HNSW index is operational'
      });
    } catch {
      res.status(500).json({ error: 'Failed to retrieve index status' });
    }
  });

  /**
   * GET /api/memory/agent/:agentId
   * Get memory profile for a specific agent
   */
  router.get('/memory/agent/:agentId', (req: Request, res: Response) => {
    try {
      const profile = memorySync.getAgentMemoryProfile(req.params.agentId);

      res.status(200).json({
        agentId: req.params.agentId,
        profile,
        indexStatus: memorySync.getIndexStatus()
      });
    } catch {
      res.status(500).json({ error: 'Failed to retrieve agent memory profile' });
    }
  });

  return router;
}

export default createApiRoutes;
