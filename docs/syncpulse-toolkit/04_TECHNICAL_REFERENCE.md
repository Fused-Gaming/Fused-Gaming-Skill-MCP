# Technical Reference - SyncPulse Ethical Hacking Toolkit API

## Table of Contents
1. Service Architecture
2. Tools Reference
3. Type Definitions
4. Integration Patterns
5. Environment Configuration
6. Performance Characteristics
7. Error Handling
8. Database Schema

---

## Part 1: Service Architecture

### Service Overview

SyncPulse provides 9 core services across 5 layers:

```
Layer 1 (Core) ✅ Existing
├── SwarmOrchestrator      // Multi-agent coordination
├── MemorySystem           // Distributed caching
├── TaskOrchestrator       // Task execution
├── CacheService           // Persistent state
└── SessionManager         // Lifecycle management

Layer 2 (Security) - Phase 1
├── RoEValidator           // Scope enforcement
├── EvidenceManager        // Chain of custody
├── FindingsDatabase       // Finding storage
└── ComplianceChecker      // CWE/OWASP mapping

Layer 3 (Agents) - Phases 2-3
├── DNSIntelligenceAgent
├── AssetDiscoveryAgent
├── VulnIntelligenceAgent
├── ServiceFingerprintingAgent
└── [Custom agents]

Layer 4 (Testing) - Phases 3-4
├── TestCaseManager
├── PayloadGenerator
├── RoEEnforcer
└── ProgressTracker

Layer 5 (Reporting) - Phase 4
├── ReportGenerator
├── DisclosureManager
└── MetricsDashboard
```

### SwarmOrchestrator (Existing ✅)

**Purpose:** Manages multi-agent task coordination across 5 topology types.

**Available Methods:**

```typescript
// Initialize swarm
initializeSwarm(
  id: string,
  name: string,
  topology: 'hierarchical' | 'mesh' | 'adaptive' | 'ring' | 'star',
  agentCount: number
): Swarm

// Assign work to agents
assignTask(
  swarmId: string,
  task: Task
): { agentId: string, taskId: string }

// Report task completion
releaseTask(
  swarmId: string,
  agentId: string,
  success: boolean
): void

// Get swarm metrics
getSwarmMetrics(id: string): {
  healthScore: number,        // 0.0-1.0
  totalTasks: number,
  completedTasks: number,
  failedTasks: number,
  averageTaskTime: number,
  agents: Agent[]
}

// Get individual agent metrics
getAgentMetrics(swarmId: string, agentId: string): {
  status: 'idle' | 'busy' | 'error' | 'offline',
  capacity: number,
  currentLoad: number,
  successRate: number,        // 0.0-1.0
  totalTasksCompleted: number,
  averageTaskDuration: number
}

// Scale swarm size
scaleSwarm(
  swarmId: string,
  newAgentCount: number
): void
```

**Topology Details:**

| Topology | Use Case | Pros | Cons |
|----------|----------|------|------|
| `hierarchical` | Coordinated testing | Strong consistency, controlled | Single point of failure |
| `mesh` | Distributed agents | Fault-tolerant, fast | More complex coordination |
| `adaptive` | Dynamic workflows | Adjusts to load | Harder to predict |
| `ring` | Sequential workflows | Simple ordering | Poor parallelization |
| `star` | Hub-and-spoke | Clear coordination | Bottleneck at hub |

**Example Usage:**

```typescript
import { createSyncPulseSkill } from '@h4shed/skill-syncpulse';

const skill = createSyncPulseSkill();
const { swarm } = skill.services;

// Create hierarchical swarm for coordinated testing
const mySwarm = swarm.initializeSwarm(
  'engagement-2024-001',
  'Production Security Assessment',
  'hierarchical',
  8
);

// Assign reconnaissance tasks
const dnsTask = {
  id: 'task-dns-enum',
  name: 'DNS Enumeration',
  priority: 10,
  status: 'pending' as const,
  createdAt: Date.now(),
  target: 'example.com'
};

const assignment = swarm.assignTask('engagement-2024-001', dnsTask);
console.log(`Task assigned to ${assignment.agentId}`);

// Monitor swarm health
const metrics = swarm.getSwarmMetrics('engagement-2024-001');
console.log(`Health Score: ${metrics.healthScore * 100}%`);
console.log(`Completed: ${metrics.completedTasks}/${metrics.totalTasks}`);
```

