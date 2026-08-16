# MCP Connectors API Reference

Complete API reference for sync.vln.gg/mcp and skill.vln.gg/mcp endpoints.

## Base URLs

```
Sync Coordinator:  https://sync.vln.gg/mcp
Skill Repository:  https://skill.vln.gg/mcp
```

## Authentication

All requests require Bearer token authentication:

```http
Authorization: Bearer <API_KEY>
```

### Example

```bash
curl -H "Authorization: Bearer sk-sync-abc123..." \
  https://sync.vln.gg/mcp/health
```

## Sync Coordinator API

### Health Check

**GET** `/mcp/health`

Check server health and status.

**Request:**
```bash
curl -H "Authorization: Bearer ${SYNC_MCP_API_KEY}" \
  https://sync.vln.gg/mcp/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "sync-coordinator-mcp",
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### Sync Tasks

**POST** `/mcp/tasks/sync`

Submit a task for synchronization across agents.

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer ${SYNC_MCP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task-123",
    "type": "sync",
    "payload": {"data": "..."},
    "agentId": "agent-1",
    "priority": "normal"
  }' \
  https://sync.vln.gg/mcp/tasks/sync
```

**Parameters:**
- `taskId` (string, required): Unique task identifier
- `type` (string, required): Task type - `sync`, `coordinate`, or `workflow-state`
- `payload` (object, required): Task payload
- `agentId` (string, optional): Agent ID
- `priority` (string, optional): Priority level - `low`, `normal`, `high`

**Response (200 OK):**
```json
{
  "success": true,
  "taskId": "task-123",
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### Get Sync Status

**GET** `/mcp/sync/status`

Get current synchronization status and metrics.

**Request:**
```bash
curl -H "Authorization: Bearer ${SYNC_MCP_API_KEY}" \
  https://sync.vln.gg/mcp/sync/status
