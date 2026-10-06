import React from "react";
import { useCommute } from "../context/CommuteContext";

export default function Toast() {
  const { toast } = useCommute();

  if (!toast) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-auto max-w-[380px] pointer-events-none animate-fluent-scale">
      <div className="bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 border border-outline/30">
        <span className="material-symbols-outlined text-secondary-fixed text-xl">
          {toast.type === "error" ? "error" : "check_circle"}
        </span>
        <span className="font-body-sm text-body-sm font-medium">
          {toast.message}
        </span>
      </div>
    </div>
  );
}
