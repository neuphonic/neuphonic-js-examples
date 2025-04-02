import { createBrowserClient } from '@neuphonic/neuphonic-js/browser';

let client: ReturnType<typeof createBrowserClient>;

export const getBrowserClient = (jwtToken?: string) => {
  if (client) {
    return client;
  }

  client = createBrowserClient();

  if (!jwtToken) {
    throw new Error('JWT token is required')
  }

  client.jwt(jwtToken);

  return client;
};
