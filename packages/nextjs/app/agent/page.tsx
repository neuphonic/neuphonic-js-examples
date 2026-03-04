import { Agent } from '../components/Agent';
import { getClient } from '../neuphonic';

const getAgentToken = async (agentId: string, instructions: string) => {
  const res = await fetch(`https://api.neuphonic.com/agents/${agentId}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.NEXT_NEUPHONIC_API_KEY!
    },
    body: JSON.stringify({
      instructions: instructions,
      api_key: process.env.NEXT_NEUPHONIC_API_KEY,
      room_name: `${agentId}-${new Date().toISOString()}`
    })
  });

  const { data } = await res.json();

  console.log(data);

  return data.token;
};

export default async function TtsPage() {
  const [agent] = await getClient().agents.list();

  const token = await getAgentToken(agent.agent_id, agent.prompt || '');

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Agent token={token} />
    </div>
  );
}
