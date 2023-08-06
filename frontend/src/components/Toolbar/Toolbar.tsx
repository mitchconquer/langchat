function Toolbar({ clearSavedMessages }: { clearSavedMessages: () => void }) {
  return (
    <div>
      <div className="flex justify-evenly">
        <button onClick={clearSavedMessages}>Clear conversation</button>
        <div>🇲🇽</div>
      </div>
    </div>
  );
}

export default Toolbar;
