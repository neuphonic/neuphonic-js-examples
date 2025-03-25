'use client';

import { WsErr } from '@neuphonic/neuphonic-js/browser';

import Image, { StaticImageData } from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

import { getClient } from '../neuphonicBrowser';

type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'error';
  timestamp: Date;
};

interface AgentHeaderProps {
  name: string;
  avatar: StaticImageData;
  speaking: boolean;
}

const AgentHeader = ({ name, avatar, speaking }: AgentHeaderProps) => {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-gray-800">
      <div className="relative h-12 w-12">
        <Image
          src={avatar}
          alt={name}
          className="h-full w-full rounded-full object-cover border-2 border-purple-500"
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-purple-900 text-white opacity-0 group-empty:opacity-100">
          {name.substring(0, 2).toUpperCase()}
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="font-semibold text-white">{name}</h2>
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              !speaking ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          ></span>
          <span className="text-xs text-gray-400 capitalize">
            {!speaking ? 'Online' : 'Speaking...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const VoiceChat = ({
  agentId,
  jwtToken,
  headerName,
  headerAvatar
}: {
  agentId: string;
  jwtToken: string;
  headerName: string;
  headerAvatar: StaticImageData;
}) => {
  const agent = useRef(
    getClient().createAgent({ agent_id: agentId, jwt_token: jwtToken })
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleConnection = async () => {
    if (isConnected) {
      setIsConnecting(true);
      await agent.current.stop();
      setIsConnecting(false);
      setIsConnected(false);
      addMessage('Disconnected from voice chat.', 'assistant');
    } else {
      setIsConnecting(true);

      try {
        const chat = await agent.current.start();

        chat.onText((role, text) => {
          addMessage(text, role);
        });

        chat.onAudio(async (audio) => {
          setIsSpeaking(audio);
        });

        setIsConnected(true);
      } catch (err) {
        if (err instanceof WsErr) {
          if (err.name === 'WsConnect') {
            addMessage(
              'Failed to connect to Neuphonic, please try again.',
              'error'
            );
          }
        } else if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            addMessage(
              'Microphone access was denied. Please allow microphone usage to continue.',
              'error'
            );
          } else if (err.name === 'NotFoundError') {
            addMessage('No microphone found on this device.', 'error');
          } else if (err.name === 'OverConstrainedError') {
            addMessage(
              'Constraint error. Try adjusting the constraints.',
              'error'
            );
          } else if (err.name === 'NotReadableError') {
            addMessage(
              'icrophone is already in use or not available. Close other apps using the microphone.',
              'error'
            );
          }
        } else {
          throw err;
        }
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const addMessage = (
    content: string,
    sender: MessageType['sender'] = 'user'
  ) => {
    const newMessage: MessageType = {
      id: new Date().toISOString(),
      content,
      sender,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 shadow-lg">
      <AgentHeader
        name={headerName}
        avatar={headerAvatar}
        speaking={isSpeaking}
      />
      <div className="flex h-[500px] flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex w-max max-w-[80%] flex-col rounded-xl px-4 py-2 text-sm ${
                  message.sender === 'user'
                    ? 'ml-auto bg-purple-600 text-white'
                    : message.sender === 'error'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                }`}
              >
                <span>{message.content}</span>
                <span className="mt-1 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-gray-800 bg-gray-900 p-4">
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={toggleConnection}
              className={`h-16 w-16 rounded-full flex items-center justify-center focus:outline-none cursor-pointer ${
                isConnecting
                  ? 'bg-purple-950 animate-pulse'
                  : isConnected
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-purple-600 hover:bg-purple-700'
              }`}
              aria-label={isConnected ? 'Disconnect' : 'Connect'}
            >
              {isConnected ? (
                <MicOff size={24} color="white" />
              ) : (
                <Mic size={24} color="white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
