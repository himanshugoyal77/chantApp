import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GreenScreenVideo from "../../components/GreenScreenVideo";
import "./Shivling.css";
import { translations } from "../../utils/translations";
import { audioManager } from "../../utils/audioManager";

const ShivLingPuja = () => {
  const t = translations.hi.shivlinga;
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const pelaRef = useRef(null);
  const belpatraRef = useRef(null);
  const [showInstruction, setShowInstruction] = useState(true);

  const pelaStart = useRef({ x: 0, y: 0 });
  const belStart = useRef({ x: 0, y: 0 });

  const [dragging, setDragging] = useState(null); // "pela" | "bel" | null
  const [belPlaced, setBelPlaced] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const vibrate = (p = 15) => {
    navigator.vibrate?.(p);
  };

  /* Initial positions */
  useEffect(() => {
    const w = window.innerWidth;
    pelaStart.current = { x: w / 2 - 120, y: 40 };
    belStart.current = { x: w / 2 + 40, y: 40 };

    pelaRef.current.style.left = `${pelaStart.current.x}px`;
    pelaRef.current.style.top = `${pelaStart.current.y}px`;

    belpatraRef.current.style.left = `${belStart.current.x}px`;
    belpatraRef.current.style.top = `${belStart.current.y}px`;
  }, []);

  const getCenterDistance = (x, y) => {
    const video = containerRef.current.getBoundingClientRect();
    const cx = video.left + video.width / 2;
    const cy = video.top + video.height / 2;
    return Math.hypot(x - cx, y - cy);
  };

  const handleMove = (x, y) => {
    if (!dragging) return;

    if (dragging === "pela") {
      pelaRef.current.style.left = `${x - 40}px`;
      pelaRef.current.style.top = `${y - 50}px`;

      const dist = getCenterDistance(x, y);

      if (dist < 140 && !videoPlaying) {
        videoRef.current.play();
        setVideoPlaying(true);
        vibrate([10, 30, 10]);
      }

      if (dist >= 140 && videoPlaying) {
        videoRef.current.pause();
        setVideoPlaying(false);
      }
    }

    if (dragging === "bel" && !belPlaced) {
      belpatraRef.current.style.left = `${x - 140}px`;
      belpatraRef.current.style.top = `${y - 0}px`;
    }
  };

  const handleEnd = () => {
    if (dragging === "pela") {
      pelaRef.current.style.left = `${pelaStart.current.x}px`;
      pelaRef.current.style.top = `${pelaStart.current.y}px`;
      videoRef.current.pause();
      setVideoPlaying(false);
    }

    if (dragging === "bel" && !belPlaced) {
      const bel = belpatraRef.current.getBoundingClientRect();
      const vid = containerRef.current.getBoundingClientRect();

      const dist = Math.hypot(
        bel.left + bel.width / 2 - (vid.left + vid.width / 2),
        bel.top + bel.height / 2 - (vid.top + vid.height / 2),
      );

      if (dist < 120) {
        setBelPlaced(true);
        belpatraRef.current.style.left = `${vid.left + vid.width / 2}px`;
        belpatraRef.current.style.top = `${vid.top + vid.height / 2 - 80}px`;
        vibrate([30, 50, 30]);
      } else {
        belpatraRef.current.style.left = `${belStart.current.x}px`;
        belpatraRef.current.style.top = `${belStart.current.y}px`;
      }
    }

    setDragging(null);
  };

  /* Audio for pouring */
  const audioRef = useRef(new Audio("/om.mp3"));

  useEffect(() => {
    const audio = audioRef.current;
    if (videoPlaying) {
      audio.loop = true;
      audioManager.play(audio);
    } else {
      audioManager.stop(audio);
    }
  }, [videoPlaying]);

  // if user is inactive for some seconds show him a message to do puja
  // check  user touch behaviur
  const handleUserActivity = useCallback(() => {
    setShowScrollHint(false);
    if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
    inactivityTimeout.current = setTimeout(
      () => setShowScrollHint(true),
      4000
    );
  }, []);

  const triggerFeedback = useCallback((type) => {
    if (type === "bel") {
      setBelPlaced(true);
      setShowInstruction(false);
      vibrate([30, 50, 30]);
    }

    if (type === "pela") {
      videoRef.current.play();
      setVideoPlaying(true);
      vibrate([10, 30, 10]);
    }
  }, []);



  return (
    <div
      className="relative h-screen w-screen overflow-hidden touch-none"
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onTouchMove={(e) =>
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
      onTouchEnd={handleEnd}
    >
      {/* Navigate to Mala Button */}
      <button
        onClick={() => navigate("/mala")}
        className="fixed top-20 left-4 z-50 bg-[#FFD700]/20 border border-[#FFD700] text-[#FFD700] px-4 py-2 rounded-lg text-xs hover:bg-[#FFD700]/30 transition-all active:scale-95 flex items-center gap-2"
      >
        <span>🙏</span>
        <span>Mala</span>
      </button>

      {/* Shivling Video */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="h-64">
          <GreenScreenVideo ref={videoRef} videoSource="/shiv/design_gs.mp4" />
        </div>
      </div>

      {/* Belpatra */}
      <img
        ref={belpatraRef}
        src="/shiv/belpatra.png"
        draggable={false}
        onMouseDown={() => {
          if (!belPlaced) {
            setDragging("bel");
            vibrate(20);
          }
        }}
        onTouchStart={() => {
          if (!belPlaced) {
            setDragging("bel");
            vibrate(20);
          }
        }}
        className={`absolute h-20 w-20 z-50 cursor-grab transition
          ${belPlaced ? "scale-110 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]" : "hover:scale-110"}`}
      />

      {/* Feedback Message */}
      <div
        className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center transition-opacity duration-500 pointer-events-none z-50 ${
          videoPlaying || showInstruction ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-[var(--deep-gold)] text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-pulse">
          {t.chant}
        </p>
        <p className="text-white/80 text-sm mt-1">{t.offering}</p>
      </div>

      {/* Pela */}
      <img
        ref={pelaRef}
        src="/shiv/pela.png"
        draggable={false}
        onMouseDown={() => {
          setDragging("pela");
          vibrate(20);
        }}
        onTouchStart={() => {
          setDragging("pela");
          vibrate(20);
        }}
        // add glowing border
        className={`absolute h-24 w-20 z-50 cursor-grab transition-transform duration-100 animate-pulse 
          ${videoPlaying ? "drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] scale-110" : "hover:scale-110"} 
          ${dragging === "pela" ? "cursor-grabbing -rotate-12" : "cursor-grab"}`}
      />
    </div>
  );
};

export default ShivLingPuja;
