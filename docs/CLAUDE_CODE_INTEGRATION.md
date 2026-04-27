# Claude Code Integration: Fused Gaming Terminal Livestream

## 📋 Overview

The **Fused Gaming Terminal Livestream** is an embedded web component that displays real-time terminal output and installation logs directly in Claude Code's web interface. This educational tool helps developers visualize MCP setup processes and skill registration in real-time.

### ⚖️ Educational Licensing

**IMPORTANT:** This feature is licensed for **educational use only**.

```
Educational Use Restrictions:
- Learning and training purposes only
- Non-commercial academic and educational institutions
- Not permitted for commercial products or services
- Attribution to Fused Gaming required
- License: Apache 2.0 with educational restrictions
```

For commercial licensing inquiries: **license@fused-gaming.io**

---

## 🎯 Features

- ✅ **Real-Time Terminal Output** — Live streaming of logs and terminal output
- ✅ **Toggle Interface** — Show/hide terminal with smooth animations
- ✅ **Fused Gaming Branding** — Magenta/purple theme matching project identity
- ✅ **Log Management** — Copy, download, and clear logs
- ✅ **Educational Badge** — Displays educational-use-only notice
- ✅ **Responsive Design** — Works on desktop and tablet layouts
- ✅ **WebSocket Support** — Real-time streaming via WebSocket or demo mode

---

## 🚀 Installation & Setup

### Option 1: Install from Published Package

```bash
npm install @fused-gaming/mcp-core-with-claude-integration
```

Then update your Claude Code configuration:

```json
{
  "extensions": [
    {
      "id": "fused-gaming-terminal-livestream",
      "version": "1.0.0",
      "type": "webview",
      "enabled": true,
      "config": {
        "position": "floating-bottom-right",
        "autoOpen": false,
        "educational": true
      }
    }
  ]
}
```

### Option 2: Build from Source (Development)

```bash
cd packages/web
npm install
npm run build
```

Then serve the built output to your Claude Code instance.

### Option 3: Web Integration

Embed the component directly in your web application:

```tsx
import TerminalLivestream from '@fused-gaming/terminal-livestream';

export default function MyApp() {
  return (
    <>
      <main>Your app content</main>
      <TerminalLivestream />
    </>
  );
}
```

---

## 📡 Using the Hook

The `useTerminalLivestream` hook provides programmatic access to the livestream:

```tsx
import { useTerminalLivestream } from '@fused-gaming/terminal-livestream';

export function MyComponent() {
  const { addLog, logs, isConnected, connect, disconnect } = useTerminalLivestream({
    maxLogs: 1000,
    autoScroll: true,
    wsUrl: 'ws://localhost:8080/logs', // Optional WebSocket endpoint
  });

  useEffect(() => {
    // Add logs programmatically
    addLog('Setup started', 'info', 'system');
    addLog('Installing dependencies...', 'command');
    addLog('Dependencies installed', 'success');
  }, [addLog]);

  return (
    <div>
      <p>Connected: {isConnected ? '✓' : '✗'}</p>
      <p>Logs: {logs.length}</p>
    </div>
  );
}
```

### Hook API

```typescript
interface TerminalConfig {
  maxLogs?: number;           // Max stored logs (default: 1000)
  autoScroll?: boolean;       // Auto-scroll on new logs (default: true)
  autoConnect?: boolean;      // Connect on mount (default: true)
  wsUrl?: string;            // WebSocket URL for real-time logs
}

interface StreamLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error' | 'command';
  message: string;
  category?: string;
}

function useTerminalLivestream(config?: TerminalConfig) {
  return {
    logs: StreamLog[];
    isConnected: boolean;
    isLive: boolean;
    setIsLive: (live: boolean) => void;
    addLog: (message: string, level?: string, category?: string) => void;
    clearLogs: () => void;
    connect: () => void;
    disconnect: () => void;
    exportLogs: (format: 'text' | 'json') => string;
  };
}
```

---

## 🔌 WebSocket Integration

For real-time log streaming from your MCP server:

### Server-Side (Node.js with WebSocket)

```javascript
import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Terminal client connected');

  // Stream MCP logs
  const logStream = listenToMCPLogs();
  logStream.on('log', (entry) => {
    ws.send(JSON.stringify({
      message: entry.message,
      level: entry.level,
      category: entry.category,
    }));
  });

  ws.on('close', () => {
    console.log('Terminal client disconnected');
  });
});
```

### Client-Side Connection

```tsx
const { connect, isConnected } = useTerminalLivestream({
  wsUrl: 'ws://localhost:8080/logs',
  autoConnect: true,
});

useEffect(() => {
  if (!isConnected) {
    connect();
  }
}, [isConnected, connect]);
```

---

## 🎨 Styling & Branding

The component uses Fused Gaming's color scheme:

