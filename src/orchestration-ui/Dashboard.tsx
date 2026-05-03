import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AgentMetric {
  name: string;
  taskCount: number;
  cpuUsage: number;
  memoryUsage: number;
  status: 'healthy' | 'warning' | 'error';
}

export const Dashboard: React.FC = () => {
  const [agents, setAgents] = useState<AgentMetric[]>([]);
  const [metrics, setMetrics] = useState<any>({});

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
    <div className="dashboard" style={{ padding: '20px' }}>
      <h1>🎮 Fused Gaming MCP - Swarm Orchestration Dashboard</h1>

      <section style={{ marginTop: '30px' }}>
        <h2>Agent Health Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {agents.map(agent => (
            <div key={agent.name} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h3>{agent.name}</h3>
              <p>Status: <span style={{ color: agent.status === 'healthy' ? 'green' : 'red' }}>{agent.status}</span></p>
              <p>Tasks: {agent.taskCount}</p>
              <p>CPU: {agent.cpuUsage}% | Memory: {agent.memoryUsage}%</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2>System Metrics</h2>
        {metrics.chartData && (
          <LineChart width={800} height={300} data={metrics.chartData}>
            <CartesianGrid />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cpuUsage" stroke="#8884d8" />
            <Line type="monotone" dataKey="memoryUsage" stroke="#82ca9d" />
          </LineChart>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
