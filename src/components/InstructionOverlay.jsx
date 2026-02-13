import React, { useState, useEffect } from "react";
import { X, Info } from "lucide-react";

/**
 * @param {string} storageKey - Unique key for localStorage
 * @param {string} title - Title of the instruction
 * @param {string} instruction - Main instruction text
 * @param {React.ReactNode} icon - Optional icon to display
 */
const InstructionOverlay = ({
  isVisible,
  onDismiss,
  title,
  instruction,
  icon,
  storageKey = null, // No longer using localStorage
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    // Always show if isVisible is true, no localStorage check
    setShow(isVisible);
  }, [isVisible]);

  const handleDismiss = () => {
    setShow(false);
    if (onDismiss) onDismiss();
    // No localStorage save
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none p-4 pb-24 sm:pb-4">
      <div className="bg-gradient-to-br from-[#1a1612]/98 to-[#0e0c0a]/98 border-2 border-[var(--deep-gold)] text-white p-6 md:p-8 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.4)] max-w-sm w-full pointer-events-auto transform transition-all animate-fade-in-up relative flex flex-col items-center text-center gap-4 backdrop-blur-md">
        
        <button 
          onClick={dismiss}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors active:scale-95"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[var(--deep-gold)]/20 to-[#FF6B35]/10 flex items-center justify-center text-[var(--deep-gold)] mb-2 border-2 border-[var(--deep-gold)]/30">
          {icon || <Info size={28} />}
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-[var(--deep-gold)]">{title}</h3>
        
        <p className="text-gray-300 leading-relaxed text-sm md:text-base">
          {instruction}
        </p>

        <button
          onClick={dismiss}
          className="mt-2 w-full bg-gradient-to-r from-[var(--deep-gold)] to-[#FDB931] text-black font-semibold py-3 md:py-4 rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all shadow-lg active:scale-95 text-sm md:text-base"
        >
          {title.includes("Mala") || title.includes("माला") ? "ठीक है 🙏" : "ठीक है"}
        </button>
      </div>
    </div>
  );
};

export default InstructionOverlay;
