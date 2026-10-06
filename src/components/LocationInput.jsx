import React, { useEffect, useRef, useState } from "react";
import { HUBS, hubPlace } from "../data/transitRates";
import { searchPlaces } from "../data/routing";

// Searchable place picker: Metro Manila & provincial presets plus nationwide
// (Philippines) search through OpenStreetMap's Nominatim geocoder.
export default function LocationInput({ value, onChange, icon, iconClass = "text-primary-container", label }) {
  const [text, setText] = useState(value.name);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    setText(value.name);
  }, [value.name]);

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setText(value.name);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [value.name]);

  const q = text.trim();
  const showingCurrent = q === value.name;

  useEffect(() => {
    if (!open || q.length < 3 || showingCurrent) {
      setResults([]);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(() => {
      searchPlaces(q, ctrl.signal)
        .then((r) => {
          setResults(r);
          setLoading(false);
        })
        .catch((e) => {
          if (e.name !== "AbortError") setLoading(false);
        });
    }, 450); // keep under Nominatim's 1 request/sec policy
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, open, showingCurrent]);

  const presets = HUBS.filter((h) => showingCurrent || h.toLowerCase().includes(q.toLowerCase())).slice(0, 8);

  const pick = (place) => {
    onChange(place);
    setText(place.name);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative flex items-center">
        <span className={`material-symbols-outlined text-lg absolute left-3 pointer-events-none ${iconClass}`}>{icon}</span>
        <input
          type="text"
          aria-label={label}
          value={text}
          placeholder="Search any place in the Philippines"
          onFocus={(e) => {
            setOpen(true);
            e.target.select();
          }}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              setText(value.name);
              e.currentTarget.blur();
            }
          }}
          className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low rounded-lg text-on-surface font-title-sm text-title-sm border border-transparent focus:border-primary-container focus:bg-surface-container-lowest focus:outline-none transition-all font-bold truncate"
        />
      </div>

      {open && (
        <ul className="absolute z-[500] left-0 right-0 mt-1 max-h-72 overflow-auto acrylic rounded-xl border border-outline-variant/40 shadow-lg animate-fluent-scale py-1">
          {presets.length > 0 && (
            <li className="px-3 pt-1.5 pb-0.5 text-[10px] uppercase tracking-wider font-bold text-outline">Popular</li>
          )}
          {presets.map((h) => (
            <li key={h}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(hubPlace(h))}
                className="w-full text-left px-3 py-2 text-sm hover:bg-primary-fixed/60 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base text-outline">location_city</span>
                {h}
              </button>
            </li>
          ))}
          {(loading || results.length > 0) && (
            <li className="px-3 pt-2 pb-0.5 text-[10px] uppercase tracking-wider font-bold text-outline">
              {loading ? "Searching…" : "Search results"}
            </li>
          )}
          {results.map((r) => (
            <li key={`${r.lat},${r.lng}`}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(r)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-primary-fixed/60 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base text-outline">place</span>
                <span className="truncate">{r.name}</span>
              </button>
            </li>
          ))}
          {!loading && presets.length === 0 && results.length === 0 && q.length >= 3 && !showingCurrent && (
            <li className="px-3 py-2 text-sm text-outline">No places found</li>
          )}
        </ul>
      )}
    </div>
  );
}
