'use client';

import { motion } from 'framer-motion';
import SwarmVisualizer from '@/components/SwarmVisualizer';
import RoadmapEditor from '@/components/RoadmapEditor';
import TaskMonitor from '@/components/TaskMonitor';
import ControlPanel from '@/components/ControlPanel';
import { useSwarmStore } from '@/store/swarmStore';
import { useEffect } from 'react';

export default function Home() {
  const { initializeSwarms } = useSwarmStore();

  useEffect(() => {
    initializeSwarms();
  }, [initializeSwarms]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-swarm-dark via-slate-900 to-swarm-dark">
      {/* Header */}
      <header className="border-b border-swarm-accent/20 sticky top-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold glow-accent">⚡ SyncPulse</h1>
              <p className="text-swarm-tertiary text-sm mt-1">Agent Swarm Commander</p>
            </div>
            <div className="text-right">
              <p className="text-swarm-accent font-mono text-sm">v1.0.0</p>
              <p className="text-slate-400 text-xs">Live Dashboard</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Swarm Visualizer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <SwarmVisualizer />
          </motion.div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ControlPanel />
          </motion.div>
        </div>

        {/* Task Monitor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <TaskMonitor />
        </motion.div>

        {/* Roadmap Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RoadmapEditor />
        </motion.div>
      </div>
    </main>
  );
}
