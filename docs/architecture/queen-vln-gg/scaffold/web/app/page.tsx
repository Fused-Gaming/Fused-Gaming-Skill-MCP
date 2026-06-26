/**
 * Queen dashboard stub: GitHub login + agent heartbeat / usage table.
 * Styling follows the SyncPulse dark/monospace tokens (see
 * docs/COMPONENT_SYSTEM_ARCHITECTURE.md upstream) - this is a minimal
 * starting point, not the full component library.
 */
'use client';

import { useEffect, useState } from 'react';

interface Agent {
  id: string;
  name: string;
  org: string;
  role: string;
  last_heartbeat: string | null;
  is_active: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://queen.vln.gg';

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/token=([^&]+)/);
    if (match) {
      setToken(match[1]);
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      const stored = window.localStorage.getItem('queen_token');
      if (stored) setToken(stored);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    window.localStorage.setItem('queen_token', token);
    fetch(`${API_BASE}/api/v1/agents/heartbeats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json();
      })
      .then((data) => setAgents(data.agents ?? []))
      .catch((e) => setError(String(e)));
  }, [token]);

  if (!token) {
    return (
      <main style={{ padding: 48 }}>
        <h1>Queen — VLN.gg Hive Mind</h1>
        <a href={`${API_BASE}/api/auth/github`} style={{ color: '#7dd3fc' }}>
          Sign in with GitHub →
        </a>
      </main>
    );
  }

  return (
    <main style={{ padding: 48 }}>
      <h1>Agent Heartbeats</h1>
      {error && <p style={{ color: '#f87171' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Org</th>
            <th align="left">Role</th>
            <th align="left">Last Heartbeat</th>
            <th align="left">Active</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.org}</td>
              <td>{a.role}</td>
              <td>{a.last_heartbeat ?? 'never'}</td>
              <td>{a.is_active ? 'yes' : 'no'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
