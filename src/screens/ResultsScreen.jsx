import React, { useState } from "react";
import DemoNotice from "../components/DemoNotice";
import RouteMap from "../components/RouteMap";
import { useCommute } from "../context/CommuteContext";

export default function ResultsScreen() {
  const { calculationResult, navigate, toggleSaveCurrentRoute, isCurrentCalculationSaved } = useCommute();
  const [isComparing, setIsComparing] = useState(false);

  const originShort = calculationResult.origin.split(",")[0].trim();
  const destShort = calculationResult.destination.split(",")[0].trim();

  const handleCompareClick = () => {
    setIsComparing(true);
    setTimeout(() => {
      navigate("compare");
      setIsComparing(false);
    }, 300);
  };

  const annualHours = Math.round(calculationResult.monthlyHours * 12);
  const annualSpend = Math.round(calculationResult.monthlyCost * 12);

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface flex flex-col min-h-screen">

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pt-20 md:pt-24 pb-28 md:pb-12">
        <DemoNotice />
        {/* Responsive Grid: 1 col on mobile, 12 cols on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">

          {/* Left Column: Route, Verdict, Stats & Main Actions (7 cols on desktop) */}
          <div className="flex flex-col space-y-4">

            {/* Route Indicator Header */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-bold">
                  Calculated Route
                </span>
                <div className="flex items-center gap-space-xs mt-1">
                  <span className="font-headline-md text-headline-md text-on-surface font-black">
                    {originShort}
                  </span>
                  <span className="material-symbols-outlined text-outline text-lg">
                    arrow_forward
                  </span>
                  <span className="font-headline-md text-headline-md text-on-surface font-black">
                    {destShort}
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                <span className="material-symbols-outlined text-2xl">commute</span>
              </div>
            </div>

            {/* Primary Verdict Card */}
            <div className="bg-primary-container rounded-xl p-space-md sm:p-5 text-on-primary flex flex-col relative overflow-hidden shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-secondary-container font-black tabular-nums text-2xl sm:text-3xl">
                    ₱{calculationResult.dailyCost}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-primary-container font-medium">
                    / day
                  </span>
                  <span className="text-on-primary-container mx-2">·</span>
                  <span className="font-headline-md text-headline-md text-on-primary font-bold tabular-nums">
                    {calculationResult.dailyHours.toFixed(1)} hrs
                  </span>
                  <span className="font-body-sm text-body-sm text-on-primary-container font-medium">
                    / day
                  </span>
                </div>
                <span
                  className={`font-headline-md text-headline-md px-4 py-1 rounded-lg font-black tracking-wider uppercase text-sm sm:text-base ${
                    calculationResult.isSulit
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-tertiary-fixed text-on-tertiary-fixed"
                  }`}
                >
                  {calculationResult.verdict}
                </span>
              </div>
            </div>

            {/* Stat Grid Cards */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {/* Stat 1: Monthly Fare */}
              <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="material-symbols-outlined text-lg">payments</span>
                </div>
                <div className="mt-3">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block font-bold text-[10px]">
                    MONTHLY
                  </span>
                  <span className="font-label-data-sm text-label-data-sm text-primary-container font-extrabold block mt-0.5 tabular-nums text-base sm:text-lg">
                    ₱{calculationResult.monthlyCost.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Stat 2: Hours Lost */}
              <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                </div>
                <div className="mt-3">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block font-bold text-[10px]">
                    HOURS / MO
                  </span>
                  <span className="font-label-data-sm text-label-data-sm text-on-surface font-extrabold block mt-0.5 tabular-nums text-base sm:text-lg">
                    {calculationResult.monthlyHours} hrs
                  </span>
                </div>
              </div>

              {/* Stat 3: Salary Cut */}
              <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="material-symbols-outlined text-lg">pie_chart</span>
                </div>
                <div className="mt-3">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block font-bold text-[10px]">
                    % SALARY
                  </span>
                  <span className={`font-label-data-sm text-label-data-sm font-extrabold block mt-0.5 tabular-nums text-base sm:text-lg ${
                    calculationResult.isSulit ? "text-primary" : "text-tertiary"
                  }`}>
                    {calculationResult.salaryPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Dual Action Buttons */}
            <div className="grid grid-cols-2 gap-space-sm pt-1">
              {/* Compare Button */}
              <button
                type="button"
                id="compareBtn"
                onClick={handleCompareClick}
                disabled={isComparing}
                className="h-12 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-primary-container font-title-sm text-title-sm uppercase tracking-wider font-bold flex items-center justify-center gap-space-xs shadow-sm hover:bg-surface-container active:scale-[0.98] transition-all"
              >
                {isComparing ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">
                      refresh
                    </span>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">
                      compare_arrows
                    </span>
                    <span>Compare</span>
                  </>
                )}
              </button>

              {/* Save Button */}
              <button
                type="button"
                id="saveBtn"
                onClick={toggleSaveCurrentRoute}
                className={`h-12 rounded-lg font-title-sm text-title-sm uppercase tracking-wider font-bold flex items-center justify-center gap-space-xs shadow-sm active:scale-[0.98] transition-all ${
                  isCurrentCalculationSaved
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-primary-container text-on-primary hover:bg-primary"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-lg ${
                    isCurrentCalculationSaved ? "fill-1" : ""
                  }`}
                >
                  bookmark
                </span>
                <span>{isCurrentCalculationSaved ? "Saved" : "Save"}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Route Legs Breakdown & Annual Summary (5 cols on desktop) */}
          <div className="flex flex-col space-y-4">

            {/* Route Segment Breakdown */}
            <div className="bg-surface-container-lowest p-space-md sm:p-5 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col space-y-space-md">
              <div className="flex items-center justify-between border-b border-surface-container pb-2.5">
                <span className="font-title-sm text-title-sm text-on-surface font-extrabold">
                  Route Legs Breakdown
                </span>
                <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">
                  2026 Fares
                </span>
              </div>
              <div className="flex flex-col space-y-3">
                {calculationResult.legs.map((leg) => (
                  <div key={leg.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary-container">
                        <span className="material-symbols-outlined text-base">
                          {leg.icon}
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface font-semibold truncate">
                        {leg.name}
                      </span>
                    </div>
                    <span className="font-title-sm text-title-sm text-on-surface font-bold shrink-0 tabular-nums ml-2">
                      ₱{leg.fare.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {calculationResult.notes.length > 0 && (
              <div className="bg-secondary-container/40 border border-outline-variant/30 rounded-xl p-space-md text-xs text-on-surface-variant space-y-1">
                {calculationResult.notes.map((n) => (
                  <p key={n} className="flex gap-2"><span className="material-symbols-outlined text-base text-primary-container shrink-0">info</span>{n}</p>
                ))}
              </div>
            )}

            {/* Annual Commute Impact Card */}
            <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">
                  calendar_today
                </span>
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                  Annual Commute Impact
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                <div className="bg-surface-container-lowest p-2 rounded-lg">
                  <span className="text-[10px] text-outline uppercase block">Annual Fare</span>
                  <span className="font-title-sm font-bold text-primary tabular-nums">
                    ₱{annualSpend.toLocaleString()}
                  </span>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded-lg">
                  <span className="text-[10px] text-outline uppercase block">Annual Travel Time</span>
                  <span className="font-title-sm font-bold text-on-surface tabular-nums">
                    {annualHours} hrs
                  </span>
                </div>
              </div>
            </div>

            {/* Recalculate CTA */}
            <button
              type="button"
              onClick={() => navigate("home")}
              className="w-full py-3 rounded-lg border border-outline-variant/40 hover:bg-surface-container text-on-surface font-title-sm uppercase tracking-wider font-bold transition-all text-center block"
            >
              &larr; Calculate Another Route
            </button>

          </div>

          <div className="h-80 lg:h-auto lg:min-h-[560px] lg:sticky lg:top-24">
            <RouteMap origin={calculationResult.originLoc} destination={calculationResult.destLoc} mode={calculationResult.mode} className="h-full min-h-[320px]" />
          </div>

        </div>
      </main>
    </div>
  );
}
