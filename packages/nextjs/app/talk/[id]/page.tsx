import { VoiceChat } from '@/app/components/VoiceChat';
import { getClient } from '@/app/neuphonic';
import { agentsSettings } from '@/app/constants';

export default async function Talk({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const fetchedAgents = (await getClient().agents.list()).slice();

  const agents = fetchedAgents.map((fetchedAgent, index) => {
    return {
      id: fetchedAgent.agent_id,
      name: fetchedAgent.name,
      greet: fetchedAgent.greeting,
      ...(agentsSettings[index] || agentsSettings[0])
    };
  });

  const agent = agents.find((agent) => agent.id === id);

  if (!agent) {
    throw new Error('Agent not found');
  }

  const jwtToken = await getClient().jwt();

  return (
    <div className="flex w-ful h-full min-h-screen justify-center items-center">
      <div className="w-[300px]">
        <VoiceChat
          headerAvatar={agent.image}
          headerName={agent.name}
          agentId={agent.id}
          jwtToken={jwtToken}
        />
      </div>
    </div>
  );
}