---

### MemorySystem (Existing ✅)

**Purpose:** Distributed caching with vector similarity search.

**Available Methods:**

```typescript
// Store value with optional TTL
set(
  key: string,
  value: unknown,
  metadata?: {
    ttl?: number,              // milliseconds
    category?: string,
    tags?: string[]
  }
): Promise<void>

// Retrieve value (checks TTL)
get(
  key: string
): Promise<unknown | null>

// Vector similarity search
vectorSearch(
  query: string,
  limit?: number,
  minSimilarity?: number        // 0.0-1.0, default 0.5
): Promise<Array<{
  key: string,
  value: unknown,
  similarity: number            // 0.0-1.0
}>>

// Get cache statistics
getStats(): Promise<{
  totalEntries: number,
  hitRate: number,              // 0.0-1.0
  missRate: number,
  averageResponseTime: number,  // milliseconds
  oldestEntry: Date,
  newestEntry: Date
}>

// Clear cache
clear(): Promise<void>

// Delete specific key
delete(key: string): Promise<void>

// Persist cache to disk
persist(): Promise<void>

// Load cache from disk
hydrate(): Promise<void>
```

**Example Usage:**

```typescript
const { memory } = skill.services;

// Cache DNS enumeration results
await memory.set(
  'dns:example.com',
  {
    aRecords: ['192.0.2.1', '192.0.2.2'],
    mxRecords: ['mail.example.com'],
    nsRecords: ['ns1.example.com', 'ns2.example.com']
  },
  {
    ttl: 3600000,    // 1 hour
    category: 'recon',
    tags: ['dns', 'example.com']
  }
);

// Query by key
const dnsResults = await memory.get('dns:example.com');

// Search by similarity
const relatedEntries = await memory.vectorSearch(
  'example.com domain enumeration',
  5,   // top 5 results
  0.7  // 70% similarity threshold
);

// Check cache health
const stats = await memory.getStats();
console.log(`Cache Hit Rate: ${stats.hitRate * 100}%`);
```

**Similarity Algorithm:**

Levenshtein distance-based similarity:
```
similarity = 1 - (levenshteinDistance(a, b) / maxLength)
```

Perfect match (1.0) requires exact key; related entries return 0.6-0.9.

---

### RoEValidator (Phase 1)

**Purpose:** Enforce Rules of Engagement before testing.

**Available Methods:**

```typescript
// Load RoE from file or database
loadRoE(roePath: string): Promise<void>

// Validate target scope
validateScope(
  targets: string[]
): {
  valid: boolean,
  violations: Violation[],       // critical/high/medium
  warnings: Warning[],
  approvalToken?: string         // Valid for 1 test
}

// Validate testing method
validateTestingMethod(
  method: TestingMethod,
  target: string
): {
  valid: boolean,
  violations: Violation[],
  warnings: Warning[]
}

// Check if currently in testing window
validateTimeWindow(): boolean

// Get current RoE
getRoE(): RulesOfEngagement | null
```

**RoE File Format (JSON):**

```json
{
  "engagementId": "eng-2024-001",
  "clientName": "Acme Corp",
  "authorizedTargets": [
    {
      "type": "domain",
      "value": "example.com",
      "services": ["ssh", "http", "https"]
    },
    {
      "type": "cidr",
      "value": "192.0.2.0/24"
    }
  ],
  "forbiddenTargets": [
    "internal.example.com",
    "192.0.2.254"
  ],
  "allowedTestingMethods": [
    "passive-reconnaissance",
    "active-scanning",
    "vulnerability-testing"
  ],
  "timeWindow": {
    "start": "2024-06-01T09:00:00Z",
    "end": "2024-06-30T18:00:00Z"
  },
  "maxConcurrentTests": 5,
  "escalationContacts": [
    {
      "name": "John Doe",
      "title": "Security Officer",
      "email": "john@example.com",
      "phone": "+1-555-0100"
    }
  ]
}
```

