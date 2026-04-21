import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

// In-memory metrics storage (would be replaced with persistent storage in production)
const metricsStore = {
  activeAgents: 3,
  cacheHits: 1247,
  avgLatency: 42,
  tasksProcessed: 5890,
  throughput: 125.3,
  cacheHitRate: 87.5,
  errorRate: 0.2,
  memoryUsage: 134217728, // bytes
  cpuUsage: 32,
  memUsage: 48,
  diskUsage: 21,
  lastUpdated: Date.now(),
};

// Simulate metric changes
function updateMetrics() {
  metricsStore.activeAgents = Math.max(1, Math.min(8, metricsStore.activeAgents + Math.random() - 0.5));
  metricsStore.cacheHits += Math.floor(Math.random() * 10);
  metricsStore.avgLatency = Math.max(10, Math.min(200, metricsStore.avgLatency + (Math.random() - 0.5) * 20));
  metricsStore.tasksProcessed += Math.floor(Math.random() * 50);
  metricsStore.throughput = Math.max(50, Math.min(200, metricsStore.throughput + (Math.random() - 0.5) * 30));
  metricsStore.cacheHitRate = Math.max(50, Math.min(99, metricsStore.cacheHitRate + (Math.random() - 0.5) * 5));
  metricsStore.errorRate = Math.max(0, Math.min(5, metricsStore.errorRate + (Math.random() - 0.5) * 0.5));
  metricsStore.cpuUsage = Math.max(10, Math.min(90, metricsStore.cpuUsage + (Math.random() - 0.5) * 10));
  metricsStore.memUsage = Math.max(20, Math.min(80, metricsStore.memUsage + (Math.random() - 0.5) * 8));
  metricsStore.diskUsage = Math.max(10, Math.min(70, metricsStore.diskUsage + (Math.random() - 0.5) * 3));
  metricsStore.lastUpdated = Date.now();
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Serve dashboard HTML
    if ((req.url === '/' || req.url === '/dashboard') && req.method === 'GET') {
      try {
        const dashboardPath = path.join(process.cwd(), 'public', 'syncpulse-dashboard.html');
        const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(dashboardContent);
      } catch (_err) {
        // Fallback if file doesn't exist
        return res.status(200).json({
          status: 'ok',
          service: 'fused-gaming-skill-mcp',
          domain: 'skill.vln.gg',
          message: 'Dashboard file not found in deployment, but service is running',
          timestamp: new Date().toISOString(),
          version: '1.0.3',
        });
      }
    }

    // Health check endpoint
    if (req.url === '/health' && req.method === 'GET') {
      return res.status(200).json({
        status: 'ok',
        service: 'fused-gaming-skill-mcp',
        domain: 'skill.vln.gg',
        timestamp: new Date().toISOString(),
        version: '1.0.3',
      });
    }

    // Metrics endpoint
    if (req.url === '/api/metrics' && req.method === 'GET') {
      updateMetrics();
      return res.status(200).json(metricsStore);
    }

    // Skills list endpoint
    if (req.url === '/skills' && req.method === 'GET') {
      return res.status(200).json({
        skills: [
          {
            name: 'syncpulse',
            description: 'Intelligent project state caching and multi-agent coordination',
            version: '1.0.3',
            features: [
              'Swarm orchestration with multiple topologies',
              'Hybrid memory caching with TTL support',
              'Distributed task routing and execution',
              'Real-time performance monitoring',
              'Vector similarity search',
            ],
          },
          {
            name: 'mermaid-terminal',
            description: 'Generate Mermaid diagrams from terminal',
            version: '1.0.0',
          },
          {
            name: 'agentic-flow-devkit',
            description: 'Visualization and planning tools for agent orchestration',
            version: '1.0.0',
          },
        ],
      });
    }

    // Syncpulse API endpoint
    if (req.url?.startsWith('/api/syncpulse') && req.method === 'POST') {
      const { action, payload } = req.body;

      switch (action) {
        case 'synchronize_project_state':
          return res.status(200).json({
            success: true,
            action,
            result: {
              projectId: payload?.projectId,
              stateHash: Math.random().toString(36).substring(7),
              timestamp: Date.now(),
              cacheSize: Math.floor(Math.random() * 10) + 1,
              message: 'Project state synchronized successfully',
            },
          });

        case 'query_cache':
          return res.status(200).json({
            success: true,
            action,
            results: [
              {
                key: 'project.config',
                score: 0.95,
                ttl: 300,
                size: 2048,
              },
              {
                key: 'agent.metrics',
                score: 0.87,
                ttl: 120,
                size: 512,
              },
              {
                key: 'task.queue',
                score: 0.72,
                ttl: 30,
                size: 256,
              },
            ],
            totalResults: 3,
          });

        case 'coordinate_agents':
          return res.status(200).json({
            success: true,
            action,
            workflowId: payload?.workflowId,
            topology: payload?.topology || 'hierarchical',
            tasksAssigned: payload?.tasks?.length || 0,
            coordinationId: Math.random().toString(36).substring(7),
            startTime: Date.now(),
          });

        case 'analyze_performance':
          return res.status(200).json({
            success: true,
            action,
            timeRange: payload?.timeRange,
            metrics: {
              avgLatency: metricsStore.avgLatency,
              throughput: metricsStore.throughput,
              cacheHitRate: metricsStore.cacheHitRate,
              errorRate: metricsStore.errorRate,
              activeAgents: Math.round(metricsStore.activeAgents),
            },
          });

        default:
          return res.status(400).json({
            error: 'Unknown action',
            action,
          });
      }
    }

    // MCP API endpoint (standard JSON-RPC)
    if (req.url === '/api' && req.method === 'POST') {
      const { jsonrpc, method, params, id } = req.body;

      if (jsonrpc === '2.0') {
        // Handle MCP-style requests
        return res.status(200).json({
          jsonrpc: '2.0',
          result: {
            received: true,
            method,
            timestamp: Date.now(),
            implementation: 'Fused Gaming Skill MCP',
          },
          id,
        });
      }
    }

    res.status(404).json({ error: 'Not found', path: req.url });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
