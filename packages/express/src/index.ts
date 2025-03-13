import express, { Request, Response } from 'express';
import { createClient } from '@neuphonic/neuphonic-js';

import 'dotenv/config';
import { createWavHeader, saveAudio } from './util';

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

app.get('/restorations', async (req: Request, res: Response) => {
  const jobs = await client.restorations.list();

  res.json(jobs);
});

app.get('/ws', async (req, res) => {
  const ws = await client.tts.websocket({
    model: 'neu_hq',
    speed: 1.15,
    lang_code: 'en',
    voice_id: 'e564ba7e-aa8d-46a2-96a8-8dffedade48f'
  });

  res.setHeader('Content-Type', 'audio/wav');
  res.setHeader('Transfer-Encoding', 'chunked');

  const estimatedDataSize = 1024 * 10000;
  const wavHeader = createWavHeader(estimatedDataSize);
  res.write(wavHeader);

  const msg =
    'Designing interfaces isn’t just about making things look good—it’s about creating seamless experiences. Every pixel, every interaction matters. I focus on intuitive layouts, clear navigation, and engaging visuals that enhance usability. Whether it’s a web app, game UI, or control panel, my goal is to balance aesthetics and function ensuring users feel in control and enjoy the journey. <STOP>';

  for await (const pcmChunk of ws.send(msg)) {
    res.write(Buffer.from(pcmChunk), 'base64');
  }

  res.end();
});

app.get('/sse', async (req, res) => {
  const sse = await client.tts.sse({
    model: 'neu_hq',
    speed: 1.15,
    lang_code: 'en',
    voice_id: 'e564ba7e-aa8d-46a2-96a8-8dffedade48f'
  });

  const audio = await sse.send('Hello how are you?');

  const wavData = saveAudio(Buffer.from(audio));

  res.setHeader('Content-Type', 'audio/wav');
  res.setHeader('Content-Length', wavData.length);
  res.send(wavData);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