**Example Usage:**

```typescript
const { roeValidator } = skill.services;

// Load RoE from engagement
await roeValidator.loadRoE('./engagements/eng-2024-001/roe.json');

// Before starting reconnaissance
const reconValidation = roeValidator.validateScope(['example.com']);
if (!reconValidation.valid) {
  console.error('RoE Violation:', reconValidation.violations[0].message);
  process.exit(1);
}

// Before executing specific tests
const testValidation = roeValidator.validateTestingMethod(
  TestingMethod.VULNERABILITY_TESTING,
  'example.com'
);

if (!testValidation.valid) {
  throw new Error('Testing method not authorized for this target');
}

// Check time window
if (!roeValidator.validateTimeWindow()) {
  throw new Error('Testing window expired');
}
```

---

### FindingsDatabase (Phase 1)

**Purpose:** Store, deduplicate, and query security findings.

**Available Methods:**

```typescript
// Store a finding (deduplicates automatically)
storeFinding(finding: Finding): Promise<string>

// Query findings with filters
queryFindings(
  query: {
    engagementId?: string,
    targetHost?: string,
    severity?: Finding['severity'][],
    status?: Finding['status'][],
    vulnerabilityType?: string
  }
): Promise<Finding[]>

// Update finding status
updateStatus(
  findingId: string,
  status: Finding['status']
): Promise<void>

// Get findings grouped by severity
getSeverityBreakdown(
  engagementId: string
): Promise<{
  Critical: number,
  High: number,
  Medium: number,
  Low: number,
  Informational: number
}>

// Search findings by keyword
searchFindings(
  keyword: string,
  engagementId?: string
): Promise<Finding[]>

// Export findings for reporting
exportFindings(
  engagementId: string,
  format: 'json' | 'csv'
): Promise<Buffer>
```

**Finding Structure:**

```typescript
interface Finding {
  id: string;                    // UUID
  engagementId: string;
  targetHost: string;            // IP or domain
  vulnerabilityType: string;     // SQL Injection, XSS, etc.
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  cvssScore: number;             // 0.0-10.0
  cvssVector?: string;           // CVSS:3.1/...
  cweIds: string[];              // ['CWE-79', 'CWE-93']
  description: string;           // What is the vuln
  evidence: {
    screenshotPath?: string;
    requestPayload?: string;
    responseData?: string;
  };
  status: 'Open' | 'InProgress' | 'Resolved' | 'AcceptedRisk' | 'FalsePositive';
  createdAt: Date;
  updatedAt: Date;
  discoveredBy: string;          // Agent ID
}
```

**Example Usage:**

```typescript
const { findingsDb } = skill.services;

// Store a finding discovered during testing
const finding: Finding = {
  id: crypto.randomUUID(),
  engagementId: 'eng-2024-001',
  targetHost: 'api.example.com',
  vulnerabilityType: 'SQL Injection',
  severity: 'Critical',
  cvssScore: 9.0,
  cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
  cweIds: ['CWE-89'],
  description: 'SQL injection in user login endpoint',
  evidence: {
    requestPayload: "' OR '1'='1",
    responseData: 'Database error: ...'
  },
  status: 'Open',
  createdAt: new Date(),
  updatedAt: new Date(),
  discoveredBy: 'agent-sql-injector'
};

await findingsDb.storeFinding(finding);

// Query findings by severity
const criticalFindings = await findingsDb.queryFindings({
  engagementId: 'eng-2024-001',
  severity: ['Critical', 'High']
});

console.log(`Found ${criticalFindings.length} critical/high findings`);

// Get breakdown for reporting
const breakdown = await findingsDb.getSeverityBreakdown('eng-2024-001');
console.log(`Critical: ${breakdown.Critical}, High: ${breakdown.High}`);

// Export for client report
const jsonExport = await findingsDb.exportFindings('eng-2024-001', 'json');
```

---

### ComplianceChecker (Phase 1)

