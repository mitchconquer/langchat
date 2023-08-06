import AudioRecorder from '../AudioRecorder';

export default function Composer({
  isLoading,
  userInput,
  setUserInput,
  onSend,
}: {
  isLoading: boolean;
  onSend: (userInput: string) => void;
  setUserInput: (userInput: string) => void;
  userInput: string;
}) {
  return (
    <div className="flex border-3 border-violet-600 p-4">
      <textarea
        disabled={isLoading}
        className="w-full h-24 border-2 border-violet-600 p-2 rounded-l-md bg-slate-950 text-white"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />

      <AudioRecorder
        setText={setUserInput}
        disableSend={!userInput}
        isLoading={isLoading}
        onSend={() => onSend(userInput)}
      />
    </div>
  );
}
