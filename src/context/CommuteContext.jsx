import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { INITIAL_ROUTES } from "../data/initialRoutes";
import { calculateCommute, hubPlace } from "../data/transitRates";
import { fetchRoute } from "../data/routing";

const CommuteContext = createContext();

export function CommuteProvider({ children }) {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [navigationHistory, setNavigationHistory] = useState(["splash"]);

  // Toast State
  const [toast, setToast] = useState(null);

  // Saved Routes History with localStorage sync
  const [savedRoutes, setSavedRoutes] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("broommm_saved_routes_v2"));
      return Array.isArray(saved) ? saved : INITIAL_ROUTES;
    } catch {
      return INITIAL_ROUTES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("broommm_saved_routes_v2", JSON.stringify(savedRoutes));
      localStorage.removeItem("broommm_profile");
      localStorage.removeItem("broommm_saved_routes");
    } catch {
      // storage unavailable; keep in-memory state only
    }
  }, [savedRoutes]);

  // Current Trip Parameters
  const [tripParams, setTripParams] = useState({
    origin: hubPlace("Antipolo City, Rizal"),
    destination: hubPlace("Ayala Ave, Makati CBD"),
    mode: "MRT_LRT",
    salary: 45000,
    workDays: 22
  });

  // Current Calculation Result
  const [calculationResult, setCalculationResult] = useState(() => {
    return calculateCommute({
      origin: "Antipolo City, Rizal",
      destination: "Ayala Ave, Makati CBD",
      mode: "MRT_LRT",
      salary: 45000,
      workDays: 22
    });
  });

  // Check if current calculation is saved
  const isCurrentCalculationSaved = savedRoutes.some(
    r => r.origin.toLowerCase().includes(calculationResult.origin.toLowerCase().split(',')[0]) &&
         r.destination.toLowerCase().includes(calculationResult.destination.toLowerCase().split(',')[0]) &&
         r.monthlyCost === calculationResult.monthlyCost
  );

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => {
      setToast(t => (t && t.id === id ? null : t));
    }, 2800);
  }, []);

  const navigate = useCallback((screen) => {
    setNavigationHistory(prev => (prev[prev.length - 1] === screen ? prev : [...prev, screen]));
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentScreen(prevScreen || "home");
    } else {
      setCurrentScreen("home");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const runCalculation = async (params) => {
    const updated = { ...tripParams, ...params };
    setTripParams(updated);
    const route = await fetchRoute(updated.origin, updated.destination);
    setCalculationResult(calculateCommute({ ...updated, route }));
    navigate("results");
  };

  const toggleSaveCurrentRoute = () => {
    const originShort = calculationResult.origin.split(",")[0].trim();
    const destShort = calculationResult.destination.split(",")[0].trim();

    const existingIndex = savedRoutes.findIndex(
      r => r.origin.toLowerCase().includes(originShort.toLowerCase()) &&
           r.destination.toLowerCase().includes(destShort.toLowerCase()) &&
           r.monthlyCost === calculationResult.monthlyCost
    );

    if (existingIndex >= 0) {
      // Remove
      setSavedRoutes(prev => prev.filter((_, idx) => idx !== existingIndex));
      showToast("Route removed from History");
    } else {
      // Add
      const modeNames = {
        MRT_LRT: "MRT/LRT + UV",
        JEEP: "Traditional PUJ",
        BUS: "City Bus Express",
        GRAB: "GrabCar 4-Seater",
        CAR: "Private Car"
      };

      const newRoute = {
        id: "route-" + Date.now(),
        origin: originShort,
        destination: destShort,
        mode: calculationResult.mode,
        originLoc: calculationResult.originLoc,
        destLoc: calculationResult.destLoc,
        modeLabel: modeNames[calculationResult.mode] || "Commute",
        modeIcon: calculationResult.mode === "JEEP" ? "airport_shuttle" :
                  calculationResult.mode === "BUS" ? "directions_bus" :
                  calculationResult.mode === "GRAB" ? "local_taxi" :
                  calculationResult.mode === "CAR" ? "directions_car" : "directions_subway",
        date: "Today",
        monthlyCost: calculationResult.monthlyCost,
        dailyCost: calculationResult.dailyCost,
        dailyHours: calculationResult.dailyHours,
        verdict: calculationResult.verdict,
        isSulit: calculationResult.isSulit,
        isPrivate: calculationResult.mode === "GRAB" || calculationResult.mode === "CAR",
        savings: calculationResult.monthlySavings
      };

      setSavedRoutes(prev => [newRoute, ...prev]);
      showToast("Route saved to Commute History!");
    }
  };

  const deleteRoute = (id) => {
    setSavedRoutes(prev => prev.filter(r => r.id !== id));
    showToast("Route deleted from history");
  };

  const clearAllRoutes = () => {
    setSavedRoutes([]);
    showToast("Commute history cleared");
  };

  const exportHistoryCsv = () => {
    if (savedRoutes.length === 0) {
      showToast("No routes to export", "error");
      return;
    }

    const headers = ["Origin", "Destination", "Transit Mode", "Daily Fare (PHP)", "Monthly Cost (PHP)", "Daily Hours", "Verdict", "Date Saved"];
    const rows = savedRoutes.map(r => [
      `"${r.origin}"`,
      `"${r.destination}"`,
      `"${r.modeLabel}"`,
      r.dailyCost,
      r.monthlyCost,
      r.dailyHours,
      r.verdict,
      `"${r.date}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `broommm_commute_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Commute history downloaded as CSV");
  };

  return (
    <CommuteContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        navigate,
        goBack,
        toast,
        showToast,
        savedRoutes,
        deleteRoute,
        clearAllRoutes,
        tripParams,
        setTripParams,
        calculationResult,
        runCalculation,
        isCurrentCalculationSaved,
        toggleSaveCurrentRoute,
        exportHistoryCsv
      }}
    >
      {children}
    </CommuteContext.Provider>
  );
}

export function useCommute() {
  const context = useContext(CommuteContext);
  if (!context) {
    throw new Error("useCommute must be used within a CommuteProvider");
  }
  return context;
}
