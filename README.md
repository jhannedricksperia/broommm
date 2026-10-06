<p align="center">
  <img src="public/logo.png" alt="Broommm logo" width="96" />
</p>

<h1 align="center">Broommm: Commute Cost Calculator</h1>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-20232A?style=flat&logo=react&logoColor=61DAFB" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=flat&logo=javascript&logoColor=black" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs&logoColor=white" />
  <img alt="Google Maps" src="https://img.shields.io/badge/Google_Maps-embed-4285F4?style=flat&logo=googlemaps&logoColor=white" />
  <img alt="OpenStreetMap" src="https://img.shields.io/badge/OpenStreetMap-OSRM_%2B_Nominatim-7EBC6F?style=flat&logo=openstreetmap&logoColor=white" />
  <img alt="Status" src="https://img.shields.io/badge/status-demo-bef500?style=flat&labelColor=1b5e20" />
</p>

> **Demo version.** Fares, travel times and distances are estimates and may be inaccurate. Verify with official sources (LTFRB, DOTr, LRTA, MRTC) before relying on them.

Broommm answers a question every Philippine commuter asks: **is this commute _sulit_ (worth it)?** Pick where you live and where you work, choose how you travel, and it shows what the trip costs per day and per month, how long it takes, and how much of your salary it eats.

<!-- Add a screenshot: ![Broommm](docs/screenshot.png) -->

## Features

- **Anywhere in the Philippines.** Search any place, or pick from Metro Manila and provincial presets (Baguio, Tagaytay, Batangas, Pampanga and more).
- **Road-based distance.** Distance and drive time come from real road routing, not straight-line guesses.
- **Google Maps route view.** See the route on an embedded Google Map, with an "Open in Google Maps" button for turn-by-turn directions.
- **Five travel modes.** Jeepney, bus, MRT/LRT, Grab and private car, with a per-leg fare breakdown.
- **MRT/LRT-aware.** Uses LRT-1, LRT-2 and MRT-3 with transfers, and disables the rail option when there is no practical station near the route.
- **Sulit verdict.** Compares monthly commute cost against your salary. Public transit at or under 15% of salary is rated SULIT.
- **Mode comparison.** Side-by-side monthly cost and travel time for every mode, with potential savings against Grab.
- **Saved routes.** Save calculations locally, re-run them, and export history as CSV.
- **Fluent-style UI.** Translucent header, smooth sliding navigation and micro-animations; respects reduced-motion settings.

## Tech stack

React 19, Vite, Tailwind CSS 3, and Oxlint, in plain JavaScript. There is no backend. Everything runs in the browser, and saved routes live in `localStorage`.

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint     # run Oxlint
```

## How it works

| Piece | Source |
| --- | --- |
| Road distance, drive time | [OSRM](https://project-osrm.org/) public routing API (OpenStreetMap data, no key needed) |
| Place search | [Nominatim](https://nominatim.org/) geocoder, limited to the Philippines |
| Map display | Google Maps embed (no API key needed) |
| Fares | Constants in [`src/data/transitRates.js`](src/data/transitRates.js) |

**Fare assumptions** (as of October 2026):

- Jeepney, bus, UV Express and TNVS rates follow the LTFRB/DOTr fare adjustment effective September 28, 2026.
- Rail fares use the current single-journey ranges: LRT-1 ₱20-55, LRT-2 ₱15-35, MRT-3 ₱13-28. The 50% discount on LRT-2 and MRT-3 (since March 23, 2026) is applied.
- **Estimated, not official:** per-station rail fares, travel times, motorcycle taxi fares, fuel (₱65 per liter at 8 km/L), parking and tolls. Grab surge pricing is not included.

When fares change, update the constants at the top of `src/data/transitRates.js`.

## Known limitations

- This is a demo. Treat every number as a rough estimate.
- The route shown on Google Maps is not guaranteed to match the OSRM route used for the fare math. A Google Maps API key with billing would be needed to use Google for both.
- OSRM and Nominatim are free public servers with fair-use limits, so they are not suitable for heavy production traffic.
- Rail planning uses a handful of key stations and nearest-station matching, not the full network or timetables.
- Routes across islands have no road path, so those fall back to a straight-line estimate.

## Project structure

```
src/
  components/   Header, BottomNav, RouteMap, LocationInput, DemoNotice, Toast
  context/      App state: navigation, saved routes, calculations
  data/         transitRates.js (fare engine), routing.js (OSRM + geocoding)
  screens/      Splash, Home, Results, Compare, History
```

## Acknowledgements

Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors. Routing by OSRM. Map embed by Google Maps.
