/**
 * Terminal Livestream Component Examples
 *
 * EDUCATIONAL USE ONLY
 *
 * This file demonstrates various ways to integrate and use the
 * Fused Gaming MCP Terminal Livestream component.
 *
 * @license Apache 2.0 with educational restrictions
 * @copyright 2026 Fused Gaming
 */

import { useEffect } from 'react';
import TerminalLivestream from '@/components/TerminalLivestream';
import { useTerminalLivestream } from '@/hooks/useTerminalLivestream';

/**
 * Example 1: Basic Usage
 * Simple integration of the terminal livestream component
 */
export function BasicTerminalExample() {
  return (
    <div>
      <h1>My App</h1>
      {/* Terminal appears as floating widget in bottom-right */}
      <TerminalLivestream />
    </div>
  );
}

/**
 * Example 2: Programmatic Log Control
 * Use the hook to programmatically add logs
 */
export function ProgrammaticLogsExample() {
  const { addLog, clearLogs, exportLogs } = useTerminalLivestream({
    maxLogs: 500,
    autoScroll: true,
  });

  const handleInstall = () => {
    addLog('Starting installation...', 'command');
    addLog('Downloading packages...', 'info');

    setTimeout(() => {
      addLog('✅ Installation complete!', 'success');
    }, 2000);
  };

  const handleExport = () => {
    const logs = exportLogs('text');
    console.log(logs);
  };

  return (
    <div>
      <button onClick={handleInstall}>Install</button>
      <button onClick={handleExport}>Export Logs</button>
      <button onClick={clearLogs}>Clear</button>
      <TerminalLivestream />
    </div>
  );
}

/**
 * Example 3: MCP Setup Wizard
 * Integration with MCP initialization process
 */
export function MCPSetupWizardExample() {
  const { addLog, isLive, setIsLive } = useTerminalLivestream({
    autoConnect: false,
  });

  useEffect(() => {
    const runSetup = async () => {
      addLog('🎮 Fused Gaming MCP Setup Wizard', 'info', 'system');
      addLog('Educational Use - Licensed under Apache 2.0', 'info', 'system');

      // Step 1: Initialize directories
      addLog('Step 1: Initializing directories...', 'command');
      await delay(500);
      addLog('✓ Created .mcp directory', 'success');
      addLog('✓ Created registry directory', 'success');

      // Step 2: Install dependencies
      addLog('Step 2: Installing dependencies...', 'command');
      await delay(1000);
      addLog('✓ npm packages installed', 'success');

      // Step 3: Generate registry
      addLog('Step 3: Generating skill registry...', 'command');
      await delay(800);
      addLog('✓ Scanned 19 skills', 'success');
      addLog('✓ Indexed 22 tools', 'success');
      addLog('✓ Categorized in 11 categories', 'success');

      // Step 4: Build
      addLog('Step 4: Building packages...', 'command');
      await delay(1200);
      addLog('✓ TypeScript compiled', 'success');
      addLog('✓ All packages built', 'success');

      // Complete
      addLog('✨ Setup complete! Your MCP is ready.', 'success', 'system');
    };

    runSetup();
  }, [addLog]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">MCP Setup</h2>
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={isLive}
          onChange={(e) => setIsLive(e.target.checked)}
        />
        Live Updates
      </label>
      <TerminalLivestream />
    </div>
  );
}

/**
 * Example 4: WebSocket Real-Time Streaming
 * Connect to a real-time log stream via WebSocket
 */
export function WebSocketStreamingExample() {
  const { isConnected, connect, disconnect, logs } = useTerminalLivestream({
    wsUrl: 'ws://localhost:8080/logs', // Your WebSocket endpoint
    autoConnect: false,
  });

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={connect}
          disabled={isConnected}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Connect
        </button>
        <button
          onClick={disconnect}
          disabled={!isConnected}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
        >
          Disconnect
        </button>
      </div>

      <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      <p>Logs: {logs.length}</p>

      <TerminalLivestream />
    </div>
  );
}

/**
 * Example 5: Error Handling & Logging
 * Demonstrate error logging patterns
 */
