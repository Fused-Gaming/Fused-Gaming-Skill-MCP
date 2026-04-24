'use client';

import { motion } from 'framer-motion';
import { useSwarmStore } from '@/store/swarmStore';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useMemo } from 'react';

export default function TaskMonitor() {
  const { swarms } = useSwarmStore();

  const allTasks = useMemo(() => {
    return swarms.flatMap((swarm) =>
      swarm.activeTasks.map((task) => ({ ...task, swarmId: swarm.id, swarmName: swarm.name }))
    );
  }, [swarms]);

  const completedTasks = allTasks.filter((t) => t.status === 'completed').length;
  const failedTasks = allTasks.filter((t) => t.status === 'failed').length;
  const runningTasks = allTasks.filter((t) => t.status === 'running').length;

  return (
    <div className="glass rounded-lg p-6 border border-swarm-tertiary/20">
      <div className="grid grid-cols-4 gap-4 mb-8">
        <motion.div
          className="bg-gradient-to-br from-swarm-accent/10 to-swarm-accent/5 rounded p-4 border border-swarm-accent/20"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-xs text-slate-400 mb-1">Total Tasks</p>
          <p className="text-3xl font-bold text-swarm-accent">{allTasks.length}</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded p-4 border border-cyan-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-xs text-slate-400 mb-1">Running</p>
          <p className="text-3xl font-bold text-cyan-400">{runningTasks}</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded p-4 border border-green-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-xs text-slate-400 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-red-500/10 to-red-500/5 rounded p-4 border border-red-500/20"
          whileHover={{ scale: 1.05 }}
        >
          <p className="text-xs text-slate-400 mb-1">Failed</p>
          <p className="text-3xl font-bold text-red-400">{failedTasks}</p>
        </motion.div>
      </div>

      {/* Task List */}
      <div>
        <h3 className="text-lg font-bold mb-4 glow-tertiary">Active Tasks</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {allTasks.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No active tasks</p>
          ) : (
            allTasks.map((task) => (
              <motion.div
                key={task.id}
                className="bg-slate-900/50 rounded p-4 border border-slate-700 hover:border-swarm-tertiary/50 transition-all"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-mono text-sm text-swarm-accent">{task.name}</p>
                    <p className="text-xs text-slate-400">{task.swarmName}</p>
                  </div>
                  {task.status === 'completed' && (
                    <CheckCircle size={16} className="text-green-400" />
                  )}
                  {task.status === 'failed' && (
                    <AlertCircle size={16} className="text-red-400" />
                  )}
                  {task.status === 'running' && (
                    <Clock size={16} className="text-swarm-tertiary animate-spin" />
                  )}
                </div>

                {task.status === 'running' && (
                  <div className="bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-swarm-accent to-swarm-tertiary"
                      animate={{ width: `${task.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}

                <div className="flex justify-between text-xs text-slate-500">
                  <span>Priority: {task.priority}</span>
                  {task.status === 'running' && <span>{task.progress}%</span>}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
