import React from "react";
import { Link } from "react-router-dom";
import { translations } from "../utils/translations";

const Home = () => {
  const t = translations.hi.home;
  
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 text-center bg-gradient-to-br from-[#0e0c0a] via-[#1a1612] to-[#0e0c0a] relative overflow-hidden">
      {/* Spiritual Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05),transparent_70%)]"></div>
      
      {/* Om Symbol Watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[20rem] md:text-[30rem] text-[var(--deep-gold)] opacity-[0.02] pointer-events-none select-none font-bold">
        ॐ
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-8 md:gap-12 w-full">
        {/* Greeting */}
        <div className="space-y-3 md:space-y-4 animate-fade-in-up">
          <div className="text-3xl md:text-4xl font-bold text-[#FF6B35] drop-shadow-lg animate-pulse">
            {t.greeting}
          </div>
          <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent drop-shadow-lg">
            {t.title}
          </h1>
          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 w-full px-4">
          <Link
            to="/mala"
            className="group relative overflow-hidden rounded-2xl border-2 border-[var(--deep-gold)]/30 bg-gradient-to-br from-[#1a1612]/80 to-[#0e0c0a]/80 p-6 md:p-8 transition-all hover:scale-105 hover:border-[var(--deep-gold)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] active:scale-100 min-h-[160px] md:min-h-[180px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--deep-gold)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-3 right-3 text-5xl md:text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🙏</div>
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--deep-gold)] mb-2 md:mb-3">{t.malaCard.title}</h2>
            <p className="text-sm md:text-base text-gray-400">
              {t.malaCard.desc}
            </p>
          </Link>

          <Link
            to="/shivlinga"
            className="group relative overflow-hidden rounded-2xl border-2 border-[var(--deep-gold)]/30 bg-gradient-to-br from-[#1a1612]/80 to-[#0e0c0a]/80 p-6 md:p-8 transition-all hover:scale-105 hover:border-[var(--deep-gold)] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] active:scale-100 min-h-[160px] md:min-h-[180px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--deep-gold)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-3 right-3 text-5xl md:text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🔱</div>
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--deep-gold)] mb-2 md:mb-3">{t.shivlingaCard.title}</h2>
            <p className="text-sm md:text-base text-gray-400">
              {t.shivlingaCard.desc}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
