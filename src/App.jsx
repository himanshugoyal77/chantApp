import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import Lottie from "lottie-react";
import scrollInstructionAnimation from "./assets/swipe up.json";
import conFettiAnimation from "./assets/Confetti.json";
import shivLingAnimation2 from "./assets/Shivling.json";
import RudrakshaComponent from "./components/RudrakshaComponent";
import Sound from "react-sound";
import BackgroundAudio from "./components/BackgroundAudio";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { LuVibrate } from "react-icons/lu";
import InstallPWA from "./components/InstallPWA";

function App() {
  const [currentBead, setCurrentBead] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [isVibrationMute, setIsvibrationMute] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [malaCount, setMalaCount] = useState(0);
  const containerRef = useRef(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef(null);
  const inactivityTimeout = useRef(null);
  const audioContextRef = useRef(null);

  const [isSoundMute, setIsSoundMute] = useState(false); // Controls "Click" Sound
  const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false); // Controls "Om"

  // Initialize audio context on user interaction
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();
    }
    return audioContextRef.current;
  };

  // Play bead sound
  const playBeadSound = useCallback(() => {
    if (isSoundMute) return; // FIX: Exit if muted

    try {
      const audioCtx = initAudioContext();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(180, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        100,
        audioCtx.currentTime + 0.08,
      );

      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.1,
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.error(e);
    }
  }, [isSoundMute]); // Re-bind when mute state changes

  const triggerFeedback = useCallback(() => {
    playBeadSound(); // This now checks isSoundMute internally

    if (!isVibrationMute && "vibrate" in navigator) {
      navigator.vibrate([10, 5, 10]);
    }
  }, [playBeadSound, isVibrationMute]);

  // Clean UI Toggles
  const toggleBgAudio = () => setIsBgMusicPlaying(!isBgMusicPlaying);
  const toggleSoundMute = () => setIsSoundMute(!isSoundMute);
  const toggleVibration = () => setIsvibrationMute(!isVibrationMute);

  const TOTAL_BEADS = 20;

  const moveToNextBead = useCallback(() => {
    if (isScrolling.current) return;

    isScrolling.current = true;

    setCurrentBead((prev) => {
      const next = prev + 1;

      if (next === TOTAL_BEADS) {
        setShowModal(true);
        setMalaCount((m) => m + 1);
        triggerFeedback();
        return 0; // start new mala
      }

      triggerFeedback();
      return next;
    });

    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 500); // Increased from 250ms to 500ms for better debouncing
  }, [triggerFeedback]);

  // Handle user activity
  const handleUserActivity = useCallback(() => {
    setShowScrollHint(false);

    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }

    inactivityTimeout.current = setTimeout(() => {
      setShowScrollHint(true);
    }, 3000);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      handleUserActivity();

      // Only move if scrolling down with sufficient delta
      if (e.deltaY > 5) {
        moveToNextBead();
      }
    };

    // Touch handling with better swipe detection
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      handleUserActivity();
    };

    const handleTouchEnd = (e) => {
      if (isScrolling.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      // Only advance on swipe up with minimum distance
      if (deltaY > 20) {
        moveToNextBead();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        moveToNextBead();
        handleUserActivity();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    // Initialize audio context on first user interaction
    const initAudioOnInteraction = () => {
      initAudioContext();
      window.removeEventListener("click", initAudioOnInteraction);
      window.removeEventListener("touchstart", initAudioOnInteraction);
    };

    window.addEventListener("click", initAudioOnInteraction);
    window.addEventListener("touchstart", initAudioOnInteraction);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", initAudioOnInteraction);
      window.removeEventListener("touchstart", initAudioOnInteraction);
      clearTimeout(scrollTimeout.current);
      clearTimeout(inactivityTimeout.current);

      // Clean up audio context
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };
  }, [handleUserActivity, moveToNextBead]);

  // Auto-scroll to center the current bead
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const beadHeight = 64;
    const scrollPosition = currentBead * beadHeight;

    container.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  }, [currentBead]);

  return (
    <div className="app-wrapper">
      <BackgroundAudio url="/om.mp3" isPlaying={isBgMusicPlaying} />
      <InstallPWA />
      <div className="fixed top-4 right-4 md:top-8 md:right-8 flex gap-3 z-50">
        {/* BG Music Toggle */}
        <button
          onClick={toggleBgAudio}
          className="control-button bg-[var(--deep-gold)]"
        >
          {isBgMusicPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
        </button>

        {/* Click Sound Toggle */}
        <button
          onClick={toggleSoundMute}
          className={`control-button ${isSoundMute ? "bg-gray-600" : "bg-[var(--deep-gold)]"}`}
        >
          {isSoundMute ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
        </button>

        {/* Vibration Toggle */}
        <button
          onClick={toggleVibration}
          className={`control-button ${isVibrationMute ? "bg-gray-600" : "bg-[var(--deep-gold)]"}`}
        >
          <LuVibrate size={16} />
        </button>
      </div>

      {/* Progress Circle Top Left */}
      <div className="fixed top-4 left-4 md:top-8 md:left-8 flex flex-col gap-4 z-40">
        <div className="flex flex-col">
          <span className="text-[var(--deep-gold)] text-[10px] opacity-70 tracking-widest">
            MALA COUNT
          </span>
          <BackgroundAudio url="/om.mp3" />
          <span className="text-2xl font-bold text-white leading-none">
            {malaCount / 2}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[var(--deep-gold)] text-[10px] opacity-70 tracking-widest">
            BEAD
          </span>
          <span className="text-xl font-light text-white leading-none">
            {currentBead + 1}
            <span className="text-xs opacity-40">/20</span>
          </span>
        </div>
      </div>

      {/* Scroll Animation */}
      <div
        className={`center-highlight fixed bottom-20 md:bottom-24 left-1/2 transform -translate-x-1/2 w-24 h-24 md:w-32 md:h-32 pointer-events-none z-40 transition-opacity duration-500 ${
          showScrollHint ? "opacity-100" : "opacity-0"
        }`}
      >
        <Lottie animationData={scrollInstructionAnimation} loop={true} />
      </div>

      {/* Mala Container */}
      <div
        className="h-screen w-full overflow-hidden relative cursor-ns-resize"
        ref={containerRef}
      >
        <div className="mala-beads-container">
          {Array.from({ length: 20 }).map((_, index) => (
            <RudrakshaComponent
              key={index}
              index={index}
              isActive={index === currentBead}
              isMeru={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Bottom Status */}
      <div className="instructions">
        {currentBead === 0 && malaCount === 0 && "Swipe up to begin your Japa"}
        {currentBead > 0 && "Om Namah Shivaya"}
        {currentBead === 19 && "Last bead of this mala"}
        {currentBead === 0 && malaCount > 0 && `Mala Complete ×${malaCount} 🙏`}
      </div>

      {/* Aesthetic Border */}
      <div className="absolute inset-0 border-8 md:border-[16px] border-[#1a1612] pointer-events-none z-50 opacity-50"></div>

      {/* Completion Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-pop">
            <div className="modal-body flex flex-col items-center text-center">
              <Lottie
                animationData={shivLingAnimation2}
                loop={true}
                style={{ width: "140px", height: "140px" }}
              />

              <button className="modal-button">Arpan milk to shiv linga</button>

              <Lottie
                animationData={conFettiAnimation}
                loop={true}
                style={{ width: "100px", height: "100px" }}
              />
              <p className="text-white opacity-70 text-sm mb-6">
                You have completed round {malaCount / 2} of your Japa.
              </p>

              <button
                className="modal-button"
                onClick={() => setShowModal(false)}
              >
                CONTINUE CHANTING
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
