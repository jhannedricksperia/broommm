import React, { useState } from "react";
import DemoNotice from "../components/DemoNotice";
import { useCommute } from "../context/CommuteContext";

export default function CompareScreen() {
  const { calculationResult, goBack, showToast } = useCommute();
  const [metricTab, setMetricTab] = useState("cost"); // "cost" or "time"
  const [isCopied, setIsCopied] = useState(false);

  const originShort = calculationResult.origin.split(",")[0].trim();
  const destShort = calculationResult.destination.split(",")[0].trim();

  const handleShare = () => {
    const text = `Broommm Metro Manila Commute: ${originShort} to ${destShort}. MRT/LRT saves up to ₱${calculationResult.monthlySavings.toLocaleString()}/mo compared to rideshares!`;
    
    if (navigator.share) {
      navigator.share({
        title: "Broommm Commute Comparison",
        text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      showToast("Route comparison copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface flex flex-col min-h-screen">

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pt-20 md:pt-24 pb-16 md:pb-12">
        <DemoNotice />
        <div className="flex flex-col w-full space-y-5">

          {/* Sub-header Context Block */}
          <div className="bg-surface-container-low p-space-md sm:p-5 rounded-xl flex items-center justify-between border border-outline-variant/30 shadow-sm">
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight font-extrabold">
                Compare Modes Across Metro Manila
              </span>
              <div className="flex items-center gap-space-xs mt-1">
                <span className="material-symbols-outlined text-sm text-outline">
                  alt_route
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  {originShort} to {destShort} ({calculationResult.distanceKm} km trip)
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close comparison view"
              onClick={goBack}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface shrink-0"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Metric Switch Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-surface-container p-1 rounded-xl max-w-md mx-auto w-full">
            <button
              type="button"
              id="tab-cost"
              onClick={() => setMetricTab("cost")}
              className={`py-2.5 rounded-lg font-title-sm text-title-sm uppercase transition-all flex items-center justify-center gap-1.5 font-bold ${
                metricTab === "cost"
                  ? "bg-surface-container-lowest text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-base">payments</span>
              Monthly Cost
            </button>

            <button
              type="button"
              id="tab-time"
              onClick={() => setMetricTab("time")}
              className={`py-2.5 rounded-lg font-title-sm text-title-sm uppercase transition-all flex items-center justify-center gap-1.5 font-bold ${
                metricTab === "time"
                  ? "bg-surface-container-lowest text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-base">schedule</span>
              Travel Time
            </button>
          </div>

          {/* Comparison Grid (1 col on mobile, 2 cols on desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4" id="mode-list">
            {calculationResult.modeComparisons.map((item) => {
              const barWidth = metricTab === "cost" ? item.costWidth : item.timeWidth;
              const barColor = item.isCheapest ? "bg-secondary-fixed" : "bg-tertiary";

              return (
                <div
                  key={item.id}
                  className={`bg-surface-container-lowest p-space-md sm:p-4 rounded-xl shadow-sm border transition-all flex flex-col justify-between space-y-2.5 ${
                    item.isCheapest ? "border-primary-container ring-1 ring-primary-container/20" : "border-outline-variant/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          item.isCheapest
                            ? "bg-primary-container text-on-primary"
                            : "bg-surface-container text-tertiary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {item.icon}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-title-sm text-title-sm text-on-surface uppercase font-extrabold">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps px-2 py-0.5 rounded uppercase tracking-wider font-extrabold text-[10px]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                        {item.timeMin}m
                      </span>
                      <span
                        className={`font-label-data-sm text-label-data-sm uppercase font-extrabold tabular-nums ${
                          item.isCheapest ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        ₱{item.monthlyCost.toLocaleString()}
                        <span className="text-xs text-outline font-semibold">/mo</span>
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden flex">
                    <div
                      className={`h-full ${barColor} animate-bar-grow origin-left rounded-full`}
                      style={{ width: barWidth }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendation Callout */}
          <div className="bg-primary-container p-space-md sm:p-5 rounded-xl text-on-primary flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-space-sm sm:gap-4">
              <div className="w-11 h-11 rounded-lg bg-surface-container-lowest/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl text-secondary-fixed">
                  savings
                </span>
              </div>
              <div>
                <span className="text-xs text-secondary-fixed/90 uppercase font-mono tracking-wider block">
                  Public Transit Advantage
                </span>
                <span className="font-headline-md text-headline-md sm:text-xl uppercase font-black text-secondary-fixed">
                  ₱{calculationResult.monthlySavings.toLocaleString()} / MO SAVINGS
                </span>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs bg-black/20 px-3 py-1.5 rounded-lg text-on-primary-container font-mono">
              vs Ride-Hailing
            </span>
          </div>

          {/* Action Bar */}
          <div className="pt-2 flex gap-3 max-w-md mx-auto w-full">
            <button
              type="button"
              onClick={goBack}
              className="flex-1 h-12 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm uppercase font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back
            </button>

            <button
              type="button"
              id="share-btn"
              onClick={handleShare}
              className="flex-1 h-12 rounded-lg bg-secondary-fixed hover:bg-secondary-fixed/90 text-on-secondary-fixed font-title-sm text-title-sm uppercase font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">
                {isCopied ? "check" : "share"}
              </span>
              {isCopied ? "Copied!" : "Share"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
