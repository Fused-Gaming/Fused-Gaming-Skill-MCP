#!/usr/bin/env node
/**
 * Auto Memory Bridge Hook (ADR-048/049)
 *
 * Wires AutoMemoryBridge + LearningBridge + MemoryGraph into Claude Code
 * session lifecycle. Called by settings.json SessionStart/SessionEnd hooks.
 *
 * Usage:
 *   node auto-memory-hook.mjs import   # SessionStart: import auto memory files into backend
 *   node auto-memory-hook.mjs sync     # SessionEnd: sync insights back to MEMORY.md
 *   node auto-memory-hook.mjs status   # Show bridge status
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '../..');
const DATA_DIR = join(PROJECT_ROOT, '.claude-flow', 'data');
const STORE_PATH = join(DATA_DIR, 'auto-memory-store.json');

// Colors
const GREEN = '\x1b[0;32m';
const CYAN = '\x1b[0;36m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const log = (msg) => console.log(`${CYAN}[AutoMemory] ${msg}${RESET}`);
const success = (msg) => console.log(`${GREEN}[AutoMemory] ✓ ${msg}${RESET}`);
const dim = (msg) => console.log(`  ${DIM}${msg}${RESET}`);

// Ensure data dir
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

// ============================================================================
// Simple JSON File Backend (implements IMemoryBackend interface)
// ============================================================================

class JsonFileBackend {
  constructor(filePath) {
    this.filePath = filePath;
    this.entries = new Map();
  }

  async initialize() {
    if (existsSync(this.filePath)) {
      try {
        const data = JSON.parse(readFileSync(this.filePath, 'utf-8'));
        if (Array.isArray(data)) {
          for (const entry of data) this.entries.set(entry.id, entry);
        }
      } catch { /* start fresh */ }
    }
  }

  async shutdown() { this._persist(); }
  async store(entry) { this.entries.set(entry.id, entry); this._persist(); }
  async get(id) { return this.entries.get(id) ?? null; }
  async getByKey(key, ns) {
    for (const e of this.entries.values()) {
      if (e.key === key && (!ns || e.namespace === ns)) return e;
    }
    return null;
  }
  async update(id, updates) {
    const e = this.entries.get(id);
    if (!e) return null;
    if (updates.metadata) Object.assign(e.metadata, updates.metadata);
    if (updates.content !== undefined) e.content = updates.content;
    if (updates.tags) e.tags = updates.tags;
    e.updatedAt = Date.now();
    this._persist();
    return e;
  }
  async delete(id) { return this.entries.delete(id); }
  async query(opts) {
    let results = [...this.entries.values()];
    if (opts?.namespace) results = results.filter(e => e.namespace === opts.namespace);
    if (opts?.type) results = results.filter(e => e.type === opts.type);
    if (opts?.limit) results = results.slice(0, opts.limit);
    return results;
  }
  async search() { return []; } // No vector search in JSON backend
  async bulkInsert(entries) { for (const e of entries) this.entries.set(e.id, e); this._persist(); }
  async bulkDelete(ids) { let n = 0; for (const id of ids) { if (this.entries.delete(id)) n++; } this._persist(); return n; }
  async count() { return this.entries.size; }
  async listNamespaces() {
    const ns = new Set();
    for (const e of this.entries.values()) ns.add(e.namespace || 'default');
    return [...ns];
  }
  async clearNamespace(ns) {
    let n = 0;
    for (const [id, e] of this.entries) {
      if (e.namespace === ns) { this.entries.delete(id); n++; }
    }
    this._persist();
    return n;
  }
  async getStats() {
    return {
      totalEntries: this.entries.size,
      entriesByNamespace: {},
      entriesByType: { semantic: 0, episodic: 0, procedural: 0, working: 0, cache: 0 },
      memoryUsage: 0, avgQueryTime: 0, avgSearchTime: 0,
    };
  }
  async healthCheck() {
    return {
      status: 'healthy',
      components: {
        storage: { status: 'healthy', latency: 0 },
        index: { status: 'healthy', latency: 0 },
        cache: { status: 'healthy', latency: 0 },
      },
      timestamp: Date.now(), issues: [], recommendations: [],
    };
  }

  _persist() {
    try {
      writeFileSync(this.filePath, JSON.stringify([...this.entries.values()], null, 2), 'utf-8');
    } catch { /* best effort */ }
  }
}

