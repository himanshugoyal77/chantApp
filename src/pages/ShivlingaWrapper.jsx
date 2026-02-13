import React, { useState, useEffect } from "react";
import Mala from "../pages/mala/Mala";
import ShivLingPuja from "../pages/shivlinga/Shivlinga";
import InstructionOverlay from "../components/InstructionOverlay";
import { Hand } from "lucide-react";

const ShivlingaWrapper = () => {
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    // Create shooting stars
    const createShootingStar = () => {
      const star = {
        id: Date.now() + Math.random(),
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 20,
      };

      setShootingStars((prev) => [...prev, star]);

      // Remove star after animation
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== star.id));
      }, 6000);
    };

    // Initial stars
    for (let i = 0; i < 5; i++) {
      setTimeout(createShootingStar, i * 2000);
    }

    // Interval for new stars
    const interval = setInterval(createShootingStar, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="shivlinga-page app-wrapper">
      <InstructionOverlay 
        storageKey="shivlinga-instruction-seen"
        title="Shivlinga Abhishek"
        instruction="Drag the Copper Vessel (Pela) over the Shivlinga to perform Abhishek. You can also offer Belpatra."
        icon={<Hand size={32} />}
      />
      {/* Cosmic Elements */}
      <div className="cosmic-nebula"></div>
      <div className="star-field"></div>
      <div className="cosmic-dust"></div>

      {/* Black Hole Center */}
      <div className="black-hole"></div>

      {/* Universe Expansion Effect */}
      <div className="universe-expansion"></div>

      {/* Sacred Cosmic Symbols */}
      <div className="cosmic-symbol cosmic-om">🕉️</div>
      <div className="cosmic-symbol cosmic-trishul">🔱</div>
      <div className="cosmic-symbol cosmic-lotus">🌸</div>

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animation: `shooting-star-animation 6s ease-out ${star.delay}s`,
          }}
        />
      ))}

      {/* Main Content */}
      <ShivLingPuja />
    </div>
  );
};

export default ShivlingaWrapper;
