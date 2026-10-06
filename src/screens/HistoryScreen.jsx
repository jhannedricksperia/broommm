import React, { useState, useMemo } from "react";
import DemoNotice from "../components/DemoNotice";
import { useCommute } from "../context/CommuteContext";
import { HUBS, hubPlace } from "../data/transitRates";

export default function HistoryScreen() {
  const { savedRoutes, deleteRoute, clearAllRoutes, navigate, runCalculation, tripParams, exportHistoryCsv } = useCommute();
  const [filter, setFilter] = useState("all"); // "all", "sulit", "private"

  const filteredRoutes = useMemo(() => {
    if (filter === "sulit") return savedRoutes.filter(r => r.isSulit);
    if (filter === "private") return savedRoutes.filter(r => r.isPrivate);
    return savedRoutes;
  }, [savedRoutes, filter]);

  // Aggregate monthly savings across sulit routes
  const totalSavings = useMemo(() => {
    return savedRoutes
      .filter(r => r.isSulit)
      .reduce((sum, r) => sum + (r.savings || 0), 0);
  }, [savedRoutes]);

  const toPlace = (loc, name) => loc || hubPlace(HUBS.find((h) => h.toLowerCase().startsWith(name.toLowerCase())) || "");

  const handleRouteClick = (route) => {
    runCalculation({
      origin: toPlace(route.originLoc, route.origin),
      destination: toPlace(route.destLoc, route.destination),
      mode: route.mode || tripParams.mode,
      salary: tripParams.salary,
      workDays: tripParams.workDays
    });
  };

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface flex flex-col min-h-screen">

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pt-20 md:pt-24 pb-28 md:pb-12">
        <DemoNotice />
        <div className="flex flex-col w-full space-y-5">

          {/* Title and Top Metric */}
          <div className="flex flex-wrap items-end justify-between gap-3 pt-space-xs">
            <div>
              <h1 className="font-headline-xl text-headline-xl sm:text-3xl text-on-surface tracking-tight font-black">
                Saved Routes
              </h1>
              <p className="text-sm text-outline mt-0.5">
                {savedRoutes.length} calculations stored in local commuter memory
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportHistoryCsv}
                className="text-xs text-primary hover:bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant uppercase tracking-wider font-bold transition-colors"
              >
                Export CSV
              </button>
              {savedRoutes.length > 0 && (
                <button
                  type="button"
                  id="clearAllBtn"
                  onClick={clearAllRoutes}
                  className="text-xs text-error hover:bg-error-container/20 px-3 py-1.5 rounded-lg border border-error/30 uppercase tracking-wider font-bold transition-colors"
                >
                  Clear All History
                </button>
              )}
            </div>
          </div>

          {/* Commute Efficiency Banner */}
          {savedRoutes.length > 0 && (
            <div className="bg-surface-container-high rounded-xl p-space-md sm:p-5 flex items-center justify-between shadow-sm border border-outline-variant/30">
              <div className="flex items-center space-x-space-sm sm:space-x-4">
                <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">insights</span>
                </div>
                <div>
                  <span className="text-[11px] text-on-surface-variant font-mono uppercase tracking-wider block">
                    Aggregated Transit Advantage
                  </span>
                  <p className="font-headline-md text-headline-md sm:text-2xl text-on-surface font-black tracking-tight">
                    SAVE ₱{totalSavings.toLocaleString()} / MO
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("home")}
                className="hidden sm:inline-flex px-4 py-2 bg-primary-container text-on-primary font-title-sm text-xs uppercase font-bold rounded-lg hover:bg-primary transition-colors"
              >
                + Plan New Route
              </button>
            </div>
          )}

          {/* Filter & Utility Bar */}
          <div className="flex items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs flex-1">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`font-label-caps text-label-caps px-space-md py-2 rounded-lg uppercase font-bold tracking-wider transition-colors ${
                  filter === "all"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                All ({savedRoutes.length})
              </button>

              <button
                type="button"
                onClick={() => setFilter("sulit")}
                className={`font-label-caps text-label-caps px-space-md py-2 rounded-lg uppercase font-bold tracking-wider transition-colors ${
                  filter === "sulit"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                Sulit
              </button>

              <button
                type="button"
                onClick={() => setFilter("private")}
                className={`font-label-caps text-label-caps px-space-md py-2 rounded-lg uppercase font-bold tracking-wider transition-colors ${
                  filter === "private"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                Private / Hindi Sulit
              </button>
            </div>
          </div>

          {/* Routes Stream: Responsive Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="routeList">
            {filteredRoutes.length === 0 ? (
              <div className="col-span-full bg-surface-container-lowest rounded-xl p-space-xl sm:p-12 text-center shadow-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-5xl text-outline mb-3">
                  history
                </span>
                <p className="font-headline-md text-headline-md text-on-surface font-extrabold">
                  No Saved Routes
                </p>
                <p className="font-body-sm text-body-sm text-outline mt-1.5 max-w-sm mx-auto">
                  Calculations will be saved automatically as you plan your commute across Metro Manila.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("home")}
                  className="mt-5 px-5 py-2.5 bg-primary-container text-on-primary font-title-sm uppercase font-bold rounded-lg text-xs hover:bg-primary transition-colors shadow-sm"
                >
                  Plan A Commute Now
                </button>
              </div>
            ) : (
              filteredRoutes.map((route) => {
                const isSulit = route.verdict === "SULIT";

                return (
                  <div
                    key={route.id}
                    className="route-item bg-surface-container-lowest rounded-xl p-space-md shadow-sm transition-all relative overflow-hidden border border-outline-variant/30 flex flex-col justify-between hover:border-primary-container/40 hover:shadow-md"
                  >
                    <div>
                      {/* Top Route Name & Delete */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-headline-md text-headline-md text-on-surface font-black">
                            {route.origin}
                          </span>
                          <span className="material-symbols-outlined text-outline text-base">
                            arrow_forward
                          </span>
                          <span className="font-headline-md text-headline-md text-on-surface font-black">
                            {route.destination}
                          </span>
                        </div>
                        <button
                          type="button"
                          aria-label="Delete route"
                          onClick={() => deleteRoute(route.id)}
                          className="delete-btn text-outline hover:text-error transition-colors p-1"
                          title="Delete from saved routes"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>

                      {/* Mode Strip */}
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-surface-container-low bg-surface-container-low -mx-space-md px-space-md py-1.5">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`material-symbols-outlined text-base ${
                              isSulit ? "text-primary" : "text-tertiary"
                            }`}
                          >
                            {route.modeIcon || "commute"}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant font-semibold">
                            {route.modeLabel}
                          </span>
                        </div>
                        <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider font-semibold">
                          {route.date}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Cost & Badge */}
                    <div className="flex items-end justify-between mt-space-md pt-2 border-t border-surface-container-low">
                      <div>
                        <span className="text-[10px] text-outline uppercase font-mono block">
                          Monthly Cost
                        </span>
                        <span
                          className={`font-label-data-lg text-label-data-lg tracking-tight font-black tabular-nums ${
                            isSulit ? "text-primary" : "text-tertiary"
                          }`}
                        >
                          ₱{route.monthlyCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-space-sm">
                        <span
                          className={`font-label-caps text-label-caps px-space-md py-1 rounded tracking-widest uppercase font-extrabold text-[10px] ${
                            isSulit
                              ? "bg-secondary-fixed text-primary"
                              : "bg-tertiary-fixed text-on-tertiary-fixed"
                          }`}
                        >
                          {route.verdict}
                        </span>
                        <button
                          type="button"
                          aria-label="View route breakdown"
                          onClick={() => handleRouteClick(route)}
                          className={`w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center transition-colors ${
                            isSulit
                              ? "hover:bg-primary hover:text-on-primary text-on-surface"
                              : "hover:bg-tertiary hover:text-on-tertiary text-on-surface"
                          }`}
                          title="View calculation details"
                        >
                          <span className="material-symbols-outlined text-base">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Re-calculate CTA Promo Card */}
          <div className="bg-primary text-on-primary rounded-xl p-space-md sm:p-5 flex items-center justify-between shadow-sm">
            <div className="hidden sm:block">
              <h4 className="font-headline-md font-bold">Need to compute a new route?</h4>
              <p className="text-xs text-on-primary-container">Compare buses, trains, UV Express, Grab and private driving costs.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("home")}
              className="w-full sm:w-auto text-center bg-secondary-fixed text-on-secondary-fixed font-title-sm text-title-sm px-6 py-3 rounded-lg font-black uppercase tracking-wider transition-opacity hover:opacity-90 block active:scale-[0.99] shadow-sm"
            >
              Recalculate
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
