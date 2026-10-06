import React from "react";

export default function DemoNotice() {
  return (
    <div role="note" className="mb-4 flex items-start gap-2.5 rounded-xl border border-outline-variant/40 bg-secondary-fixed/30 px-3.5 py-2.5 text-xs text-on-surface-variant animate-fluent-in">
      <span className="material-symbols-outlined text-base text-primary-container shrink-0">info</span>
      <p>
        <strong className="text-on-surface">Demo version.</strong> Fares, travel times and distances are estimates and may be inaccurate. Please verify with official sources (LTFRB, DOTr, LRTA, MRTC) before relying on them.
      </p>
    </div>
  );
}
