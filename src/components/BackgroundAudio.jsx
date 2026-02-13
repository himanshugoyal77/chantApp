// components/BackgroundAudio.jsx
import { useEffect, useRef } from "react";
import { audioManager } from "../utils/audioManager";

const BackgroundAudio = ({ url, isPlaying }) => {
  const audioRef = useRef(new Audio(url));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.loop = true;

    if (isPlaying) {
      audioManager.play(audio);
    } else {
      audioManager.stop(audio);
    }

    return () => {
      audioManager.stop(audio);
    };
  }, [isPlaying]);

  return null;
};

export default BackgroundAudio;