- **Primary:** Magenta (#d946ef)
- **Secondary:** Purple (#a855f7)
- **Dark Background:** #0f172a (slate-950)
- **Accent:** Cyan (#06b6d4)

### Customize Theme

```css
/* Override Fused Gaming colors */
:root {
  --fg-primary: #d946ef;
  --fg-secondary: #a855f7;
  --fg-accent: #06b6d4;
  --fg-dark: #0f172a;
}
```

### Component Classes

The component uses Tailwind CSS classes. Common customization points:

```tsx
// Toggle button styling
className="bg-gradient-to-r from-magenta-600 to-purple-600"

// Terminal output background
className="bg-slate-950"

// Log text colors
className="text-green-400"  // success
className="text-red-400"    // error
className="text-yellow-400" // warning
className="text-cyan-400"   // command
```

---

## 📄 Licensing & Attribution

### Required Attribution

When using this component, include the following notice:

```
This application uses Fused Gaming MCP Terminal Livestream
Licensed under Apache 2.0 for educational use only
© 2026 Fused Gaming — https://github.com/fused-gaming/fused-gaming-skill-mcp
Educational Use: Learning and training only
```

### License Headers

All component files include:

```javascript
/**
 * EDUCATIONAL USE ONLY
 *
 * Licensed under Apache 2.0 with educational restrictions.
 * For commercial licensing: license@fused-gaming.io
 *
 * @copyright 2026 Fused Gaming
 */
```

### Prohibited Uses

❌ Commercial SaaS applications  
❌ Proprietary products  
❌ Resale or redistribution  
❌ Removal of license notices  

### Permitted Uses

✅ Educational institutions  
✅ Academic research  
✅ Open-source projects  
✅ Personal learning  
✅ Nonprofit organizations  

---

## 🔧 Configuration Examples

### Example 1: Claude Code Extension

`.claude/settings.json`:

```json
{
  "extensions": {
    "fused-gaming-terminal": {
      "enabled": true,
      "config": {
        "position": "floating-bottom-right",
        "width": 384,
        "maxHeight": 384,
        "theme": "dark",
        "educational": true,
        "showAttributionBadge": true,
        "logRetention": 1000
      }
    }
  }
}
```

### Example 2: Next.js Web App

`next.config.js`:

```javascript
module.exports = {
  webpack: (config) => {
    config.externals.push({
      ws: 'ws',
    });
    return config;
  },
};
```

### Example 3: MCP Installation Display

Integrate with MCP setup process:

```typescript
import { useTerminalLivestream } from '@fused-gaming/terminal-livestream';

export function MCPSetupWizard() {
  const { addLog } = useTerminalLivestream();

  const runSetup = async () => {
    addLog('Starting MCP initialization...', 'command');
    
    try {
      addLog('Creating directories...', 'info');
      // ... setup logic
      addLog('✅ Setup complete!', 'success');
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
    }
  };

  return (
    <button onClick={runSetup}>
      Start Setup
    </button>
  );
}
```

---

## 🐛 Troubleshooting

### Terminal Not Appearing

- Ensure the component is imported and rendered
- Check browser console for errors
- Verify Tailwind CSS is properly configured

### WebSocket Connection Fails

```typescript
// Check connection status
const { isConnected, connect } = useTerminalLivestream();

useEffect(() => {
  if (!isConnected) {
    console.log('Attempting reconnection...');
    connect();
  }
}, [isConnected]);
```

### Logs Not Updating

- Verify `isLive` is `true`
- Check that `maxLogs` is not exceeded
- Ensure logs are being added with `addLog()`

### Styling Issues

- Verify Tailwind CSS is installed: `npm install -D tailwindcss`
- Check `tailwind.config.ts` includes component paths
- Clear Next.js build cache: `rm -rf .next`

---

## 📚 Examples & Use Cases

### Use Case 1: Live Installation Monitor

Display real-time progress of MCP installation in Claude Code:

```tsx
<TerminalLivestream />
```

Click the toggle to view installation logs as they happen.

### Use Case 2: Skill Registry Updates

Monitor skill registry generation in real-time:

```tsx
const { addLog } = useTerminalLivestream();

// Watch for registry changes
fs.watchFile('registry/skills.json', () => {
  addLog('Registry updated', 'success', 'registry');
});
```

### Use Case 3: Custom Log Integration

Send custom logs from your application:

```tsx
// In your error handler
const { addLog } = useTerminalLivestream();

try {
  // ... code
} catch (error) {
  addLog(`Error in skill: ${error.message}`, 'error', 'skill');
}
```

---

## 🔐 Security Considerations

- **No sensitive data** should be sent through logs
- Avoid logging API keys, tokens, or passwords
- Sanitize user input before logging
- Educational use only — do not use in production

---

## 📞 Support & Licensing

**GitHub Issues:** [Fused Gaming MCP Issues](https://github.com/fused-gaming/fused-gaming-skill-mcp/issues)  
**Commercial Licensing:** license@fused-gaming.io  
**Documentation:** [Fused Gaming MCP Docs](https://github.com/fused-gaming/fused-gaming-skill-mcp/tree/main/docs)

---

## 📄 License

```
Fused Gaming MCP Terminal Livestream
Copyright © 2026 Fused Gaming

Licensed under the Apache License, Version 2.0 with additional
educational-use-only restrictions.

For educational use: See requirements above
For commercial use: Contact license@fused-gaming.io

This software is provided "as is" for educational purposes.
```

---

**Version:** 1.0.0  
**Last Updated:** April 27, 2026  
**Status:** Educational Beta
