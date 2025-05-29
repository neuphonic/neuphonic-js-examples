'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Square, Volume2 } from 'lucide-react';
import { Voice } from '@neuphonic/neuphonic-js';
import { Tts as TtsClient, Player } from '@neuphonic/neuphonic-js/browser';
import { getBrowserClient } from '../neuphonicBrowser';

const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

const outputFormats = ['wav', 'mp3'] as const;
const sampleRates = [22050, 16000, 8000] as const;

export const Tts = ({
  jwtToken,
  voices,
  langs
}: {
  jwtToken: string;
  voices: Voice[];
  langs: string[];
}) => {
  const client = useRef<TtsClient>(null);
  const player = useRef<Player>(null);

  const [text, setText] = useState('Hello, how are you?');
  const [isPlaying, setIsPlaying] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedVoice, setSelectedVoice] = useState('fc854436-2dac-4d21-aa69-ae17b54e98eb');

  const filteredVoices = voices.filter(
    (voice) => voice.lang_code === selectedLanguage
  );

  const [outputFormat, setOutputFormat] = useState<'mp3' | 'wav'>('wav');
  const [sampleRate, setSampleRate] = useState<22050 | 16000 | 8000>(22050);

  const handlePlay = async () => {
    if (text.trim() === '') {
      return;
    }

    setIsPlaying(true);

    if (!client.current) {
      client.current = getBrowserClient(jwtToken).tts;
    }

    if (!player.current) {
      player.current = await client.current.player({
        voice_id: selectedVoice,
        lang_code: selectedLanguage,
        output_format: outputFormat,
        sampling_rate: sampleRate
      });
    }

    await player.current.play(text);

    setIsPlaying(false);
  };

  const changeVoice = (voiceId: string) => {
    setSelectedVoice(voiceId);
    player.current?.close();
    player.current = null;
  };

  const changeLang = (lang: string) => {
    const voiceId = voices.find((voice) => voice.lang_code === lang)?.id;
    setSelectedVoice(voiceId!);
    setSelectedLanguage(lang);
    player.current?.close();
    player.current = null;
  };

  const changeOutputFormat = (format: string) => {
    setOutputFormat(format as 'mp3' | 'wav');
    player.current?.close();
    player.current = null;
  };

  const changeSampleRate = (rate: number) => {
    setSampleRate(rate as 22050 | 16000 | 8000);
    player.current?.close();
    player.current = null;
  };

  const handleStop = () => {
    setIsPlaying(false);
    player.current?.stop();
  };

  useEffect(() => {
    player.current?.close();
    player.current = null;
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-lg w-[400px]">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <Volume2 size={24} className="text-purple-500" />
          <h3 className="font-semibold text-white text-lg">Text to Speech</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="speech-text"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Text
            </label>
            <textarea
              id="speech-text"
              rows={4}
              placeholder="Type the text you want to convert to speech..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isPlaying}
              className={classNames(
                'w-full rounded-lg border bg-gray-800 px-3 py-2 text-white placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                'disabled:opacity-70 disabled:cursor-not-allowed',
                isPlaying
                  ? 'border-gray-700'
                  : 'border-gray-700 hover:border-gray-600'
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="voice-select"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Voice
              </label>
              <select
                id="voice-select"
                value={selectedVoice}
                onChange={(e) => changeVoice(e.target.value)}
                disabled={isPlaying}
                className={classNames(
                  'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                  'disabled:opacity-70 disabled:cursor-not-allowed',
                  'appearance-none bg-no-repeat bg-right',
                  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M6%209L1%204h10L6%209z%22%2F%3E%3C%2Fsvg%3E')]",
                  'bg-[length:1.5em_1.5em] pr-10'
                )}
              >
                {filteredVoices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="language-select"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Language
              </label>
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => changeLang(e.target.value)}
                disabled={isPlaying}
                className={classNames(
                  'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                  'disabled:opacity-70 disabled:cursor-not-allowed',
                  'appearance-none bg-no-repeat bg-right',
                  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M6%209L1%204h10L6%209z%22%2F%3E%3C%2Fsvg%3E')]",
                  'bg-[length:1.5em_1.5em] pr-10'
                )}
              >
                {langs.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="output-format-select"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Output Format
              </label>
              <select
                id="output-format-select"
                value={outputFormat}
                onChange={(e) => changeOutputFormat(e.target.value)}
                disabled={isPlaying}
                className={classNames(
                  'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                  'disabled:opacity-70 disabled:cursor-not-allowed',
                  'appearance-none bg-no-repeat bg-right',
                  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M6%209L1%204h10L6%209z%22%2F%3E%3C%2Fsvg%3E')]",
                  'bg-[length:1.5em_1.5em] pr-10'
                )}
              >
                {outputFormats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="language-select"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Sample Rate
              </label>
              <select
                id="language-select"
                value={sampleRate}
                onChange={(e) => changeSampleRate(Number(e.target.value))}
                disabled={isPlaying}
                className={classNames(
                  'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white',
                  'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                  'disabled:opacity-70 disabled:cursor-not-allowed',
                  'appearance-none bg-no-repeat bg-right',
                  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M6%209L1%204h10L6%209z%22%2F%3E%3C%2Fsvg%3E')]",
                  'bg-[length:1.5em_1.5em] pr-10'
                )}
              >
                {sampleRates.map((sampleRate) => (
                  <option key={sampleRate} value={sampleRate}>
                    {sampleRate}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex justify-center">
              {!isPlaying ? (
                <button
                  onClick={handlePlay}
                  disabled={text.trim() === ''}
                  className={classNames(
                    'flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
                    text.trim() === ''
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500'
                  )}
                >
                  <Play size={18} />
                  <span>Play</span>
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
                >
                  <Square size={18} />
                  <span>Stop</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
