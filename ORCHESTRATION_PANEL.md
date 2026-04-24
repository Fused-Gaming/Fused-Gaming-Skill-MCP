# 🎮 Fused Gaming MCP - Orchestration Panel

## Overview

The Orchestration Panel is a comprehensive web-based management interface for the Fused Gaming multi-agent swarm orchestration system. It provides real-time visibility, control, and monitoring of 60+ specialized AI agents running complex tasks.

## 🚀 Quick Start

### One-Line Installation

```bash
npm run orchestration:init
```

This command:
1. ✅ Detects your system resources (CPU, memory, disk)
2. ✅ Auto-selects optimal topology (simple, balanced, or advanced)
3. ✅ Initializes agent configuration
4. ✅ Sets up authentication with secure one-time password
5. ✅ Generates metrics collection infrastructure

### After Installation

The installer outputs your one-time administrator password in the format:
```
Example: Quantum-Phoenix-Stellar-Cascade
```

**Save this password securely.** You'll need it for first login.

### First Login & Setup

1. **Open the Dashboard**
   ```
   http://localhost:3333
   ```

2. **Enter One-Time Password**
   - Paste your password from the installation output
   - You have 5 attempts before the account locks
   - Password expires after 24 hours

3. **Change Your Password** (Required)
   - Create a strong password (16+ characters)
   - Must include: uppercase, lowercase, numbers, special characters
   - System validates strength in real-time
   - No common patterns allowed (qwerty, password, 123456, etc.)

4. **Access the Dashboard**
   - Monitor swarm health and performance
   - Scale agents up/down
   - View real-time metrics

## 🏗️ Architecture

### Components

**Frontend:**
- React-based dashboard (`src/orchestration-ui/`)
  - Real-time metrics visualization
  - Agent management UI
  - First-login password change flow

**Backend:**
- Express API (`src/orchestration-api/`)
  - Authentication & authorization
  - Metrics collection & aggregation
  - Health monitoring
  - Swarm management

**Infrastructure:**
- `.claude-flow/` directory
  - `agents.json` - Swarm topology configuration
  - `init-config.json` - System capabilities
  - `metrics/` - Performance data
  - `security/` - Auth and audit logs
  - `sessions/` - User session management

### Authentication

#### First-Time Setup
1. System generates memorable one-time password from word lists
   - Format: `Adjective-Noun-Color-Action` (e.g., `Quantum-Phoenix-Stellar-Cascade`)
   - Cryptographically secure random selection
   - Expires after 24 hours
   - Stored as PBKDF2 hash with 10,000 iterations

2. Mandatory password change enforces strong credentials
   - Minimum 16 characters
   - Must include uppercase, lowercase, numbers, special characters
   - No repeated characters (aaa, bbb, etc.)
   - No common patterns (qwerty, password, 123, etc.)

#### Subsequent Logins
- Use your custom password set during first login
- Session tokens provide 24-hour access
- Automatic logout after inactivity

### Topology Modes

**Simple** (1-2 CPU cores, ≤4GB RAM)
- 8 agents total
- Gossip consensus protocol
- For development/testing only

**Balanced** (3-8 CPU cores, 5-16GB RAM)
- 24 agents total
- Raft consensus protocol
- Suitable for small teams

**Advanced** (8+ CPU cores, >16GB RAM)
- 60 agents total
- Byzantine fault-tolerant consensus
- Production-ready with maximum resilience

## 📊 Monitoring & Metrics

### Dashboard Widgets

**System Health**
- CPU usage (real-time)
- Memory utilization
- Disk space
- Overall health status

**Swarm Status**
- Active/total agents
- Agent roles and distributions
- Health per agent
- Task load balance

**Performance Metrics**
- Tasks processed (total/in-progress/failed)
- Average response time
- Throughput (tasks/minute)
- Latency percentiles (P50, P95, P99)

### Metrics API

**Get Current Metrics**
```bash
curl http://localhost:3334/api/metrics
```

**Metrics History**
```bash
curl http://localhost:3334/api/metrics/history?limit=100
```

**Health Status**
```bash
curl http://localhost:3334/api/health
```

## 🎮 Agent Management

### View Agents

```bash
curl http://localhost:3334/api/swarm/agents
```

### Scale Swarm

```bash
curl -X POST http://localhost:3334/api/swarm/scale \
  -H "Content-Type: application/json" \
  -d '{"targetAgents": 30}'
```