**Purpose:** Map findings to compliance frameworks (CWE, OWASP, CVSS).

**Available Methods:**

```typescript
// Map description to CWE IDs
mapToCWE(
  description: string
): CWE[]

// Map finding to OWASP categories
mapToOWASP(
  description: string
): OWASPTopic[]

// Calculate CVSS score
calculateCVSS(
  description: string,
  targetType: 'web' | 'api' | 'database' | 'network'
): CVSSVector

// Get all supported CWE mappings
getCWEDatabase(): CWE[]

// Get all supported OWASP mappings
getOWASPDatabase(): OWASPTopic[]
```

**Response Types:**

```typescript
interface CWE {
  id: string;          // e.g., 'CWE-79'
  name: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
}

interface OWASPTopic {
  category: string;    // e.g., 'A01:2021'
  name: string;
  description: string;
}

interface CVSSVector {
  version: '3.0' | '3.1';
  baseScore: number;           // 0.0-10.0
  baseSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  vector: string;              // CVSS:3.1/AV:N/AC:L/...
}
```

**Example Usage:**

```typescript
const { complianceChecker } = skill.services;

const finding = {
  description: 'Reflected XSS in search parameter',
  targetType: 'web' as const
};

// Map to standards
const cwes = complianceChecker.mapToCWE(finding.description);
const owasps = complianceChecker.mapToOWASP(finding.description);
const cvss = complianceChecker.calculateCVSS(finding.description, finding.targetType);

console.log(`CWE: ${cwes[0].id} - ${cwes[0].name}`);
console.log(`OWASP: ${owasps[0].category} - ${owasps[0].name}`);
console.log(`CVSS: ${cvss.baseScore} (${cvss.baseSeverity})`);
console.log(`Vector: ${cvss.vector}`);
```

---

## Part 2: Tools Reference (MCP Interface)

### Available Tools (13 + 4 = 17 Total)

#### Coordination Tools (4)

**1. synchronize_project_state**

Caches current project state across all agents.

**Input:**
```typescript
{
  projectId: string;
  includeGit: boolean;           // Include .git metadata
  cacheTTL: number;              // TTL in milliseconds
}
```

**Output:**
```typescript
{
  state: {
    projectId: string;
    files: number;
    directories: number;
    gitStatus: string;
  };
  cached: boolean;
  metadata: {
    cachedAt: string;
    ttl: number;
  };
}
```

---

**2. query_cache**

Vector similarity search across distributed cache.

**Input:**
```typescript
{
  query: string;
  limit: number;                 // Max results (default: 10)
  minSimilarity: number;         // 0.0-1.0 (default: 0.5)
}
```

**Output:**
```typescript
{
  results: Array<{
    key: string;
    similarity: number;          // 0.0-1.0
    value: unknown;
    metadata: Record<string, unknown>;
  }>;
  totalMatches: number;
  executionTime: number;         // milliseconds
}
```

---

**3. coordinate_agents**

Multi-agent task coordination.

**Input:**
```typescript
{
  workflowId: string;
  topology: 'hierarchical' | 'mesh' | 'adaptive' | 'ring' | 'star';
  tasks: Array<{
    id: string;
    name: string;
    priority: number;            // 1-10
    target?: string;
  }>;
}
```

**Output:**
```typescript
{
  workflowId: string;
  tasksAssigned: number;
  swarmMetrics: {
    healthScore: number;
    averageTaskTime: number;
    successRate: number;
  };
  taskResults: Array<{
    taskId: string;
    agentId: string;
    status: 'completed' | 'failed' | 'pending';
    result?: unknown;
    error?: string;
  }>;
}
```

---

**4. analyze_performance**

Real-time metrics and analytics.

**Input:**
```typescript
{
  timeRange: '1h' | '6h' | '24h' | '7d';
  metrics: Array<
    'cacheHitRate' |
    'taskThroughput' |
    'agentUtilization' |
    'avgTaskDuration' |
    'errorRate'
  >;
}
```

