import { useEffect, useState } from "react";
import "./InstallPWA.css"; // You'll need to create this

function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPopup(true);
    });
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPopup(false);
  };

  const dismissPopup = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="install-popup-overlay">
      <div className="install-popup">
        <button className="close-btn" onClick={dismissPopup}>
          ✕
        </button>
        <div className="popup-content">
          <div className="popup-icon">📱</div>
          <h3>Install App</h3>
          <p>Install this app on your device for a better experience!</p>
          <div className="popup-actions">
            <button className="install-btn" onClick={installApp}>
              📥 Install Now
            </button>
            <button className="dismiss-btn" onClick={dismissPopup}>
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstallPWA;
