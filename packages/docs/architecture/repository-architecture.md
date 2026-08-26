# Fused Gaming Skill MCP — Repository Architecture

> Repository: `Fused-Gaming/Fused-Gaming-Skill-MCP`  
> Package: `@h4shed/mcp`  
> Runtime: Node.js 20+ / TypeScript  
> Architecture: MCP Runtime + Skills + Tools + SyncPulse Multi-Agent Orchestration

## 1. High-Level Repository Architecture

```mermaid
flowchart TB

    subgraph CLIENTS["AI Clients & Consumers"]
        Claude["Claude Desktop / Claude Code"]
        ChatGPT["ChatGPT / MCP Clients"]
        Dev["Developers / Applications"]
        Agents["Autonomous Agents / Swarms"]
    end

    subgraph ACCESS["MCP Access Layer"]
        Config[".mcp.json"]
        Local["Local MCP Server"]
        SyncAPI["sync.vln.gg/mcp<br/>Sync Coordinator"]
        SkillAPI["skill.vln.gg/mcp<br/>Skill Repository"]
    end

    subgraph CORE["packages/core — MCP Runtime"]
        Server["MCP Server"]
        Registry["Skill Registry"]
        ToolRegistry["Tool Registry"]
        Engine["Execution Engine"]
        Auth["Authentication / Validation"]
        Events["Coordination Event Bus"]
        SyncServer["Sync Coordinator Server"]
        SkillServer["Skill Repository Server"]
    end

    subgraph ORCH["SyncPulse — Orchestration Control Plane"]
        SyncPulse["SyncPulse"]
        Queue["Task Queue / Scheduler"]
        Coordinator["Agent Coordinator"]
        Balance["Work-Stealing / Load Balancing"]
        JobBus["Cross-Agent Job Bus"]
        Router["Capability / Provider Router"]
        Hub["SyncPulse Hub"]
        Monitor["Health / Performance"]
    end

    subgraph CAP["Capability Plane"]
        Skills["AI Skills<br/>packages/skills/*"]
        Tools["Specialized Tools"]
    end

    subgraph PROVIDERS["Execution Providers"]
        ClaudeWorker["Claude Runtime<br/>planning · swarm orchestration"]
        CodexWorker["Codex Runtime<br/>mockups · image processing"]
        GenericWorker["Other MCP / Agent Runtime"]
    end

    subgraph SUPPORT["Supporting Packages"]
        Tokens["design-tokens"]
        CLI["cli"]
        Web["web"]
        Docs["docs"]
        License["license-client"]
        Bench["benchmark-utils"]
    end

    CLIENTS --> Config
    Config --> Local
    Config --> SyncAPI
    Config --> SkillAPI

    Local --> Server
    SyncAPI --> SyncServer
    SkillAPI --> SkillServer

    Server --> Registry
    Server --> ToolRegistry
    Server --> Engine
    SyncServer --> Auth
    SyncServer --> Events
    SyncServer --> Engine
    SkillServer --> Auth
    SkillServer --> Registry
    SkillServer --> ToolRegistry
    SkillServer --> Engine

    Engine --> SyncPulse
    Events --> SyncPulse

    SyncPulse --> Queue
    SyncPulse --> Coordinator
    SyncPulse --> Balance
    SyncPulse --> JobBus
    JobBus --> Router
    SyncPulse --> Hub
    Hub --> Monitor

    Router --> ClaudeWorker
    Router --> CodexWorker
    Router --> GenericWorker

    ClaudeWorker --> Skills
    CodexWorker --> Skills
    GenericWorker --> Skills
    Skills --> Tools

    Skills --> Tokens
    CORE --> License
    Registry --> CLI
    Hub --> Web
    Docs -. documents .-> CORE
    Docs -. documents .-> Skills
    Docs -. documents .-> Tools
    Bench --> Monitor
```

## 2. Logical Layer Model