**Output:**
```typescript
{
  timeRange: string;
  metrics: {
    cacheHitRate: number;        // 0.0-1.0
    taskThroughput: number;      // tasks/sec
    agentUtilization: number;    // 0.0-1.0
    avgTaskDuration: number;     // milliseconds
    errorRate: number;           // 0.0-1.0
  };
  trend: 'up' | 'down' | 'stable';
  recommendations: string[];
}
```

---

#### Email Tools (13 - Currently Available ✅)

**Workflow Templates:**

1. `send_magic_link` — Magic link authentication email
2. `send_mfa_code` — Multi-factor authentication code delivery
3. `send_password_reset` — Password reset instructions
4. `send_security_alert` — Security event notification
5. `send_invoice` — Invoice delivery
6. `send_newsletter` — Newsletter distribution
7. `send_outage_notice` — Service outage notification
8. `send_maintenance_notice` — Maintenance window notification
9. `send_ticket_update` — Support ticket status update

**Generic & Bulk Tools:**

10. `send_email` — Custom email with template variables
11. `send_bulk_email` — Batch email to multiple recipients with per-recipient variables
12. `send_marketing_campaign` — Marketing campaign with tracking
13. `verify_email_configuration` — Validate SMTP configuration

---

## Part 3: Type Definitions

### Core Types

```typescript
// Agent lifecycle
type AgentStatus = 'idle' | 'busy' | 'error' | 'offline';
type AgentRole = 'coordinator' | 'executor' | 'reviewer' | 'optimizer' | 'monitor';

// Task execution
type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
type TaskPriority = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// Session states
type SessionStatus = 'active' | 'paused' | 'completed';

// Swarm topologies
type SwarmTopology = 'hierarchical' | 'mesh' | 'adaptive' | 'ring' | 'star';

// Testing frameworks
type TestingMethod =
  | 'passive-reconnaissance'
  | 'active-scanning'
  | 'vulnerability-testing'
  | 'exploitation'
  | 'social-engineering';

// Finding severity
type FindingSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

// Finding status
type FindingStatus = 'Open' | 'InProgress' | 'Resolved' | 'AcceptedRisk' | 'FalsePositive';
```

### Agent Interface

```typescript
interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  capacity: number;              // Max concurrent tasks
  currentLoad: number;           // Current tasks
  successRate: number;           // 0.0-1.0
  lastHeartbeat: number;         // timestamp
}
```

### Task Interface

```typescript
interface Task {
  id: string;
  name: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: number;             // timestamp
  target?: string;
  parameters?: Record<string, unknown>;
  result?: unknown;
  error?: string;
}
```

### Swarm Interface

```typescript
interface Swarm {
  id: string;
  name: string;
  topology: SwarmTopology;
  agents: Agent[];
  activeTasks: Task[];
  completedTasks: Task[];
  healthScore: number;           // 0.0-1.0
  createdAt: number;
}
```

---

## Part 4: Integration Patterns

### Pattern 1: Basic Reconnaissance Workflow