```

**Response (200 OK):**
```json
{
  "pendingTasks": 5,
  "eventQueueSize": 42,
  "uptime": 3600.5,
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### Get Task by ID

**GET** `/mcp/tasks/:taskId`

Retrieve a specific task by ID.

**Request:**
```bash
curl -H "Authorization: Bearer ${SYNC_MCP_API_KEY}" \
  https://sync.vln.gg/mcp/tasks/task-123
```

**Response (200 OK):**
```json
{
  "taskId": "task-123",
  "type": "sync",
  "payload": {"data": "..."},
  "agentId": "agent-1",
  "priority": "normal"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Task not found"
}
```

---

### Publish Coordination Event

**POST** `/mcp/events/publish`

Publish an event to the coordination event bus.

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer ${SYNC_MCP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "agent-ready",
    "agentId": "agent-1",
    "data": {"status": "ready"}
  }' \
  https://sync.vln.gg/mcp/events/publish
```

**Parameters:**
- `type` (string, required): Event type
- `agentId` (string, required): Agent ID
- `data` (object, optional): Event data

**Response (200 OK):**
```json
{
  "success": true,
  "eventId": "agent-1-1692194400000",
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### Get Coordination Events

**GET** `/mcp/events`

Retrieve coordination events with optional filtering.

**Query Parameters:**
- `agentId` (string, optional): Filter by agent ID
- `limit` (number, optional): Max events to return (default: 100, max: 1000)

**Request:**
```bash
curl -H "Authorization: Bearer ${SYNC_MCP_API_KEY}" \
  'https://sync.vln.gg/mcp/events?agentId=agent-1&limit=50'
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "type": "agent-ready",
      "agentId": "agent-1",
      "timestamp": 1692194400000,
      "data": {"status": "ready"}
    }
  ],
  "total": 150,
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### List Tools

**GET** `/mcp/tools`

List all available coordination tools.

**Request:**
```bash
curl -H "Authorization: Bearer ${SYNC_MCP_API_KEY}" \
  https://sync.vln.gg/mcp/tools
```

**Response (200 OK):**
```json
{
  "tools": [
    {
      "name": "sync-tasks",
      "description": "Synchronize task execution across agents"
    },
    {
      "name": "coordinate-agents",
      "description": "Coordinate actions between multiple agents"
    },
    {
      "name": "manage-workflow-state",
      "description": "Manage and track workflow state"
    },
    {
      "name": "publish-coordination-event",
      "description": "Publish coordination events to the bus"
    },
    {
      "name": "subscribe-to-events",
      "description": "Subscribe to coordination events"
    },
    {
      "name": "get-sync-status",
      "description": "Get current synchronization status"
    }
  ]
}
```

---

## Skill Repository API

### Health Check

**GET** `/mcp/health`

Check server health and status.

**Request:**
```bash
curl -H "Authorization: Bearer ${SKILL_MCP_API_KEY}" \
  https://skill.vln.gg/mcp/health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "skill-repository-mcp",
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### List Skills

**GET** `/mcp/skills`

Get all registered skills.

**Request:**
```bash
curl -H "Authorization: Bearer ${SKILL_MCP_API_KEY}" \
  https://skill.vln.gg/mcp/skills
```

**Response (200 OK):**
```json
{
  "skills": [
    {
      "name": "design-system",
      "version": "1.0.0",
      "description": "UI design system skills",
      "tags": ["design", "ui"],
      "toolCount": 5
    },
    {
      "name": "workflow-automation",
      "version": "1.0.0",
      "description": "Workflow automation tools",
      "tags": ["automation"],
      "toolCount": 3
    }
  ],
  "total": 2,
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### Get Skill

**GET** `/mcp/skills/:skillName`

Get details for a specific skill.

**Request:**
```bash
curl -H "Authorization: Bearer ${SKILL_MCP_API_KEY}" \
  https://skill.vln.gg/mcp/skills/design-system
```

**Response (200 OK):**
```json
{
  "name": "design-system",
  "version": "1.0.0",
  "description": "UI design system skills",
  "author": "Fused Gaming",
  "license": "Apache-2.0",
  "tags": ["design", "ui"],
  "toolCount": 5
}
```

**Response (404 Not Found):**
```json
{
  "error": "Skill not found"
}
```

---

### Search Skills

**GET** `/mcp/skills/search`

Search skills by query or tags.

**Query Parameters:**
- `q` (string, optional): Search query
- `tag` (string, optional): Filter by tag

**Request:**
```bash
curl -H "Authorization: Bearer ${SKILL_MCP_API_KEY}" \
  'https://skill.vln.gg/mcp/skills/search?q=design&tag=ui'
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "name": "design-system",
      "version": "1.0.0",
      "description": "UI design system skills",
      "toolCount": 5
    }
  ],
  "total": 1,
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### Register Skill

**POST** `/mcp/skills/register`

Register a new skill.

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer ${SKILL_MCP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-skill",
    "version": "1.0.0",
    "description": "My custom skill",
    "author": "Developer",
    "license": "MIT",
    "tags": ["custom", "tools"]
  }' \
  https://skill.vln.gg/mcp/skills/register
