import React, { useLayoutEffect, useRef, useState } from "react";
import { useCommute } from "../context/CommuteContext";

export default function Header() {
  const { currentScreen, navigate, goBack, savedRoutes } = useCommute();
  const showBack = currentScreen === "results" || currentScreen === "compare";
  const navRef = useRef(null);
  const [pill, setPill] = useState(null);

  const logoUrl = "/logo.png";

  const isHomeActive = currentScreen === "home" || currentScreen === "results" || currentScreen === "compare";
  const isHistoryActive = currentScreen === "history";

  const activeKey = isHistoryActive ? "history" : "home";
  useLayoutEffect(() => {
    const el = navRef.current?.querySelector(`[data-tab="${activeKey}"]`);
    if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [activeKey, savedRoutes.length]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/30 pt-safe transition-all shadow-sm">
      <div className="h-16 px-4 sm:px-6 md:px-8 flex items-center justify-between max-w-[1400px] mx-auto w-full">
        {/* Left: Back / Brand Logo & Title */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              type="button"
              aria-label="Back"
              onClick={goBack}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-container text-on-surface active:scale-95 transition-all -ml-1"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
          )}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate("home")}
          >
            <img
              src={logoUrl}
              alt="Broommm Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-primary uppercase font-extrabold tracking-tight">
                Broommm
                <span className="ml-1.5 align-middle text-[9px] font-bold tracking-wider bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded">DEMO</span>
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase font-mono tracking-wider -mt-1 hidden sm:block">
                Commute Calculator
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Bar (Visible on md and above) */}
        <nav ref={navRef} className="hidden md:flex relative items-center gap-1 bg-surface-container-low px-2 py-1 rounded-xl border border-outline-variant/20">
          {pill && (
            <span
              aria-hidden
              className="absolute top-1 bottom-1 left-0 rounded-lg bg-primary-container shadow-sm transition-[transform,width] duration-300 ease-fluent-decel"
              style={{ width: pill.w, transform: `translateX(${pill.x}px)` }}
            />
          )}
          <button
            type="button"
            data-tab="home"
            onClick={() => navigate("home")}
            className={`relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold uppercase transition-colors duration-200 ${
              isHomeActive
                ? "text-on-primary"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className={`material-symbols-outlined text-lg ${isHomeActive ? "fill-1" : ""}`}>
              calculate
            </span>
            <span>Calculate</span>
          </button>

          <button
            type="button"
            data-tab="history"
            onClick={() => navigate("history")}
            className={`relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold uppercase transition-colors duration-200 ${
              isHistoryActive
                ? "text-on-primary"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className={`material-symbols-outlined text-lg ${isHistoryActive ? "fill-1" : ""}`}>
              history
            </span>
            <span>Saved Routes</span>
            {savedRoutes.length > 0 && (
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                isHistoryActive ? "bg-secondary-fixed text-primary" : "bg-surface-container text-on-surface"
              }`}>
                {savedRoutes.length}
              </span>
            )}
          </button>
        </nav>

      </div>
    </header>
  );
}