// ============================================================================
// Resolve memory package path (local dev or npm installed)
// ============================================================================

async function loadMemoryPackage() {
  // Strategy 1: Local dev (built dist)
  const localDist = join(PROJECT_ROOT, 'v3/@claude-flow/memory/dist/index.js');
  if (existsSync(localDist)) {
    try {
      return await import(`file://${localDist}`);
    } catch { /* fall through */ }
  }

  // Strategy 2: Use createRequire for CJS-style resolution (handles nested node_modules
  // when installed as a transitive dependency via npx ruflo / npx claude-flow)
  try {
    const { createRequire } = await import('module');
    const require = createRequire(join(PROJECT_ROOT, 'package.json'));
    return require('@claude-flow/memory');
  } catch { /* fall through */ }

  // Strategy 3: ESM import (works when @claude-flow/memory is a direct dependency)
  try {
    return await import('@claude-flow/memory');
  } catch { /* fall through */ }

  // Strategy 4: Walk up from PROJECT_ROOT looking for @claude-flow/memory in any node_modules
  let searchDir = PROJECT_ROOT;
  const { parse } = await import('path');
  while (searchDir !== parse(searchDir).root) {
    const candidate = join(searchDir, 'node_modules', '@claude-flow', 'memory', 'dist', 'index.js');
    if (existsSync(candidate)) {
      try {
        return await import(`file://${candidate}`);
      } catch { /* fall through */ }
    }
    searchDir = dirname(searchDir);
  }

  return null;
}

// ============================================================================
// Read config from .claude-flow/config.yaml
// ============================================================================

function readConfig() {
  const configPath = join(PROJECT_ROOT, '.claude-flow', 'config.yaml');
  const defaults = {
    learningBridge: { enabled: true, sonaMode: 'balanced', confidenceDecayRate: 0.005, accessBoostAmount: 0.03, consolidationThreshold: 10 },
    memoryGraph: { enabled: true, pageRankDamping: 0.85, maxNodes: 5000, similarityThreshold: 0.8 },
    agentScopes: { enabled: true, defaultScope: 'project' },
  };

  if (!existsSync(configPath)) return defaults;

  try {
    const yaml = readFileSync(configPath, 'utf-8');
    // Simple YAML parser for the memory section
    const getBool = (key) => {
      const match = yaml.match(new RegExp(`${key}:\\s*(true|false)`, 'i'));
      return match ? match[1] === 'true' : undefined;
    };

    const lbEnabled = getBool('learningBridge[\\s\\S]*?enabled');
    if (lbEnabled !== undefined) defaults.learningBridge.enabled = lbEnabled;

    const mgEnabled = getBool('memoryGraph[\\s\\S]*?enabled');
    if (mgEnabled !== undefined) defaults.memoryGraph.enabled = mgEnabled;

    const asEnabled = getBool('agentScopes[\\s\\S]*?enabled');
    if (asEnabled !== undefined) defaults.agentScopes.enabled = asEnabled;

    return defaults;
  } catch {
    return defaults;
  }
}

// ============================================================================
// Commands
// ============================================================================

