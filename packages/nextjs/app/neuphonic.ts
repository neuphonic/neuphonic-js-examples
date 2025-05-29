import { createClient } from '@neuphonic/neuphonic-js';

let client: ReturnType<typeof createClient>;

export const getClient = () => {
  if (client) {
    return client;
  }

  client = createClient({
    apiKey: process.env.NEXT_NEUPHONIC_API_KEY,
    baseURL: process.env.NEXT_PUBLIC_NEUPHONIC_BASE_URL,
    baseHttp: !!process.env.NEXT_PUBLIC_NEUPHONIC_BASE_HTTP
  });

  return client;
};
