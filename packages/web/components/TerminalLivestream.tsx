'use client';

/**
 * Terminal Livestream Component
 *
 * EDUCATIONAL USE ONLY
 *
 * This component is part of the Fused Gaming MCP project and is licensed for
 * educational use only under the Apache 2.0 License. This component integrates
 * with the Fused Gaming MCP ecosystem to provide real-time terminal output
 * visualization and livestream capabilities for development workflows.
 *
 * Educational Use Restrictions:
 * - For learning and training purposes only
 * - Non-commercial academic and educational institutions
 * - Not permitted for commercial products or services
 * - Attribution to Fused Gaming required
 *
 * For commercial licensing inquiries, contact: license@fused-gaming.io
 *
 * @license Apache 2.0 with educational restrictions
 * @copyright 2026 Fused Gaming
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, Copy, Trash2, Download } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error' | 'command';
  message: string;
  category?: string;
}

export default function TerminalLivestream() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLive, setIsLive] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current && isLive) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isLive]);

  // Simulate real-time log streaming
  useEffect(() => {
    if (!isOpen) return;

    const sampleLogs = [
      {
        level: 'info' as const,
        message: '🎮 Fused Gaming MCP Terminal Livestream',
        category: 'system',
      },
      {
        level: 'info' as const,
        message: 'Educational Use Only - Licensed under Apache 2.0',
        category: 'system',
      },
      {
        level: 'success' as const,
        message: 'Terminal connection established',
        category: 'connection',
      },
      {
        level: 'command' as const,
        message: 'npm run mcp:init',
        category: 'user',
      },
      {
        level: 'info' as const,
        message: 'Initializing MCP core directories...',
        category: 'init',
      },
      {
        level: 'success' as const,
        message: 'Created directory: .mcp',
        category: 'init',
      },
      {
        level: 'success' as const,
        message: 'Created directory: registry',
        category: 'init',
      },
      {
        level: 'command' as const,
        message: 'node scripts/generate-skill-registry.js',
        category: 'registry',
      },
      {
        level: 'info' as const,
        message: 'Scanning skill packages...',
        category: 'registry',
      },
      {
        level: 'success' as const,
        message: '✅ Generated skill registry: registry/skills.json',
        category: 'registry',
      },
      {
        level: 'success' as const,
        message: '✅ Generated skill registry: registry/skills.cjs',
        category: 'registry',
      },
      {
        level: 'success' as const,
        message: '✅ Generated skill registry: registry/skills.ts',
        category: 'registry',
      },
      {
        level: 'info' as const,
        message: 'Registry Summary: 19 Skills | 22 Tools | 11 Categories',
        category: 'registry',
      },
      {
        level: 'success' as const,
        message: '✨ Installation complete!',
        category: 'system',
      },
    ];

    const addLogWithDelay = (index: number) => {
      if (index < sampleLogs.length && isOpen) {
        const log = sampleLogs[index];
        setLogs((prev) => [
          ...prev,
          {
            id: `log-${Date.now()}-${index}`,
            timestamp: new Date().toLocaleTimeString(),
            ...log,
          },
        ]);
        setTimeout(() => addLogWithDelay(index + 1), 300 + Math.random() * 200);
      }
    };

    if (logs.length === 0) {
      addLogWithDelay(0);
    }
  }, [isOpen, logs.length]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'command':
        return 'text-cyan-400';
      default:
        return 'text-slate-300';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'command':
        return '❯';
      default:
        return '•';
    }
  };

  const handleCopyLogs = () => {
    const text = logs.map((log) => `[${log.timestamp}] ${log.message}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  const handleDownloadLogs = () => {
    const text = logs.map((log) => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fused-gaming-mcp-${Date.now()}.log`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 max-h-96 z-50 font-mono">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-magenta-600 to-purple-600 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-between gap-2 shadow-xl hover:shadow-2xl transition-shadow border border-magenta-500/50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          <Terminal size={18} className="animate-pulse" />
          <span className="text-sm">Fused Gaming Terminal</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>

      {/* Terminal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 bg-slate-950 rounded-lg border border-magenta-500/30 shadow-2xl overflow-hidden glass"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 border-b border-magenta-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-bold text-magenta-400">LIVESTREAM</span>
              </div>
              <span className="text-xs text-slate-400">Educational Use Only</span>
            </div>

            {/* License Badge */}
            <div className="bg-slate-900/50 px-4 py-2 border-b border-magenta-500/10">
              <p className="text-xs text-slate-500 text-center">
                🎮 Fused Gaming MCP • Apache 2.0 • Educational Use
              </p>
            </div>

            {/* Terminal Output */}
            <div
              ref={scrollRef}
              className="h-64 overflow-y-auto bg-slate-950 px-4 py-3 space-y-1 text-xs scrollbar-thin scrollbar-thumb-magenta-500/30 scrollbar-track-slate-900"
            >
              {logs.length === 0 ? (
                <div className="text-slate-500 italic">
                  Terminal ready for livestream output...
                </div>
              ) : (
                logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-2"
                  >
                    <span className="text-slate-500 shrink-0 w-4">
                      {getLevelIcon(log.level)}
                    </span>
                    <span className="text-slate-500 shrink-0">
                      {log.timestamp}
                    </span>
                    <span className={`flex-1 ${getLevelColor(log.level)}`}>
                      {log.message}
                    </span>
                  </motion.div>
                ))
              )}
            </div>

            {/* Controls */}
            <div className="bg-slate-900/50 px-4 py-3 border-t border-magenta-500/20 flex gap-2">
              <motion.button
                onClick={handleCopyLogs}
                disabled={logs.length === 0}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy size={12} /> Copy
              </motion.button>

              <motion.button
                onClick={handleDownloadLogs}
                disabled={logs.length === 0}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={12} /> Download
              </motion.button>

              <motion.button
                onClick={handleClearLogs}
                disabled={logs.length === 0}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 size={12} /> Clear
              </motion.button>

              <label className="ml-auto flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLive}
                  onChange={(e) => setIsLive(e.target.checked)}
                  className="w-3 h-3 rounded"
                />
                <span>Live</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility Label */}
      <div className="sr-only">
        Fused Gaming MCP Terminal Livestream - Educational Use Only
      </div>
    </div>
  );
}
