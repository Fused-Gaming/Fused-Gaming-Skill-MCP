# Orchestration & Ethical Hacking Framework Setup

## ✅ Installation Complete!

The Fused Gaming MCP orchestration platform with integrated ethical hacking framework has been successfully set up.

### What Was Installed

#### 1. **SyncPulse Orchestration Integration** ✓
- Multi-agent orchestration service with 4 agent groups
- Agent groups: reconnaissance, testing, compliance, reporting
- Claude Flow v3alpha integration with Raft consensus
- Email automation for finding notifications

#### 2. **Ethical Hacking Framework** ✓
- Multi-phase engagement management system
- Rules of Engagement (RoE) validation
- Evidence chain of custody tracking
- Finding collection with severity levels
- Compliance reporting with audit trails
- CVSS/CWE/OWASP mapping support

#### 3. **Orchestration Services** ✓
- Web UI Dashboard (React-based, dark theme)
- Metrics API (Node.js)
- Health check endpoints
- Real-time agent metrics collection

#### 4. **CLI Integration** ✓
- Updated `mcp:init` command to include orchestration setup
- New `orchestration:ui`, `orchestration:api`, `start:all` scripts
- SyncPulse integration during initialization

---

## 🚀 Starting the Services

### Option 1: Start All Services (Recommended)
```bash
npm run start:all
```

This starts:
- **Web UI Dashboard** → http://localhost:3333
- **Metrics API** → http://localhost:3334

### Option 2: Start Services Individually

**Start Web UI:**
```bash
npm run orchestration:ui
```

**Start Metrics API:**
```bash
npm run orchestration:api
```

### Option 3: Manual Startup
```bash
# Terminal 1: Start API server
bash scripts/start-orchestration-api.sh

# Terminal 2: Start UI server
bash scripts/start-orchestration-ui.sh
```

---

## 📊 Service Endpoints

### Web UI Dashboard
- **URL:** http://localhost:3333
- **Tabs:**
  - 📊 Agent Orchestration (agent health, system metrics)
  - 🛡️ Ethical Hacking Framework (engagements, ROE, findings, evidence)

### Metrics API
- **Health Check:** http://localhost:3334/health
- **Metrics:** http://localhost:3334/api/metrics
- **Agent Health:** http://localhost:3334/api/agents/health
- **Stats:** http://localhost:3334/api/stats

---

## 🛡️ Ethical Hacking Framework Features

### Engagement Management
- Create new security testing engagements
- Track client name, scope, timeline
- Multi-phase workflow (reconnaissance → testing → reporting → disclosure)
- Status tracking (planning, active, paused, completed)

### Rules of Engagement (RoE)
- Define authorized targets
- Specify prohibited targets
- Allowed testing techniques
- Time windows and blackout dates
- Automatic validation before testing

### Evidence Management
- Immutable hash verification
- Timestamped chain of custody
- Cryptographic signatures
- Compliance audit trails
- Evidence type tracking (findings, logs, screenshots, captures)

### Findings Collection
- Severity levels: Critical, High, Medium, Low, Informational
- CVSS scoring
- CWE/OWASP mapping
- Remediation guidance
- Status tracking (open, mitigated, false positive)

### Compliance Reporting
- Automatic finding categorization
- Evidence integrity verification
- RoE violation detection
- Audit trail generation

---

## 🔧 Configuration

### System Resources Detected
The orchestration was initialized with:
- **Topology:** Balanced
- **Agent Count:** 24
- **Consensus Mode:** Raft
- **Vector Indexing:** HNSW
- **Cache Size:** ~4GB

### Directory Structure
```
.claude-flow/
├── agents.json              # Agent topology configuration
├── init-config.json         # Framework initialization config
├── agents/                  # Agent state data
├── data/                    # Metrics and health data
├── metrics/                 # Performance metrics
├── security/                # Security audit logs
├── sessions/                # Session tracking
└── cache/                   # Vector cache data

src/
├── services/
│   └── syncpulse-orchestration.ts    # SyncPulse integration
├── ethical-hacking/
│   └── framework.ts                  # Ethical hacking framework
└── orchestration-ui/
    ├── Dashboard.tsx                 # Main dashboard
    └── components/
        └── EthicalHackingPanel.tsx   # Ethical hacking UI
```

---

## 📚 Integration Points

### With SyncPulse (@h4shed/skill-syncpulse)
- **Multi-agent coordination** - Distribute testing across agents
- **Email automation** - 9 templated workflows for findings
- **State caching** - Share findings between agents (70-90% hit rate)
- **Performance monitoring** - Real-time agent metrics

### With Claude Flow v3alpha
- **Distributed consensus** - Raft protocol with heartbeat
- **Agent orchestration** - Balanced topology with 24 agents
- **Memory synchronization** - HNSW vector indexing
- **Health checks** - Continuous agent monitoring

