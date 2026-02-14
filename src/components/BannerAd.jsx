import { useEffect, useRef } from "react";

const BannerAd = () => {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Set global ad config
    window.atOptions = {
      key: "33ca2d4ee8148924750405aa9d778819",
      format: "iframe",
      height: 60,
      width: 468,
      params: {},
    };

    // Create script element
    const script = document.createElement("script");
    script.src =
      "https://www.highperformanceformat.com/33ca2d4ee8148924750405aa9d778819/invoke.js"; // replace if provider gives different url
    script.async = true;

    adRef.current.appendChild(script);

    // cleanup on unmount
    return () => {
      if (adRef.current) adRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50">
      <div ref={adRef} style={{ width: 468, height: 60 }} />
    </div>
  );
};

export default BannerAd;
