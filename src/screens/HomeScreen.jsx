import React, { useState, useMemo } from "react";
import DemoNotice from "../components/DemoNotice";
import RouteMap from "../components/RouteMap";
import { useCommute } from "../context/CommuteContext";
import LocationInput from "../components/LocationInput";
import { useRoadRoute } from "../data/routing";
import { TRANSIT_MODES, calculateCommute, hasRailService } from "../data/transitRates";

export default function HomeScreen() {
  const { tripParams, runCalculation } = useCommute();

  const [origin, setOrigin] = useState(tripParams.origin);
  const [destination, setDestination] = useState(tripParams.destination);
  const [selectedMode, setMode] = useState(tripParams.mode || "MRT_LRT");
  const [salary, setSalary] = useState(tripParams.salary || 45000);
  const [salaryStr, setSalaryStr] = useState(String(tripParams.salary || 45000));
  const [workDays, setWorkDays] = useState(tripParams.workDays || 22);
  const [isSalaryEditing, setIsSalaryEditing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // MRT/LRT is disabled when no rail is practical; fall back to bus (selection returns when rail is available again)
  const railAvailable = hasRailService(origin, destination);
  const mode = selectedMode === "MRT_LRT" && !railAvailable ? "BUS" : selectedMode;

  const road = useRoadRoute(origin, destination);

  // Quick live estimate
  const liveEstimate = useMemo(() => {
    const validSalary = salary > 0 ? salary : 45000;
    const validWorkDays = workDays > 0 ? workDays : 22;
    return calculateCommute({
      origin,
      destination,
      mode,
      salary: validSalary,
      workDays: validWorkDays,
      route: road.route
    });
  }, [origin, destination, mode, salary, workDays, road.route]);

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      await runCalculation({
        origin,
        destination,
        mode,
        salary: salary > 0 ? salary : 45000,
        workDays: workDays > 0 ? workDays : 22
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface flex flex-col min-h-screen">

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pt-20 md:pt-24 pb-28 md:pb-12">
        <DemoNotice />
        {/* Responsive Grid: 1 col on mobile, 12 cols on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">

          {/* Left Column: Inputs & Transit Parameters (7 cols on desktop) */}
          <div className="flex flex-col space-y-4">

            {/* Route Origin & Destination Selector Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-bold">
                  Commute Route
                </span>
                <button
                  type="button"
                  onClick={handleSwap}
                  aria-label="Swap Route"
                  className="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary-container transition-colors"
                  title="Swap origin and destination"
                >
                  <span className="material-symbols-outlined text-base">swap_vert</span>
                </button>
              </div>

              {/* Origin Input */}
              <div className="mb-2.5"><LocationInput label="Origin" value={origin} onChange={setOrigin} icon="radio_button_checked" /></div>

              {/* Destination Input */}
              <div><LocationInput label="Destination" value={destination} onChange={setDestination} icon="location_on" iconClass="text-secondary" /></div>

              {/* Distance badge */}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-surface-container text-xs text-outline font-medium">
                <span>{road.status === "loading" ? "Finding road route…" : road.status === "ok" ? `Road distance ${road.route.km.toFixed(1)} km` : `Est. distance ${liveEstimate.distanceKm} km (no road route)`}</span>
                <span className="text-primary-container font-semibold">2026 fares</span>
              </div>
            </div>

            {/* Transit Mode Selection */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-bold block mb-space-sm">
                Transit Mode
              </span>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {TRANSIT_MODES.map((item) => {
                  const isActive = mode === item.id;
                  const disabled = item.id === "MRT_LRT" && !railAvailable;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={disabled}
                      title={disabled ? "No MRT/LRT service near this route" : undefined}
                      onClick={() => setMode(item.id)}
                      className={`relative flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 rounded-lg transition-all ${
                        disabled
                          ? "bg-surface-container-low text-outline/50 cursor-not-allowed"
                          : isActive
                          ? "bg-primary-container text-on-primary shadow-sm ring-1 ring-primary"
                          : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-secondary-fixed ring-2 ring-surface-container-lowest animate-pulse" />
                      )}
                      <span className="material-symbols-outlined text-xl sm:text-2xl mb-1">
                        {item.icon}
                      </span>
                      <span className="font-label-caps text-[10px] sm:text-xs uppercase font-bold tracking-tight">
                        {item.label}
                      </span>
                      {disabled && (
                        <span className="text-[9px] leading-none mt-0.5 normal-case font-semibold">No rail</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monthly Salary & Work Days Grid */}
            <div className="grid grid-cols-2 gap-space-sm">
              {/* Monthly Salary */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-bold">
                  Monthly Salary
                </span>
                <div className="mt-2">
                  {isSalaryEditing ? (
                    <div className="flex items-center">
                      <span className="text-primary-container font-extrabold text-xl mr-1">₱</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoFocus
                        placeholder="e.g. 45000"
                        value={salaryStr}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^0-9]/g, "");
                          setSalaryStr(raw);
                          if (raw !== "" && Number(raw) > 0) {
                            setSalary(Number(raw));
                          }
                        }}
                        onBlur={() => {
                          setIsSalaryEditing(false);
                          if (!salaryStr || Number(salaryStr) <= 0) {
                            setSalary(45000);
                            setSalaryStr("45000");
                          } else {
                            setSalary(Number(salaryStr));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.currentTarget.blur();
                        }}
                        className="w-full bg-surface-container-low text-on-surface font-headline-md text-headline-md font-bold px-2 py-0.5 rounded border border-primary-container/40 focus:outline-none focus:ring-1 focus:ring-primary-container tabular-nums"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setSalaryStr(salary ? String(salary) : "");
                        setIsSalaryEditing(true);
                      }}
                      className="flex items-center cursor-pointer group"
                      title="Click to edit salary"
                    >
                      <span className="text-primary-container font-extrabold text-2xl mr-1.5">₱</span>
                      <span className="font-headline-md text-headline-md text-on-surface font-black tabular-nums group-hover:text-primary transition-colors">
                        {(salary || 45000).toLocaleString()}
                      </span>
                      <span className="material-symbols-outlined text-xs text-outline ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        edit
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Work Days / Mo Stepper */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-bold">
                  Work Days / Mo
                </span>
                <div className="flex items-center justify-between mt-2">
                  <button
                    type="button"
                    aria-label="Decrease work days"
                    onClick={() => setWorkDays((prev) => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface active:scale-95 transition-transform font-bold text-lg"
                  >
                    –
                  </button>
                  <span className="font-headline-md text-headline-md text-on-surface font-black tabular-nums">
                    {workDays}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase work days"
                    onClick={() => setWorkDays((prev) => Math.min(31, prev + 1))}
                    className="w-8 h-8 rounded bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface active:scale-95 transition-transform font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Estimate & Action Card (5 cols on desktop) */}
          <div className="flex flex-col space-y-4">

            {/* Live Estimate Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between space-y-4">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-bold block mb-1">
                  Live Cost Preview
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-extrabold">
                  {origin.name.split(',')[0]} &rarr; {destination.name.split(',')[0]}
                </h3>
              </div>

              {/* Estimate Strip */}
              <div className="bg-surface-container-low rounded-xl p-3.5 flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-primary-container text-secondary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">bolt</span>
                  </div>
                  <div>
                    <span className="font-title-sm text-title-sm text-on-surface font-bold block">
                      {Math.round(liveEstimate.dailyHours * 30)} min • {liveEstimate.legs.length} transfers
                    </span>
                    <span className="text-[11px] text-outline">
                      One-way estimate
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-headline-md text-headline-md text-primary-container font-black tabular-nums block">
                    ₱{Math.round(liveEstimate.dailyCost / 2)}.00
                  </span>
                  <span className="text-[10px] text-outline uppercase font-mono">
                    Roundtrip: ₱{liveEstimate.dailyCost}
                  </span>
                </div>
              </div>

              {/* Projected Monthly Metric */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-center">
                <div className="bg-surface rounded-lg p-2.5 border border-outline-variant/20">
                  <span className="font-label-caps text-outline uppercase block text-[10px]">
                    Projected / Mo
                  </span>
                  <span className="font-headline-md text-primary font-black tabular-nums">
                    ₱{liveEstimate.monthlyCost.toLocaleString()}
                  </span>
                </div>
                <div className="bg-surface rounded-lg p-2.5 border border-outline-variant/20">
                  <span className="font-label-caps text-outline uppercase block text-[10px]">
                    Salary Impact
                  </span>
                  <span className={`font-headline-md font-black tabular-nums ${
                    liveEstimate.isSulit ? "text-primary" : "text-tertiary"
                  }`}>
                    {liveEstimate.salaryPercent}%
                  </span>
                </div>
              </div>

              {/* Calculate CTA Button */}
              <button
                type="button"
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full h-14 bg-primary-container hover:bg-primary text-on-primary rounded-xl font-headline-md text-headline-md uppercase tracking-wider font-bold flex items-center justify-center gap-space-sm shadow-md active:scale-[0.99] transition-all disabled:opacity-80"
              >
                {isCalculating ? (
                  <>
                    <span className="material-symbols-outlined text-2xl animate-spin text-secondary-fixed">
                      refresh
                    </span>
                    <span>Calculating Route...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-2xl text-secondary-fixed">
                      payments
                    </span>
                    <span>Calculate Breakdown</span>
                  </>
                )}
              </button>
            </div>

            {/* Commuter Tips banner on desktop */}
            <div className="bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/20 text-xs text-on-surface-variant flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl shrink-0">
                lightbulb
              </span>
              <p>
                <strong>Commuter Tip:</strong> Commutes taking &le; 15% of your salary are rated <strong>SULIT</strong>. Save routes to track monthly transit savings.
              </p>
            </div>

          </div>

          {/* Column 3: Map */}
          <div className="h-80 lg:h-auto lg:min-h-[560px] lg:sticky lg:top-24">
            <RouteMap origin={origin} destination={destination} mode={mode} className="h-full min-h-[320px]" />
          </div>

        </div>
      </main>
    </div>
  );
}
