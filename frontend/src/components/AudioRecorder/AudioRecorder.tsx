import { useRef, useState } from 'react';

function AudioRecorder({
  disableSend,
  setText,
  isLoading,
  onSend,
}: {
  disableSend: boolean;
  setText: (text: string) => void;
  isLoading: boolean;
  onSend: () => void;
}) {
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();

      const audioChunks: Blob[] = [];

      mediaRecorder.current.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

        const form = new FormData();

        // form.append('model', 'whisper-1');
        // form.append('response_format', 'text');
        form.append('file', audioBlob, 'audio.webm');

        fetch(import.meta.env.VITE_API_BASE_URL + '/api/transcribe', {
          body: form,
          method: 'POST',
        })
          .then((res) => res.json())
          .then((res) => {
            if (res?.text) {
              setText(res.text);
            }
          });
      });

      setRecording(true);
    });
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();

    setRecording(false);
  };

  return (
    <div>
      <div className="flex flex-col h-full justify-stretch w-32">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          className="text-white bg-violet-600 grow rounded-tr-md border-b border-violet-500"
          disabled={isLoading}
        >
          {recording ? '🙅‍♀️' : '🎤'}
        </button>
        <button
          onClick={onSend}
          className="text-white bg-violet-600 grow rounded-br-md"
          disabled={isLoading || disableSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AudioRecorder;
