'use client';

import { motion } from 'framer-motion';
import { useSwarmStore } from '@/store/swarmStore';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

export default function ControlPanel() {
  const { swarms, selectedSwarm, isRunning, toggleExecution, selectSwarm } = useSwarmStore();

  return (
    <div className="glass rounded-lg p-6 border border-swarm-secondary/20">
      <h2 className="text-xl font-bold glow-secondary mb-6">Control Center</h2>

      {/* Swarm Selector */}
      <div className="mb-6">
        <label className="text-sm text-slate-400 mb-2 block">Active Swarm</label>
        <div className="space-y-2">
          {swarms.map((swarm) => (
            <motion.button
              key={swarm.id}
              onClick={() => selectSwarm(swarm.id)}
              className={`w-full px-4 py-2 rounded text-sm transition-all ${
                selectedSwarm === swarm.id
                  ? 'bg-swarm-secondary text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {swarm.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          onClick={toggleExecution}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded font-mono text-sm transition-all ${
            isRunning
              ? 'bg-swarm-secondary text-white'
              : 'bg-swarm-accent text-black hover:bg-opacity-90'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRunning ? (
            <>
              <Pause size={16} /> Stop
            </>
          ) : (
            <>
              <Play size={16} /> Start
            </>
          )}
        </motion.button>

        <motion.button
          className="flex items-center justify-center gap-2 px-4 py-3 rounded font-mono text-sm bg-swarm-tertiary/20 text-swarm-tertiary hover:bg-swarm-tertiary/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={16} /> Reset
        </motion.button>
      </div>

      {/* Status Indicator */}
      <div className="bg-slate-900/50 rounded p-4 mb-6 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-mono">Execution Status</span>
          <motion.div
            animate={{
              backgroundColor: isRunning
                ? ['#00ff88', '#00d9ff', '#00ff88']
                : '#6b7280',
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 rounded-full"
          />
        </div>
        <p className="text-xs text-slate-400">
          {isRunning ? 'System Running' : 'System Idle'}
        </p>
      </div>

      {/* Quick Settings */}
      <div className="space-y-3">
        <motion.button
          className="w-full flex items-center gap-2 px-4 py-2 rounded text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
          whileHover={{ x: 4 }}
        >
          <Settings size={14} />
          Configuration
        </motion.button>
      </div>
    </div>
  );
}
