import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';

let landingPageHtml: string | null = null;

function getLandingPage(): string {
  if (!landingPageHtml) {
    try {
      landingPageHtml = readFileSync(join(__dirname, '../public/index.html'), 'utf-8');
    } catch {
      landingPageHtml = '<html><body><h1>Fused Gaming MCP Skills API</h1><p>Service is running</p></body></html>';
    }
  }
  return landingPageHtml;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Landing page endpoint
    if (req.url === '/' && req.method === 'GET') {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(getLandingPage());
    }

    // Health check endpoint
    if (req.url === '/health' && req.method === 'GET') {
      return res.status(200).json({
        status: 'ok',
        service: 'fused-gaming-skill-mcp',
        domain: 'skill.vln.gg',
        timestamp: new Date().toISOString(),
        version: '1.0.3',
      });
    }

    // Skills list endpoint
    if (req.url === '/skills' && req.method === 'GET') {
      return res.status(200).json({
        skills: [
          {
            name: 'syncpulse',
            description: 'Task synchronization and session management service',
            version: '1.0.0',
          },
          {
            name: 'mermaid-terminal',
            description: 'Generate Mermaid diagrams from terminal',
            version: '1.0.0',
          },
        ],
      });
    }

    // MCP API endpoint
    if (req.url === '/api' && req.method === 'POST') {
      const { jsonrpc, method, _params, id } = req.body;

      if (jsonrpc === '2.0') {
        // Echo back the request as a placeholder
        return res.status(200).json({
          jsonrpc: '2.0',
          result: { received: true, method, timestamp: Date.now() },
          id,
        });
      }
    }

    res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
