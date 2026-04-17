import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Health check endpoint
    if (req.url?.startsWith('/health') && req.method === 'GET') {
      return res.status(200).json({
        status: 'ok',
        service: 'fused-gaming-skill-mcp',
        domain: 'skill.vln.gg',
        timestamp: new Date().toISOString(),
        version: '1.0.3',
      });
    }

    // Skills list endpoint
    if (req.url?.startsWith('/skills') && req.method === 'GET') {
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
    if (req.url?.startsWith('/api') && req.method === 'POST') {
      const { jsonrpc, method, _params, id } = req.body;

      if (jsonrpc === '2.0') {
        return res.status(200).json({
          jsonrpc: '2.0',
          result: { received: true, method, timestamp: Date.now() },
          id,
        });
      }
    }

    // Root path info (simple response, no HTML)
    if ((req.url === '/' || req.url === '') && req.method === 'GET') {
      return res.status(200).json({
        name: 'Fused Gaming MCP Skills API',
        status: 'running',
        endpoints: {
          health: 'GET /health',
          skills: 'GET /skills',
          api: 'POST /api',
        },
      });
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
