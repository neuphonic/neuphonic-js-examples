import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

import { createClient, AgentResult } from '@neuphonic/neuphonic-js';

import 'dotenv/config';

const app = express();

app.all('/twilio/inbound_call', (req, res) => {
  console.log('Inbound call', JSON.stringify(req.method));

  res.type('application/xml');

  res.send(
    `<Response><Connect><Stream url="wss:/${process.env.SERVER_BASE_URL}/"/></Connect></Response>`
  );
});

const server = createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', async (socket: WebSocket) => {
  console.log('Connection');

  let streamId;
  let agentSocket: AgentResult;

  socket.on('message', async (raw) => {
    const data = JSON.parse(raw.toString());

    if (data['event'] == 'connected') {
      console.log('Twilio connected');
    } else if (data['event'] == 'start') {
      streamId = data['start']['streamSid'];
    } else if (data['event'] == 'media') {
      agentSocket?.send(JSON.stringify({ audio: data['media']['payload'] }));
    } else if (data['event'] == 'stop') {
      console.log('Twilio closed');
      socket.close();
    } else {
      console.log(data);
    }
  });

  const client = createClient({ apiKey: process.env.NEUPHONIC_API_KEY });

  const agent = await client.createBaseAgent(
    {
      agent_id: process.env.NEUPHONIC_AGENT_ID!,
      return_sampling_rate: 8000,
      incoming_encoding: 'pcm_mulaw',
      return_encoding: 'pcm_mulaw',
      incoming_mode: 'text'
    },
    {
      sampling_rate: 8000,
      voice_id: 'fc854436-2dac-4d21-aa69-ae17b54e98eb'
    }
  );

  agentSocket = await agent.start();

  agentSocket.onMessage((message) => {
    if (streamId && message.data.type == 'audio_response') {
      console.log('Neuphonic audio');

      socket.send(
        JSON.stringify({
          event: 'media',
          streamSid: streamId,
          media: {
            payload: message.data.audio
          }
        })
      );
    } else if (message.data.type == 'user_transcript') {
      console.log(`Neuphonic transcript: ${message.data.text}`);
    } else if (message.data.type == 'llm_response') {
      console.log(`Neuphonic llm: ${message.data.text}`);
    } else if (streamId && message.data.type == 'stop_audio_response') {
      console.log('Neuphonic stop audio');

      socket.send(
        JSON.stringify({
          event: 'clear',
          streamSid: streamId
        })
      );
    }
  });
});

// Starting the server
// ------------------------------------------------------------------------------

const PORT = process.env.PORT ?? 8000;

server.listen(PORT, () => {
  console.log(`Listen on: ${PORT}`);
});
