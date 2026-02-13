import React from "react";

const WeeklyStreak = ({
  completedDays = [true, true, true, true, false, false, false],
  currentDay = 3, // 0=Sun, 1=Mon, 2=Tue, 3=Wed...
}) => {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const completedCount = completedDays.filter(Boolean).length;
  const isPerfectWeek = completedCount === 7;

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-[#1a1612]/90 to-[#0e0c0a]/95 border border-[#FFD700]/30 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-sm">
      {/* Container for Days and Star */}
      <div className="flex flex-row items-center justify-between gap-2">
        
        {/* Days Grid: Responsive columns */}
        <div className="grid grid-cols-7 flex-grow gap-1 sm:gap-3">
          {days.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <span
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-tighter sm:tracking-normal ${
                  index === currentDay
                    ? "text-[#FFD700]"
                    : "text-white/40"
                }`}
              >
                {day}
              </span>

              <div
                className={`
                  relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300
                  ${
                    completedDays[index]
                      ? "bg-[#FFD700] text-[#1a1612] shadow-[0_0_10px_rgba(255,215,0,0.3)] scale-105"
                      : "bg-white/5 border border-white/10 text-white/20"
                  }
                `}
              >
                {completedDays[index] ? (
                  <span className="font-bold">✓</span>
                ) : (
                  <span className="text-[10px] opacity-30">{index + 1}</span>
                )}
                
                {/* Underline for Current Day */}
                {index === currentDay && (
                   <div className="absolute -bottom-1 w-1 h-1 bg-[#FFD700] rounded-full animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Star for perfect week - Hidden on very small screens or resized */}
        <div className={`
          flex flex-col items-center justify-center pl-2 border-l border-white/10 ml-1 sm:ml-4
          ${isPerfectWeek ? "animate-bounce" : "opacity-40"}
        `}>
          <span className="text-xl sm:text-2xl">
            {isPerfectWeek ? "⭐" : "☆"}
          </span>
          <span className="text-[8px] text-[#FFD700] font-bold uppercase mt-1">Goal</span>
        </div>
      </div>

      {/* Message Area */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed text-center sm:text-left">
          {isPerfectWeek ? (
            <span className="flex items-center justify-center sm:justify-start gap-2">
              Amazing! Perfect week streak 🎉
            </span>
          ) : (
            <>
              You have completed <span className="text-[#FFD700] font-bold">{completedCount}/7</span> days.{" "}
              <span className="block sm:inline text-[#FFD700]/80">Keep going for a perfect week!</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default WeeklyStreak;