// Road routing (OSRM) and place search (Nominatim) — both OpenStreetMap-based,
// keyless public endpoints. Results are cached per session.

import { useEffect, useState } from "react";

const OSRM = "https://router.project-osrm.org/route/v1/driving";
const NOMINATIM = "https://nominatim.openstreetmap.org/search";

const routeCache = new Map();
const key = (p) => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`;

// Resolves to { km, min, coords:[[lat,lng],...] } or null when no road connects the points
export function fetchRoute(a, b) {
  if (!a || !b) return Promise.resolve(null);
  const k = `${key(a)}|${key(b)}`;
  if (routeCache.has(k)) return routeCache.get(k);
  const p = fetch(`${OSRM}/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`)
    .then((r) => r.json())
    .then((d) => {
      const route = d.routes?.[0];
      if (!route) return null;
      return {
        km: route.distance / 1000,
        min: route.duration / 60,
        coords: route.geometry.coordinates.map(([lng, lat]) => [lat, lng])
      };
    })
    .catch(() => {
      routeCache.delete(k); // allow retry after a network failure
      return null;
    });
  routeCache.set(k, p);
  return p;
}

// status: "loading" | "ok" | "none"
export function useRoadRoute(origin, destination) {
  const [state, setState] = useState({ k: "", status: "loading", route: null });
  const k = origin && destination ? `${key(origin)}|${key(destination)}` : "";

  useEffect(() => {
    if (!k) return;
    let live = true;
    fetchRoute(origin, destination).then((route) => {
      if (live) setState({ k, status: route ? "ok" : "none", route });
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);

  if (state.k !== k) return { status: "loading", route: null };
  return { status: state.status, route: state.route };
}

// Philippines-wide place search
export async function searchPlaces(query, signal) {
  const url = `${NOMINATIM}?format=jsonv2&countrycodes=ph&limit=6&addressdetails=0&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { signal, headers: { "Accept-Language": "en" } });
  const data = await res.json();
  return data.map((d) => ({
    name: d.display_name.split(",").slice(0, 3).join(",").trim(),
    lat: Number(d.lat),
    lng: Number(d.lon)
  }));
}
