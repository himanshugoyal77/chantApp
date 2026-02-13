import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const GreenScreenVideo = forwardRef(({ videoSource, onReady }, ref) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);

  useImperativeHandle(ref, () => videoRef.current);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const draw = () => {
      if (video.videoWidth) {
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = frame.data;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];

          if (g > 100 && g > r * 1.2 && g > b * 1.2) {
            d[i + 3] = 0;
          }
        }

        ctx.putImageData(frame, 0, 0);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const onCanPlay = () => {
      onReady?.();
      draw(); // ⭐ draw immediately, even paused
    };

    video.addEventListener("canplay", onCanPlay);
    video.load();

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      cancelAnimationFrame(rafRef.current);
    };
  }, [videoSource, onReady]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <video
        ref={videoRef}
        src={videoSource}
        muted
        loop
        playsInline
        preload="auto"
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
});

GreenScreenVideo.displayName = "GreenScreenVideo";
export default GreenScreenVideo;