### Framework Architecture
```
┌─────────────────────────────────────────┐
│  Orchestration UI Dashboard              │
│  ├─ Agent Orchestration Tab              │
│  └─ Ethical Hacking Framework Tab        │
│     ├─ Engagements                       │
│     ├─ Rules of Engagement               │
│     ├─ Findings Collection               │
│     └─ Evidence Chain of Custody         │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│  Metrics API (Port 3334)                 │
│  ├─ /health - Service health             │
│  ├─ /api/metrics - System metrics        │
│  ├─ /api/agents/health - Agent status    │
│  └─ /api/stats - Performance stats       │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│  Claude Flow v3alpha Orchestration       │
│  ├─ SwarmOrchestrator                    │
│  ├─ MemorySystem                         │
│  ├─ TaskOrchestrator                     │
│  ├─ CacheService                         │
│  └─ EmailService                         │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│  SyncPulse Ethical Hacking Framework     │
│  ├─ Phase 1: Legal & Compliance          │
│  │  ├─ RoEValidator                      │
│  │  ├─ EvidenceManager                   │
│  │  └─ FindingsDatabase                  │
│  ├─ Phase 2: OSINT & Reconnaissance     │
│  │  ├─ DNS Intelligence Agent            │
│  │  ├─ Asset Discovery Agent             │
│  │  └─ Service Fingerprinting Agent      │
│  ├─ Phase 3: Testing Orchestration       │
│  │  ├─ Payload Generator                 │
│  │  ├─ Test Executor                     │
│  │  └─ Scope Validator                   │
│  └─ Phase 4: Reporting & Disclosure      │
│     ├─ Report Generator                  │
│     ├─ Disclosure Manager                │
│     └─ Compliance Report Engine          │
└─────────────────────────────────────────┘
```

---

## 🎯 Next Steps

### 1. Start the Services
```bash
npm run start:all
```

### 2. Access the Dashboard
Open your browser to: **http://localhost:3333**

### 3. Create Your First Engagement
- Click "Ethical Hacking Framework" tab
- Click "+ New Engagement"
- Enter client name
- Configure Rules of Engagement
- Begin reconnaissance phase

### 4. Configure Deployment
To deploy to skill.vln.gg, see: [docs/SKILL_VLN_GG_DEPLOYMENT.md](./docs/SKILL_VLN_GG_DEPLOYMENT.md)

---

## 📖 Documentation

- **Orchestration Setup:** This file
- **SyncPulse Toolkit:** [docs/syncpulse-toolkit/00_START_HERE.md](./docs/syncpulse-toolkit/00_START_HERE.md)
- **API Deployment:** [docs/SKILL_VLN_GG_DEPLOYMENT.md](./docs/SKILL_VLN_GG_DEPLOYMENT.md)
- **Executive Summary:** [docs/syncpulse-toolkit/01_EXECUTIVE_SUMMARY.md](./docs/syncpulse-toolkit/01_EXECUTIVE_SUMMARY.md)
- **Implementation Roadmap:** [docs/syncpulse-toolkit/03_IMPLEMENTATION_ROADMAP.md](./docs/syncpulse-toolkit/03_IMPLEMENTATION_ROADMAP.md)

---

## ⚙️ Troubleshooting

### Port Already in Use
If port 3333 or 3334 is already in use:
```bash
# Find and kill processes on ports
lsof -i :3333  # Find process on port 3333
kill -9 <PID>  # Kill the process

# Or use different ports
WEB_UI_PORT=3335 API_PORT=3336 npm run start:all
```

### Services Not Starting
1. Verify Node.js >= 20.0.0: `node -v`
2. Check orchestration initialization: `ls -la .claude-flow/`
3. Reinitialize if needed: `npm run orchestration:init:balanced`
4. Check for logs: `tail -f /tmp/*.log`

### Can't Connect to API
- Verify API is running: `curl http://localhost:3334/health`
- Check firewall rules
- Ensure ports aren't blocked by other services

---

## 🔐 Security Notes

### Authentication
The framework includes:
- Email-based authentication templates
- MFA verification workflow
- Secure credential storage (SMTP)

### Compliance
- Complete audit trail of all testing
- Chain of custody for evidence
- RoE violation detection
- Automatic compliance reporting

### Best Practices
1. **Always validate RoE** before any testing
2. **Record all evidence** with timestamps
3. **Monitor metrics** for performance issues
4. **Review compliance reports** after engagements
5. **Keep engagement scope** documented

---

## 📈 Performance

### Metrics Collection
- Collects metrics every 5 seconds
- Stores up to 1000 metrics in memory
- Persists to `.claude-flow/data/metrics.json`

### Agent Optimization
- Balanced topology: 24 agents
- Raft consensus: 5s heartbeat, 15s election timeout
- HNSW vector search: ~150x faster than keyword search
- Cache hit rate: 70-90%

---

## 🚀 Deployment

For production deployment to skill.vln.gg:
```bash
# See deployment documentation
cat docs/SKILL_VLN_GG_DEPLOYMENT.md
```

---

## 💬 Support

For issues or questions:
1. Check logs: `tail -50 .claude-flow/data/health.json`
2. Review documentation in `docs/`
3. Check GitHub issues
4. Contact: support@h4shed.io

---

**Framework Version:** 1.0.0  
**Last Updated:** 2026-05-03  
**Status:** ✅ Ready for Production
