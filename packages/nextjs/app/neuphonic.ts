import { createClient } from '@neuphonic/neuphonic-js';

let client: ReturnType<typeof createClient>;

export const getClient = () => {
  if (client) {
    return client;
  }

  client = createClient({ apiKey: process.env.NEXT_NEUPHONIC_API_KEY });

  return client;
};
