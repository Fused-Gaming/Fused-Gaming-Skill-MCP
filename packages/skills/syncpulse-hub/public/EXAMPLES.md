# SyncPulse Concept Page - Code Examples

This document provides copy-paste ready code examples for common integration scenarios.

---

## Example 1: Basic Integration

### Setup
```javascript
// Wait for page to load, then get API reference
const API = window.SyncPulseAPI || {};

// Verify API is available
if (!API.setAgentState) {
    console.error('SyncPulse API not loaded');
    exit(1);
}
```

### Simple State Change
```javascript
const API = window.SyncPulseAPI;

// Change state
API.setAgentState('working');

// Update a metric
API.updateAgentMetric('orchestrator', 'Tasks', '1/3');

// Log activity
API.logActivity('Task started');

// Later...
API.setAgentState('success');
API.logActivity('Task completed', 'success');
```

---

## Example 2: Simulated Deployment

```javascript
const API = window.SyncPulseAPI;

async function simulateDeployment() {
    API.setAgentState('working');
    API.logActivity('Deployment starting...');
    
    // Stage 1: Orchestrator coordinates
    API.setAgentStatus('orchestrator', 'working');
    API.updateAgentMetric('orchestrator', 'Tasks', '1/3');
    API.logActivity('Orchestrator coordinating deployment');
    await sleep(2000);
    
    // Stage 2: Sentinel validates
    API.setAgentStatus('sentinel', 'working');
    API.updateAgentMetric('orchestrator', 'Tasks', '2/3');
    API.logActivity('Sentinel validating agents');
    await sleep(2000);
    
    // Stage 3: Analyst confirms
    API.setAgentStatus('analyst', 'working');
    API.updateAgentMetric('orchestrator', 'Tasks', '3/3');
    API.logActivity('Analyst confirming patterns');
    await sleep(1000);
    
    // Complete
    API.setAgentState('success');
    API.setAgentStatus('orchestrator', 'success');
    API.setAgentStatus('sentinel', 'success');
    API.setAgentStatus('analyst', 'success');
    API.logActivity('Deployment successful!', 'success');
    
    // Reset after delay
    await sleep(3000);
    API.setAgentState('idle');
    API.setAgentStatus('orchestrator', 'idle');
    API.setAgentStatus('sentinel', 'idle');
    API.setAgentStatus('analyst', 'idle');
    API.updateAgentMetric('orchestrator', 'Tasks', '0/3');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Call it
simulateDeployment();
```

---

## Example 3: WebSocket Integration

```javascript
const API = window.SyncPulseAPI;

class SyncPulseWebSocketBridge {
    constructor(wsUrl) {
        this.ws = new WebSocket(wsUrl);
        this.setupHandlers();
    }
    
    setupHandlers() {
        this.ws.addEventListener('open', () => {
            console.log('Connected to orchestration service');
            API.setAgentState('idle');
            API.logActivity('Connected to orchestration service', 'success');
        });
        
        this.ws.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
        });
        
        this.ws.addEventListener('error', () => {
            API.setAgentState('alert');
            API.logActivity('WebSocket connection error', 'alert');
        });
        
        this.ws.addEventListener('close', () => {
            API.setAgentState('idle');
            API.logActivity('Disconnected from service');
        });
    }
    
    handleMessage(message) {
        const { type, payload } = message;
        
        switch (type) {
            case 'state-change':
                API.setAgentState(payload.state);
                break;
            
            case 'agent-update':
                API.setAgentStatus(payload.agent, payload.status);
                break;
            
            case 'metric-update':
                API.updateAgentMetric(
                    payload.agent,
                    payload.metric,
                    payload.value
                );
                break;
            
            case 'activity-log':
                API.logActivity(payload.message, payload.type);
                break;
        }
    }
}

// Usage
const bridge = new SyncPulseWebSocketBridge('wss://api.example.com/events');
```

---

## Example 4: EventEmitter Pattern