```typescript
import { createSyncPulseSkill } from '@h4shed/skill-syncpulse';
import { RoEValidator } from './services/RoEValidator';
import { FindingsDatabase } from './services/FindingsDatabase';

async function runReconnaissance(engagementId: string) {
  const skill = createSyncPulseSkill();
  const { swarm, memory, roeValidator, findingsDb } = skill.services;

  // Step 1: Load and validate RoE
  await roeValidator.loadRoE(`./engagements/${engagementId}/roe.json`);
  const targets = ['example.com', '192.0.2.1', '192.0.2.0/24'];
  
  const validation = roeValidator.validateScope(targets);
  if (!validation.valid) {
    throw new Error(`RoE violation: ${validation.violations[0].message}`);
  }

  // Step 2: Create reconnaissance swarm
  const reconSwarm = swarm.initializeSwarm(
    engagementId,
    'Reconnaissance Team',
    'mesh',      // Distributed agents, no bottleneck
    4
  );

  // Step 3: Assign tasks
  const tasks = [
    { id: 'dns-1', name: 'DNS Enumeration', priority: 10, target: 'example.com' },
    { id: 'port-1', name: 'Port Scanning', priority: 8, target: '192.0.2.0/24' },
    { id: 'cert-1', name: 'Certificate Search', priority: 6, target: 'example.com' },
    { id: 'whois-1', name: 'WHOIS Lookup', priority: 5, target: 'example.com' }
  ];

  for (const task of tasks) {
    const assignment = swarm.assignTask(engagementId, task);
    console.log(`Assigned ${task.name} to ${assignment.agentId}`);
  }

  // Step 4: Monitor progress
  const startTime = Date.now();
  let allComplete = false;

  while (!allComplete) {
    const metrics = swarm.getSwarmMetrics(engagementId);
    console.log(`Progress: ${metrics.completedTasks}/${metrics.totalTasks}`);
    
    if (metrics.completedTasks === metrics.totalTasks) {
      allComplete = true;
    } else {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
    }
  }

  const duration = (Date.now() - startTime) / 1000;
  console.log(`Reconnaissance complete in ${duration}s`);

  // Step 5: Store findings
  const findings = [
    {
      id: crypto.randomUUID(),
      engagementId,
      targetHost: '192.0.2.1',
      vulnerabilityType: 'Open SSH Service',
      severity: 'Medium' as const,
      cvssScore: 5.3,
      cweIds: [],
      description: 'SSH service running on non-standard port 2222',
      evidence: {},
      status: 'Open' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      discoveredBy: 'agent-port-scanner'
    }
  ];

  for (const finding of findings) {
    await findingsDb.storeFinding(finding);
  }

  console.log(`Stored ${findings.length} findings`);
}
```

---

### Pattern 2: Coordinated Testing Workflow

```typescript
async function runVulnerabilityTesting(engagementId: string) {
  const skill = createSyncPulseSkill();
  const { swarm, roeValidator, roeEnforcer, findingsDb } = skill.services;

  // Load RoE
  await roeValidator.loadRoE(`./engagements/${engagementId}/roe.json`);

  // Create testing swarm (hierarchical for coordinated testing)
  const testSwarm = swarm.initializeSwarm(
    `${engagementId}-testing`,
    'Testing Team',
    'hierarchical',  // Queen-led for consistent targeting
    6
  );

  // Test cases to execute
  const testCases = [
    {
      id: 'xss-1',
      name: 'Reflected XSS Testing',
      priority: 9,
      target: 'example.com',
      method: 'vulnerability-testing' as const,
      payloads: ['<script>alert(1)</script>', '"\'>alert(1)</"']
    },
    {
      id: 'sqli-1',
      name: 'SQL Injection Testing',
      priority: 10,
      target: 'example.com/api',
      method: 'vulnerability-testing' as const,
      payloads: ["' OR '1'='1", "'; DROP TABLE users; --"]
    },
    {
      id: 'csrf-1',
      name: 'CSRF Testing',
      priority: 7,
      target: 'example.com',
      method: 'vulnerability-testing' as const,
      payloads: []
    }
  ];

  for (const testCase of testCases) {
    // Enforce RoE for each test
    const roeCheck = roeValidator.validateTestingMethod(
      testCase.method,
      testCase.target
    );

    if (!roeCheck.valid) {
      console.warn(`Skipping ${testCase.name}: ${roeCheck.violations[0].message}`);
      continue;
    }

    // Assign test task
    const assignment = swarm.assignTask(`${engagementId}-testing`, {
      id: testCase.id,
      name: testCase.name,
      priority: testCase.priority,
      createdAt: Date.now(),
      parameters: {
        target: testCase.target,
        payloads: testCase.payloads
      }
    });

    console.log(`Assigned ${testCase.name} to ${assignment.agentId}`);
  }

  // Wait for completion
  await waitForCompletion(`${engagementId}-testing`, swarm);
}
```

---

### Pattern 3: Evidence Collection & Finding Storage

