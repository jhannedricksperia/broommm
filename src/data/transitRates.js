// Fare engine for Metro Manila and nearby provinces.
//
// Fare sources (as of Oct 2026):
//  - LTFRB/DOTr PUV fare hike effective Sept 28, 2026 (jeepney, bus, UV Express, TNVS)
//  - LRT-1 ₱20–55, LRT-2 ₱15–35, MRT-3 ₱13–28 single-journey ranges
//  - DOTr across-the-board 50% discount on LRT-2 & MRT-3 since Mar 23, 2026
// Distance comes from real road routing (see routing.js). Travel times, per-station
// rail fares and car/TNVS costs are estimates. Edit the constants when fares change.

export const HUB_COORDS = {
  "Antipolo City, Rizal": [14.5849, 121.1757],
  "Ayala Ave, Makati CBD": [14.5547, 121.0244],
  "Fairview, Quezon City": [14.7336, 121.0587],
  "BGC Taguig": [14.5507, 121.0503],
  "Katipunan, Quezon City": [14.6396, 121.0775],
  "Pasay MOA": [14.5352, 120.9822],
  "Cavite (Bacoor)": [14.459, 120.943],
  "Ortigas Center, Pasig": [14.5873, 121.0615],
  "Cubao, Quezon City": [14.6197, 121.0525],
  "Manila City Hall": [14.5906, 120.9815],
  "Monumento, Caloocan": [14.6543, 120.984],
  "Alabang, Muntinlupa": [14.4195, 121.039],
  // Provinces
  "Tagaytay, Cavite": [14.1153, 120.9621],
  "Calamba, Laguna": [14.2117, 121.1653],
  "Santa Rosa, Laguna": [14.3122, 121.1114],
  "Batangas City": [13.7565, 121.0583],
  "Lipa, Batangas": [13.9411, 121.1631],
  "Lucena, Quezon": [13.9373, 121.6175],
  "San Fernando, Pampanga": [15.0286, 120.6898],
  "Angeles City, Pampanga": [15.145, 120.5887],
  "Baliwag, Bulacan": [14.9545, 120.8983],
  "Cabanatuan, Nueva Ecija": [15.4868, 120.9675],
  "Tarlac City": [15.4755, 120.5963],
  "Olongapo, Zambales": [14.8292, 120.2828],
  "Baguio City": [16.4023, 120.596]
};

export const HUBS = Object.keys(HUB_COORDS);

export function hubPlace(name) {
  const c = HUB_COORDS[name];
  return c ? { name, lat: c[0], lng: c[1] } : null;
}

// ---- Fare constants -------------------------------------------------------
export const FARES = {
  JEEP: { base: 14, baseKm: 4, perKm: 2.0 }, // traditional jeepney
  MODERN: { base: 17, baseKm: 4, perKm: 2.4 }, // modern jeepney
  BUS: { base: 18, baseKm: 5, perKm: 2.98 }, // Metro Manila aircon bus
  PROV_BUS: { base: 18, perKm: 2.45 }, // provincial aircon bus (₱/km)
  UV: { base: 30, perKm: 2.6 }, // traditional UV Express (₱/km, provisional)
  TNVS: { base: 65, perKm: 15, perMin: 2 }, // sedan; regulated rates, surge excluded
  MOTO: { base: 50, baseKm: 2, perKm: 10 }, // estimate
  CAR: { kmPerLiter: 8, pesoPerLiter: 65, parkingOneWay: 100, tollOneWay: 45, tollAboveKm: 15, tollPerKmLong: 2 }
};

export const RAIL_LINES = {
  L1: { name: "LRT-1", icon: "train", min: 20, max: 55, length: 25.2, discount: 1 },
  L2: { name: "LRT-2", icon: "train", min: 15, max: 35, length: 17.6, discount: 0.5 },
  M3: { name: "MRT-3", icon: "directions_subway", min: 13, max: 28, length: 16.9, discount: 0.5 }
};