```javascript
const API = window.SyncPulseAPI;
const EventEmitter = require('events');

class OrchestrationService extends EventEmitter {
    constructor() {
        super();
        this.wireUpUI();
    }
    
    wireUpUI() {
        // All state changes go to UI
        this.on('state', (state) => {
            API.setAgentState(state);
        });
        
        this.on('agent', ({ name, status }) => {
            API.setAgentStatus(name, status);
        });
        
        this.on('metric', ({ agent, metric, value }) => {
            API.updateAgentMetric(agent, metric, value);
        });
        
        this.on('activity', ({ message, type }) => {
            API.logActivity(message, type);
        });
    }
    
    // Example: Deploy agents
    async deploy() {
        this.emit('state', 'working');
        this.emit('activity', { message: 'Deployment starting' });
        
        try {
            this.emit('agent', { name: 'orchestrator', status: 'working' });
            await this.coordinateAgents();
            
            this.emit('agent', { name: 'sentinel', status: 'working' });
            await this.validateAgents();
            
            this.emit('state', 'success');
            this.emit('activity', {
                message: 'All agents deployed',
                type: 'success'
            });
        } catch (error) {
            this.emit('state', 'alert');
            this.emit('activity', {
                message: `Deployment error: ${error.message}`,
                type: 'alert'
            });
        }
    }
    
    async coordinateAgents() {
        // Simulate work
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.emit('metric', {
            agent: 'orchestrator',
            metric: 'Tasks',
            value: '1/3'
        });
    }
    
    async validateAgents() {
        // Simulate work
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.emit('metric', {
            agent: 'sentinel',
            metric: 'Checks',
            value: '150/150'
        });
    }
}

// Usage
const service = new OrchestrationService();
service.deploy();
```

---

## Example 5: React Component Integration

```javascript
import React, { useEffect, useRef } from 'react';

function SyncPulseWidget() {
    const iframeRef = useRef(null);
    const apiRef = useRef(null);
    
    useEffect(() => {
        // Load the concept page in iframe
        const iframe = iframeRef.current;
        
        iframe.onload = () => {
            // Get API from iframe
            apiRef.current = iframe.contentWindow.SyncPulseAPI;
            
            // Now we can use it
            if (apiRef.current) {
                apiRef.current.setAgentState('idle');
            }
        };
    }, []);
    
    // Method to trigger deployment from React
    const handleDeploy = async () => {
        const api = apiRef.current;
        if (!api) return;
        
        api.setAgentState('working');
        api.logActivity('React component triggered deployment');
        
        try {
            const response = await fetch('/api/deploy');
            const result = await response.json();
            
            api.setAgentState('success');
            api.logActivity(`Deployment: ${result.message}`, 'success');
        } catch (error) {
            api.setAgentState('alert');
            api.logActivity(`Error: ${error.message}`, 'alert');
        }
    };
    
    return (
        <div>
            <iframe
                ref={iframeRef}
                src="/concept-page.html"
                style={{
                    width: '100%',
                    height: '100vh',
                    border: 'none'
                }}
            />
            <button onClick={handleDeploy}>
                Deploy from React
            </button>
        </div>
    );
}

export default SyncPulseWidget;
```

---

## Example 6: Real Agent Monitoring

```javascript
const API = window.SyncPulseAPI;

class AgentMonitor {
    constructor(agentSystem) {
        this.agentSystem = agentSystem;
        this.startMonitoring();
    }
    
    startMonitoring() {
        // Hook into agent lifecycle events
        this.agentSystem.on('agent:spawn', (agent) => {
            API.logActivity(`Agent spawned: ${agent.name}`, 'success');
            API.setAgentStatus(agent.name, 'idle');
        });
        
        this.agentSystem.on('agent:start-task', (agent, task) => {
            API.setAgentStatus(agent.name, 'working');
            API.logActivity(`${agent.name} starting task: ${task.id}`);
        });
        
        this.agentSystem.on('agent:metric-update', (agent, metric) => {
            API.updateAgentMetric(agent.name, metric.label, metric.value);
        });
        
        this.agentSystem.on('agent:task-complete', (agent, task) => {
            API.setAgentStatus(agent.name, 'success');
            API.logActivity(
                `${agent.name} completed: ${task.id}`,
                'success'
            );
            
            // Back to idle after 1 second
            setTimeout(() => {
                API.setAgentStatus(agent.name, 'idle');
            }, 1000);
        });
        
        this.agentSystem.on('agent:error', (agent, error) => {
            API.setAgentStatus(agent.name, 'alert');
            API.logActivity(
                `${agent.name} error: ${error.message}`,
                'alert'
            );
        });
    }
}

// Usage
const monitor = new AgentMonitor(yourAgentSystem);
```

