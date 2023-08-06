import { useEffect, useRef } from 'react';

import { Message } from '../../types';

const messageClass = 'max-w-xs p-1.5 m-1.5 rounded whitespace-pre-line';
const userMessageClass =
  'bg-violet-600 text-white self-end text-right max-w-xs';
const systemMessageClass =
  'bg-gray-500 text-white self-start text-left max-w-xs';

export default function Welcome({
  messages,
  rephrase,
}: {
  messages: Message[];
  rephrase: (userInput: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex flex-col flex-grow max-h-[calc(100vh-8rem)] overflow-auto "
    >
      <div className="flex flex-col flex-grow">
        {messages.length
          ? messages
              .filter((msg) => msg.role !== 'system')
              .map((msg, i) => (
                <div
                  key={i}
                  className={`${messageClass} ${
                    msg.role === 'user' ? userMessageClass : systemMessageClass
                  }`}
                >
                  <p>{msg.content}</p>
                  {msg.role === 'user' && (
                    <button
                      className="self-end"
                      onClick={() => rephrase(msg.content)}
                    >
                      <small className="text-violet-300">🔄 Rephrase</small>
                    </button>
                  )}
                </div>
              ))
          : 'Welcome'}
      </div>
    </div>
  );
}
