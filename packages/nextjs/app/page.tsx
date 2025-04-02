import LinkBlock from "./components/LinkBlock";

export default function HomePage() {

  return (
    <div className='flex min-h-screen items-center justify-center '>
      <div className="max-w-2xl grid grid-cols-2 gap-4">
        <LinkBlock href="/tts" title="TTS" description="Neuphonic’s primary offering is its text-to-speech technology, which serves as the foundation for various features, including Agents."/> 
        <LinkBlock href="/talk" title="Agents" description="Agents allow you to create, manage, and interact with intelligent multilingual AI assistants."/> 
      </div>
    </div>
  );
}