---

## Example 7: Progress Tracking

```javascript
const API = window.SyncPulseAPI;

class ProgressTracker {
    constructor(totalSteps) {
        this.totalSteps = totalSteps;
        this.currentStep = 0;
    }
    
    start(label) {
        this.label = label;
        API.setAgentState('working');
        API.logActivity(`${label} starting...`);
    }
    
    step(stepName) {
        this.currentStep++;
        const percentage = Math.round(
            (this.currentStep / this.totalSteps) * 100
        );
        
        API.updateAgentMetric(
            'executor',
            'Queue',
            `${this.currentStep}/${this.totalSteps}`
        );
        
        API.logActivity(
            `${stepName} (${percentage}% complete)`
        );
    }
    
    complete(result) {
        API.setAgentState('success');
        API.logActivity(`${this.label} completed: ${result}`, 'success');
    }
    
    error(errorMsg) {
        API.setAgentState('alert');
        API.logActivity(`${this.label} failed: ${errorMsg}`, 'alert');
    }
}

// Usage
const tracker = new ProgressTracker(5);
tracker.start('Data Processing');
tracker.step('Step 1: Load data');
tracker.step('Step 2: Validate');
tracker.step('Step 3: Transform');
tracker.step('Step 4: Aggregate');
tracker.step('Step 5: Export');
tracker.complete('Results exported to S3');
```

---

## Example 8: Error Handling

```javascript
const API = window.SyncPulseAPI;

class ErrorHandler {
    constructor() {
        this.errorThreshold = 3;
        this.errorCount = 0;
    }
    
    handleAgentError(agentName, error) {
        this.errorCount++;
        
        // Single agent error
        API.setAgentStatus(agentName, 'alert');
        API.logActivity(
            `${agentName} encountered error: ${error.message}`,
            'alert'
        );
        
        // If too many errors, alert the whole swarm
        if (this.errorCount >= this.errorThreshold) {
            API.setAgentState('alert');
            API.logActivity(
                `CRITICAL: Swarm error threshold exceeded (${this.errorCount} errors)`,
                'alert'
            );
            this.triggerRecovery();
        }
    }
    
    triggerRecovery() {
        API.logActivity('Initiating recovery protocol...');
        
        // Attempt recovery
        setTimeout(() => {
            this.errorCount = 0;
            API.setAgentState('idle');
            API.logActivity('Recovery complete', 'success');
        }, 3000);
    }
}

// Usage
const errorHandler = new ErrorHandler();
someAsyncOperation().catch(error => {
    errorHandler.handleAgentError('orchestrator', error);
});
```

---

## Example 9: Dashboard State Sync

```javascript
const API = window.SyncPulseAPI;

// Keep page title in sync with swarm state
let currentState = 'idle';
const stateIcons = {
    idle: '⚪',
    working: '🔵',
    alert: '🔴',
    success: '✅'
};

// Intercept setAgentState to also update page title
const originalSetState = API.setAgentState;
API.setAgentState = function(state) {
    originalSetState(state);
    currentState = state;
    document.title = `${stateIcons[state]} SyncPulse - ${state.toUpperCase()}`;
};

// Initialize
API.setAgentState('idle');
```

---

## Example 10: Batch Operations