```typescript
async function recordFinding(
  engagementId: string,
  vulnerability: {
    targetHost: string;
    type: string;
    description: string;
    proof: Buffer;
  },
  discoveredBy: string
) {
  const skill = createSyncPulseSkill();
  const { findingsDb, evidenceManager, complianceChecker } = skill.services;

  // Record evidence with chain of custody
  const evidence = await evidenceManager.recordEvidence(
    crypto.randomUUID(),
    vulnerability.proof,
    'binary',
    discoveredBy
  );

  // Get compliance mappings
  const cwes = complianceChecker.mapToCWE(vulnerability.description);
  const owasps = complianceChecker.mapToOWASP(vulnerability.description);
  const cvss = complianceChecker.calculateCVSS(vulnerability.description, 'web');

  // Create finding
  const finding: Finding = {
    id: crypto.randomUUID(),
    engagementId,
    targetHost: vulnerability.targetHost,
    vulnerabilityType: vulnerability.type,
    severity: cvss.baseSeverity as any,
    cvssScore: cvss.baseScore,
    cvssVector: cvss.vector,
    cweIds: cwes.map(c => c.id),
    description: vulnerability.description,
    evidence: {
      responseData: vulnerability.proof.toString('utf8')
    },
    status: 'Open',
    createdAt: new Date(),
    updatedAt: new Date(),
    discoveredBy
  };

  // Store finding
  const findingId = await findingsDb.storeFinding(finding);
  console.log(`Finding stored: ${findingId} (${cvss.baseSeverity})`);

  return { finding, evidence };
}
```

---

## Part 5: Environment Configuration

### Configuration File (.env)

```bash
# Database
DATABASE_URL=sqlite:.findings.db
# or: postgresql://user:pass@localhost/findings

# Security
EVIDENCE_HMAC_KEY=<generate via: openssl rand -hex 32>
ENCRYPTION_KEY=<generate via: openssl rand -hex 32>

# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<SendGrid API key>
SMTP_FROM=alerts@example.com

# SyncPulse Configuration
SYNCPULSE_CACHE_DIR=.cache
SYNCPULSE_MAX_AGENTS=15
SYNCPULSE_DEFAULT_TOPOLOGY=hierarchical
SYNCPULSE_ENABLE_VECTOR_SEARCH=true

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# API Configuration
API_PORT=3000
API_HOST=localhost
```

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

---

## Part 6: Performance Characteristics

### Operational Metrics

| Component | Metric | Typical | Target |
|-----------|--------|---------|--------|
| **Memory System** | Cache hit rate | 75% | >70% |
| | Search latency | 5ms | <10ms |
| | Persistence time | 100ms | <200ms |
| **SwarmOrchestrator** | Task assignment | 2ms | <5ms |
| | Health score update | 1ms | <2ms |
| | Agent scaling time | 500ms | <1s |
| **FindingsDatabase** | Query time (100 findings) | 10ms | <50ms |
| | Insert time (dedup) | 5ms | <10ms |
| | Export (1000 findings) | 500ms | <2s |
| **RoEValidator** | Scope validation | 2ms | <5ms |
| **EvidenceManager** | Evidence record | 50ms | <100ms |
| | Integrity check | 20ms | <50ms |

### Scalability Limits

```
Cache Size:          1,000+ entries (before slowdown)
Concurrent Agents:   15 (tested, configurable)
Tasks per Swarm:     100+ (before contention)
Findings Database:   10,000+ records (SQLite)
                     1M+ records (PostgreSQL)
Evidence Size:       100MB+ total (filesystem)
```

### Throughput

```
Task Assignment:     500 tasks/second
Cache Operations:    1,000 ops/second
Finding Storage:     100 findings/second
Email Sending:       10 emails/second (SMTP limited)
```

---

## Part 7: Error Handling

### Common Errors

```typescript
// Error: RoE violation during test execution
class RoEViolationError extends Error {
  constructor(
    message: string,
    public violation: Violation,
    public target: string
  ) {
    super(message);
  }
}

// Error: Evidence integrity check failed
class EvidenceIntegrityError extends Error {
  constructor(
    message: string,
    public evidenceId: string,
    public expectedHash: string,
    public actualHash: string
  ) {
    super(message);
  }
}

// Error: Database constraint violation (dedup)
class DuplicateFindingError extends Error {
  constructor(
    message: string,
    public existingFindingId: string
  ) {
    super(message);
  }
}
```

