# SyncPulse Swarm Controller - Complete Guide

Your artistic agent swarm control dashboard is ready. Here's how to get it online and start commanding your swarms.

## 🚀 Quick Start

### Local Development

```bash
# Navigate to web package
cd packages/web

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

### Build for Production

```bash
npm run build
npm start
```

## 📦 Deployment Options

### Option 1: Deploy to Vercel (Recommended)

The web app is configured for Vercel with automatic deployments:

```bash
# From project root
vercel deploy

# Or specifically the web package
vercel --cwd packages/web
```

**Vercel Configuration** (automatic):
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Environment: Production

### Option 2: Deploy to your VLN Server

Update your deployment configuration:

```bash
# Build the app
npm run build

# Deploy dist to your server
scp -r packages/web/.next user@vln.gg:/var/www/swarm-controller/

# Start with pm2 or systemd
pm2 start "npm start --cwd packages/web" --name swarm-controller
```

### Option 3: Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY packages/web .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🎨 Dashboard Features

### 1. Swarm Visualizer
**What it does**: Shows real-time agent topology and status

```
- Orbital visualization with animated connections
- Color-coded agent roles:
  - 🟢 Coordinator (Green)
  - 🔵 Executor (Cyan)
  - 🔴 Reviewer (Pink)
  - 🟡 Optimizer (Yellow)
- Live agent metrics (load, success rate, status)
- Swarm health score (0-100%)
```

### 2. Control Panel
**What it does**: Command and manage swarm execution

```
Features:
- Select active swarm
- Start/Stop execution
- Reset state
- View system status
- Access configuration
```

### 3. Task Monitor
**What it does**: Track task execution across swarms

```
Metrics:
- Total tasks
- Running tasks (live count)
- Completed tasks
- Failed tasks

Per-task details:
- Task name & swarm
- Priority level
- Execution progress (0-100%)
- Assignment to agent
```

### 4. Execution Roadmap
**What it does**: Schedule and manage execution phases

```
Features:
- Timeline view with visual phases
- Add new execution phases
- Define schedules:
  - Simple: "hourly", "daily", "weekly"
  - Cron: "0 */6 * * *" (every 6 hours)
  - Custom: "daily at 2am", "every monday"
- Track completion timestamps
- Delete phases
```

## 🔗 API Integration

The dashboard is ready to connect to SyncPulse API endpoints:

### Available Endpoints (to implement)

```bash
# Health check
GET /health
Response: { status: 'ok', service: 'fused-gaming-skill-mcp', version: '1.0.3' }

# List swarms
GET /swarms
Response: { swarms: [{ id, name, topology, agents: [...], activeTasks: [...] }] }

# Get swarm details
GET /swarms/{swarmId}
Response: { id, name, topology, agents: [...], metrics: {...} }

# Execute task
POST /swarms/{swarmId}/execute
Body: { taskId, name, priority, assignedAgent?, schedule? }
Response: { success, taskId, result }

# Update swarm config
POST /swarms/{swarmId}/config
Body: { topology, strategy, maxAgents, ... }
Response: { success, swarm: {...} }

# Get execution roadmap
GET /roadmap
Response: { phases: [{ id, name, schedule, tasks: [...], status }] }

# Add roadmap phase
POST /roadmap
Body: { name, schedule, description, tasks: [...] }
Response: { success, phaseId }
```

### Example API Call (ready to add)

```typescript
// In components/SwarmVisualizer.tsx
const fetchSwarmData = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/swarms`);
  const data = await response.json();
  updateSwarms(data.swarms);
};
```

## 🎯 Current State Data Model

The dashboard uses local Zustand store with simulated data:

```typescript
// Production swarms (2 pre-configured)
- Production Swarm (hierarchical topology)
  - 4 agents: Queen, 2 Executors, Reviewer
  - Health: 95%
  
- Dev Swarm (mesh topology)
  - 3 agents: 2 Executors, Optimizer
  - 1 sample task running (65% progress)
  - Health: 88%
```

## 🔧 Customization

### Colors (Brand Your Dashboard)

Edit `packages/web/tailwind.config.ts`:

```typescript
extend: {
  colors: {
    'swarm-dark': '#0a0e27',        // Background
    'swarm-accent': '#00ff88',      // Primary (green)
    'swarm-secondary': '#ff006e',   // Alert (pink)
    'swarm-tertiary': '#00d9ff',    // Info (cyan)
  },
}
```

### Animations

Edit `packages/web/app/globals.css` to modify:
- `pulse-glow`: Glowing effect timing
- `float`: Background element animation
- `orbit`: Agent orbital motion
- `shimmer`: Loading state effect

### Typography

Update `tailwind.config.ts` for fonts:

```typescript
fontFamily: {
  'sans': ['system-ui', 'sans-serif'],
  'mono': ['JetBrains Mono', 'monospace'],
}
```

## 📊 Performance Tips

1. **Limit Agent Count**: Dashboard optimized for 3-15 agents per swarm
2. **Task Updates**: Batch updates every 500ms to avoid over-rendering
3. **Network**: Use HTTP/2 and enable compression on server
4. **Caching**: Enable browser caching for assets (images, fonts)

## 🐛 Debugging

### Enable Debug Mode

```bash
# Next.js debug logging
DEBUG=* npm run dev

# React DevTools
# Install React DevTools browser extension
```

### Common Issues

1. **Animations lagging**
   - Check GPU acceleration in DevTools
   - Reduce number of simultaneous animations
   - Clear browser cache

2. **API calls failing**
   - Verify NEXT_PUBLIC_API_URL environment variable
   - Check CORS settings on API server
   - Look at browser console for errors

3. **State not updating**
   - Check Zustand devtools browser extension
   - Verify API response matches expected schema
   - Check network tab for failed requests

## 📱 Future Enhancements

### Planned Features
- [ ] WebSocket for real-time updates
- [ ] Agent performance analytics
- [ ] Custom swarm topology editor
- [ ] Task creation wizard
- [ ] Execution history export
- [ ] Mobile responsive design
- [ ] Dark/light theme toggle
- [ ] Multi-user collaboration

### Next Steps
1. Implement API integration (fetch actual swarm data)
2. Add WebSocket listener for real-time updates
3. Create task creation UI
4. Add swarm configuration editor
5. Implement notifications
6. Add user authentication

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For issues or questions:
1. Check the dashboard README: `packages/web/README.md`
2. Review example components in `packages/web/components/`
3. Check Zustand store in `packages/web/store/swarmStore.ts`

---

**Your swarm controller is ready to command agent orchestration with style!** ⚡
