# SyncPulse Concept Page - Integration Quick Start

## 5-Minute Setup

### Step 1: Load the Page

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <!-- Load the SyncPulse concept page in an iframe OR directly -->
    <iframe src="/concept-page.html" style="width: 100%; height: 100vh;"></iframe>
    
    <!-- OR embed directly as a component -->
    <!-- Copy the entire concept-page.html into your app -->
</body>
</html>
```

### Step 2: Access the API

```javascript
// The API is immediately available once the page loads
const API = window.SyncPulseAPI;

// Test it
API.setAgentState('working');
API.logActivity('Hello from integration!', 'success');
```

### Step 3: Wire Up Your Events

```javascript
// Your orchestration system fires events
yourSystem.on('event', (data) => {
    // Map to SyncPulse API
    API.setAgentState(data.state);
    API.logActivity(data.message);
    API.setAgentStatus(data.agent, data.status);
    API.updateAgentMetric(data.agent, data.metric, data.value);
});
```

---

## Common Integration Patterns

### Pattern 1: Global State Updates

```javascript
// When your swarm changes global state
const API = window.SyncPulseAPI;

function onSwarmStateChange(newState) {
    // idle -> working -> success/alert -> idle
    API.setAgentState(newState);
}
```

### Pattern 2: Individual Agent Tracking

```javascript
const API = window.SyncPulseAPI;

// When an agent updates
function onAgentStatusChange(agentName, status) {
    API.setAgentStatus(agentName, status);
    
    // Also log it
    API.logActivity(`${agentName} is now ${status}`, status);
}
```

### Pattern 3: Real-Time Metrics

```javascript
const API = window.SyncPulseAPI;

// Update agent metrics in real-time
function onMetricChange(agentName, metricName, metricValue) {
    API.updateAgentMetric(agentName, metricName, metricValue);
}

// Example: Track orchestrator task progress
onMetricChange('orchestrator', 'Tasks', '3/12');
```

### Pattern 4: Activity Feed

```javascript
const API = window.SyncPulseAPI;

// Log activity with type
function logActivity(message, type = null) {
    const types = {
        success: 'success',  // Green checkmark
        error: 'alert',      // Red warning
        info: null           // Neutral
    };
    
    API.logActivity(message, types[type]);
}

// Usage:
logActivity('Deployment started');
logActivity('Agent connected', 'success');
logActivity('Connection timeout', 'error');
```

### Pattern 5: Simulation Demo (No Real Data)

```javascript
const API = window.SyncPulseAPI;

function startSimulation() {
    API.setAgentState('working');
    API.logActivity('Simulation started');
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 2;
        API.updateAgentMetric('orchestrator', 'Tasks', `${Math.min(progress, 12)}/12`);
        
        if (progress >= 12) {
            clearInterval(interval);
            API.setAgentState('success');
            API.logActivity('Simulation completed', 'success');
        }
    }, 500);
}
```

---

## State Flow Examples

### Example: Deployment Workflow

```javascript
const API = window.SyncPulseAPI;

async function deploySwarm() {
    // 1. Starting
    API.setAgentState('working');
    API.logActivity('Deployment initiated');
    
    try {
        // 2. Notify individual agents
        API.setAgentStatus('orchestrator', 'working');
        API.logActivity('Orchestrator coordinating agents');
        
        API.setAgentStatus('sentinel', 'working');
        API.logActivity('Sentinel validating configuration');
        
        // 3. Update metrics
        API.updateAgentMetric('orchestrator', 'Tasks', '1/3');
        
        // 4. Simulate work
        await sleep(2000);
        API.updateAgentMetric('orchestrator', 'Tasks', '2/3');
        
        await sleep(2000);
        API.updateAgentMetric('orchestrator', 'Tasks', '3/3');
        
        // 5. Success
        API.setAgentState('success');
        API.setAgentStatus('orchestrator', 'success');
        API.setAgentStatus('sentinel', 'success');
        API.logActivity('Deployment completed', 'success');
        
        // 6. Return to idle
        setTimeout(() => {
            API.setAgentState('idle');
            API.setAgentStatus('orchestrator', 'idle');
            API.setAgentStatus('sentinel', 'idle');
        }, 3000);
        
    } catch (error) {
        API.setAgentState('alert');
        API.logActivity(`Deployment failed: ${error.message}`, 'alert');
    }
}
```

### Example: Error Handling

```javascript
const API = window.SyncPulseAPI;

function handleError(agentName, errorMessage) {
    // Mark specific agent as alert
    API.setAgentStatus(agentName, 'alert');
    
    // Log the error
    API.logActivity(
        `${agentName} error: ${errorMessage}`,
        'alert'
    );
    
    // If it's critical, alert the whole swarm
    if (isCritical(errorMessage)) {
        API.setAgentState('alert');
        API.logActivity('CRITICAL ALERT: Swarm compromised', 'alert');
    }
}
```

---

## Advanced: Event Bus Integration

### Using an Event Emitter

```javascript
import EventEmitter from 'events';

