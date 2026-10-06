import React from "react";

// Google Maps directions embed (keyless). Public transport modes show Google's transit
// directions; Grab/car show driving directions.
export default function RouteMap({ origin, destination, mode, className = "" }) {
  const place = (p) => encodeURIComponent(`${p.name}, Philippines`);
  const transit = mode === "MRT_LRT" || mode === "BUS" || mode === "JEEP";
  const embed = `https://www.google.com/maps?saddr=${place(origin)}&daddr=${place(destination)}&dirflg=${transit ? "r" : "d"}&output=embed`;
  const link = `https://www.google.com/maps/dir/?api=1&origin=${place(origin)}&destination=${place(destination)}&travelmode=${transit ? "transit" : "driving"}`;

  return (
    <div className={`relative overflow-hidden rounded-xl border border-outline-variant/40 shadow-fluent bg-surface-container ${className}`}>
      <iframe
        key={embed}
        title={`Google Maps route from ${origin.name} to ${destination.name}`}
        src={embed}
        className="absolute inset-0 w-full h-full border-0 animate-fluent-fade"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-3 left-3 acrylic rounded-lg px-3 py-1.5 text-xs font-bold text-primary-container flex items-center gap-1.5 hover:bg-white"
      >
        <span className="material-symbols-outlined text-base">open_in_new</span>
        Open in Google Maps
      </a>
    </div>
  );
}