### Best Practices

```typescript
// Always validate RoE before testing
try {
  const validation = roeValidator.validateScope(targets);
  if (!validation.valid) {
    throw new RoEViolationError(
      'RoE validation failed',
      validation.violations[0],
      targets[0]
    );
  }
} catch (err) {
  logger.error('RoE validation', err);
  // Escalate to security team
}

// Verify evidence integrity periodically
try {
  const isValid = await evidenceManager.verifyIntegrity(evidenceId);
  if (!isValid) {
    throw new EvidenceIntegrityError(
      'Evidence tampering detected',
      evidenceId,
      expectedHash,
      actualHash
    );
  }
} catch (err) {
  logger.critical('Evidence integrity', err);
  // Halt findings reporting
}
```

---

## Part 8: Database Schema

### SQLite Schema (Development)

See migrations/001_phase1_schema.sql for complete schema.

### PostgreSQL Schema (Production)

```sql
-- Engagements
CREATE TABLE engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rules of Engagement
CREATE TABLE rules_of_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  roe_json JSONB NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_roe_engagement ON rules_of_engagement(engagement_id);

-- Findings
CREATE TABLE findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  target_host VARCHAR(255) NOT NULL,
  vulnerability_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20),
  cvss_score DECIMAL(3,1),
  cvss_vector VARCHAR(100),
  cwe_ids TEXT[],
  owasp_categories TEXT[],
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Open',
  discovered_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(engagement_id, target_host, vulnerability_type)
);

CREATE INDEX idx_findings_engagement ON findings(engagement_id);
CREATE INDEX idx_findings_severity ON findings(severity);
CREATE INDEX idx_findings_status ON findings(status);

-- Evidence
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  finding_id UUID NOT NULL REFERENCES findings(id) ON DELETE CASCADE,
  content_hash VARCHAR(64) NOT NULL,
  content_type VARCHAR(50),
  signature VARCHAR(256),
  collected_by VARCHAR(100),
  collected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_evidence_finding ON evidence(finding_id);

-- Chain of Custody
CREATE TABLE evidence_chain_of_custody (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE,
  actor VARCHAR(100),
  action VARCHAR(50),
  details TEXT
);

CREATE INDEX idx_coc_evidence ON evidence_chain_of_custody(evidence_id);
```

---

## Quick Reference

### Initializing SyncPulse

```typescript
import { createSyncPulseSkill } from '@h4shed/skill-syncpulse';

const skill = createSyncPulseSkill();
const {
  swarm,           // SwarmOrchestrator ✅
  memory,          // MemorySystem ✅
  tasks,           // TaskOrchestrator ✅
  cache,           // CacheService ✅
  emailService     // EmailService ✅
  // Phase 1 services coming soon:
  // roeValidator, findingsDb, evidenceManager, complianceChecker
} = skill.services;
```

### Common Operations

```typescript
// Create swarm and assign task
const mySwarm = swarm.initializeSwarm(id, name, topology, count);
swarm.assignTask(mySwarm.id, task);
const metrics = swarm.getSwarmMetrics(mySwarm.id);

// Cache data
await memory.set(key, value, metadata);
const data = await memory.get(key);
const matches = await memory.vectorSearch(query, 5);

// Send email
await emailService.sendEmail({
  recipients: [{ email: 'user@example.com' }],
  subject: 'Test',
  htmlBody: '<p>Hello {{name}}</p>',
  variables: { name: 'User' }
});

// Phase 1 services (when available):
// const validation = roeValidator.validateScope(targets);
// await findingsDb.storeFinding(finding);
const findings = await findingsDb.queryFindings({ engagementId });

// Record evidence
const evidence = await evidenceManager.recordEvidence(id, content, type, actor);
const valid = await evidenceManager.verifyIntegrity(id);
```

For more detailed examples, see the [IMPLEMENTATION_ROADMAP.md](03_IMPLEMENTATION_ROADMAP.md) code sketches section.
