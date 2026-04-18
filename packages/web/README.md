# SyncPulse Swarm Controller

An artistic, interactive Next.js + React dashboard for controlling and monitoring SyncPulse agent swarms with real-time visualization and task scheduling.

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

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Animation**: Framer Motion for smooth, physics-based animations
- **State Management**: Zustand for lightweight global state
- **Styling**: Tailwind CSS + custom CSS for artsy effects
- **Icons**: Lucide React
- **HTTP Client**: Axios for API calls
- **Charts**: Recharts for data visualization (ready to integrate)

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
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles and animations
├── components/
│   ├── SwarmVisualizer.tsx # Orbital swarm visualization
│   ├── ControlPanel.tsx    # Swarm control interface
│   ├── TaskMonitor.tsx     # Task tracking dashboard
│   └── RoadmapEditor.tsx   # Execution roadmap timeline
├── store/
│   └── swarmStore.ts       # Zustand state management
├── tailwind.config.ts      # Tailwind configuration
├── next.config.js          # Next.js configuration
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

The dashboard connects to your SyncPulse API at `https://skill.vln.gg/`:

```typescript
// Example API calls (ready to implement)
GET  /health              // Check service status
GET  /skills              // List available skills
POST /api                 // MCP RPC calls
GET  /swarms/:id          // Get swarm details
POST /swarms/:id/execute  // Execute tasks
```

## Deployment

### Vercel Deployment

```bash
# Update root vercel.json to serve the web app
vercel deploy packages/web
```

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://skill.vln.gg
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
