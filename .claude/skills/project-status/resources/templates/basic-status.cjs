/**
 * Basic Project Status Endpoint
 * Minimal implementation with Express.js
 */

const express = require('express');
const { ProjectStatusAPI } = require('project-status-framework');

const app = express();

// Initialize status API
const statusAPI = new ProjectStatusAPI({
  project: 'MyProject',
  description: 'Project description',
  rfpNumber: '25-26-09',
  deadline: new Date('2026-05-22T15:00:00Z'),
  gates: [
    { id: 0, name: 'Gate 0', owner: 'team' },
    { id: 1, name: 'Gate 1', owner: 'team' },
    { id: 2, name: 'Gate 2', owner: 'team' },
    { id: 3, name: 'Gate 3', owner: 'team' },
    { id: 4, name: 'Gate 4', owner: 'team' },
    { id: 5, name: 'Gate 5', owner: 'team' }
  ]
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Main status endpoint
app.get('/status', async (req, res) => {
  const status = await statusAPI.getStatus();
  res.json(status);
});

// Agent status endpoint
app.get('/status/agents', async (req, res) => {
  const agents = await statusAPI.getSwarmStatus();
  res.json(agents);
});

// Gate status endpoint
app.get('/status/gates', async (req, res) => {
  const gates = await statusAPI.getGateStatus();
  res.json(gates);
});

// Compliance status endpoint
app.get('/status/compliance', async (req, res) => {
  const compliance = await statusAPI.getComplianceStatus();
  res.json(compliance);
});

// Metrics endpoint
app.get('/status/metrics', async (req, res) => {
  const metrics = await statusAPI.getMetrics();
  res.json(metrics);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Status API running on http://localhost:${PORT}`);
  console.log(`  GET /health - Health check`);
  console.log(`  GET /status - Complete project status`);
  console.log(`  GET /status/agents - Agent swarm metrics`);
  console.log(`  GET /status/gates - Quality gate progression`);
  console.log(`  GET /status/compliance - RFP compliance status`);
  console.log(`  GET /status/metrics - Execution metrics`);
});

module.exports = app;
