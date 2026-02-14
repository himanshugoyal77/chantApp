const TapChantPage = ()=> {
    return (
        <div>
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
        </div>
    )
}

export default TapChantPage