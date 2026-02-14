import { useEffect, useRef } from "react";

const TimedAdScript = () => {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);

  // config
  const AD_SHOW_TIME = 8000; // show ad for 8 seconds
  const USER_ACTIVE_LIMIT = 60000; // 60 seconds
  const CHECK_INTERVAL = 15000; // check every 15 seconds

  const lastActivityTime = useRef(Date.now());

  // track user activity
  useEffect(() => {
    const updateActivity = () => {
      lastActivityTime.current = Date.now();
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("click", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("scroll", updateActivity);
    window.addEventListener("touchstart", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("scroll", updateActivity);
      window.removeEventListener("touchstart", updateActivity);
    };
  }, []);

  // load ad script
  const loadAd = () => {
    if (!containerRef.current || scriptRef.current) return;

    const script = document.createElement("script");
    script.src =
      "https://pl28683832.effectivegatecpm.com/f8/7f/fc/f87ffcc329a29a40a71c1f1c16ee2b93.js";
    script.async = true;

    containerRef.current.appendChild(script);
    scriptRef.current = script;

    // auto remove after few seconds
    setTimeout(removeAd, AD_SHOW_TIME);
  };

  // remove ad script
  const removeAd = () => {
    if (scriptRef.current && containerRef.current) {
      containerRef.current.innerHTML = "";
      scriptRef.current = null;
    }
  };

  // check activity loop
  useEffect(() => {
    const interval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivityTime.current;

      // show ad only if user inactive for 120 sec
      if (inactiveTime >= USER_ACTIVE_LIMIT) {
        loadAd();
      } else {
        removeAd();
      }
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} />;
};

export default TimedAdScript;
