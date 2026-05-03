import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import EthicalHackingPanel from './components/EthicalHackingPanel';

interface AgentMetric {
  name: string;
  taskCount: number;
  cpuUsage: number;
  memoryUsage: number;
  status: 'healthy' | 'warning' | 'error';
}

export const Dashboard: React.FC = () => {
  const [_agents, _setAgents] = useState<AgentMetric[]>([]);
  const [metrics, setMetrics] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'orchestration' | 'ethical-hacking'>('orchestration');

  useEffect(() => {
    // Connect to metrics API
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`http://localhost:3334/api/metrics`);
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard" style={{ padding: '20px', backgroundColor: '#0f172a', color: '#e2e8f0', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '30px' }}>🎮 Fused Gaming MCP - Orchestration Dashboard</h1>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #334155', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveTab('orchestration')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'orchestration' ? '#3b82f6' : 'transparent',
            color: activeTab === 'orchestration' ? '#fff' : '#94a3b8',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeTab === 'orchestration' ? 'bold' : 'normal',
          }}
        >
          📊 Agent Orchestration
        </button>
        <button
          onClick={() => setActiveTab('ethical-hacking')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'ethical-hacking' ? '#3b82f6' : 'transparent',
            color: activeTab === 'ethical-hacking' ? '#fff' : '#94a3b8',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: activeTab === 'ethical-hacking' ? 'bold' : 'normal',
          }}
        >
          🛡️ Ethical Hacking Framework
        </button>
      </div>

      {/* Orchestration Tab */}
      {activeTab === 'orchestration' && (
        <>
          <section style={{ marginTop: '30px' }}>
            <h2>Agent Health Status</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {agents.length > 0 ? (
                agents.map(agent => (
                  <div key={agent.name} style={{ border: '1px solid #475569', padding: '15px', borderRadius: '8px', backgroundColor: '#1e293b' }}>
                    <h3>{agent.name}</h3>
                    <p>Status: <span style={{ color: agent.status === 'healthy' ? '#10b981' : '#ef4444' }}>{agent.status}</span></p>
                    <p>Tasks: {agent.taskCount}</p>
                    <p>CPU: {agent.cpuUsage}% | Memory: {agent.memoryUsage}%</p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#94a3b8' }}>Initializing agents...</p>
              )}
            </div>
          </section>

          <section style={{ marginTop: '30px' }}>
            <h2>System Metrics</h2>
            {metrics.chartData && (
              <LineChart width={800} height={300} data={metrics.chartData}>
                <CartesianGrid stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                <Legend />
                <Line type="monotone" dataKey="cpuUsage" stroke="#3b82f6" />
                <Line type="monotone" dataKey="memoryUsage" stroke="#10b981" />
              </LineChart>
            )}
          </section>
        </>
      )}

      {/* Ethical Hacking Tab */}
      {activeTab === 'ethical-hacking' && (
        <EthicalHackingPanel />
      )}
    </div>
  );
};

export default Dashboard;
