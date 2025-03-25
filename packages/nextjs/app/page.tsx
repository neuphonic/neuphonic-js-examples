import { AgentCard } from './components/AgentCard';
import { agentsSettings } from './constants';
import { getClient } from './neuphonic';

export default async function Home() {
  const fetchedAgents = (await getClient().agents.list()).slice();

  const agents = fetchedAgents.map((fetchedAgent, index) => {
    return {
      id: fetchedAgent.agent_id,
      name: fetchedAgent.name,
      greet: fetchedAgent.greeting,
      ...(agentsSettings[index] || agentsSettings[0])
    };
  });

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className="grid grid-cols-3 gap-4">
        {agents.map((agent) => {
          return (
            <AgentCard
              key={agent.id}
              id={agent.id}
              name={agent.name}
              lang={agent.lang}
              greet={agent.greet}
              image={agent.image}
            />
          );
        })}
      </div>
    </div>
  );
}