```

**Parameters:**
- `name` (string, required): Skill name
- `version` (string, required): Version (semantic versioning)
- `description` (string, required): Skill description
- `author` (string, optional): Author name
- `license` (string, optional): License type
- `tags` (array, optional): Tags

**Response (200 OK):**
```json
{
  "success": true,
  "skill": {
    "name": "my-skill",
    "version": "1.0.0",
    "description": "My custom skill",
    "author": "Developer",
    "license": "MIT",
    "tags": ["custom", "tools"],
    "toolCount": 0
  },
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### List Tools

**GET** `/mcp/tools`

List all available tools.

**Query Parameters:**
- `skill` (string, optional): Filter by skill name

**Request:**
```bash
curl -H "Authorization: Bearer ${SKILL_MCP_API_KEY}" \
  'https://skill.vln.gg/mcp/tools?skill=design-system'
```

**Response (200 OK):**
```json
{
  "tools": [
    {
      "name": "generate-theme",
      "description": "Generate design theme",
      "skillName": "design-system",
      "inputSchema": {...}
    }
  ],
  "total": 1,
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### Get Tool

**GET** `/mcp/tools/:toolName`

Get details for a specific tool.

**Request:**
```bash
curl -H "Authorization: Bearer ${SKILL_MCP_API_KEY}" \
  https://skill.vln.gg/mcp/tools/generate-theme
```

**Response (200 OK):**
```json
{
  "name": "generate-theme",
  "description": "Generate design theme",
  "skillName": "design-system",
  "inputSchema": {
    "type": "object",
    "properties": {
      "colors": {"type": "array"},
      "name": {"type": "string"}
    }
  }
}
```

---

### Search Tools

**GET** `/mcp/tools/search`

Search tools by query.

**Query Parameters:**
- `q` (string, optional): Search query
- `skill` (string, optional): Filter by skill name

**Request:**
```bash
curl -H "Authorization: Bearer ${SKILL_MCP_API_KEY}" \
  'https://skill.vln.gg/mcp/tools/search?q=generate'
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "name": "generate-theme",
      "description": "Generate design theme",
      "skillName": "design-system"
    }
  ],
  "total": 1,
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### Register Tool

**POST** `/mcp/tools/register`

Register a new tool.

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer ${SKILL_MCP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-tool",
    "description": "My custom tool",
    "skillName": "my-skill",
    "inputSchema": {
      "type": "object",
      "properties": {"param": {"type": "string"}}
    }
  }' \
  https://skill.vln.gg/mcp/tools/register
```

**Response (200 OK):**
```json
{
  "success": true,
  "tool": {
    "name": "my-tool",
    "description": "My custom tool",
    "skillName": "my-skill",
    "inputSchema": {...}
  },
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### Execute Skill

**POST** `/mcp/skills/:skillName/execute`

Execute a tool from a skill.

**Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer ${SKILL_MCP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "generate-theme",
    "input": {"colors": ["#FF0000", "#00FF00"], "name": "vibrant"}
  }' \
  https://skill.vln.gg/mcp/skills/design-system/execute
```

**Response (200 OK):**
```json
{
  "success": true,
  "skillName": "design-system",
  "tool": "generate-theme",
  "result": {"message": "Tool execution started"},
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

### Get Metadata

**GET** `/mcp/metadata/skills`

Get aggregate metadata for all registered skills.

**Request:**
```bash
curl -H "Authorization: Bearer ${SKILL_MCP_API_KEY}" \
  https://skill.vln.gg/mcp/metadata/skills
```

**Response (200 OK):**
```json
{
  "availableSkills": [
    {"name": "design-system", "version": "1.0.0"},
    {"name": "workflow-automation", "version": "1.0.0"}
  ],
  "totalSkills": 2,
  "totalTools": 8,
  "timestamp": "2026-08-16T10:30:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required parameter: taskId"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error: <details>"
}
```

---

## Response Headers

All responses include:
```
Content-Type: application/json
Cache-Control: no-cache
X-Request-ID: unique-request-id
```

---

## Rate Limiting

- Default: 30 requests per second
- Burst capacity: 50 requests
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Unix timestamp of reset time

---

## Streaming with SSE

Server-Sent Events for real-time data:

```bash
curl -H "Authorization: Bearer ${SYNC_MCP_API_KEY}" \
  -H "Accept: text/event-stream" \
  https://sync.vln.gg/mcp
```

Event format:
```
data: {"type":"event-type","data":{...}}

```

---

## Version History

- **1.0.0** (2026-08-16): Initial release
  - Sync Coordinator API
  - Skill Repository API
  - SSE streaming support

---

## Support

For API issues or questions:
1. Check the troubleshooting guide in MCP-CONNECTORS-SETUP.md
2. Review server logs
3. Contact support at support@vln.gg
