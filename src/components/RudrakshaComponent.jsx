const RudrakshaComponent = ({ index, isActive, isMeru }) => {
  return (
    <div 
      className={`
        flex flex-col-reverse items-center justify-center relative h-16 w-16 mx-auto 
        transition-all duration-300
        ${isActive ? 'scale-125 z-30' : 'scale-100'}
      `}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        animation: isActive ? 'beadPulse 0.3s ease-out' : 'none'
      }}
    >
      {/* Top Thread */}
      <img
        src="/thread.png"
        alt="thread"
        className="w-12 h-4 absolute top-0 -z-10"
      />
      
      {/* Rudraksha Bead */}
      <img
        src="/rudraksha.png"
        alt="shivbhakti"
        className={`
          w-16 absolute top-3 z-20 transition-all duration-300
          ${isActive ? 'brightness-[1.3]' : 'brightness-100'}
        `}
        style={{
          filter: isActive 
            ? 'brightness(1.3) drop-shadow(0 0 15px rgba(255, 165, 0, 0.6))' 
            : 'none',
          animation: isActive ? 'beadGlow 2s infinite' : 'none'
        }}
      />

      {/* Meru Symbol (for first bead) */}
      {isMeru && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl z-30">
          <div 
            className="text-amber-600 font-bold"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
            }}
          >
            ॐ
          </div>
          {isActive && (
            <div 
              className="absolute inset-0 rounded-full bg-amber-200 opacity-20 blur-sm"
              style={{
                animation: 'meruPulse 1.5s infinite'
              }}
            />
          )}
        </div>
      )}

      {/* Bottom Thread */}
      <img
        src="/thread.png"
        alt="thread"
        className="w-12 h-4 absolute bottom-0 z-0"
      />

      {/* Bead Number (only for active bead) */}
      {isActive && (
        <div 
          className="absolute -right-12 md:-right-16 top-1/2 transform -translate-y-1/2 text-amber-500 font-bold text-xs md:text-sm bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm"
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          #{index + 1}
        </div>
      )}

    
    </div>
  );
};

export default RudrakshaComponent;