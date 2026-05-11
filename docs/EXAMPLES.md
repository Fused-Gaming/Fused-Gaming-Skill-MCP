# Examples and Use Cases

Real-world examples of using Fused Gaming MCP skills.

## Basic Usage: Generate Algorithmic Art

### Scenario

You want Claude to generate a p5.js sketch using the algorithmic-art skill.

### Setup

```bash
# Install
npm install @h4shed/mcp

# Initialize config
npx fused-gaming-mcp init

# Ensure algorithmic-art is enabled
npx fused-gaming-mcp list
```

### Using with Claude API

```javascript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-opus-4-20250514",
  max_tokens: 2048,
  tools: [
    {
      type: "use_mcp_tool",
      resource: {
        uri: "child_process://npm run dev --prefix /path/to/mcp",
        protocol: "stdio"
      }
    }
  ],
  messages: [
    {
      role: "user",
      content: "Generate a mandala pattern with 5 complexity using p5.js"
    }
  ]
});

console.log(response.content);
```

---

## Advanced: Building a Design System

### Scenario

Create a complete design system using theme-factory and frontend-design skills.

### Steps

```bash
# 1. Initialize
npx fused-gaming-mcp init
npx fused-gaming-mcp add theme-factory
npx fused-gaming-mcp add frontend-design
```

### Workflow with Claude

**Step 1: Generate Theme**

```
Claude: "Create a modern design theme named 'Ocean Blue' based on #0066CC"

Tool Call: generate-theme
  Input: { name: "Ocean Blue", baseColor: "#0066CC", format: "tailwind" }
  Output: Tailwind configuration with color palette
```

**Step 2: Generate Components**

```
Claude: "Create a card component that uses the Ocean Blue theme"

Tool Call: generate-component
  Input: { component: "card", framework: "react", variant: "elevated" }
  Output: React component with Tailwind classes
```

---

## Integration: Pre-Deployment Validation

### Scenario

Validate application readiness before deploying to production.

### Usage

```bash
npx fused-gaming-mcp add pre-deploy-validator
```

### Workflow

```
Claude: "Check if my app is ready for production"

Tool Call: validate-deployment
  Input: {
    checks: ["lint", "test", "build", "security"],
    environment: "production"
  }
  Output: {
    results: [
      { check: "lint", status: "passed" },
      { check: "test", status: "passed" },
      { check: "build", status: "passed" },
      { check: "security", status: "warning", message: "..." }
    ]
  }
```

---

## Custom: Building Your Own Skill

### Scenario

Create a custom "weather" skill to integrate with your Claude agent.

### Implementation

See [SKILLS_GUIDE.md](./SKILLS_GUIDE.md) → "Example: Weather Skill"

After creating:

```bash
# Add to config
npx fused-gaming-mcp add weather

# Use with Claude
```

---

## Real-World: Content Creator Workflow

### Setup

```bash
npx fused-gaming-mcp init
npx fused-gaming-mcp add algorithmic-art
npx fused-gaming-mcp add frontend-design
npx fused-gaming-mcp add canvas-design
npx fused-gaming-mcp add ascii-mockup
```

### Multi-Step Workflow

**1. Plan with mockups**
```
Claude: "Create a mobile app wireframe for a note-taking app"
→ ascii-mockup skill generates ASCII mockups
```

**2. Design visuals**
```
Claude: "Generate hero graphics for the landing page"
→ canvas-design skill creates SVG illustrations
```

**3. Build components**
```
Claude: "Create React components based on the mockups"
→ frontend-design skill generates component code
```

**4. Verify design**
```
Claude: "Generate visual preview of the design system"
→ algorithmic-art skill creates preview graphics
```

---

## Advanced: Local Skills

### Scenario

You have proprietary internal skills that shouldn't be published to npm.

### Setup

1. Create local skill directory:
```bash
mkdir local-skills
mkdir local-skills/internal-tool
cd local-skills/internal-tool
npm init -y
npm install @h4shed/mcp-core
```

2. Create your skill in `src/index.ts`

3. Update `.fused-gaming-mcp.json`:
```json
{
  "skills": {
    "enabled": ["algorithmic-art"],
    "custom": ["./local-skills/internal-tool"]
  }
}
```

4. Register in server:
```typescript
import { internalTool } from "./local-skills/internal-tool";
registry.registerSkill(internalTool);
```

---

## Debugging

### Enable Debug Logging

```json
{
  "logging": {
    "level": "debug"
  }
}
```

### Test Tool Manually

```typescript
import { myTool } from "@h4shed/skill-my-skill";

// Test directly
const result = await myTool.handler({ input: "test" });
console.log(result);
```

### Common Issues

**Tool not found:**
- Check `.fused-gaming-mcp.json` includes skill
- Verify skill exports correct tool name

**Skill initialization failed:**
- Check logs for error message
- Verify `initialize()` doesn't throw
- Check API keys if required

**Input validation errors:**
- Verify JSON schema in tool definition
- Check input matches required fields
- Use `console.log()` to debug handler

---

## Performance Tips

### 1. Lazy Load Skills

Only enable skills you're actively using:
```bash
npx fused-gaming-mcp remove unused-skill
```

### 2. Cache Results

For expensive operations, cache in skill state:
```typescript
class MySkill {
  private cache = new Map();
  
  async handler(input) {
    const key = JSON.stringify(input);
    if (this.cache.has(key)) return this.cache.get(key);
    
    const result = await expensiveOperation();
    this.cache.set(key, result);
    return result;
  }
}
```

### 3. Async/Await

Always use async/await, not callbacks:
```typescript
// ✅ Good
async handler(input) {
  const data = await fetch(...);
  return data.json();
}

// ❌ Bad (blocks event loop)
handler(input) {
  const data = fs.readFileSync(...);
  return data;
}
```

---

## Integration Patterns

### Pattern 1: Sequential Tasks

```
Tool A → Tool B → Tool C
(output of A feeds to B, etc.)
```

### Pattern 2: Parallel Execution

```
Tool A ─┐
        ├→ Combine Results
Tool B ─┘
```

### Pattern 3: Conditional Branching

```
Tool A → Check Result → Tool B or Tool C
```

### Pattern 4: Error Recovery

```
Try Tool A → If error, use Tool B as fallback
```

---

## Security Considerations

### 1. API Key Management

```json
{
  "auth": {
    "apiKeys": {
      "openai": "sk-...",
      "stripe": "sk_live_..."
    }
  }
}
```

Never commit API keys. Use environment variables:
```bash
export OPENAI_API_KEY="sk-..."
# Load in config from process.env
```

### 2. Input Validation

Always validate user input in tools:
```typescript
if (typeof input.text !== "string") {
  return { error: "text must be a string" };
}
```

### 3. Rate Limiting

Implement rate limiting for external APIs:
```typescript
const rateLimiter = new Map();

async handler(input) {
  const key = input.userId;
  const count = rateLimiter.get(key) || 0;
  
  if (count > 100) {
    return { error: "Rate limit exceeded" };
  }
  
  rateLimiter.set(key, count + 1);
  // ... continue
}
```

---

See [SKILLS_GUIDE.md](./SKILLS_GUIDE.md) for creating custom skills and [API_REFERENCE.md](./API_REFERENCE.md) for complete API documentation.