export function ErrorHandlingExample() {
  const { addLog } = useTerminalLivestream();

  const handleAsync = async () => {
    try {
      addLog('Executing task...', 'command');
      await delay(1000);

      // Simulate random success/failure
      if (Math.random() > 0.5) {
        addLog('✓ Task completed successfully', 'success');
      } else {
        throw new Error('Task failed unexpectedly');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      addLog(`❌ Error: ${message}`, 'error');
    }
  };

  return (
    <div>
      <button
        onClick={handleAsync}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Run Task
      </button>
      <TerminalLivestream />
    </div>
  );
}

/**
 * Example 6: Skill Registry Monitor
 * Real-time monitoring of skill registry generation
 */
export function SkillRegistryMonitorExample() {
  const { addLog } = useTerminalLivestream();

  useEffect(() => {
    const monitorRegistry = async () => {
      addLog('🎮 Skill Registry Monitor Started', 'info', 'system');
      addLog('Educational Component - Fused Gaming MCP', 'info', 'system');

      // Simulate registry updates
      const skills = [
        'algorithmic-art',
        'ascii-mockup',
        'canvas-design',
        'frontend-design',
        'theme-factory',
      ];

      for (const skill of skills) {
        await delay(300);
        addLog(`Scanning skill: ${skill}`, 'info', 'registry');
        await delay(200);
        addLog(`✓ ${skill} registered`, 'success', 'registry');
      }

      addLog('Registry generation complete', 'success', 'system');
      addLog('Total: 19 skills, 22 tools, 11 categories', 'info', 'system');
    };

    monitorRegistry();
  }, [addLog]);

  return (
    <div className="p-6 bg-slate-950 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Skill Registry Monitor</h2>
      <p className="text-sm text-slate-400 mb-4">
        Real-time monitoring of skill discovery and registration
      </p>
      <TerminalLivestream />
    </div>
  );
}

/**
 * Example 7: Multi-Tab Installation Monitor
 * Show terminal in multiple locations
 */
export function MultiTabMonitorExample() {
  useTerminalLivestream({ maxLogs: 500 });
  useTerminalLivestream({ maxLogs: 500 });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-bold mb-2">Tab 1: Installation</h3>
        {/* Each tab gets separate terminal instance */}
        <TerminalLivestream />
      </div>
      <div>
        <h3 className="font-bold mb-2">Tab 2: Registry Generation</h3>
        <TerminalLivestream />
      </div>
    </div>
  );
}

/**
 * Example 8: Styled Terminal Integration
 * Custom positioning and styling
 */
export function CustomStylingExample() {
  return (
    <div className="flex flex-col gap-6">
      {/* Terminal in modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="w-full max-w-2xl max-h-96">
          <TerminalLivestream />
        </div>
      </div>

      {/* Terminal in sidebar */}
      <div className="flex gap-4">
        <div className="flex-1">Main Content</div>
        <div className="w-96">
          <TerminalLivestream />
        </div>
      </div>

      {/* Terminal as bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 h-48 border-t border-magenta-500/30">
        <TerminalLivestream />
      </div>
    </div>
  );
}

/**
 * Example 9: Integration with Claude Code Extension
 * Example for Claude Code plugin integration
 */
export function ClaudeCodeExtensionExample() {
  const { addLog } = useTerminalLivestream({
    wsUrl: process.env.NEXT_PUBLIC_MCP_WS_URL,
  });

  // Listen for Claude Code messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data;

      if (type === 'MCP_LOG') {
        addLog(data.message, data.level, data.category);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addLog]);

  return (
    <div>
      <TerminalLivestream />
    </div>
  );
}

/**
 * Example 10: Complete Dashboard Integration
 * Full page dashboard with terminal + other components
 */
export function DashboardExample() {
  const { logs, clearLogs, exportLogs } = useTerminalLivestream();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-magenta-500">
          🎮 Fused Gaming MCP Dashboard
        </h1>
        <p className="text-slate-400 mt-2">
          Educational Use Only - Apache 2.0 License
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 rounded p-4">
          <div className="text-3xl font-bold text-magenta-500">19</div>
          <div className="text-slate-400">Skills</div>
        </div>
        <div className="bg-slate-800 rounded p-4">
          <div className="text-3xl font-bold text-purple-500">22</div>
          <div className="text-slate-400">Tools</div>
        </div>
        <div className="bg-slate-800 rounded p-4">
          <div className="text-3xl font-bold text-cyan-500">{logs.length}</div>
          <div className="text-slate-400">Log Entries</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => exportLogs('json')}
          className="px-4 py-2 bg-magenta-600 text-white rounded hover:bg-magenta-700"
        >
          Export JSON
        </button>
        <button
          onClick={() => exportLogs('text')}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Export Text
        </button>
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear
        </button>
      </div>

      {/* Terminal */}
      <div className="relative">
        <TerminalLivestream />
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-slate-500 text-sm">
        <p>
          Fused Gaming MCP Terminal Livestream © 2026 |{' '}
          <a
            href="https://github.com/fused-gaming/fused-gaming-skill-mcp"
            className="text-magenta-500 hover:underline"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

/**
 * Helper function to simulate delays
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