```mermaid
flowchart TB
    L1["Layer 1 — Consumers<br/>Claude · ChatGPT · Developers · Agent Swarms"]
    L2["Layer 2 — MCP Interface<br/>Local MCP · sync.vln.gg · skill.vln.gg"]
    L3["Layer 3 — Core Runtime<br/>Protocol · Registry · Execution · Auth · Events"]
    L4A["Layer 4A — Capability Plane<br/>Skills · Tools"]
    L4B["Layer 4B — Control Plane<br/>SyncPulse · Scheduler · Swarms · Cross-Agent Jobs"]
    L4C["Layer 4C — Provider Plane<br/>Capability Routing · Runtime Adapters · Workers"]
    L5["Layer 5 — Platform Services<br/>CLI · Web · Design Tokens · Licensing · Docs"]
    L6["Layer 6 — Delivery<br/>Testing · Benchmarks · npm · Docker · CI/CD"]

    L1 --> L2
    L2 --> L3
    L3 --> L4A
    L3 --> L4B
    L4B <--> L4A
    L4B --> L4C
    L4C --> L4A
    L4A --> L5
    L4B --> L5
    L4C --> L5
    L5 --> L6
    L6 -. published packages .-> L1
    L6 -. deployed MCP endpoints .-> L2
```

## 3. Core MCP Request Flow

```mermaid
sequenceDiagram
    autonumber
    participant C as MCP Client
    participant G as MCP Server
    participant R as Registry
    participant E as Execution Engine
    participant P as SyncPulse
    participant J as Cross-Agent Job Bus
    participant PR as Provider Router
    participant W as Worker Runtime

    C->>G: MCP Request
    G->>R: Discover capability
    R-->>G: Skill / Tool metadata
    G->>E: Execute request

    alt Direct Tool or Skill
        E-->>G: Direct execution result
    else Multi-Agent / Cross-Runtime Task
        E->>P: Submit coordinated task
        P->>J: Create durable job
        J->>PR: Resolve capability requirements
        PR->>W: Dispatch / make job claimable
        W-->>J: Result + artifact manifest
        J-->>P: Completion event
        P-->>E: Aggregated result
    end

    E-->>G: Execution result
    G-->>C: MCP Response
```

## 4. SyncPulse Multi-Agent Architecture

```mermaid
flowchart TB
    Request["Incoming Complex Task"] --> Sync["SyncPulse Coordinator"]
    Sync --> Planner["Task Planning"]
    Planner --> Queue["Task Queue"]
    Queue --> Scheduler["Scheduler"]
    Scheduler --> Balance["Work-Stealing / Load Balancer"]
    Sync --> JobBus["Cross-Agent Job Bus"]
    JobBus --> Router["Capability / Provider Router"]

    subgraph SWARM["Agent Swarm"]
        A1["Agent 1"]
        A2["Agent 2"]
        AN["Agent N"]
    end

    subgraph PROVIDERS["External / Specialized Runtimes"]
        Claude["Claude Adapter"]
        Codex["Codex Adapter"]
        Other["Generic Adapter"]
    end

    Balance --> A1
    Balance --> A2
    Balance --> AN

    Router --> Claude
    Router --> Codex
    Router --> Other

    A1 --> Sync
    A2 --> Sync
    AN --> Sync
    Claude --> JobBus
    Codex --> JobBus
    Other --> JobBus

    JobBus --> Result["Aggregated Result / Artifact Manifest"]
    Sync --> Result
```

## 5. Control Plane vs Capability Plane vs Provider Plane

The repository can be modeled as three operational planes.

### Control Plane

SyncPulse determines what work should execute, when it should execute, how work is synchronized, and how work is redistributed. The cross-agent job bus belongs here because it owns durable task state, claims, leases, retries, completion events, and provenance.

### Capability Plane

The MCP Core, Skill Registry, Tool Registry, Skills, and Tools determine what capabilities exist and how they execute.

### Provider Plane

The provider plane maps capability requirements onto an execution runtime. Claude, Codex, ChatGPT-compatible runtimes, local agents, and future workers are providers rather than architectural layers themselves.

```mermaid
flowchart LR
    Intent["Task Intent"] --> Sync["SyncPulse"]
    Sync --> Job["CrossAgentJob"]
    Job --> Requirements["Capability Requirements"]
    Requirements --> Router["Provider Router"]
    Router --> Claude["Claude Runtime"]
    Router --> Codex["Codex Runtime"]
    Router --> Other["Other Runtime"]
    Claude --> Result["Result + Artifacts"]
    Codex --> Result
    Other --> Result
    Result --> Sync
```