// Create your event bus
const orchestrationBus = new EventEmitter();
const API = window.SyncPulseAPI;

// Wire all events to SyncPulse
orchestrationBus.on('state', (state) => API.setAgentState(state));
orchestrationBus.on('agent-status', ({ name, status }) => API.setAgentStatus(name, status));
orchestrationBus.on('metric', ({ agent, label, value }) => API.updateAgentMetric(agent, label, value));
orchestrationBus.on('activity', ({ message, type }) => API.logActivity(message, type));

// Now your orchestration system just emits events
orchestrationBus.emit('state', 'working');
orchestrationBus.emit('activity', { message: 'Task started', type: 'info' });
orchestrationBus.emit('metric', { agent: 'orchestrator', label: 'Tasks', value: '1/5' });
```

### Using RxJS Observables

```javascript
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

const API = window.SyncPulseAPI;

// Subscribe to state changes
yourOrchestratorService.stateChanges$
    .pipe(
        map(state => API.setAgentState(state))
    )
    .subscribe();

// Subscribe to agent updates
yourOrchestratorService.agentUpdates$
    .pipe(
        map(({ name, status }) => API.setAgentStatus(name, status))
    )
    .subscribe();

// Subscribe to metrics
yourOrchestratorService.metrics$
    .pipe(
        map(({ agent, label, value }) => API.updateAgentMetric(agent, label, value))
    )
    .subscribe();
```

---

## API Reference (TL;DR)

```javascript
const API = window.SyncPulseAPI;

// 1. Set global state
API.setAgentState('idle' | 'working' | 'alert' | 'success');

// 2. Set individual agent state
API.setAgentStatus('orchestrator' | 'sentinel' | 'analyst' | 'executor', state);

// 3. Log activity
API.logActivity(message, 'success' | 'alert' | null);

// 4. Update metrics
API.updateAgentMetric(agentName, metricLabel, value);

// 5. Access state constants
API.STATES.IDLE    // 'idle'
API.STATES.WORKING // 'working'
API.STATES.ALERT   // 'alert'
API.STATES.SUCCESS // 'success'
```

---

## Troubleshooting

### "API is undefined"
- The page may not have loaded yet
- Use `document.readyState === 'complete'` or `DOMContentLoaded` event
- If in iframe, ensure same-origin or use PostMessage

### "Metric doesn't update"
- Check metric label matches exactly (case-sensitive)
- Available labels: Task, Checks, Health, Uptime, Accuracy, Memory, Queue, Completed, Success, etc.
- See `CONCEPT_PAGE_API.md` for full list per agent

### "Animations are disabled"
- User's browser has `prefers-reduced-motion` enabled
- This is intentional (accessibility feature)
- Check with `window.matchMedia('(prefers-reduced-motion: reduce)').matches`

### "State change doesn't reflect"
- The state is set, but card might still show old text
- Always call `updateAgentMetric` to update displayed values
- Example: `setAgentState('working')` then `updateAgentMetric('orchestrator', 'Status', 'WORKING')`

---

## Testing Your Integration

### Quick Test Script

```javascript
// Paste this in the browser console to test
const API = window.SyncPulseAPI;

// Test 1: State transitions
console.log('Testing state transitions...');
API.setAgentState('working');
setTimeout(() => API.setAgentState('success'), 1000);
setTimeout(() => API.setAgentState('idle'), 3000);

// Test 2: Individual agents
console.log('Testing individual agents...');
API.setAgentStatus('orchestrator', 'working');
API.setAgentStatus('sentinel', 'alert');
API.setAgentStatus('analyst', 'success');

// Test 3: Activity logging
console.log('Testing activity logging...');
API.logActivity('Test message');
API.logActivity('Success test', 'success');
API.logActivity('Alert test', 'alert');

// Test 4: Metrics
console.log('Testing metrics...');
API.updateAgentMetric('orchestrator', 'Tasks', '5/12');
API.updateAgentMetric('sentinel', 'Health', '95%');

console.log('All tests completed - check the page!');
```

---

## Next Steps

1. **Read the full API docs:** See `CONCEPT_PAGE_API.md`
2. **Check out the integration examples:** Search for "INTEGRATION GUIDE" in `concept-page.html`
3. **Deploy to production:** See deployment checklist in API docs
4. **Wire to your system:** Use the patterns above for your architecture

---

## Support

For questions or issues:
1. Check `CONCEPT_PAGE_API.md` troubleshooting section
2. Review the demo functions in `concept-page.html` (search for `simulateDeployment()`)
3. Consult GitHub issues #164/#165 for design token specifications

Happy integrating!
