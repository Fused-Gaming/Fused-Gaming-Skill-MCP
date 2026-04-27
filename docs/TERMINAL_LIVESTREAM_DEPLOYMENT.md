# Terminal Livestream: Deployment Guide

## 🚀 Quick Deploy

The Fused Gaming Terminal Livestream component is ready for production deployment. This guide covers installation and configuration for various environments.

---

## 📦 Package Contents

```
packages/web/
├── components/
│   └── TerminalLivestream.tsx      # Main component (educational, licensed)
├── hooks/
│   └── useTerminalLivestream.ts    # React hook for programmatic control
├── examples/
│   └── TerminalLivestream.example.tsx
├── app/
│   └── page.tsx                    # Updated with component integration
├── CLAUDE_CODE_LICENSE.md          # Educational use license
└── README.md
```

---

## 🛠️ Installation Methods

### Method 1: Install from npm (When Published)

```bash
npm install @fused-gaming/terminal-livestream
```

Then import:

```tsx
import TerminalLivestream from '@fused-gaming/terminal-livestream';
import { useTerminalLivestream } from '@fused-gaming/terminal-livestream';
```

### Method 2: Build from Source

```bash
# Clone repository
git clone https://github.com/fused-gaming/fused-gaming-skill-mcp.git
cd fused-gaming-skill-mcp/packages/web

# Install dependencies
npm install

# Build component library
npm run build

# Output: dist/
```

### Method 3: Development Integration

```bash
cd packages/web
npm run dev

# Runs on http://localhost:3000
```

---

## 🔧 Integration Steps

### Step 1: Import Component

```tsx
import TerminalLivestream from '@/components/TerminalLivestream';
```

### Step 2: Add to Layout

```tsx
export default function Layout() {
  return (
    <>
      <main>Your content</main>
      <TerminalLivestream />
    </>
  );
}
```

### Step 3: Configure Styling

Ensure Tailwind CSS is installed and configured:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

Update `tailwind.config.ts`:

```typescript
export default {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        magenta: {
          500: '#d946ef',
          600: '#c026d3',
        },
      },
    },
  },
};
```

### Step 4: Test Integration

```bash
npm run dev
```

Click the terminal toggle in bottom-right corner to verify functionality.

---

## 🌐 Claude Code Integration

### For Claude Code Extensions

1. **Create extension manifest** (`.claude/extension.json`):

```json
{
  "id": "fused-gaming-terminal-livestream",
  "name": "Fused Gaming Terminal Livestream",
  "version": "1.0.0",
  "description": "Real-time terminal log viewer for MCP setup",
  "type": "webview",
  "entry": "packages/web/dist/terminal-livestream.js",
  "config": {
    "position": "floating-bottom-right",
    "width": 384,
    "height": 384,
    "theme": "dark",
    "educational": true
  }
}
```

2. **Update Claude Code settings** (`.claude/settings.json`):

```json
{
  "extensions": {
    "fused-gaming-terminal": {
      "enabled": true,
      "config": {
        "autoOpen": false,
        "position": "floating-bottom-right",
        "educational": true,
        "licenseCheck": true
      }
    }
  }
}
```

3. **Build the bundle**:

```bash
npm run build
```

4. **Register with Claude Code**:

```bash
claude-code extension:register packages/web/dist/terminal-livestream.js
```

---

## 🖥️ Web App Deployment

### Deploy to Vercel

1. **Push to GitHub**:

```bash
git add .
git commit -m "feat: add Claude Code Terminal Livestream integration"
git push origin main
```

2. **Connect to Vercel**:

```bash
npm i -g vercel
vercel link
vercel
```

3. **Configure build settings**:

- Framework: Next.js
- Root Directory: `packages/web`
- Build Command: `npm run build`
- Output Directory: `.next`

### Deploy to Docker

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy monorepo
COPY packages/web ./packages/web
COPY package.json package-lock.json ./

# Install and build
RUN npm ci
RUN npm run build --workspace=packages/web

# Run
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=packages/web"]
```

Build and run:

```bash
docker build -t fused-gaming-terminal .
docker run -p 3000:3000 fused-gaming-terminal
```

### Deploy to AWS

**Using CloudFront + S3**:

```bash
# Build static export
npm run export

# Upload to S3
aws s3 sync out/ s3://your-bucket/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## 🔌 WebSocket Server Integration

For real-time log streaming:

### Node.js + Express

```javascript
import express from 'express';
import WebSocket from 'ws';

const app = express();
const wss = new WebSocket.Server({ noServer: true });

// Handle upgrade
app.get('/logs', (req, res, next) => {
  const server = req.socket.server;
  if (!server.ws) {
    server.ws = new WebSocket.Server({ noServer: true });
  }

  server.ws.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    // Stream logs
    const logInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          message: `Log entry at ${new Date().toISOString()}`,
          level: 'info',
          category: 'system',
        }));
      }
    }, 1000);

    ws.on('close', () => clearInterval(logInterval));
  });
});

app.listen(3000);
```

### Python + FastAPI