// Key stations: position (km along the line) and coordinates
const STATIONS = [
  { line: "L1", name: "Roosevelt", pos: 0, ll: [14.6573, 121.0212] },
  { line: "L1", name: "Monumento", pos: 3.5, ll: [14.6543, 120.9839] },
  { line: "L1", name: "Central Terminal", pos: 13.4, ll: [14.5921, 120.9817] },
  { line: "L1", name: "EDSA", pos: 20.4, ll: [14.5385, 121.0006] },
  { line: "L1", name: "Baclaran", pos: 19.6, ll: [14.534, 120.9983] },
  { line: "L1", name: "Dr. Santos", pos: 25.2, ll: [14.4903, 120.991] },
  { line: "L2", name: "Recto", pos: 0, ll: [14.6035, 120.9835] },
  { line: "L2", name: "Araneta-Cubao", pos: 8.5, ll: [14.6226, 121.0526] },
  { line: "L2", name: "Katipunan", pos: 11.5, ll: [14.6310, 121.0728] },
  { line: "L2", name: "Antipolo", pos: 17.6, ll: [14.6244, 121.1214] },
  { line: "M3", name: "North Ave", pos: 0, ll: [14.6522, 121.0323] },
  { line: "M3", name: "Araneta-Cubao", pos: 5.7, ll: [14.6195, 121.051] },
  { line: "M3", name: "Ortigas", pos: 8.9, ll: [14.5878, 121.0566] },
  { line: "M3", name: "Ayala", pos: 13.3, ll: [14.549, 121.0276] },
  { line: "M3", name: "Taft Ave", pos: 16.9, ll: [14.5376, 121.0017] }
];

const INTERCHANGES = [
  { a: "L2", b: "M3", posA: 8.5, posB: 5.7, name: "Araneta-Cubao" },
  { a: "L1", b: "M3", posA: 20.4, posB: 16.9, name: "EDSA / Taft" },
  { a: "L1", b: "L2", posA: 12.4, posB: 0, name: "Doroteo Jose / Recto" }
];

const MAX_RAIL_FEEDER_KM = 20;

export const TRANSIT_MODES = [
  { id: "JEEP", label: "JEEP", icon: "airport_shuttle" },
  { id: "BUS", label: "BUS", icon: "directions_bus" },
  { id: "MRT_LRT", label: "MRT/LRT", icon: "train" },
  { id: "GRAB", label: "GRAB", icon: "local_taxi" },
  { id: "CAR", label: "CAR", icon: "directions_car" }
];

// ---- Geometry --------------------------------------------------------------
const CIRCUITY = 1.35; // straight line -> road, only used when no routed road exists

