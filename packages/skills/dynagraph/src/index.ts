/**
 * @h4shed/skill-dynagraph
 * MCP Skill Adapter for Dynagraph - Dynamic Open Graph Image Renderer
 *
 * This module provides MCP tool integration for the Dynagraph rendering engine.
 * Dynagraph itself is a separate, standalone npm package (@h4shed/dynagraph).
 *
 * This adapter wraps the Dynagraph SDK for use as an MCP skill/tool.
 *
 * License: Apache-2.0
 * Note: Dynagraph core uses dual-licensing (PolyForm Noncommercial + Commercial)
 */

import type { Tool, Resource } from '@h4shed/mcp-core';

export interface DynagraphSkillConfig {
  defaultWidth?: number;
  defaultHeight?: number;
  defaultDpr?: number;
  defaultFormat?: 'svg' | 'png' | 'webp';
  enableApiEndpoint?: boolean;
}

/**
 * Initialize Dynagraph skill
 * Called by MCP core on server startup
 */
export async function initializeDynagraphSkill(
  config: DynagraphSkillConfig = {}
): Promise<{
  tools: Tool[];
  resources?: Resource[];
}> {
  // TODO: Import Dynagraph SDK once available
  // import { render, validateTemplate, listTemplates } from '@h4shed/dynagraph';

  return {
    tools: [
      {
        name: 'dynagraph_render',
        description:
          'Render a dynamic Open Graph image using Dynagraph template engine',
        inputSchema: {
          type: 'object' as const,
          properties: {
            template: {
              type: 'string',
              description: 'Template identifier (e.g., "profile", "article")'
            },
            props: {
              type: 'object',
              description: 'Template-specific properties (context-dependent)'
            },
            width: {
              type: 'number',
              description: 'Output width in pixels',
              default: config.defaultWidth ?? 1200
            },
            height: {
              type: 'number',
              description: 'Output height in pixels',
              default: config.defaultHeight ?? 630
            },
            dpr: {
              type: 'number',
              description: 'Device pixel ratio for high-DPI output',
              default: config.defaultDpr ?? 1,
              minimum: 1,
              maximum: 3
            },
            format: {
              type: 'string',
              enum: ['svg', 'png', 'webp'],
              description: 'Output format',
              default: config.defaultFormat ?? 'png'
            }
          },
          required: ['template', 'props']
        }
      },
      {
        name: 'dynagraph_list_templates',
        description: 'List available Dynagraph templates',
        inputSchema: {
          type: 'object' as const,
          properties: {}
        }
      },
      {
        name: 'dynagraph_validate_template',
        description: 'Validate template definition and schema',
        inputSchema: {
          type: 'object' as const,
          properties: {
            template: {
              type: 'string',
              description: 'Template TypeScript source code'
            }
          },
          required: ['template']
        }
      },
      {
        name: 'dynagraph_preview',
        description: 'Generate a preview of rendered output (SVG only)',
        inputSchema: {
          type: 'object' as const,
          properties: {
            template: {
              type: 'string',
              description: 'Template identifier'
            },
            props: {
              type: 'object',
              description: 'Template properties'
            },
            width: {
              type: 'number',
              default: config.defaultWidth ?? 1200
            },
            height: {
              type: 'number',
              default: config.defaultHeight ?? 630
            }
          },
          required: ['template', 'props']
        }
      }
    ]
  };
}

/**
 * Tool handlers will be implemented once Dynagraph SDK is available
 * See: INTEGRATION-PLAN.md for implementation roadmap
 */

export default {
  initialize: initializeDynagraphSkill,
  version: '1.0.0',
  name: '@h4shed/skill-dynagraph'
};
