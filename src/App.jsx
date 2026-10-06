import React from "react";
import { CommuteProvider, useCommute } from "./context/CommuteContext";
import SplashScreen from "./screens/SplashScreen";
import HomeScreen from "./screens/HomeScreen";
import ResultsScreen from "./screens/ResultsScreen";
import CompareScreen from "./screens/CompareScreen";
import HistoryScreen from "./screens/HistoryScreen";
import Toast from "./components/Toast";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";

function AppContent() {
  const { currentScreen } = useCommute();

  return (
    <div className="w-full min-h-screen bg-background text-on-surface flex flex-col">
      <Toast />
      {currentScreen !== "splash" && <Header />}

      {currentScreen === "splash" && <SplashScreen />}
      {currentScreen === "home" && <HomeScreen />}
      {currentScreen === "results" && <ResultsScreen />}
      {currentScreen === "compare" && <CompareScreen />}
      {currentScreen === "history" && <HistoryScreen />}
      {(currentScreen === "home" || currentScreen === "results" || currentScreen === "history") && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <CommuteProvider>
      <AppContent />
    </CommuteProvider>
  );
}