function haversine([lat1, lon1], [lat2, lon2]) {
  const rad = (d) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

const ll = (p) => [p.lat, p.lng];
const inMetroManila = (p) => p.lat > 14.35 && p.lat < 14.80 && p.lng > 120.9 && p.lng < 121.2;

function nearestStation(p) {
  let best = null;
  for (const s of STATIONS) {
    const km = haversine(ll(p), s.ll) * CIRCUITY;
    if (!best || km < best.feederKm) best = { ...s, feederKm: km };
  }
  return best;
}

// ---- Planners --------------------------------------------------------------
const r2 = (n) => Math.round(n * 100) / 100;
const tiered = ({ base, baseKm, perKm }, km) => base + Math.max(0, km - baseKm) * perKm;

function sumPlan(legs, extra = {}) {
  return {
    oneWayFare: r2(legs.reduce((s, l) => s + l.fare, 0)),
    oneWayMin: legs.reduce((s, l) => s + l.min, 0),
    legs: legs.map(({ min: _min, ...leg }, i) => ({ ...leg, id: i + 1 })),
    ...extra
  };
}

// ctx = { km, roadMin (traffic-adjusted one-way minutes by car), metro }
function planJeep(ctx) {
  const { km, roadMin } = ctx;
  if (km > 36) {
    const min = Math.round(roadMin * 1.2 + 15);
    return sumPlan([{ name: `UV Express (${Math.round(km)} km, ~${min}m)`, icon: "airport_shuttle", fare: Math.round(FARES.UV.base + FARES.UV.perKm * km), min }]);
  }
  const n = Math.max(1, Math.ceil(km / 12)); // jeepney routes rarely exceed ~12 km
  const seg = km / n;
  const min = Math.round((roadMin / n) * 1.4 + 6);
  return sumPlan(
    Array.from({ length: n }, (_, i) => ({
      name: n === 1 ? `Traditional jeepney (${Math.round(seg)} km, ~${min}m)` : `Jeepney ${i + 1} of ${n} (${Math.round(seg)} km, ~${min}m)`,
      icon: "airport_shuttle",
      fare: r2(tiered(FARES.JEEP, seg)),
      min
    }))
  );
}

function planModern(ctx) {
  const { km, roadMin } = ctx;
  const n = Math.max(1, Math.ceil(km / 12));
  const seg = km / n;
  const min = Math.round((roadMin / n) * 1.3 + 6);
  return sumPlan(
    Array.from({ length: n }, (_, i) => ({
      name: n === 1 ? `Modern jeepney (${Math.round(seg)} km, ~${min}m)` : `Modern PUV ${i + 1} of ${n} (${Math.round(seg)} km, ~${min}m)`,
      icon: "airport_shuttle",
      fare: r2(tiered(FARES.MODERN, seg)),
      min
    }))
  );
}

function planBus(ctx) {
  const { km, roadMin, metro } = ctx;
  const min = Math.round(roadMin * 1.25 + 10);
  const provincial = !metro || km > 40;
  const fare = provincial ? Math.max(FARES.PROV_BUS.base, FARES.PROV_BUS.perKm * km) : tiered(FARES.BUS, km);
  return sumPlan([
    { name: `${provincial ? "Provincial aircon bus" : "Aircon city bus"} (${Math.round(km)} km, ~${min}m)`, icon: "directions_bus", fare: r2(fare), min }
  ]);
}

function planGrab(ctx) {
  const { km, roadMin } = ctx;
  const min = Math.round(roadMin + 5);
  const fare = Math.round(FARES.TNVS.base + FARES.TNVS.perKm * km + FARES.TNVS.perMin * min);
  return sumPlan([{ name: `GrabCar sedan door-to-door (${Math.round(km)} km, ~${min}m)`, icon: "local_taxi", fare, min }]);
}

function planMoto(ctx) {
  const { km, roadMin } = ctx;
  const min = Math.round(roadMin * 0.8 + 5);
  return sumPlan([{ name: `Motorcycle taxi (${Math.round(km)} km, ~${min}m)`, icon: "two_wheeler", fare: r2(tiered(FARES.MOTO, km)), min }]);
}

function planCar(ctx) {
  const { km, roadMin } = ctx;
  const c = FARES.CAR;
  const fuel = Math.round((km / c.kmPerLiter) * c.pesoPerLiter);
  const toll = (km > c.tollAboveKm ? c.tollOneWay : 0) + (km > 40 ? Math.round((km - 40) * c.tollPerKmLong) : 0);
  const min = Math.round(roadMin);
  return sumPlan([
    { name: `Fuel (${Math.round(km)} km @ ${c.kmPerLiter} km/L, ₱${c.pesoPerLiter}/L, ~${min}m)`, icon: "directions_car", fare: fuel, min },
    { name: "Parking & toll allowance (estimate)", icon: "payments", fare: c.parkingOneWay + toll, min: 0 }
  ]);
}

function railFare(lineId, km) {
  const l = RAIL_LINES[lineId];
  const full = l.min + (l.max - l.min) * Math.min(1, km / l.length);
  return Math.round(full * l.discount * 2) / 2;
}

function railSegment(lineId, from, to) {
  const km = Math.abs(to - from);
  const l = RAIL_LINES[lineId];
  const min = Math.round(km * 2 + 8);
  return {
    name: `${l.name} (${Math.round(km)} km, ~${min}m${l.discount < 1 ? ", 50% off" : ""})`,
    icon: l.icon,
    fare: railFare(lineId, km),
    min
  };
}

// Returns a plan, or null when no rail service is practical for this trip
function planRail(origin, destination, ctx) {
  const o = nearestStation(origin);
  const d = nearestStation(destination);
  if (o.feederKm > MAX_RAIL_FEEDER_KM || d.feederKm > MAX_RAIL_FEEDER_KM) return null;
  if (o.line === d.line && Math.abs(o.pos - d.pos) < 1) return null;

  const legs = [];
  const feeder = (km, where) => {
    if (km <= 1) return;
    const min = Math.round(km * (ctx.metro ? 4.2 : 3) + 6);
    const fare = km > 12 ? tiered(FARES.BUS, km) : tiered(FARES.JEEP, km);
    legs.push({ name: `Feeder ${km > 12 ? "bus" : "jeep"} ${where} (${Math.round(km)} km, ~${min}m)`, icon: "airport_shuttle", fare: r2(fare), min });
  };

  feeder(o.feederKm, `to ${o.name}`);
  if (o.line === d.line) {
    legs.push(railSegment(o.line, o.pos, d.pos));
  } else {
    const ix = INTERCHANGES.find((x) => (x.a === o.line && x.b === d.line) || (x.b === o.line && x.a === d.line));
    const oPos = ix.a === o.line ? ix.posA : ix.posB;
    const dPos = ix.a === d.line ? ix.posA : ix.posB;
    legs.push(railSegment(o.line, o.pos, oPos));
    legs.push(railSegment(d.line, dPos, d.pos));
  }
  feeder(d.feederKm, `from ${d.name}`);

  const stations = [o, d].map((s) => ({ name: `${RAIL_LINES[s.line].name} ${s.name}`, lat: s.ll[0], lng: s.ll[1] }));
  return sumPlan(legs, { stations });
}

// ---- Public API ------------------------------------------------------------
const toPlace = (p) => (typeof p === "string" ? hubPlace(p) : p);

// True when MRT/LRT is a practical option for this origin/destination pair
export function hasRailService(origin, destination) {
  return !!planRail(toPlace(origin), toPlace(destination), { metro: true });
}

export function calculateCommute({
  origin = "Antipolo City, Rizal",
  destination = "Ayala Ave, Makati CBD",
  mode = "MRT_LRT",
  salary = 45000,
  workDays = 22,
  route = null // { km, min, coords } from road routing, or null to estimate
}) {
  const o = toPlace(origin);
  const d = toPlace(destination);
  const straightKm = haversine(ll(o), ll(d));
  const hasRoad = !!route;
  const km = hasRoad ? route.km : Math.max(2, straightKm * CIRCUITY);
  const metro = inMetroManila(o) && inMetroManila(d);
  // OSRM durations are free-flow; Metro Manila traffic roughly doubles them
  const roadMin = (hasRoad ? route.min : km * 1.8) * (metro ? 2 : 1.25);
  const ctx = { km, roadMin, metro };

  const safeSalary = Number(salary) > 0 ? Number(salary) : 45000;
  const safeWorkDays = Number(workDays) >= 1 && Number(workDays) <= 31 ? Number(workDays) : 22;

  const notes = [];
  const rail = planRail(o, d, ctx);
  const planners = {
    JEEP: () => planJeep(ctx),
    BUS: () => planBus(ctx),
    GRAB: () => planGrab(ctx),
    CAR: () => planCar(ctx),
    MRT_LRT: () => rail
  };
  let plan = planners[mode]();
  if (!plan) {
    notes.push("No MRT/LRT service practical for this route, showing bus fares instead.");
    plan = planBus(ctx);
  }
  if (!hasRoad) notes.push("No road route found (different islands or offline). Distance is a straight-line estimate.");
  if (mode === "GRAB") notes.push("Grab fares use LTFRB regulated TNVS rates; surge pricing is not included.");

  const dailyCost = Math.round(plan.oneWayFare * 2);
  const dailyHours = Number(((plan.oneWayMin * 2) / 60).toFixed(1));
  const monthlyCost = dailyCost * safeWorkDays;
  const monthlyHours = Math.round(dailyHours * safeWorkDays);
  const salaryPercent = Number(((monthlyCost / safeSalary) * 100).toFixed(1));

  const isPublicTransit = mode === "MRT_LRT" || mode === "BUS" || mode === "JEEP";
  const isSulit = (salaryPercent <= 15 && isPublicTransit) || salaryPercent <= 10;

  const candidates = [
    rail && { id: "mrt_lrt", label: "MRT / LRT", icon: "train", plan: rail },
    { id: "puv", label: "Modern PUV", icon: "airport_shuttle", plan: planModern(ctx) },
    { id: "bus", label: "Bus", icon: "directions_bus", plan: planBus(ctx) },
    km <= 35 && { id: "moto", label: "Moto Taxi", icon: "two_wheeler", plan: planMoto(ctx) },
    { id: "car", label: "Car", icon: "directions_car", plan: planCar(ctx) },
    { id: "grab", label: "Grab", icon: "local_taxi", plan: planGrab(ctx) }
  ]
    .filter(Boolean)
    .map((m) => ({
      id: m.id,
      label: m.label,
      icon: m.icon,
      timeMin: m.plan.oneWayMin * 2,
      monthlyCost: Math.round(m.plan.oneWayFare * 2) * safeWorkDays
    }));

  const maxCost = Math.max(...candidates.map((m) => m.monthlyCost), 1);
  const maxTime = Math.max(...candidates.map((m) => m.timeMin), 1);
  const cheapest = candidates.reduce((a, b) => (b.monthlyCost < a.monthlyCost ? b : a));
  const modeComparisons = candidates.map((m) => ({
    ...m,
    isCheapest: m.id === cheapest.id,
    badge: m.id === cheapest.id ? "Cheapest" : undefined,
    costWidth: `${Math.max(4, Math.round((m.monthlyCost / maxCost) * 100))}%`,
    timeWidth: `${Math.max(4, Math.round((m.timeMin / maxTime) * 100))}%`
  }));

  const grabCost = candidates.find((m) => m.id === "grab").monthlyCost;

  return {
    origin: o.name,
    destination: d.name,
    originLoc: o,
    destLoc: d,
    distanceKm: Math.round(km),
    hasRoad,
    route,
    mode,
    salary: safeSalary,
    workDays: safeWorkDays,
    dailyCost,
    dailyHours,
    monthlyCost,
    monthlyHours,
    salaryPercent,
    isSulit,
    verdict: isSulit ? "SULIT" : "HINDI SULIT",
    legs: plan.legs,
    stations: mode === "MRT_LRT" && plan === rail ? rail.stations : [],
    notes,
    modeComparisons,
    monthlySavings: Math.max(0, grabCost - cheapest.monthlyCost)
  };
}