async function doImport() {
  log('Importing auto memory files into bridge...');

  const memPkg = await loadMemoryPackage();
  if (!memPkg || !memPkg.AutoMemoryBridge) {
    dim('Memory package not available — skipping auto memory import');
    return;
  }

  const config = readConfig();
  const backend = new JsonFileBackend(STORE_PATH);
  await backend.initialize();

  const bridgeConfig = {
    workingDir: PROJECT_ROOT,
    syncMode: 'on-session-end',
  };

  // Wire learning if enabled and available
  if (config.learningBridge.enabled && memPkg.LearningBridge) {
    bridgeConfig.learning = {
      sonaMode: config.learningBridge.sonaMode,
      confidenceDecayRate: config.learningBridge.confidenceDecayRate,
      accessBoostAmount: config.learningBridge.accessBoostAmount,
      consolidationThreshold: config.learningBridge.consolidationThreshold,
    };
  }

  // Wire graph if enabled and available
  if (config.memoryGraph.enabled && memPkg.MemoryGraph) {
    bridgeConfig.graph = {
      pageRankDamping: config.memoryGraph.pageRankDamping,
      maxNodes: config.memoryGraph.maxNodes,
      similarityThreshold: config.memoryGraph.similarityThreshold,
    };
  }

  const bridge = new memPkg.AutoMemoryBridge(backend, bridgeConfig);

  try {
    const result = await bridge.importFromAutoMemory();
    success(`Imported ${result.imported} entries (${result.skipped} skipped)`);
    dim(`├─ Backend entries: ${await backend.count()}`);
    dim(`├─ Learning: ${config.learningBridge.enabled ? 'active' : 'disabled'}`);
    dim(`├─ Graph: ${config.memoryGraph.enabled ? 'active' : 'disabled'}`);
    dim(`└─ Agent scopes: ${config.agentScopes.enabled ? 'active' : 'disabled'}`);

    // Bridge to AgentDB: store entries with ONNX vector embeddings for semantic search
    let vectorized = 0;
    try {
      const cliDistPath = join(PROJECT_ROOT, 'v3/@claude-flow/cli/dist/src/memory/memory-initializer.js');
      if (existsSync(cliDistPath)) {
        const memInit = await import(`file://${cliDistPath}`);
        await memInit.initializeMemoryDatabase({ force: false, verbose: false });

        const entries = await backend.query({});
        for (const entry of entries) {
          if (!entry.content || entry.content.length < 10) continue;
          try {
            await memInit.storeEntry({
              key: entry.key || entry.id,
              value: entry.content,
              namespace: entry.namespace || 'auto-memory',
              generateEmbeddingFlag: true,
            });
            vectorized++;
          } catch { /* skip entries that fail to embed */ }
        }

        if (vectorized > 0) {
          success(`Vectorized ${vectorized} entries into AgentDB (ONNX 384-dim)`);
        }
      }
    } catch (vecErr) {
      dim(`AgentDB vectorization skipped: ${vecErr.message?.slice(0, 60)}`);
    }
  } catch (err) {
    dim(`Import failed (non-critical): ${err.message}`);
  }

  await backend.shutdown();
}

async function doSync() {
  log('Syncing insights to auto memory files...');

  const memPkg = await loadMemoryPackage();
  if (!memPkg || !memPkg.AutoMemoryBridge) {
    dim('Memory package not available — skipping sync');
    return;
  }

  const config = readConfig();
  const backend = new JsonFileBackend(STORE_PATH);
  await backend.initialize();

  const entryCount = await backend.count();
  if (entryCount === 0) {
    dim('No entries to sync');
    await backend.shutdown();
    return;
  }

  const bridgeConfig = {
    workingDir: PROJECT_ROOT,
    syncMode: 'on-session-end',
  };

  if (config.learningBridge.enabled && memPkg.LearningBridge) {
    bridgeConfig.learning = {
      sonaMode: config.learningBridge.sonaMode,
      confidenceDecayRate: config.learningBridge.confidenceDecayRate,
      consolidationThreshold: config.learningBridge.consolidationThreshold,
    };
  }

  if (config.memoryGraph.enabled && memPkg.MemoryGraph) {
    bridgeConfig.graph = {
      pageRankDamping: config.memoryGraph.pageRankDamping,
      maxNodes: config.memoryGraph.maxNodes,
    };
  }

  const bridge = new memPkg.AutoMemoryBridge(backend, bridgeConfig);

  try {
    const syncResult = await bridge.syncToAutoMemory();
    success(`Synced ${syncResult.synced} entries to auto memory`);
    dim(`├─ Categories updated: ${syncResult.categories?.join(', ') || 'none'}`);
    dim(`└─ Backend entries: ${entryCount}`);

    // Curate MEMORY.md index with graph-aware ordering
    await bridge.curateIndex();
    success('Curated MEMORY.md index');

    // Flush intelligence patterns to disk (SONA + ReasoningBank)
    try {
      const intPath = join(PROJECT_ROOT, 'v3/@claude-flow/cli/dist/src/memory/intelligence.js');
      if (existsSync(intPath)) {
        const intelligence = await import(`file://${intPath}`);
        if (intelligence.flushPatterns) {
          intelligence.flushPatterns();
          const stats = intelligence.getIntelligenceStats?.();
          if (stats && stats.patternsLearned > 0) {
            success(`Flushed ${stats.patternsLearned} learned patterns to disk`);
          }
        }
      }
    } catch { /* non-critical */ }
  } catch (err) {
    dim(`Sync failed (non-critical): ${err.message}`);
  }

  if (bridge.destroy) bridge.destroy();
  await backend.shutdown();
}

