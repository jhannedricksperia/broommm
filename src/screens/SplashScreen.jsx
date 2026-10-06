import React, { useState, useEffect } from "react";
import { useCommute } from "../context/CommuteContext";

export default function SplashScreen() {
  const { navigate } = useCommute();
  const [progress, setProgress] = useState(0);

  const stages = [
    { at: 25, label: "LOADING 2026 FARES" },
    { at: 55, label: "MAPPING INTERCHANGES" },
    { at: 85, label: "CONFIGURING FAST ROUTES" },
    { at: 100, label: "SYSTEM READY" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + Math.floor(Math.random() * 8) + 4));
    }, 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const t = setTimeout(() => navigate("home"), 350);
    return () => clearTimeout(t);
  }, [progress, navigate]);

  const currentStage = (stages.find((s) => progress <= s.at) || stages[stages.length - 1]).label;

  const logoUrl = "/logo.png";

  return (
    <div className="w-full h-screen min-h-full bg-primary-container text-on-primary flex flex-col justify-between items-center px-4 sm:px-6 py-8 relative select-none">
      {/* Skip button top right */}
      <div className="w-full max-w-5xl flex justify-end pt-safe">
        <button
          type="button"
          onClick={() => navigate("home")}
          className="text-on-primary/80 hover:text-secondary-fixed text-xs tracking-wider uppercase font-bold px-3 py-1.5 rounded-lg bg-black/15 hover:bg-black/25 transition-all"
        >
          Skip &rarr;
        </button>
      </div>

      {/* Center Branding */}
      <div className="flex flex-col items-center justify-center w-full my-auto text-center max-w-md">
        <div className="w-36 h-36 mb-space-lg flex items-center justify-center animate-pulse">
          <img
            alt="Broommm Logo"
            className="w-full h-full object-contain filter drop-shadow-md"
            src={logoUrl}
          />
        </div>
        <div className="flex items-center justify-center gap-space-sm mb-space-xs">
          <div className="h-1 w-8 bg-secondary-fixed rounded-full"></div>
          <h1 className="font-headline-xl text-3xl sm:text-4xl tracking-tighter text-on-primary font-black uppercase">
            Broommm
          </h1>
          <div className="h-1 w-8 bg-secondary-fixed rounded-full"></div>
        </div>
        <p className="text-secondary-fixed font-label-caps uppercase tracking-widest text-xs font-bold mt-1">
          Metro Manila and Beyond
        </p>
      </div>

      {/* Bottom Progress Bar & Telemetry */}
      <div className="w-full max-w-sm pb-space-lg flex flex-col items-center pb-safe">
        <div className="w-full flex items-center justify-between text-xs font-mono text-secondary-fixed mb-2 font-bold">
          <span className="tracking-wider">{currentStage}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-primary relative overflow-hidden rounded-full">
          <div
            className="h-full bg-secondary-fixed transition-all duration-150 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-[11px] text-on-primary-container uppercase tracking-widest mt-2.5 font-mono">
          Philippine Commute Intelligence
        </span>
      </div>
    </div>
  );
}
