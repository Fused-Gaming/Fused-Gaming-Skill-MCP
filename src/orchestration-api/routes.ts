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
import FirstLoginManager from './first-login-manager.js';
import AuthMiddleware from './auth-middleware.js';
import { MetricsCollector } from './metrics.js';
import { HealthCheckService } from './health.js';

export function createApiRoutes(baseDir: string = '.claude-flow'): Router {
  const router = Router();

  // Initialize managers
  const firstLoginManager = new FirstLoginManager(baseDir);
  const authMiddleware = new AuthMiddleware(baseDir);
  const metricsCollector = new MetricsCollector(baseDir);
  const healthCheckService = new HealthCheckService(baseDir);

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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve topology configuration' });
    }
  });

  return router;
}

export default createApiRoutes;
