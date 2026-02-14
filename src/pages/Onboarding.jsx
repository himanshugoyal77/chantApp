import Lottie from "lottie-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import shivlingAnimation from "../assets/Shivling.json";
import WeeklyStreak from "../components/WeeklyStreak";

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    console.log("Onboarding completed");
    navigate("/mala");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0c0a] via-[#1a1612] to-[#0e0c0a] text-white overflow-hidden">
      {/* Screen 1: Divine Welcome */}
      {currentStep === 0 && (
        <div className="relative flex flex-col h-screen w-full max-w-md mx-auto px-6">
          {/* Skip Button */}
          <div className="flex justify-end pt-8">
            <button
              onClick={completeOnboarding}
              className="text-white/60 text-sm font-medium hover:text-white transition-colors"
            >
              छोड़ें
            </button>
          </div>

          {/* Illustration Area */}
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <div className="relative w-full aspect-square max-w-[280px] flex items-center justify-center">
              {/* Decorative circles */}
              <div className="absolute inset-0 rounded-full border border-[#FF9933]/20 animate-pulse"></div>
              <div className="absolute inset-4 rounded-full border border-[#FFD700]/10"></div>

              {/* Om Symbol */}
              <Lottie animationData={shivlingAnimation} />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col items-center text-center space-y-4 pb-8">
            <h1 className="text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-tight px-2">
              <span className="text-[#FFD700]">भगवान शिव</span> की भक्ति
            </h1>
            <p className="text-white/70 text-base font-normal leading-relaxed px-4">
              डिजिटल माला के साथ जाप करें और शिवलिंग का अभिषेक करें। हर हर
              महादेव। 🙏
            </p>
          </div>

          {/* Bottom Controls */}
          <div className="w-full pb-12 space-y-6 flex flex-col items-center">
            {/* Pagination Dots */}
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="h-2 w-6 rounded-full bg-[var(--deep-gold)] shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
              <div className="h-2 w-2 rounded-full bg-white/20"></div>
              <div className="h-2 w-2 rounded-full bg-white/20"></div>
            </div>

            {/* Next Button */}
            <button
              onClick={nextStep}
              className="w-full max-w-[280px] bg-gradient-to-r from-[var(--deep-gold)] to-[#FDB931] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all duration-300 active:scale-95 shadow-lg"
            >
              <span>आगे बढ़ें</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>

          {/* Background Glow */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF9933]/5 blur-[120px] pointer-events-none"></div>
          <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--deep-gold)]/10 blur-[150px] pointer-events-none"></div>
        </div>
      )}

      {/* Screen 2: Features */}
      {currentStep === 1 && (
        <div className="flex flex-col h-screen max-w-md mx-auto items-center">
          {/* Top Navigation */}
          <div className="flex items-center p-6 justify-between">
            <button
              onClick={prevStep}
              className="text-white/60 hover:text-white flex size-10 items-center justify-center transition-colors"
            >
              <span className="text-2xl">←</span>
            </button>
            <span className="text-white/40 text-xs font-semibold tracking-widest uppercase">
              2 / 3
            </span>
          </div>

          {/* Main Content */}
          <main className="flex-1 flex flex-col px-6 justify-center">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-white tracking-tight text-3xl md:text-4xl font-extrabold leading-tight mb-4">
                आध्यात्मिक साधन
              </h1>
              <p className="text-white/60 text-base leading-relaxed max-w-[280px] mx-auto">
                जाप माला और शिवलिंग अभिषेक के लिए विशेष रूप से डिज़ाइन किया गया
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              {/* Mala Card */}
              <div className="bg-gradient-to-br from-[#1a1612]/80 to-[#0e0c0a]/80 border-2 border-[var(--deep-gold)]/30 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">🙏</div>
                  <div className="flex-1">
                    <h3 className="text-[var(--deep-gold)] text-lg font-bold mb-1">
                      जाप माला
                    </h3>
                    <p className="text-white/60 text-sm">
                      108 मनकों के साथ डिजिटल रुद्राक्ष माला
                    </p>
                  </div>
                </div>
              </div>

              {/* Shivlinga Card */}
              <div className="bg-gradient-to-br from-[#1a1612]/80 to-[#0e0c0a]/80 border-2 border-[var(--deep-gold)]/30 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">🔱</div>
                  <div className="flex-1">
                    <h3 className="text-[var(--deep-gold)] text-lg font-bold mb-1">
                      शिवलिंग दर्शन
                    </h3>
                    <p className="text-white/60 text-sm">
                      आभासी अभिषेक और बेलपत्र अर्पण
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Bottom Navigation */}
          <footer className="w-full p-6 space-y-6 flex flex-col items-center">
            {/* Pagination */}
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/20"></div>
              <div className="h-2 w-6 rounded-full bg-[var(--deep-gold)] shadow-[0_0_10px_rgba(212,175,55,0.6)]"></div>
              <div className="h-2 w-2 rounded-full bg-white/20"></div>
            </div>

            {/* Continue Button */}
            <button
              onClick={nextStep}
              className="w-full max-w-[280px] bg-gradient-to-r from-[var(--deep-gold)] to-[#FDB931] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all duration-300 active:scale-95 shadow-lg"
            >
              <span>आगे बढ़ें</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </footer>
        </div>
      )}

      {/* Screen 3: Get Started */}
      {currentStep === 2 && (
        <div className="relative flex h-screen w-full max-w-md mx-auto flex-col justify-between px-6">
          {/* Header */}
          <div className="flex items-center pt-6 pb-2 justify-between">
            <button
              onClick={prevStep}
              className="text-white/60 hover:text-white flex size-10 items-center justify-center transition-colors"
            >
              <span className="text-2xl">←</span>
            </button>
            <span className="text-white/40 text-xs font-semibold tracking-widest uppercase">
              3 / 3
            </span>
          </div>

          {/* Main Content */}
          <div className="flex flex-col flex-1 items-center justify-center">
            {/* Headline */}
            <WeeklyStreak />
            <div className="text-center my-12">
              <h1 className="text-white tracking-tight text-3xl md:text-4xl font-extrabold leading-tight mb-4">
                हर हर महादेव 🙏
              </h1>
              <p className="text-white/60 text-base leading-relaxed max-w-[280px] mx-auto">
                अपनी भक्ति यात्रा शुरू करें और भगवान शिव का आशीर्वाद प्राप्त
                करें
              </p>
            </div>

            {/* Central Visual */}
            {/* <div className="relative w-64 h-64 flex items-center justify-center mb-8">
              {/* Background Glow */}
            <div className="absolute -z-2 inset-0 bg-[var(--deep-gold)]/10 rounded-full blur-[60px]"></div>

            {/* Om Symbol */}
            {/* <div className="relative z-10 text-[8rem] text-[var(--deep-gold)] font-bold drop-shadow-[0_0_40px_rgba(212,175,55,0.8)] animate-pulse">
                ॐ
              </div>
            </div> */}

            {/* Progress Indicators */}
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-white/20"></div>
              <div className="h-2 w-2 rounded-full bg-white/20"></div>
              <div className="h-2 w-6 rounded-full bg-[var(--deep-gold)]"></div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pb-12 pt-6 flex flex-col items-center">
            <button
              onClick={completeOnboarding}
              className="w-full max-w-[280px] bg-gradient-to-r from-[var(--deep-gold)] to-[#FDB931] text-black text-lg font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            >
              शुरू करें
            </button>
            <p className="text-center text-white/40 text-xs mt-4">
              ॐ नमः शिवाय
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