async function doStatus() {
  const memPkg = await loadMemoryPackage();
  const config = readConfig();

  console.log('\n=== Auto Memory Bridge Status ===\n');
  console.log(`  Package:        ${memPkg ? '✅ Available' : '❌ Not found'}`);
  console.log(`  Store:          ${existsSync(STORE_PATH) ? '✅ ' + STORE_PATH : '⏸ Not initialized'}`);
  console.log(`  LearningBridge: ${config.learningBridge.enabled ? '✅ Enabled' : '⏸ Disabled'}`);
  console.log(`  MemoryGraph:    ${config.memoryGraph.enabled ? '✅ Enabled' : '⏸ Disabled'}`);
  console.log(`  AgentScopes:    ${config.agentScopes.enabled ? '✅ Enabled' : '⏸ Disabled'}`);

  if (existsSync(STORE_PATH)) {
    try {
      const data = JSON.parse(readFileSync(STORE_PATH, 'utf-8'));
      console.log(`  Entries:        ${Array.isArray(data) ? data.length : 0}`);
    } catch { /* ignore */ }
  }

  // AgentDB vector status
  try {
    const dbPath = join(PROJECT_ROOT, '.claude-flow', 'memory', 'memory.db');
    const swarmDbPath = join(PROJECT_ROOT, '.swarm', 'memory.db');
    const hasDb = existsSync(dbPath) || existsSync(swarmDbPath);
    console.log(`  AgentDB:        ${hasDb ? '✅ sql.js database exists' : '⏸ Not initialized'}`);

    const intPath = join(PROJECT_ROOT, 'v3/@claude-flow/cli/dist/src/memory/intelligence.js');
    if (existsSync(intPath)) {
      const intelligence = await import(`file://${intPath}`);
      const stats = intelligence.getIntelligenceStats?.();
      if (stats) {
        console.log(`  SONA:           ${stats.sonaEnabled ? '✅ Active' : '⏸ Not initialized'}`);
        console.log(`  Patterns:       ${stats.patternsLearned} learned`);
        console.log(`  Trajectories:   ${stats.trajectoriesRecorded} recorded`);
      }
    }
  } catch { /* ignore */ }

  console.log('');
}

// ============================================================================
// Import ALL Claude Code memories from all projects into AgentDB
// ============================================================================

