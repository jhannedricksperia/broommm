import React from "react";
import { useCommute } from "../context/CommuteContext";

export default function BottomNav() {
  const { currentScreen, navigate } = useCommute();

  const isHomeActive = currentScreen === "home" || currentScreen === "results";
  const isHistoryActive = currentScreen === "history";

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.06)] border-t border-outline-variant/30">
      <div className="flex justify-around items-center h-16 max-w-[440px] mx-auto px-margin-mobile">
        {/* Home Tab */}
        <button
          type="button"
          onClick={() => navigate("home")}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] px-space-md py-space-xs transition-colors ${
            isHomeActive
              ? "text-primary-container font-title-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className={`material-symbols-outlined text-2xl ${isHomeActive ? "fill-1" : ""}`}>
            calculate
          </span>
          <span className="font-label-caps text-label-caps uppercase mt-1 tracking-wider font-bold">
            Home
          </span>
        </button>

        {/* History Tab */}
        <button
          type="button"
          onClick={() => navigate("history")}
          className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] px-space-md py-space-xs transition-colors ${
            isHistoryActive
              ? "text-primary-container font-title-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className={`material-symbols-outlined text-2xl ${isHistoryActive ? "fill-1" : ""}`}>
            history
          </span>
          <span className="font-label-caps text-label-caps uppercase mt-1 tracking-wider font-bold">
            History
          </span>
        </button>
      </div>
    </nav>
  );
}
