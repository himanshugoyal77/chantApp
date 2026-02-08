const RudrakshaComponent = ({ index, isActive, isMeru }) => {
  return (
    <div className={`bead-container ${isActive ? "bead-active" : ""}`}>
      <img
        src="/thread.png"
        alt="thread"
        className="w-12 h-4 absolute top-0 -z-10"
      />
      <img
        src="/rudraksha.png"
        alt="shivbhakti"
        className={`bead-image ${isActive ? "bead-active-image" : ""}`}
      />
      {isMeru && (
        <div className="meru-symbol">
          <div className="om-symbol">ॐ</div>
          {isActive && <div className="meru-glow"></div>}
        </div>
      )}
      <img
        src="/thread.png"
        alt="thread"
        className="w-12 h-4 absolute bottom-0 z-0"
      />

      {isActive && <div className="bead-number">#{index + 1}</div>}
    </div>
  );
};

export default RudrakshaComponent;