```javascript
const API = window.SyncPulseAPI;

class BatchOperations {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }
    
    add(operation) {
        this.queue.push(operation);
        return this;
    }
    
    async execute() {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        API.setAgentState('working');
        API.logActivity(`Processing batch of ${this.queue.length} items`);
        
        try {
            let completed = 0;
            for (const op of this.queue) {
                await op.execute();
                completed++;
                
                API.updateAgentMetric(
                    'executor',
                    'Completed',
                    completed.toString()
                );
            }
            
            API.setAgentState('success');
            API.logActivity(
                `Batch complete: ${completed}/${this.queue.length} items`,
                'success'
            );
        } catch (error) {
            API.setAgentState('alert');
            API.logActivity(`Batch failed: ${error.message}`, 'alert');
        } finally {
            this.isProcessing = false;
            this.queue = [];
        }
    }
}

// Usage
const batch = new BatchOperations();
batch
    .add({ execute: async () => { /* task 1 */ } })
    .add({ execute: async () => { /* task 2 */ } })
    .add({ execute: async () => { /* task 3 */ } });
batch.execute();
```

---

## Testing

### Browser Console Test Script

```javascript
// Copy and paste this into the browser console

const API = window.SyncPulseAPI;
console.log('Starting SyncPulse API test...');

// Test 1: State transitions
console.log('Test 1: State transitions');
API.setAgentState('working');
setTimeout(() => API.setAgentState('success'), 2000);
setTimeout(() => API.setAgentState('idle'), 4000);

// Test 2: Individual agents
console.log('Test 2: Individual agent updates');
API.setAgentStatus('orchestrator', 'working');
setTimeout(() => API.setAgentStatus('orchestrator', 'success'), 1000);

// Test 3: Metrics
console.log('Test 3: Metric updates');
API.updateAgentMetric('orchestrator', 'Tasks', '5/10');
API.updateAgentMetric('sentinel', 'Health', '98%');
API.updateAgentMetric('analyst', 'Memory', '2.5GB');
API.updateAgentMetric('executor', 'Queue', '3');

// Test 4: Activity
console.log('Test 4: Activity logging');
API.logActivity('Normal message');
API.logActivity('Success message', 'success');
API.logActivity('Error message', 'alert');

console.log('Tests complete!');
```

---

## Common Patterns

### Pattern: Heartbeat Monitor
```javascript
const API = window.SyncPulseAPI;

setInterval(() => {
    // Update timestamp to show page is alive
    const now = new Date().toLocaleTimeString();
    API.logActivity(`Heartbeat: ${now}`);
}, 30000); // Every 30 seconds
```

### Pattern: State Recovery
```javascript
const API = window.SyncPulseAPI;

window.addEventListener('beforeunload', () => {
    // Save state to localStorage
    localStorage.setItem('syncpulse-state', API.STATES);
});

// Restore on load
const savedState = localStorage.getItem('syncpulse-state') || 'idle';
API.setAgentState(savedState);
```

### Pattern: Metrics Dashboard
```javascript
const API = window.SyncPulseAPI;

class MetricsDashboard {
    updateAll(metrics) {
        for (const [agent, agentMetrics] of Object.entries(metrics)) {
            for (const [label, value] of Object.entries(agentMetrics)) {
                API.updateAgentMetric(agent, label, value);
            }
        }
    }
}

// Usage
const dashboard = new MetricsDashboard();
dashboard.updateAll({
    orchestrator: { Tasks: '5/12', Agents: '4/4' },
    sentinel: { Checks: '150/150', Health: '100%' },
    analyst: { Patterns: '847', Accuracy: '94.2%' },
    executor: { Queue: '0', Completed: '1024' }
});
```

---

## Debugging

### Enable Console Logging
```javascript
const API = window.SyncPulseAPI;

// Wrap all API calls with logging
const loggedAPI = {};
for (const [key, fn] of Object.entries(API)) {
    if (typeof fn === 'function') {
        loggedAPI[key] = function(...args) {
            console.log(`API.${key}(`, ...args, ')');
            return fn.apply(API, args);
        };
    } else {
        loggedAPI[key] = fn;
    }
}

// Use loggedAPI instead of API
// loggedAPI.setAgentState('working');
```

---

For more examples and detailed API reference, see:
- `CONCEPT_PAGE_API.md` - Full API documentation
- `INTEGRATION_QUICKSTART.md` - Quick integration patterns