## 6. Cross-Agent Job Protocol

The cross-agent protocol is a reusable SyncPulse control-plane primitive for delegating work across model and runtime boundaries.

### Job lifecycle

```text
pending -> claimed -> running -> completed
                  \-> failed -> retryable -> pending
                  \-> expired -> pending
```

### Core operations

```text
submitJob()
claimJob()
heartbeatJob()
completeJob()
failJob()
releaseExpiredClaims()
watchJobs()
```

### Canonical job contract

```json
{
  "id": "job_01...",
  "workflowId": "design-fulfillment",
  "status": "pending",
  "capabilities": ["visual-mockup", "image-processing"],
  "preferredProviders": ["codex"],
  "inputs": [],
  "instructions": "Generate mobile product-card variants.",
  "acceptanceCriteria": [],
  "artifacts": [],
  "claim": null,
  "provenance": {
    "createdBy": "syncpulse",
    "project": "hiramsbunker"
  }
}
```

The protocol must remain provider-neutral. Project profiles may prefer a provider, but SyncPulse routes by capability and availability.

## 7. Transport Architecture

Cross-agent jobs use a durable transport adapter. The first implementation is filesystem-backed so project repositories can exchange jobs through versioned files, but the protocol is transport-neutral.

```mermaid
flowchart TB
    Job["CrossAgentJob"] --> T["JobTransport"]
    T --> FS["FilesystemTransport<br/>.codex/jobs / .syncpulse/jobs"]
    T --> HTTP["HTTP / sync.vln.gg"]
    T --> MCP["MCP Transport"]
    T --> Queue["Queue / DB Transport"]
    T --> Git["Git / PR Transport"]
```

Project-local `.codex/jobs` directories are therefore an adapter/projection of SyncPulse state, not the SyncPulse architecture itself.

## 8. Design Fulfillment Reference Workflow

```mermaid
flowchart LR
    U["Design request"] --> P["SyncPulse planner"]
    P --> J1["Planning / parallelization capability"]
    P --> J2["Mockup / image capability"]

    J1 --> R1["Provider Router"]
    J2 --> R2["Provider Router"]

    R1 --> C["Claude runtime"]
    R2 --> X["Codex runtime"]

    C --> Impl["Implementation / QA tasks"]
    X --> Art["PNG / SVG / mockup artifacts"]

    Impl --> Merge["Validation / aggregation"]
    Art --> Merge
    Merge --> Git["Git / CI / deployment"]
```

The initial Hiram's Bunker profile prefers Claude for planning and multi-agent containerization and Codex for rapid mockups and image processing. This preference is configuration, not a core protocol rule.

## 9. Repository Responsibility Map — Cross-Agent Additions

```text
packages/
├── core/
│   └── MCP runtime / registry / execution
├── skills/
│   └── syncpulse/
│       └── src/
│           └── jobs/
│               ├── types.ts
│               ├── transport.ts
│               ├── filesystem-transport.ts
│               ├── router.ts
│               └── index.ts
├── docs/
│   └── architecture/
│       └── repository-architecture.md
└── ...
```

## 10. Architectural Formula

```text
Fused Gaming MCP
=
MCP Runtime
+ Capability Registry
+ Skill Ecosystem
+ Tool Ecosystem
+ SyncPulse Control Plane
+ Cross-Agent Job Protocol
+ Provider Runtime Adapters
+ Agent Swarms
+ Artifact Transport
+ Supporting Platform Packages
+ Quality / Benchmark Infrastructure
+ npm Distribution
+ Remote MCP Deployment
```

The resulting execution chain is:

```text
User Intent
    ↓
MCP Client / Project Workflow
    ↓
MCP Transport
    ↓
Core Runtime
    ↓
Capability Discovery
    ↓
SyncPulse Planning / Direct Execution
    ↓
Cross-Agent Job (when required)
    ↓
Capability + Provider Resolution
    ↓
Worker Runtime
    ↓
Skill / Tool Execution
    ↓
Artifacts + Provenance
    ↓
Validation / Aggregation
    ↓
MCP Response / Project Delivery
```
