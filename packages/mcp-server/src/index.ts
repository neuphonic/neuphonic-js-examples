import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';
import z from 'zod';

const mcpServer = new McpServer(
  {
    name: 'ExampleMCPServer',
    version: '1.0.0'
  },
  {
    capabilities: {}
  }
);

mcpServer.registerTool(
  'fetch-weather',
  {
    title: 'Weather Fetcher',
    description: 'Get weather data for a city',
    inputSchema: { city: z.string() }
  },
  async ({ city }) => {
    console.log(`Getting weather in ${city}...`);

    const response = await fetch(`https://wttr.in/${city}?format=4`);
    const data = await response.text();

    console.log(data);

    return {
      content: [{ type: 'text', text: data }]
    };
  }
);

const app = express();

const transportMap = new Map<string, SSEServerTransport>();

app.get('/sse', async (req, res) => {
  const transport = new SSEServerTransport('/messages', res);
  transportMap.set(transport.sessionId, transport);
  await mcpServer.connect(transport);
});

app.post('/messages', (req, res) => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    console.error('Message received without sessionId');
    res.status(400).json({ error: 'sessionId is required' });
    return;
  }

  const transport = transportMap.get(sessionId);

  if (transport) {
    transport.handlePostMessage(req, res);
  }
});

app.listen(8000);
