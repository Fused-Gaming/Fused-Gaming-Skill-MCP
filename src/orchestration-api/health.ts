import fs from 'fs';
import path from 'path';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'critical';
  agents: AgentHealth[];
  systemHealth: SystemHealth;
  timestamp: string;
}

export interface AgentHealth {
  id: string;
  status: 'healthy' | 'warning' | 'error';
  responseTime: number;
  lastHeartbeat: string;
}

export interface SystemHealth {
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  diskUsagePercent: number;
  uptime: number;
  avgLatency: number;
}

export class HealthCheckService {
  private healthFile: string;

  constructor(dataDir: string) {
    this.healthFile = path.join(dataDir, 'health.json');
  }

  public async checkHealth(
    agents: Array<{ id: string; lastHeartbeat?: number; responseTime?: number }>,
    systemMetrics: { cpuUsage?: number; memoryUsage?: number; diskUsage?: number; avgLatency?: number }
  ): Promise<HealthStatus> {
    const agentHealth: AgentHealth[] = agents.map(agent => ({
      id: agent.id,
      status: agent.lastHeartbeat && Date.now() - agent.lastHeartbeat < 10000 ? 'healthy' : 'error',
      responseTime: agent.responseTime || 0,
      lastHeartbeat: new Date(agent.lastHeartbeat || 0).toISOString()
    }));

    const systemHealth: SystemHealth = {
      cpuUsagePercent: systemMetrics.cpuUsage || 0,
      memoryUsagePercent: systemMetrics.memoryUsage || 0,
      diskUsagePercent: systemMetrics.diskUsage || 0,
      uptime: process.uptime(),
      avgLatency: systemMetrics.avgLatency || 0
    };

    const overallStatus = this.determineOverallStatus(agentHealth, systemHealth);

    const health: HealthStatus = {
      status: overallStatus,
      agents: agentHealth,
      systemHealth,
      timestamp: new Date().toISOString()
    };

    this.saveHealth(health);
    return health;
  }

  private determineOverallStatus(agents: AgentHealth[], system: SystemHealth): 'healthy' | 'degraded' | 'critical' {
    const healthyAgents = agents.filter(a => a.status === 'healthy').length;
    const healthRatio = healthyAgents / agents.length;

    if (system.cpuUsagePercent > 90 || system.memoryUsagePercent > 85) {
      return 'critical';
    }

    if (healthRatio < 0.5 || system.cpuUsagePercent > 75 || system.memoryUsagePercent > 70) {
      return 'degraded';
    }

    return 'healthy';
  }

  private saveHealth(health: HealthStatus): void {
    try {
      fs.writeFileSync(this.healthFile, JSON.stringify(health, null, 2));
    } catch (error) {
      console.error('Failed to save health status:', error);
    }
  }
}
