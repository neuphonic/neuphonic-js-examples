import { getClient } from '../neuphonic';
import { Tts } from '../components/Tts';

export default async function TtsPage() {
  const voices = await getClient().voices.list();

  const jwtToken = await getClient().jwt();

  const langs = voices
    .map((voice) => voice.lang_code)
    .filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Tts jwtToken={jwtToken} voices={voices} langs={langs} />
    </div>
  );
}
