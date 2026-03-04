'use client';

import {
  LiveKitRoom,
  useTranscriptions,
  AudioConference
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useEffect, useRef } from 'react';

const LIVEKIT_URL = 'https://agents.neuphonic.com';

const Transcript = () => {
  const transcriptions = useTranscriptions();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptions]);

  return (
    <div
      ref={scrollRef}
      className="flex min-h-0 flex-1 w-full flex-col gap-4 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
    >
      {transcriptions.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-neutral-500">
          Conversation will appear here...
        </div>
      ) : (
        transcriptions.map((t, idx) => {
          const isAgent = t.participantInfo.identity.startsWith('agent-');
          return (
            <div
              key={idx}
              className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-base ${
                  isAgent
                    ? 'text-neutral-700 dark:text-neutral-200'
                    : 'bg-themeContrast2 text-themeWhite shadow-md shadow-slate-300 dark:border dark:border-darkThemeSecondary/30 dark:bg-darkThemeSecondary/20 dark:shadow-neutral-800'
                }`}
              >
                {t.text}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export const Agent = ({ token }: { token: string }) => {
  return (
    <div>
      <LiveKitRoom
        serverUrl={LIVEKIT_URL}
        token={token}
        data-lk-theme="default"
        connect={true}
        audio={true}
      >
        <AudioConference />
        <Transcript />
      </LiveKitRoom>
    </div>
  );
};
