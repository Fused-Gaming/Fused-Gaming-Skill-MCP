# SyncPulse Web Interface

An artistic, interactive Next.js + React dashboard and skills catalog for SyncPulse, featuring real-time agent swarm control, monitoring, and an organized skills discovery portal.

## Features

### 🎨 Artsy Visualization
- **Swarm Orbital Display**: Beautiful animated swarm topology visualization with glowing connections
- **Agent Status Indicators**: Real-time agent state with color-coded role indicators
- **Glassmorphism UI**: Modern glass effect with gradient backgrounds and smooth animations
- **Animated Metrics**: Live health scores, uptime, and load indicators

### 🎮 Swarm Control
- **Live Agent Monitoring**: Per-agent load, success rate, and status tracking
- **Swarm Selection**: Switch between multiple active swarms
- **Execution Control**: Play/pause/reset swarm execution
- **Real-time Status**: System health and execution state indicators

### 📋 Task Management
- **Task Monitor**: Track active tasks across all swarms
- **Progress Tracking**: Visual progress bars for running tasks
- **Task Statistics**: Dashboard showing total, running, completed, and failed tasks
- **Priority Levels**: Task prioritization and queue management

### 🗺️ Execution Roadmap
- **Timeline View**: Visual roadmap of scheduled execution phases
- **Schedule Definition**: Define phases with cron expressions or simple schedules
- **Phase Management**: Add, edit, and track execution phases
- **Completion Tracking**: Mark phases complete with timestamps

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18
- **Animation**: Framer Motion for smooth, physics-based animations
- **State Management**: Zustand for lightweight global state
- **Styling**: Tailwind CSS + custom CSS for artsy effects
- **Icons**: Lucide React
- **HTTP Client**: Axios for API calls
- **Charts**: Recharts for data visualization
- **Deployment**: Vercel with GitHub Actions CI/CD

## Installation

```bash
cd packages/web
npm install
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

## Project Structure

```
packages/web/
├── app/
│   ├── layout.tsx          # Root layout with global styling
│   ├── page.tsx            # Main dashboard page (SyncPulse)
│   ├── skills/
│   │   └── page.tsx        # Skills catalog with categories
│   ├── api/
│   │   ├── health/
│   │   ├── swarms/
│   │   ├── tasks/
│   │   └── roadmap/
│   └── globals.css         # Global styles and animations
├── components/
│   ├── SwarmVisualizer.tsx # Orbital swarm visualization
│   ├── ControlPanel.tsx    # Swarm control interface
│   ├── TaskMonitor.tsx     # Task tracking dashboard
│   ├── RoadmapEditor.tsx   # Execution roadmap timeline
│   └── ToolCard.tsx        # Skills catalog card component
├── store/
│   └── swarmStore.ts       # Zustand state management
├── tailwind.config.ts      # Tailwind configuration
├── next.config.js          # Next.js configuration
├── vercel.json             # Vercel deployment config
└── tsconfig.json           # TypeScript configuration
```

## Key Components

### SwarmVisualizer
Displays the selected swarm with:
- Orbital agent visualization with animated connections
- Color-coded agent roles
- Real-time agent status and load
- Health score and uptime metrics

### ControlPanel
Provides swarm control:
- Swarm selection dropdown
- Play/pause/reset execution
- System status indicator
- Configuration shortcuts

### TaskMonitor
Shows task execution metrics:
- Total, running, completed, and failed task counts
- Individual task progress tracking
- Task assignment to agents
- Priority level display

### RoadmapEditor
Manages execution schedules:
- Timeline view of phases
- Add new phases with schedules
- Cron expression support
- Completion tracking

### Skills Catalog (`/skills`)
Organized skill discovery portal:
- 7 skill categories (Design, Development, Automation, Data, Web3, Content, DevOps)
- 25+ available skills with descriptions and links
- Status indicators (Stable, Beta, New)
- Tag-based filtering and organization
- Direct npm package links
- Interactive tool cards with hover effects

## Styling & Animation

### Color Scheme
- **Accent (Green)**: `#00ff88` - Primary actions and highlights
- **Secondary (Pink)**: `#ff006e` - Alerts and secondary elements
- **Tertiary (Cyan)**: `#00d9ff` - Information and status
- **Dark Base**: `#0a0e27` - Background

### Custom Animations
- **pulse-glow**: Glowing effect for active elements
- **float**: Smooth floating motion for background elements
- **orbit**: Circular orbital motion for agents
- **shimmer**: Shimmer effect for loading states

## Integration with SyncPulse API

The dashboard connects to the SyncPulse API and endpoints:

```typescript
// SyncPulse Dashboard (/)
GET  /api/health          // Check service status
GET  /api/swarms          // List available swarms
POST /api/swarms/:id/execute  // Execute tasks
GET  /api/tasks           // Get task status
GET  /api/roadmap         // Get execution roadmap

// Skills Catalog (/skills)
GET  /skills              // Discover available skills
GET  /skills/:category    // Filter by category
```

**Deployment URLs:**
- Dashboard: `sync.vln.gg` (SyncPulse agent swarm control)
- Catalog: `skill.vln.gg` (Skills discovery portal)
- Tools: `vln.gg/tools` (Main tools hub)

## Deployment

### Quick Start
```bash
# Deploy to Vercel with one command
vercel --prod
```

### Deployment Guides

**SyncPulse Dashboard (sync.vln.gg):**
See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:
- One-click Vercel deployment
- GitHub Actions CI/CD setup
- Environment variable configuration
- Custom domain setup
- Monitoring and troubleshooting

**Skills Catalog (skill.vln.gg):**
See [SKILL_DEPLOYMENT.md](./SKILL_DEPLOYMENT.md) for dedicated deployment guide including:
- Skills catalog features and updates
- Domain configuration
- Integration with main tools hub
- Category management
- Adding new skills

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://api.example.com      # Backend API endpoint
NEXT_PUBLIC_WS_URL=wss://api.example.com         # WebSocket URL
NEXT_PUBLIC_ENABLE_LIVE_MODE=true                # Enable live features
NEXT_PUBLIC_ENABLE_ANALYTICS=false               # Analytics tracking
```

## Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Advanced swarm topology editing
- [ ] Task creation and deployment UI
- [ ] Agent performance analytics
- [ ] Swarm performance benchmarking
- [ ] Export execution history
- [ ] Dark/light theme toggle
- [ ] Mobile responsive layout

## Performance

- **Animations**: Framer Motion hardware-accelerated transforms
- **State**: Zustand for optimal re-render performance
- **Images**: Optimized with Next.js Image component
- **Code Splitting**: Automatic per-route code splitting

## License

MIT - Part of Fused Gaming MCP Project