```python
from fastapi import FastAPI, WebSocket
from fastapi.websockets import WebSocketDisconnect
import asyncio
import json

app = FastAPI()

@app.websocket("/ws/logs")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = {
                "message": "Log entry",
                "level": "info",
                "category": "system"
            }
            await websocket.send_json(data)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("Client disconnected")
```

---

## ⚙️ Configuration Reference

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_MCP_WS_URL=ws://localhost:8080/logs
NEXT_PUBLIC_EDUCATIONAL_MODE=true
NEXT_PUBLIC_SHOW_LICENSE=true
NEXT_PUBLIC_LOG_RETENTION=1000
```

### Component Props

```typescript
interface TerminalLivestreamProps {
  // Optional: External logs from useTerminalLivestream hook
  // If provided, component displays these logs instead of demo simulation
  logs?: LogEntry[];
  
  // Optional: Callback for clearing logs when using external logs
  // Required if logs prop is provided for Clear button to work
  onClearLogs?: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error' | 'command';
  message: string;
  category?: string;
}
```

### Theming

```css
/* Override colors via CSS variables */
:root {
  --terminal-primary: #d946ef;        /* Magenta */
  --terminal-secondary: #a855f7;      /* Purple */
  --terminal-accent: #06b6d4;         /* Cyan */
  --terminal-dark: #0f172a;           /* Slate-950 */
  --terminal-success: #22c55e;        /* Green */
  --terminal-error: #ef4444;          /* Red */
  --terminal-warning: #eab308;        /* Yellow */
  --terminal-info: #3b82f6;           /* Blue */
}
```

---

## ✅ Testing Checklist

- [ ] Component renders without errors
- [ ] Toggle shows/hides terminal
- [ ] Logs display in real-time
- [ ] Copy button copies logs
- [ ] Download button creates file
- [ ] Clear button removes logs
- [ ] Responsive on mobile
- [ ] Keyboard accessible (tab, enter)
- [ ] Educational license notice visible
- [ ] Dark theme works correctly
- [ ] WebSocket connects (if configured)
- [ ] Component gracefully handles errors

---

## 🐛 Troubleshooting

### Component Not Rendering

```typescript
// Check import
import TerminalLivestream from '@/components/TerminalLivestream';

// Verify it's in layout
export default function RootLayout() {
  return <TerminalLivestream />;
}
```

### Tailwind Styles Missing

```bash
# Rebuild Tailwind
npx tailwindcss -i ./app/globals.css -o ./app/output.css

# Check config includes component paths
content: ['./components/**/*.{js,ts,jsx,tsx}']
```

### WebSocket Not Connecting

```typescript
// Check connection
const { isConnected, connect } = useTerminalLivestream();

useEffect(() => {
  console.log('Connected:', isConnected);
  if (!isConnected) connect();
}, [isConnected]);

// Check server is running
// curl http://localhost:8080/ws/logs
```

### Performance Issues

```typescript
// Limit log retention
const { logs } = useTerminalLivestream({ maxLogs: 500 });

// Disable live scroll for large logs
setIsLive(false);

// Export and clear periodically
const text = exportLogs();
clearLogs();
```

---

## 📊 Production Checklist

- [ ] Educational license visible in UI
- [ ] LICENSE file included in distribution
- [ ] Attribution in documentation
- [ ] WebSocket endpoint configured
- [ ] Error logging implemented
- [ ] Performance monitored
- [ ] Dark mode tested
- [ ] Accessibility tested (WCAG AA)
- [ ] Mobile responsive tested
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Build size optimized
- [ ] Caching headers configured
- [ ] CSP headers allow component
- [ ] Monitoring/alerting configured

---

## 📈 Monitoring & Analytics

Track component usage (optional):

```typescript
// pages/api/telemetry.ts
export default async function handler(req, res) {
  const { event, data } = req.body;
  
  // Log to analytics service
  console.log(`Terminal Event: ${event}`, data);
  
  res.status(200).json({ ok: true });
}
```

Use in component:

```typescript
const trackEvent = (event: string, data?: any) => {
  fetch('/api/telemetry', {
    method: 'POST',
    body: JSON.stringify({ event, data }),
  });
};

// Track usage
trackEvent('terminal-opened');
trackEvent('logs-exported', { format: 'json', count: logs.length });
```

---

## 🔗 Related Documentation

- [CLAUDE_CODE_INTEGRATION.md](./CLAUDE_CODE_INTEGRATION.md) — Integration guide
- [../packages/web/CLAUDE_CODE_LICENSE.md](../packages/web/CLAUDE_CODE_LICENSE.md) — Educational license
- [../packages/web/README.md](../packages/web/README.md) — Web package docs

---

## 📞 Support

**Deployment Issues:**
- GitHub Issues: https://github.com/fused-gaming/fused-gaming-skill-mcp/issues
- Discussions: https://github.com/fused-gaming/fused-gaming-skill-mcp/discussions

**Licensing:**
- Email: license@fused-gaming.io

---

**Version:** 1.0.0  
**Last Updated:** April 27, 2026  
**Status:** Production Ready
