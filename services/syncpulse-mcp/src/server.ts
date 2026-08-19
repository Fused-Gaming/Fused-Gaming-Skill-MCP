#!/usr/bin/env node

/**
 * SyncPulse Remote MCP Connector
 * Streamable HTTP MCP server for capability discovery and resolution
 *
 * Runs at:
 * - Local: http://localhost:3000/mcp
 * - Staging: https://staging-sync.vln.gg/mcp
 * - Production: https://sync.vln.gg/mcp
 */

import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { TextContent } from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';

import { MockCapabilityRegistry } from './services/capability-registry.js';
import {
  CapabilitySearch,
  CapabilityRequirement,
} from './schemas/types.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const registry = new MockCapabilityRegistry();

// Middleware
app.use(express.json());

// MCP Server setup
const server = new Server({
  name: 'syncpulse-mcp',
  version: '0.1.0',
});

// Register tools
const tools: object[] = [
  {
    name: 'search_capabilities',
    description: 'Search the SyncPulse registry for capabilities matching a query',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query (name, description, ID)',
        },
        kind: {
          type: 'array',
          items: { type: 'string' },
          description: 'Capability kinds to filter (skill, tool, agent, etc.)',
        },
        provides: {
          type: 'array',
          items: { type: 'string' },
          description: 'Required capabilities provided',
        },
        riskTier: {
          type: 'array',
          items: { type: 'string' },
          description: 'Acceptable risk tiers (P0-P4)',
        },
        limit: {
          type: 'number',
          description: 'Maximum results (default: 20, max: 100)',
        },
      },
    },
  },
  {
    name: 'get_capability',
    description: 'Get detailed information about a specific capability',
    inputSchema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string',
          description: 'Capability ID',
        },
        version: {
          type: 'string',
          description: 'Optional version (defaults to latest stable)',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'resolve_capability',
    description: 'Resolve a capability requirement to matching candidates',
    inputSchema: {
      type: 'object' as const,
      properties: {
        provides: {
          type: 'array',
          items: { type: 'string' },
          description: 'Required capabilities',
        },
        constraints: {
          type: 'object',
          properties: {
            maxRisk: {
              type: 'string',
              description: 'Maximum acceptable risk tier',
            },
            workspace: {
              type: 'string',
              description: 'Target workspace',
            },
          },
        },
      },
      required: ['provides'],
    },
  },
  {
    name: 'compare_capabilities',
    description: 'Compare multiple capabilities for compatibility and quality',
    inputSchema: {
      type: 'object' as const,
      properties: {
        ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Capability IDs to compare',
        },
      },
      required: ['ids'],
    },
  },
  {
    name: 'get_versions',
    description: 'Get available versions for a capability',
    inputSchema: {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string',
          description: 'Capability ID',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'get_registry_health',
    description: 'Get registry health and operational status',
    inputSchema: {
      type: 'object' as const,
      properties: {},
    },
  },
];

// Tool handler
server.setRequestHandler(async (request) => {
  if (request.method === 'tools/list') {
    return { tools };
  }

  if (request.method === 'tools/call') {
    const { name, arguments: args } = request.params;

    try {
      let result: TextContent;

      switch (name) {
        case 'search_capabilities': {
          const searchQuery: CapabilitySearch = {
            query: args.query as string | undefined,
            kind: args.kind as string[] | undefined,
            provides: args.provides as string[] | undefined,
            riskTier: args.riskTier as string[] | undefined,
            limit: (args.limit as number) || 20,
          };
          const searchResult = await registry.search(searchQuery);
          result = {
            type: 'text',
            text: JSON.stringify(searchResult, null, 2),
          };
          break;
        }

        case 'get_capability': {
          const cap = await registry.get(
            args.id as string,
            args.version as string | undefined,
          );
          result = {
            type: 'text',
            text: cap ? JSON.stringify(cap, null, 2) : 'Capability not found',
          };
          break;
        }

        case 'resolve_capability': {
          const requirement: CapabilityRequirement = {
            provides: args.provides as string[],
            constraints: args.constraints as any,
          };
          const resolution = await registry.resolve(requirement);
          result = {
            type: 'text',
            text: JSON.stringify(resolution, null, 2),
          };
          break;
        }

        case 'compare_capabilities': {
          const comparison = await registry.compare(args.ids as string[]);
          result = {
            type: 'text',
            text: JSON.stringify(comparison, null, 2),
          };
          break;
        }

        case 'get_versions': {
          const versions = await registry.versions(args.id as string);
          result = {
            type: 'text',
            text: JSON.stringify(versions, null, 2),
          };
          break;
        }

        case 'get_registry_health': {
          const health = await registry.health();
          result = {
            type: 'text',
            text: JSON.stringify(health, null, 2),
          };
          break;
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return { content: [result] };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: 'text', text: `Error: ${errorMsg}` }],
        isError: true,
      };
    }
  }

  return { content: [{ type: 'text', text: 'Unknown request' }], isError: true };
});

// Express routes for HTTP MCP
app.post('/mcp', async (req, res) => {
  try {
    // Parse MCP request from body
    const response = await server.handleRequest(req.body);
    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.listen(port, () => {
  console.log(`SyncPulse MCP server running at http://localhost:${port}/mcp`);
});
