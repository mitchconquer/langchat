import { useCallback, useEffect, useRef, useState } from 'react';

import Composer from './components/Composer';
import Toolbar from './components/Toolbar/Toolbar';
import Welcome from './components/Welcome';
import { Message } from './types';

const localStorageKey = 'messages';

const LANGUAGE = 'Spanish';
const COUNTRY = 'Mexico';
const TONE = 'colloquial';

const rephraseMessages = {
  Spanish: ({
    userInput,
    tone,
    country,
  }: {
    userInput: string;
    tone: string;
    country: string;
  }): string =>
    `¿Cómo puedo decir el siguiente de una manera más natural, nativo, ${tonesByLanguage['Spanish']?.[tone]} y típico de ${countriesByLanguage['Spanish']?.[country]}: "${userInput}"`,
};

const tonesByLanguage = {
  Spanish: {
    colloquial: 'coloquial',
  },
};

const countriesByLanguage = {
  Spanish: {
    Mexico: 'México',
  },
};

const defaultMessage: Message = {
  content: `You are a helpful assistant. Your responses are brief and never more than 50 words long. You speak in a ${TONE} manner, typical of ${COUNTRY}. You are eager to teach about the local customs and culture of ${COUNTRY} and give examples when helpful, but you are brief.`,
  role: 'system',
};

function App() {
  const [messages, setMessages] = useState<Message[]>([defaultMessage]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mediaPlayer = useRef<HTMLAudioElement>(null);

  // load messages from local storage
  useEffect(() => {
    const messages = localStorage.getItem(localStorageKey);

    if (messages) {
      setMessages(JSON.parse(messages));
    }
  }, []);

  // save messages to local storage
  useEffect(() => {
    if (messages.length <= 1) return;

    localStorage.setItem(localStorageKey, JSON.stringify(messages));
  }, [messages]);

  const clearSavedMessages = useCallback(() => {
    localStorage.removeItem(localStorageKey);
    setMessages([defaultMessage]);
  }, []);

  const playAudio = useCallback(async () => {
    if (mediaPlayer.current) {
      await mediaPlayer.current.play();
    }
  }, []);

  const speak = useCallback(
    async (text: string) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL as string}/api/speak`,
        {
          body: JSON.stringify({ text }),
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          method: 'POST',
        }
      );

      const blob = await res.blob();

      const objectURL = URL.createObjectURL(blob);

      if (mediaPlayer.current) {
        mediaPlayer.current.src = objectURL;
        playAudio();
      }
    },
    [playAudio]
  );

  const onSend = useCallback(
    async (userInput: string) => {
      if (!userInput) return;

      setIsLoading(true);
      setMessages((msgs) => [...msgs, { content: userInput, role: 'user' }]);
      setUserInput('');

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL as string}/api/ask`,
          {
            body: JSON.stringify({
              messages: [...messages, { content: userInput, role: 'user' }],
              model: 'gpt-3.5-turbo',
            }),
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            method: 'POST',
          }
        );

        const body = await res.json();

        const newMsg = body.choices?.[0]?.message;

        if (newMsg) {
          setMessages((msgs) => [...msgs, newMsg]);
          speak(newMsg.content);
        }
      } catch (err) {
        // restore messages and user input
        setMessages((msgs) => msgs.slice(0, -1));
        setUserInput(userInput);

        console.error(err);
      }

      setIsLoading(false);
    },
    [messages, speak]
  );

  const rephrase = useCallback(
    async (userInput: string) => {
      const message = rephraseMessages[LANGUAGE]?.({
        country: COUNTRY,
        tone: TONE,
        userInput,
      });

      if (message) {
        onSend(message);
      }
    },
    [onSend]
  );

  return (
    <div className="overflow-hidden h-screen flex flex-col justify-between bg-slate-950 text-white">
      <Toolbar clearSavedMessages={clearSavedMessages} />
      <audio id="audio" ref={mediaPlayer}></audio>
      <Welcome messages={messages} rephrase={rephrase} />
      <Composer
        isLoading={isLoading}
        userInput={userInput}
        setUserInput={setUserInput}
        onSend={onSend}
      />
    </div>
  );
}

export default App;