async function doImportAll() {
  log('Importing ALL Claude Code memories into AgentDB...');

  const { homedir } = await import('os');
  const { readdirSync } = await import('fs');
  const claudeProjectsDir = join(homedir(), '.claude', 'projects');

  if (!existsSync(claudeProjectsDir)) {
    dim('No Claude Code projects found at ' + claudeProjectsDir);
    return;
  }

  // Find all memory files across all projects
  const memoryFiles = [];
  try {
    const projects = readdirSync(claudeProjectsDir, { withFileTypes: true });
    for (const project of projects) {
      if (!project.isDirectory()) continue;
      const memDir = join(claudeProjectsDir, project.name, 'memory');
      if (!existsSync(memDir)) continue;
      const files = readdirSync(memDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        memoryFiles.push({
          path: join(memDir, file),
          project: project.name,
          file,
        });
      }
    }
  } catch (err) {
    dim('Error scanning projects: ' + err.message);
    return;
  }

  if (memoryFiles.length === 0) {
    dim('No memory files found');
    return;
  }

  log(`Found ${memoryFiles.length} memory files across ${new Set(memoryFiles.map(f => f.project)).size} projects`);

  // Load memory-initializer for vectorized storage
  let memInit = null;
  try {
    const cliDistPath = join(PROJECT_ROOT, 'v3/@claude-flow/cli/dist/src/memory/memory-initializer.js');
    if (existsSync(cliDistPath)) {
      memInit = await import(`file://${cliDistPath}`);
      await memInit.initializeMemoryDatabase({ force: false, verbose: false });
    }
  } catch (err) {
    dim('Memory initializer not available: ' + err.message?.slice(0, 60));
  }

  if (!memInit) {
    dim('Cannot vectorize without memory-initializer. Run: cd v3/@claude-flow/cli && npm run build');
    return;
  }

  let imported = 0;
  let skipped = 0;

  for (const memFile of memoryFiles) {
    try {
      const content = readFileSync(memFile.path, 'utf-8');

      // Parse YAML frontmatter + body
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      let name = memFile.file.replace('.md', '');
      let description = '';
      let type = 'auto-memory';
      let body = content;

      if (frontmatterMatch) {
        const yaml = frontmatterMatch[1];
        body = frontmatterMatch[2].trim();
        const nameMatch = yaml.match(/^name:\s*(.+)$/m);
        const descMatch = yaml.match(/^description:\s*(.+)$/m);
        const typeMatch = yaml.match(/^type:\s*(.+)$/m);
        if (nameMatch) name = nameMatch[1].trim();
        if (descMatch) description = descMatch[1].trim();
        if (typeMatch) type = typeMatch[1].trim();
      }

      // Split body into sections (## headers) for granular entries
      const sections = body.split(/^(?=## )/m).filter(s => s.trim().length > 20);

      if (sections.length === 0) {
        // Store whole file as one entry
        if (body.length > 10) {
          await memInit.storeEntry({
            key: `claude-memory:${memFile.project}:${name}`,
            value: body.slice(0, 4096),
            namespace: 'claude-memories',
            generateEmbeddingFlag: true,
          });
          imported++;
        }
      } else {
        // Store each section separately for better search granularity
        for (const section of sections) {
          const titleMatch = section.match(/^##\s+(.+)/);
          const sectionTitle = titleMatch ? titleMatch[1].trim() : name;
          const sectionBody = section.replace(/^##\s+.+\n/, '').trim();
          if (sectionBody.length < 10) continue;

          await memInit.storeEntry({
            key: `claude-memory:${memFile.project}:${name}:${sectionTitle.slice(0, 50)}`,
            value: sectionBody.slice(0, 4096),
            namespace: 'claude-memories',
            generateEmbeddingFlag: true,
          });
          imported++;
        }
      }

      dim(`  ✓ ${memFile.project}/${memFile.file} (${sections.length || 1} entries)`);
    } catch (err) {
      dim(`  ✗ ${memFile.project}/${memFile.file}: ${err.message?.slice(0, 60)}`);
      skipped++;
    }
  }

  success(`Imported ${imported} entries from ${memoryFiles.length} files (${skipped} skipped)`);
  success('All Claude Code memories now searchable via AgentDB vector search');
}

// ============================================================================
// Main
// ============================================================================

const command = process.argv[2] || 'status';

// Suppress unhandled rejection warnings from dynamic import() failures
// which can cause non-zero exit codes even when caught
process.on('unhandledRejection', () => {});

try {
  switch (command) {
    case 'import': await doImport(); break;
    case 'import-all': await doImportAll(); break;
    case 'sync': await doSync(); break;
    case 'status': await doStatus(); break;
    default:
      console.log('Usage: auto-memory-hook.mjs <import|sync|status>');
      process.exit(1);
  }
} catch (err) {
  // Hooks must never crash Claude Code - fail silently
  dim(`Error (non-critical): ${err.message}`);
}
// Ensure clean exit for Claude Code hooks (exit 0 = success, no stderr = no error)
process.exit(0);
