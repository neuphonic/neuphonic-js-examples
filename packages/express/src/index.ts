import express, { Request, Response } from 'express';
import { createClient, toWav, createWavHeader } from '@neuphonic/neuphonic-js';

import 'dotenv/config';

const app = express();
const PORT = 3000;

const client = createClient({ apiKey: process.env.NEUPHONIC_API_KEY });

app.get('/', (req: Request, res: Response) => {
  res.send('Index');
});

app.get('/voices', async (req: Request, res: Response) => {
  const voices = await client.voices.list();

  res.json(voices);
});

app.get('/agents', async (req: Request, res: Response) => {
  const agents = await client.agents.list();

  res.json(agents);
});

app.get('/ws', async (req, res) => {
  const ws = await client.tts.websocket({
    speed: 1.15,
    lang_code: 'en',
    voice_id: 'e564ba7e-aa8d-46a2-96a8-8dffedade48f'
  });

  res.setHeader('Content-Type', 'audio/wav');
  res.setHeader('Transfer-Encoding', 'chunked');

  const wavHeader = createWavHeader(22050);
  res.write(wavHeader);

  const msg =
    'Designing interfaces isn’t just about making things look good—it’s about creating seamless experiences. Every pixel, every interaction matters. I focus on intuitive layouts, clear navigation, and engaging visuals that enhance usability. Whether it’s a web app, game UI, or control panel, my goal is to balance aesthetics and function ensuring users feel in control and enjoy the journey. <STOP>';

  for await (const chunk of ws.send(msg)) {
    res.write(Buffer.from(chunk.audio));
  }

  res.end();
});

app.get('/sse', async (req, res) => {
  const sse = await client.tts.sse({
    speed: 1.15,
    lang_code: 'en',
    voice_id: 'e564ba7e-aa8d-46a2-96a8-8dffedade48f'
  });

  const audio = await sse.send('Hello how are you?');

  const wavData = Buffer.from(toWav(audio.audio));

  res.setHeader('Content-Type', 'audio/wav');
  res.setHeader('Content-Length', wavData.length);
  res.send(wavData);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
