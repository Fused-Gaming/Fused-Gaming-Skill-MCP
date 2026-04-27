/**
 * Hook for Terminal Livestream Integration
 *
 * EDUCATIONAL USE ONLY
 *
 * This hook provides utilities for integrating the Fused Gaming MCP Terminal
 * Livestream component with Claude Code and other development environments.
 *
 * @license Apache 2.0 with educational restrictions
 * @copyright 2026 Fused Gaming
 */

import { useState, useCallback, useEffect, useRef } from 'react';

export interface StreamLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error' | 'command';
  message: string;
  category?: string;
}

export interface TerminalConfig {
  maxLogs?: number;
  autoScroll?: boolean;
  autoConnect?: boolean;
  wsUrl?: string;
}

export function useTerminalLivestream(config: TerminalConfig = {}) {
  const {
    maxLogs = 1000,
    autoScroll = true,
    autoConnect = true,
    wsUrl,
  } = config;

  const [logs, setLogs] = useState<StreamLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  /**
   * Add a log entry to the stream
   */
  const addLog = useCallback(
    (
      message: string,
      level: StreamLog['level'] = 'info',
      category?: string
    ) => {
      const log: StreamLog = {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        level,
        message,
        category,
      };

      setLogs((prev) => {
        const updated = [...prev, log];
        return updated.length > maxLogs ? updated.slice(-maxLogs) : updated;
      });
    },
    [maxLogs]
  );

  /**
   * Clear all logs
   */
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  /**
   * Connect to WebSocket stream (for real-time logs)
   */
  const connect = useCallback(() => {
    if (!wsUrl || wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        addLog('Connected to livestream', 'success', 'connection');
      };

      wsRef.current.onmessage = (event) => {
        if (isLive) {
          try {
            const data = JSON.parse(event.data);
            addLog(data.message, data.level || 'info', data.category);
          } catch {
            addLog(event.data, 'info');
          }
        }
      };

      wsRef.current.onerror = () => {
        addLog('Livestream connection error', 'error', 'connection');
        setIsConnected(false);
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        addLog('Disconnected from livestream', 'warning', 'connection');
      };
    } catch (error) {
      addLog(`Connection failed: ${error}`, 'error', 'connection');
    }
  }, [wsUrl, isLive, addLog]);

  /**
   * Disconnect from WebSocket stream
   */
  const disconnect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
      setIsConnected(false);
    }
  }, []);

  /**
   * Export logs as text
   */
  const exportLogs = useCallback(
    (format: 'text' | 'json' = 'text') => {
      if (format === 'json') {
        return JSON.stringify(logs, null, 2);
      }
      return logs
        .map((log) => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`)
        .join('\n');
    },
    [logs]
  );

  /**
   * Auto-connect on mount if configured
   */
  useEffect(() => {
    if (autoConnect && wsUrl) {
      connect();
    }

    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, wsUrl, connect, disconnect]);

  return {
    logs,
    isConnected,
    isLive,
    setIsLive,
    addLog,
    clearLogs,
    connect,
    disconnect,
    exportLogs,
  };
}