### Agent Roles

- **Coordinator** - Orchestrates task distribution and consensus
- **Executor** - Runs assigned tasks with full concurrency
- **Reviewer** - Validates task results and quality
- **Optimizer** - Analyzes performance and suggests improvements

## 🔒 Security

### Password Requirements

Your password must meet ALL of these requirements:

✅ At least 16 characters  
✅ At least one uppercase letter (A-Z)  
✅ At least one lowercase letter (a-z)  
✅ At least one number (0-9)  
✅ At least one special character (!@#$%)  
✅ No repeated characters (aaa, bbb, etc.)  
✅ No common patterns (qwerty, password, 123456)  

### Audit Logging

All security events are logged:
- First-login attempts (success/failure)
- Password changes
- Account lockouts
- Unauthorized access attempts

View audit log:
```bash
cat .claude-flow/security/audit.log
```

### Account Lockout

- Maximum 5 failed login attempts
- Account locks for 1 hour after exceeding limit
- Contact administrator for forced unlock

## 🔧 Advanced Configuration

### Custom Topology

Generate a new installation with specific topology:

```bash
npm run orchestration:init:simple    # 8 agents
npm run orchestration:init:balanced  # 24 agents
npm run orchestration:init:advanced  # 60 agents
```

### Reset First-Login

If you need to reset the first-login password:

```bash
# Generate new one-time password
node -e "
  const { FirstLoginManager } = require('./src/orchestration-api/first-login-manager.js');
  const mgr = new FirstLoginManager();
  console.log('New password:', mgr.generateNewOneTimePassword('.claude-flow'));
"
```

### Change Administrator Password

```bash
curl -X POST http://localhost:3334/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "newPassword": "YourNewSecurePassword123!",
    "confirmPassword": "YourNewSecurePassword123!"
  }'
```

## 🐛 Troubleshooting

### Installation Fails

**Check Node.js version:**
```bash
node --version  # Must be >=20.0.0
npm --version   # Must be >=8.0.0
```

**Run prerequisite check:**
```bash
npm run orchestration:init 2>&1 | head -20
```

### Can't Access Dashboard

1. Verify the port is not in use:
   ```bash
   lsof -i :3333
   ```

2. Check logs:
   ```bash
   tail -f .claude-flow/logs/orchestration.log
   ```

3. Verify installation:
   ```bash
   ls -la .claude-flow/agents.json .claude-flow/init-config.json
   ```

### Forgot One-Time Password

The one-time password expires after 24 hours and cannot be recovered. To reset:

```bash
rm .claude-flow/security/first-login.json
npm run orchestration:init
```

**This will reset your entire authentication system.**

### Agent Not Responding

1. Check health status:
   ```bash
   curl http://localhost:3334/api/health
   ```

2. View agent details:
   ```bash
   curl http://localhost:3334/api/swarm/agents | jq '.agents[] | select(.status != "healthy")'
   ```

3. Restart swarm:
   ```bash
   npm run orchestration:restart
   ```

## 📚 API Reference

### Authentication

- `POST /api/auth/login` - Initial login with one-time password
- `POST /api/auth/change-password` - Change password (first-login only)
- `GET /api/auth/status` - Get authentication status

### Monitoring

- `GET /api/health` - System health check
- `GET /api/metrics` - Current metrics
- `GET /api/metrics/history` - Historical metrics

### Management

- `GET /api/swarm/agents` - List agents
- `POST /api/swarm/scale` - Scale swarm
- `GET /api/dashboard/overview` - Dashboard data
- `GET /api/config/topology` - Topology configuration

## 🚀 Performance

Typical performance on standard hardware:

| Topology | Agents | CPU | Memory | Throughput |
|----------|--------|-----|--------|-----------|
| Simple   | 8      | 5%  | 400MB  | 10 tasks/min |
| Balanced | 24     | 15% | 1.2GB  | 45 tasks/min |
| Advanced | 60     | 35% | 2.8GB  | 120 tasks/min |

## 📞 Support

For issues or questions:

1. Check `.claude-flow/logs/orchestration.log`
2. Review `.claude-flow/security/audit.log` for auth issues
3. Check GitHub Issues: https://github.com/fused-gaming/fused-gaming-skill-mcp/issues
4. Contact support@fused-gaming.io

---

**Version:** 1.0.4  
**Last Updated:** April 18, 2026  
**Status:** Production Ready ✅
