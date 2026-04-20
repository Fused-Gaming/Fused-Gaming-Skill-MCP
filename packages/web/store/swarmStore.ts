import { create } from 'zustand';

export interface Agent {
  id: string;
  name: string;
  role: 'coordinator' | 'executor' | 'reviewer' | 'optimizer' | 'monitor';
  status: 'idle' | 'busy' | 'error' | 'offline';
  load: number;
  capacity: number;
  successRate: number;
}

export interface Task {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: number;
  assignedAgent?: string;
  progress: number;
}

export interface Swarm {
  id: string;
  name: string;
  topology: 'hierarchical' | 'mesh' | 'adaptive';
  agents: Agent[];
  activeTasks: Task[];
  health: number;
  uptime: number;
}

interface SwarmStore {
  swarms: Swarm[];
  selectedSwarm: string | null;
  roadmap: RoadmapItem[];
  isRunning: boolean;
  initializeSwarms: () => void;
  addSwarm: (swarm: Swarm) => void;
  updateSwarm: (id: string, updates: Partial<Swarm>) => void;
  selectSwarm: (id: string) => void;
  executeTask: (swarmId: string, task: Task) => void;
  updateRoadmap: (items: RoadmapItem[]) => void;
  toggleExecution: () => void;
}

export interface RoadmapItem {
  id: string;
  name: string;
  description: string;
  schedule: string;
  tasks: Task[];
  isActive: boolean;
  completedAt?: number;
}

export const useSwarmStore = create<SwarmStore>((set) => ({
  swarms: [],
  selectedSwarm: null,
  roadmap: [],
  isRunning: false,

  initializeSwarms: () => {
    const initialSwarms: Swarm[] = [
      {
        id: 'swarm-1',
        name: 'Production Swarm',
        topology: 'hierarchical',
        agents: [
          {
            id: 'agent-1',
            name: 'Queen',
            role: 'coordinator',
            status: 'idle',
            load: 2,
            capacity: 10,
            successRate: 0.99,
          },
          {
            id: 'agent-2',
            name: 'Executor-A',
            role: 'executor',
            status: 'idle',
            load: 1,
            capacity: 10,
            successRate: 0.95,
          },
          {
            id: 'agent-3',
            name: 'Executor-B',
            role: 'executor',
            status: 'idle',
            load: 0,
            capacity: 10,
            successRate: 0.97,
          },
          {
            id: 'agent-4',
            name: 'Reviewer',
            role: 'reviewer',
            status: 'idle',
            load: 1,
            capacity: 8,
            successRate: 0.98,
          },
        ],
        activeTasks: [],
        health: 0.95,
        uptime: 99.8,
      },
      {
        id: 'swarm-2',
        name: 'Dev Swarm',
        topology: 'mesh',
        agents: [
          {
            id: 'agent-5',
            name: 'Dev-1',
            role: 'executor',
            status: 'busy',
            load: 5,
            capacity: 10,
            successRate: 0.92,
          },
          {
            id: 'agent-6',
            name: 'Dev-2',
            role: 'executor',
            status: 'idle',
            load: 2,
            capacity: 10,
            successRate: 0.94,
          },
          {
            id: 'agent-7',
            name: 'Optimizer',
            role: 'optimizer',
            status: 'idle',
            load: 0,
            capacity: 8,
            successRate: 0.96,
          },
        ],
        activeTasks: [
          {
            id: 'task-1',
            name: 'Build Application',
            status: 'running',
            priority: 10,
            assignedAgent: 'agent-5',
            progress: 65,
          },
        ],
        health: 0.88,
        uptime: 95.2,
      },
    ];

    set({ swarms: initialSwarms, selectedSwarm: initialSwarms[0].id });
  },

  addSwarm: (swarm) =>
    set((state) => ({
      swarms: [...state.swarms, swarm],
    })),

  updateSwarm: (id, updates) =>
    set((state) => ({
      swarms: state.swarms.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  selectSwarm: (id) => set({ selectedSwarm: id }),

  executeTask: (swarmId, task) =>
    set((state) => ({
      swarms: state.swarms.map((s) =>
        s.id === swarmId
          ? { ...s, activeTasks: [...s.activeTasks, task] }
          : s
      ),
    })),

  updateRoadmap: (items) => set({ roadmap: items }),

  toggleExecution: () => set((state) => ({ isRunning: !state.isRunning })),
}));
