# Project Status API Framework

Real-time status endpoints for project health, agent swarms, gate progression, and compliance tracking.

## Quick Start

```bash
npm install project-status-framework
```

```javascript
const { ProjectStatusAPI } = require('project-status-framework');

const api = new ProjectStatusAPI({
  project: 'MyProject',
  rfpNumber: '2026-001',
  deadline: new Date('2026-05-22T15:00:00Z')
});

app.get('/status', async (req, res) => {
  res.json(await api.getStatus());
});
```

## Features

✅ Multi-project status aggregation  
✅ Real-time agent swarm metrics  
✅ Quality gate progression tracking  
✅ RFP compliance monitoring  
✅ Execution metrics and reporting  
✅ Historical data tracking  
✅ Webhook notifications  
✅ Custom metrics integration  

## Documentation

- **[SKILL.md](SKILL.md)** - Main skill documentation and usage guide
- **[API_REFERENCE.md](docs/API_REFERENCE.md)** - Complete API documentation
- **[ADVANCED.md](docs/ADVANCED.md)** - Advanced configuration and integration
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## Examples

- **[Basic PeraltaCC](resources/examples/basic-peraltacc/)** - Simple RFP tracking
- **[Multi-Project Dashboard](resources/examples/multi-project-dashboard/)** - Team status aggregation
- **[RFP Submission](resources/examples/rfp-tracking/)** - Deadline monitoring

## Installation

```bash
# Clone and setup
git clone https://github.com/fused-gaming/project-status-framework.git
cd project-status-framework
./scripts/setup.sh

# Validate configuration
node scripts/validate-config.cjs config.json

# Start monitoring
./scripts/monitor-status.sh
```

## Usage

### Basic Status Endpoint

```javascript
const express = require('express');
const { ProjectStatusAPI } = require('project-status-framework');

const app = express();
const statusAPI = new ProjectStatusAPI({
  project: 'PeraltaCC',
  rfpNumber: '25-26-09',
  deadline: new Date('2026-05-22T15:00:00Z')
});

app.get('/status', async (req, res) => {
  const status = await statusAPI.getStatus();
  res.json(status);
});

app.listen(3000);
```

### Agent Swarm Integration

```javascript
statusAPI.registerMetricsSource('agents', {
  fetch: async () => {
    const controller = require('./orchestration-controller');
    return controller.getSwarmStatus();
  },
  interval: 5000
});
```

### Gate Tracking

```javascript
statusAPI.registerMetricsSource('gates', {
  fetch: async () => require('./gate-tracker').getStatus(),
  interval: 10000
});
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /status` | Complete project status |
| `GET /status/agents` | Agent swarm metrics |
| `GET /status/gates` | Quality gate progression |
| `GET /status/compliance` | RFP compliance status |
| `GET /status/metrics` | System metrics |

## Configuration

```javascript
{
  project: 'ProjectName',
  rfpNumber: '2026-001',
  deadline: new Date('2026-05-22T15:00:00Z'),
  gates: [
    { id: 0, name: 'Gate 0', owner: 'team' },
    { id: 1, name: 'Gate 1', owner: 'team' }
  ]
}
```

See [CONFIG.md](docs/CONFIG.md) for all options.

## Support

- **Issues**: [GitHub Issues](https://github.com/fused-gaming/project-status-framework/issues)
- **Docs**: [Full Documentation](docs/)
- **Examples**: [Example Projects](resources/examples/)

## License

MIT - See LICENSE file

---

**Version**: 1.0.0  
**Maintained By**: Fused Gaming
