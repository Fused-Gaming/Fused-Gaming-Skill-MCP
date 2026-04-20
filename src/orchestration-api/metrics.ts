import fs from 'fs';
import path from 'path';
import os from 'os';

export interface SystemMetrics {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  activeAgents: number;
  tasksProcessed: number;
  averageTaskDuration: number;
}

export class MetricsCollector {
  private metricsFile: string;
  private metrics: SystemMetrics[] = [];

  constructor(dataDir: string) {
    this.metricsFile = path.join(dataDir, 'metrics.json');
    this.loadMetrics();
  }

  private loadMetrics(): void {
    try {
      if (fs.existsSync(this.metricsFile)) {
        const data = fs.readFileSync(this.metricsFile, 'utf-8');
        this.metrics = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  }

  public collectMetrics(agentCount: number, tasksProcessed: number, avgTaskDuration: number): SystemMetrics {
    const freemem = os.freemem();
    const totalmem = os.totalmem();
    const memUsagePercent = ((totalmem - freemem) / totalmem) * 100;

    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach(cpu => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    });

    const cpuUsagePercent = (1 - totalIdle / totalTick) * 100;

    const metric: SystemMetrics = {
      timestamp: new Date().toISOString(),
      cpuUsage: Math.round(cpuUsagePercent * 100) / 100,
      memoryUsage: Math.round(memUsagePercent * 100) / 100,
      activeAgents: agentCount,
      tasksProcessed,
      averageTaskDuration: avgTaskDuration
    };

    this.metrics.push(metric);
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    this.saveMetrics();
    return metric;
  }

  private saveMetrics(): void {
    try {
      fs.writeFileSync(this.metricsFile, JSON.stringify(this.metrics, null, 2));
    } catch (error) {
      console.error('Failed to save metrics:', error);
    }
  }

  public getMetrics(limit: number = 100): SystemMetrics[] {
    return this.metrics.slice(-limit);
  }
}
