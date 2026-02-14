import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import scrollInstructionAnimation from "../../assets/swipe up.json";
import shivLingAnimation2 from "../../assets/Shivling.json";
import RudrakshaComponent from "../../components/RudrakshaComponent";
import BackgroundAudio from "../../components/BackgroundAudio";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { LuVibrate } from "react-icons/lu";
import InstallPWA from "../../components/InstallPWA";
import InstructionOverlay from "../../components/InstructionOverlay";
import { MoveDown } from "lucide-react";
import { translations } from "../../utils/translations";
import { audioManager } from "../../utils/audioManager";

function Mala() {
  const t = translations.hi.mala;
  const navigate = useNavigate();

  const TOTAL_BEADS = 108;
  const SCROLL_COOLDOWN = 400;
  const SCROLL_THRESHOLD = 40;

  // show ॐ only at milestones
  const AUM_MILESTONES = [27, 54, 81, 108];

  const [currentBead, setCurrentBead] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [isVibrationMute, setIsvibrationMute] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [malaCount, setMalaCount] = useState(0);
  const [aumAnimationKey, setAumAnimationKey] = useState(0);
  const [showProgressMessage, setShowProgressMessage] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");

  // View mode: 'mala' or 'tap' - No localStorage persistence
  const [viewMode, setViewMode] = useState("mala");

  // daily streak system - ONLY localStorage for streak
  const [streak, setStreak] = useState(
    Number(localStorage.getItem("mala-streak") || 0),
  );

  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = (currentBead + 1) / 108;
  const strokeDashoffset = circumference - progress * circumference;

  const containerRef = useRef(null);
  const beadsContainerRef = useRef(null);
  const lastScrollTime = useRef(0);
  const touchHandled = useRef(false);
  const progressMessageTimeout = useRef(null);
  const inactivityTimeout = useRef(null);
  const audioContextRef = useRef(null);

  const [isSoundMute, setIsSoundMute] = useState(false);
  const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false);

  // ---------- AUDIO ----------
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();
    }
    return audioContextRef.current;
  };

  const playBeadSound = useCallback(() => {
    if (isSoundMute) return;
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
    } catch {}
  }, [isSoundMute]);

  const triggerFeedback = useCallback(
    (showAum = false) => {
      playBeadSound();

      if (!isVibrationMute && "vibrate" in navigator) {
        navigator.vibrate([10, 5, 10]);
      }

      if (showAum) {
        setAumAnimationKey((prev) => prev + 1);
      }
    },
    [playBeadSound, isVibrationMute],
  );

  // on every tap show aum animation
  const triggerFeedbackOnTap = useCallback(() => {
    playBeadSound();

    if (!isVibrationMute && "vibrate" in navigator) {
      navigator.vibrate([10, 5, 10]);
    }

    setAumAnimationKey((prev) => prev + 1);
  }, [playBeadSound, isVibrationMute]);

  // ---------- USER ACTIVITY ----------
  const handleUserActivity = useCallback(() => {
    setShowScrollHint(false);
    if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
    inactivityTimeout.current = setTimeout(() => setShowScrollHint(true), 4000);
  }, []);

  // ---------- STREAK ----------
  const updateStreak = () => {
    const lastDate = localStorage.getItem("last-mala-date");
    const today = new Date().toDateString();

    if (lastDate !== today) {
      setStreak((s) => {
        const newStreak = s + 1;
        localStorage.setItem("mala-streak", newStreak);
        return newStreak;
      });
      localStorage.setItem("last-mala-date", today);
    }
  };

  // ---------- TOGGLE VIEW MODE ----------
  const toggleViewMode = () => {
    const newMode = viewMode === "mala" ? "tap" : "mala";
    setViewMode(newMode);
    setAumAnimationKey(0);
    setCurrentBead(0);
    // No localStorage persistence
  };

  // ---------- TAP MODE HANDLER ----------
  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollTime.current < 100) return; // Faster cooldown for taps

    lastScrollTime.current = now;

    setCurrentBead((prev) => {
      const next = prev + 1;

      const showAum = AUM_MILESTONES.includes(next);
      if (showAum) {
        triggerFeedback(true);
      } else {
        triggerFeedbackOnTap();
      }

      if (next === TOTAL_BEADS) {
        setShowModal(true);
        setMalaCount((m) => m + 1);
        updateStreak();
        return 0;
      }

      return next;
    });
  }, [triggerFeedback, triggerFeedbackOnTap]);

  // ---------- MOVE BEAD ----------
  const moveToNextBead = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;

    lastScrollTime.current = now;

    setCurrentBead((prev) => {
      const next = prev + 1;

      const showAum = AUM_MILESTONES.includes(next);
      triggerFeedback(showAum);

      if (next === TOTAL_BEADS) {
        setShowModal(true);
        setMalaCount((m) => m + 1);
        updateStreak();
        return 0;
      }

      return next;
    });
  }, [triggerFeedback]);

  // ---------- SCROLL / TOUCH ----------
  // ---------- SCROLL / TOUCH ----------
  useEffect(() => {
    const container = containerRef.current;
    if (!container || viewMode !== "mala") return;

    let touchStartY = 0;
    let touchStartTime = 0;
    let hasTriggered = false;
    let isMouseDown = false;
    let mouseStartY = 0;

    const handleWheel = (e) => {
      e.preventDefault();
      // allow ONLY downward scroll
      if (e.deltaY > 0) {
        // Only trigger on scroll down
        moveToNextBead();
        handleUserActivity();
      }
    };

    const handleMouseDown = (e) => {
      // Only handle left click (button 0)
      if (e.button !== 0) {
        e.preventDefault();
        return;
      }
      isMouseDown = true;
      mouseStartY = e.clientY;
      hasTriggered = false;
      handleUserActivity();
    };

    const handleMouseMove = (e) => {
      if (!isMouseDown || hasTriggered) return;
      e.preventDefault();

      const deltaY = mouseStartY - e.clientY; // Negative for swipe down

      // Only trigger on significant swipe down
      if (deltaY < -SCROLL_THRESHOLD) {
        hasTriggered = true;
        moveToNextBead();
        isMouseDown = false; // Reset after trigger
      }
    };

    const handleMouseUp = (e) => {
      e.preventDefault();
      isMouseDown = false;
      hasTriggered = false;
    };

    const handleMouseLeave = (e) => {
      isMouseDown = false;
      hasTriggered = false;
    };

    const handleTouchStart = (e) => {
      e.preventDefault(); // Prevent default touch behavior
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      hasTriggered = false;
      handleUserActivity();
    };

    const handleTouchMove = (e) => {
      e.preventDefault(); // Always prevent default to stop scrolling
      if (hasTriggered) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY; // Negative for swipe down

      // Only trigger on significant swipe down
      if (deltaY < -SCROLL_THRESHOLD) {
        hasTriggered = true;
        moveToNextBead();
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      hasTriggered = false;
    };

    const handleContextMenu = (e) => {
      e.preventDefault(); // Prevent right-click context menu
      return false;
    };

    // Add event listeners with proper options
    container.addEventListener("wheel", handleWheel, { passive: false });

    // Mouse events for desktop
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Touch events for mobile
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });

    // Prevent context menu on right click
    container.addEventListener("contextmenu", handleContextMenu);

    return () => {
      container.removeEventListener("wheel", handleWheel);

      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseLeave);

      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [moveToNextBead, handleUserActivity, viewMode]);

  // ---------- AUTO SCROLL ----------
  useEffect(() => {
    const container = containerRef.current;
    if (!container || viewMode !== "mala") return;

    const beadHeight = 64;
    // Use transform instead of scrollTo for smoother animation without actual scrolling
    if (beadsContainerRef.current) {
      beadsContainerRef.current.style.transform = `translateY(-${currentBead * beadHeight}px)`;
    }
  }, [currentBead, viewMode]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#101022] via-[#151535] to-[#101022] flex flex-col items-center justify-center overflow-hidden">
      <InstallPWA />
      <BackgroundAudio url="/om.mp3" isPlaying={isBgMusicPlaying} />

      <InstructionOverlay
        storageKey="mala-instruction-seen"
        title={t.overlay.title}
        instruction="नीचे swipe करें • Swipe Down"
        icon={<MoveDown size={32} />}
      />

      {/* Audio Controls */}
      <div className="fixed top-20 right-7 z-50 flex gap-2">
        <button
          onClick={() => setIsBgMusicPlaying(!isBgMusicPlaying)}
          className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center text-[#101022]"
        >
          {isBgMusicPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
        </button>
        <button
          onClick={() => setIsSoundMute(!isSoundMute)}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isSoundMute ? "bg-gray-600" : "bg-[#FFD700] text-[#101022]"
          }`}
        >
          {isSoundMute ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
        </button>
        <button
          onClick={() => setIsvibrationMute(!isVibrationMute)}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isVibrationMute ? "bg-gray-600" : "bg-[#FFD700] text-[#101022]"
          }`}
        >
          <LuVibrate size={16} />
        </button>
      </div>

      {/* Floating Aum */}
      <div
        key={aumAnimationKey}
        className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
      >
        <div
          className="text-[10rem] text-[#FFD700] opacity-0 font-bold"
          style={{ animation: "floatUp 2.5s ease-out forwards" }}
        >
          ॐ
        </div>
      </div>

      {/* Toast */}
      <div
        className={`fixed top-32 left-1/2 -translate-x-1/2 z-50 transition-all ${
          showProgressMessage ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="bg-[#FFD700] text-[#101022] px-6 py-3 rounded-full">
          {progressMessage}
        </div>
      </div>

      {/* Stats */}
      <div className="fixed top-20 left-4 flex flex-col gap-3 text-white z-40 items-center justify-center ">
        <div className="bg-[#2A2A4A]/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#FFD700]/30">
          🔥 Streak: {streak} {streak === 1 ? "day" : "days"}
        </div>

        {/* Circular progress bar */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="rotate-[-90deg]"
          >
            {/* Background circle */}
            <circle
              stroke="rgba(255,255,255,0.1)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <circle
              stroke="url(#gradient)"
              fill="transparent"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-500"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#58CC02" />
                <stop offset="100%" stopColor="#89E219" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center text */}
          <div className="absolute text-white font-bold text-xl">
            {currentBead + 1}
          </div>
        </div>
        <div className="text-center text-sm opacity-70">
          {currentBead + 1} / {TOTAL_BEADS}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed top-36 right-7 flex flex-col gap-2 z-50">
        <button
          onClick={toggleViewMode}
          className="bg-[#2A2A4A] border border-[#FFD700] text-[#FFD700] px-4 py-2 rounded-lg text-sm hover:bg-[#FFD700] hover:text-[#2A2A4A] transition-all active:scale-95 shadow-lg flex items-center gap-2 backdrop-blur-sm"
        >
          {viewMode === "mala" ? (
            <>
              <span>🖱️</span>
              <span>Tap Mode</span>
            </>
          ) : (
            <>
              <span>📿</span>
              <span>Mala Mode</span>
            </>
          )}
        </button>

        <button
          onClick={() => navigate("/shivlinga")}
          className="bg-[#2A2A4A] border border-[#FF6B35] text-[#FF6B35] px-4 py-2 rounded-lg text-sm hover:bg-[#FF6B35] hover:text-[#2A2A4A] transition-all active:scale-95 shadow-lg flex items-center gap-2 backdrop-blur-sm"
        >
          <span>🔱</span>
          <span>Shivlinga</span>
        </button>
      </div>

      {/* Scroll hint - Only in mala mode */}
      {viewMode === "mala" && (
        <div
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none z-40 transition-opacity duration-500 ${
            showScrollHint ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* flip the animation */}
          <Lottie
          className="rotate-180 transition-all duration-500"
          
          animationData={scrollInstructionAnimation} loop />
        </div>
      )}

      {/* TAP VIEW MODE */}
      {viewMode === "tap" && (
        <div className="flex flex-col items-center justify-center h-screen relative">
          <button
            onClick={handleTap}
            className="group relative w-64 h-64 rounded-full flex items-center justify-center active:scale-95 transition-all duration-200"
          >
            {/* Outer Aura Ring */}
            <div className="absolute inset-0 rounded-full bg-[#FFD700]/20 blur-2xl animate-pulse"></div>

            {/* Energy Ring */}
            <div className="absolute inset-[-12px] rounded-full border border-[#FFD700]/40 animate-spin-slow"></div>

            {/* Main Button */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#FFD700] to-[#FDB931] flex items-center justify-center shadow-[0_0_60px_rgba(255,215,0,0.5)] group-hover:shadow-[0_0_90px_rgba(255,215,0,0.7)] transition-all">
              {/* Om Symbol */}
              <div className="text-7xl font-bold text-[#101022] tracking-wide">
                ॐ
              </div>

              {/* Ripple Wave */}
              <span className="absolute inset-0 rounded-full border border-white/40 scale-0 opacity-0 group-active:scale-[1.6] group-active:opacity-100 transition-all duration-700" />

              {/* Inner Glow */}
              <div className="absolute inset-0 rounded-full bg-white/10 blur-xl opacity-50" />
            </div>

            {/* Floating Energy Particles on Tap */}
            <div className="pointer-events-none absolute inset-0">
              <span className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full opacity-0 group-active:animate-ping"></span>
              <span className="absolute bottom-12 right-12 w-2 h-2 bg-white rounded-full opacity-0 group-active:animate-ping delay-100"></span>
              <span className="absolute top-1/2 left-6 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-active:animate-ping delay-200"></span>
            </div>
          </button>

          <p className="mt-10 text-[#FFD700] text-sm opacity-70 tracking-widest uppercase">
            {currentBead + 1}/{TOTAL_BEADS} • Tap to Chant
          </p>
        </div>
      )}

      {/* MALA VIEW MODE - FIXED VERSION */}
      {viewMode === "mala" && (
        <div
          ref={containerRef}
          className="h-screen w-full overflow-hidden cursor-ns-resize relative"
          style={{ touchAction: "none" }}
        >
          <div
            ref={beadsContainerRef}
            className="flex flex-col items-center transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: `translateY(${45}vh)`, // Initial offset
              paddingBottom: "50vh",
            }}
          >
            {Array.from({ length: TOTAL_BEADS + 8 }).map((_, index) => (
              <div
                key={index}
                style={{ height: 64 }}
                className="flex items-center justify-center"
              >
                <RudrakshaComponent
                  index={index - 5}
                  isActive={index === currentBead + 5}
                  isMeru={index === 5}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-[1000]">
          <div className="bg-[#1a1612] border border-[#FFD700] p-10 rounded-3xl text-center max-w-[320px] w-[90%]">
            <Lottie
              animationData={shivLingAnimation2}
              loop
              className="w-32 h-32 mx-auto"
            />
            <h2 className="text-[#FFD700] text-xl my-4">{t.modal.title}</h2>
            <p className="text-white/70 mb-6">
              {t.modal.desc.replace("{count}", malaCount)}
            </p>
            <button
              className="border border-[#FFD700] text-[#FFD700] px-8 py-2 rounded-full hover:bg-[#FFD700] hover:text-black transition-colors"
              onClick={() => setShowModal(false)}
            >
              {t.modal.btn}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-300px) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spinSlow 18s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Mala;
