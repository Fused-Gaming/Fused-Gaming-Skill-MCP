import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';

export interface Agent {
  id: string;
  role: string;
  group: string;
  status: 'initializing' | 'running' | 'idle' | 'error';
  tasksCompleted: number;
  lastHeartbeat: number;
  memoryUsageMB: number;
  errorLog?: string[];
}

export interface AgentBootstrapConfig {
  topology: 'simple' | 'balanced' | 'advanced';
  totalAgents: number;
  consensusMode: 'gossip' | 'raft' | 'byzantine';
  agentGroups: Record<string, { count: number; roles: string[] }>;
}

export class AgentBootstrapManager extends EventEmitter {
  private configPath: string;
  private agentsPath: string;
  private agents: Map<string, Agent> = new Map();
  private config: AgentBootstrapConfig | null = null;
  private startTime: number = Date.now();

  constructor(dataDir: string) {
    super();
    this.configPath = path.join(dataDir, 'agents.json');
    this.agentsPath = path.join(dataDir, 'active-agents.json');
    this.loadConfig();
  }

  private loadConfig(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, 'utf-8');
        this.config = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load agent config:', error);
    }
  }

  public async bootstrapAgents(): Promise<Agent[]> {
    if (!this.config) {
      throw new Error('Agent configuration not loaded');
    }

    const agentList: Agent[] = [];
    let agentId = 1;

    for (const [groupName, groupConfig] of Object.entries(this.config.agentGroups)) {
      for (let i = 0; i < groupConfig.count; i++) {
        const role = groupConfig.roles[i % groupConfig.roles.length];
        const agent = await this.createAgent(
          `agent-${agentId}`,
          role,
          groupName
        );
        agentList.push(agent);
        this.agents.set(agent.id, agent);
        agentId++;
      }
    }

    this.saveAgents();
    this.emit('agents-bootstrapped', {
      count: agentList.length,
      timestamp: new Date().toISOString()
    });

    return agentList;
  }

  private async createAgent(id: string, role: string, group: string): Promise<Agent> {
    const agent: Agent = {
      id,
      role,
      group,
      status: 'initializing',
      tasksCompleted: 0,
      lastHeartbeat: Date.now(),
      memoryUsageMB: Math.random() * 50 + 10, // Simulated memory
      errorLog: []
    };

    // Simulate agent initialization
    await new Promise(resolve => setTimeout(resolve, 10));
    agent.status = 'running';

    return agent;
  }

  public getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  public updateAgentMetrics(
    agentId: string,
    update: Partial<Omit<Agent, 'id' | 'role' | 'group'>>
  ): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    Object.assign(agent, update);
    agent.lastHeartbeat = Date.now();
    this.saveAgents();
    return true;
  }

  public getAgentsByGroup(group: string): Agent[] {
    return Array.from(this.agents.values()).filter(a => a.group === group);
  }

  public getAgentsByRole(role: string): Agent[] {
    return Array.from(this.agents.values()).filter(a => a.role === role);
  }

  public getAgentHealth(): {
    total: number;
    running: number;
    idle: number;
    error: number;
    uptime: number;
  } {
    const agents = this.getAllAgents();
    return {
      total: agents.length,
      running: agents.filter(a => a.status === 'running').length,
      idle: agents.filter(a => a.status === 'idle').length,
      error: agents.filter(a => a.status === 'error').length,
      uptime: Math.round((Date.now() - this.startTime) / 1000)
    };
  }

  public getTotalMemoryUsage(): number {
    return Array.from(this.agents.values()).reduce((sum, a) => sum + a.memoryUsageMB, 0);
  }

  private saveAgents(): void {
    try {
      const agentArray = Array.from(this.agents.values());
      fs.writeFileSync(this.agentsPath, JSON.stringify(agentArray, null, 2));
    } catch (error) {
      console.error('Failed to save agents:', error);
    }
  }

  public loadAgents(): Agent[] {
    try {
      if (fs.existsSync(this.agentsPath)) {
        const data = fs.readFileSync(this.agentsPath, 'utf-8');
        const agents = JSON.parse(data) as Agent[];
        agents.forEach(a => this.agents.set(a.id, a));
        return agents;
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
    return [];
  }

  public getMetricsSnapshot() {
    const health = this.getAgentHealth();
    return {
      timestamp: new Date().toISOString(),
      agentMetrics: health,
      totalMemoryMB: this.getTotalMemoryUsage(),
      consensusMode: this.config?.consensusMode || 'unknown',
      topology: this.config?.topology || 'unknown'
    };
  }
}
