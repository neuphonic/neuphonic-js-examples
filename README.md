An example of usage Neuphonic Typescript SDK
============================================

Please check the SDK here: https://github.com/neuphonic/neuphonic-js.

For comprehensive guides and official documentation, check out [https://docs.neuphonic.com](https://docs.neuphonic.com).
If you need support or want to join the community, visit our [Discord](https://discord.gg/G258vva7gZ)!

# API Key
Get your API key from the [Neuphonic website](https://beta.neuphonic.com).

# Install the dependencies
`yarn install`

# Express application

This is an example of a Node.js Express application demonstrating how to use the Neuphonic API to:

- List available voices
- Retrieve restoration jobs
- Stream text-to-speech (TTS) audio

## Running the application

Copy your API key into `.env` andsStart the server with:

```bash
yarn dev
```

## Available Endpoints

- GET /voices - Fetches a list of available voices from the Neuphonic API.
- GET /restorations - Retrieves a list of active restoration jobs.
- GET /ws - Streams synthesized speech using WebSockets.
- GET /sse - Streams synthesized speech using Server-Sent Events (SSE).
