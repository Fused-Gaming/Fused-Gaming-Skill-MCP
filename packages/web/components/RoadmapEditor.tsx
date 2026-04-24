'use client';

import { motion } from 'framer-motion';
import { useSwarmStore, type RoadmapItem } from '@/store/swarmStore';
import { Plus, Calendar, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function RoadmapEditor() {
  const { roadmap, updateRoadmap } = useSwarmStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', schedule: '', description: '' });

  const handleAddItem = () => {
    if (!formData.name || !formData.schedule) return;

    const newItem: RoadmapItem = {
      id: `roadmap-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      schedule: formData.schedule,
      tasks: [],
      isActive: false,
    };

    updateRoadmap([...roadmap, newItem]);
    setFormData({ name: '', schedule: '', description: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    updateRoadmap(roadmap.filter((item) => item.id !== id));
  };

  return (
    <div className="glass rounded-lg p-6 border border-swarm-accent/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold glow-accent">Execution Roadmap</h2>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-swarm-accent text-black rounded font-mono text-sm hover:bg-opacity-90 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={16} /> Add Phase
        </motion.button>
      </div>

      {/* Add Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 rounded p-4 mb-6 border border-slate-700 space-y-3"
        >
          <input
            type="text"
            placeholder="Phase name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded text-sm border border-slate-600 focus:border-swarm-accent outline-none transition-colors"
          />
          <input
            type="text"
            placeholder="Schedule (e.g., daily, 2h, cron: 0 */6 * * *)"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded text-sm border border-slate-600 focus:border-swarm-accent outline-none transition-colors"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded text-sm border border-slate-600 focus:border-swarm-accent outline-none transition-colors resize-none h-20"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddItem}
              className="flex-1 bg-swarm-accent text-black px-3 py-2 rounded text-sm font-mono hover:bg-opacity-90 transition-all"
            >
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-slate-700 text-white px-3 py-2 rounded text-sm hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Roadmap Timeline */}
      <div className="space-y-3">
        {roadmap.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No phases scheduled</p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-swarm-accent via-swarm-tertiary to-swarm-secondary" />

            {/* Timeline items */}
            {roadmap.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-20 pb-8"
              >
                <motion.div
                  className="absolute left-0 w-14 h-14 bg-gradient-to-br from-swarm-accent to-swarm-tertiary rounded-full flex items-center justify-center text-black font-bold text-sm cursor-pointer hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.1 }}
                >
                  {idx + 1}
                </motion.div>

                <motion.div
                  className={`bg-slate-900/50 rounded-lg p-4 border transition-all cursor-pointer ${
                    item.isActive ? 'border-swarm-secondary' : 'border-slate-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-swarm-accent mb-1">{item.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar size={12} />
                        <span className="font-mono">{item.schedule}</span>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.2 }}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>

                  {item.description && (
                    <p className="text-sm text-slate-400 mt-2">{item.description}</p>
                  )}

                  {item.completedAt && (
                    <div className="mt-3 text-xs text-green-400 font-mono">
                      ✓ Completed {new Date(item.completedAt).toLocaleDateString()}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
