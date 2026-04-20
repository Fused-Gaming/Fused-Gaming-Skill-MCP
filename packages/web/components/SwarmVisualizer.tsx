'use client';

import { motion } from 'framer-motion';
import { useSwarmStore } from '@/store/swarmStore';
import { Activity } from 'lucide-react';

export default function SwarmVisualizer() {
  const { swarms, selectedSwarm } = useSwarmStore();
  const currentSwarm = swarms.find((s) => s.id === selectedSwarm);

  if (!currentSwarm) return null;

  const agentColors: Record<string, string> = {
    coordinator: '#00ff88',
    executor: '#00d9ff',
    reviewer: '#ff006e',
    optimizer: '#ffd60a',
    monitor: '#9d4edd',
  };

  return (
    <div className="glass rounded-lg p-6 border border-swarm-accent/20 min-h-96">
      <div className="mb-6">
        <h2 className="text-2xl font-bold glow-accent mb-2">{currentSwarm.name}</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-swarm-accent animate-pulse"></div>
            <span>Health: {(currentSwarm.health * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={14} />
            <span>Uptime: {currentSwarm.uptime.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Swarm Visualization */}
      <svg
        className="w-full h-64 mb-6"
        viewBox="0 0 600 300"
        style={{ background: 'rgba(0,0,0,0.2)' }}
      >
        {/* Center node (coordinator for hierarchical) */}
        <motion.circle
          cx="300"
          cy="150"
          r="30"
          fill={agentColors.coordinator}
          opacity={0.3}
          animate={{
            r: [30, 35, 30],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <text x="300" y="155" textAnchor="middle" fontSize="12" fill="white">
          Q
        </text>

        {/* Orbiting agents */}
        {currentSwarm.agents.slice(1).map((agent, idx) => {
          const angle = (idx / (currentSwarm.agents.length - 1)) * Math.PI * 2 - Math.PI / 2;
          const distance = 120;
          const x = 300 + distance * Math.cos(angle);
          const y = 150 + distance * Math.sin(angle);

          return (
            <motion.g key={agent.id}>
              <motion.circle
                cx={x}
                cy={y}
                r="20"
                fill={agentColors[agent.role]}
                opacity={agent.status === 'busy' ? 0.8 : 0.4}
                animate={{
                  r: agent.status === 'busy' ? [20, 23, 20] : 20,
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontWeight="bold"
              >
                {idx + 1}
              </text>
            </motion.g>
          );
        })}

        {/* Connection lines */}
        {currentSwarm.agents.slice(1).map((agent, idx) => {
          const angle = (idx / (currentSwarm.agents.length - 1)) * Math.PI * 2 - Math.PI / 2;
          const distance = 120;
          const x = 300 + distance * Math.cos(angle);
          const y = 150 + distance * Math.sin(angle);

          return (
            <motion.line
              key={`line-${agent.id}`}
              x1="300"
              y1="150"
              x2={x}
              y2={y}
              stroke={agentColors[agent.role]}
              strokeWidth="1"
              opacity="0.3"
              animate={{
                opacity: agent.status === 'busy' ? [0.5, 0.8, 0.5] : 0.3,
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          );
        })}
      </svg>

      {/* Agent Stats */}
      <div className="grid grid-cols-2 gap-3">
        {currentSwarm.agents.map((agent) => (
          <motion.div
            key={agent.id}
            className="bg-slate-900/50 rounded p-3 text-xs border border-slate-700"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: agentColors[agent.role] }}
              ></div>
              <span className="font-mono text-swarm-accent">{agent.name}</span>
            </div>
            <div className="text-slate-400 space-y-1">
              <p>Load: {agent.load}/{agent.capacity}</p>
              <p>Success: {(agent.successRate * 100).toFixed(0)}%</p>
              <p
                className={`${
                  agent.status === 'idle'
                    ? 'text-swarm-accent'
                    : agent.status === 'busy'
                    ? 'text-swarm-secondary'
                    : 'text-red-400'
                }`}
              >
                {agent.status.toUpperCase()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
