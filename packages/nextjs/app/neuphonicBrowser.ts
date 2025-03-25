import { createBrowserClient } from '@neuphonic/neuphonic-js/browser';

let client: ReturnType<typeof createBrowserClient>;

export const getClient = () => {
  if (client) {
    return client;
  }

  client = createBrowserClient();

  return client;
};
