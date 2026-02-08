// components/BackgroundAudio.jsx
import { useEffect, useRef } from "react";

const BackgroundAudio = ({ url, isPlaying }) => {
  const audioRef = useRef(new Audio(url));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;

    if (isPlaying) {
      // Browsers require a user gesture to play.
      // Since the button click is a gesture, this will work.
      audio.play().catch((err) => console.log("Audio play blocked:", err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  return null;
};

export default BackgroundAudio;
