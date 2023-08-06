import { ConvoContext } from '../../types';

function Toolbar({
  setView,
  clearSavedMessages,
  convoContext,
}: {
  setView: (view: 'chat' | 'menu') => void;
  clearSavedMessages: () => void;
  convoContext?: ConvoContext;
}) {
  return (
    <div>
      <div className="flex justify-evenly">
        <button onClick={() => setView('menu')}>Menu</button>
        <button onClick={clearSavedMessages}>Clear conversation</button>
        <div>🇲🇽</div>
      </div>
      {convoContext && convoContext.description && (
        <div className="flex flex-col p-2 bg-slate-800 p-2 m-2">
          <div className="w-full h-96 flex-col justify-center align-center overflow-hidden">
            <img
              className="h-full w-full object-contain"
              src={convoContext?.imageUrl}
            />
          </div>

          <div className="flex justify-center mt-2">
            <code>{convoContext?.description}</code>
          </div>
        </div>
      )}
    </div>
  );
}

export default Toolbar;
