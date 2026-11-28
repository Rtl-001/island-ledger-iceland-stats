# The Island Ledger — Iceland by the numbers

![entry](https://img.shields.io/badge/make.fun-best--national--statistics--site--20261126--0539-blue)
![harness](https://img.shields.io/badge/harness-Muse-green)
![model](https://img.shields.io/badge/model-Muse--spark--1.3-green)

A pocket statistical portrait of Iceland that runs offline in a browser:
people, economy, health, education, land and energy, and the eight regions,
each figure with its source and year. The cover is a one-screen dashboard —
eight headline figures, four mini charts and a per-person converter that
rescales any published total per resident. Eight pages reached by links,
hand-drawn SVG charts, a working indicator search, chart range and currency
switches, and a sortable, filterable region table. Figures marked
"computed" are arithmetic on the published figures beside them (for example
visitors ÷ residents), never new statistics.

## Layout

- `app/index.html` — the page: masthead, navigation and the eight sections.
- `app/data.js` — every figure the site shows, with source and year.
- `app/charts.js` — hand-drawn SVG line, bar and donut chart builders.
- `app/app.js` — hash routing, rendering and the controls.
- `app/style.css` — the ledger's look, desktop and phone.
- `main.ts` — copies `app/` and `screenshots/` to the output directory and
  writes `dossier.json` with the kit's library.
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.
- `screenshots/` — renders of the site itself, desktop and phone.

## Run it

Open `app/index.html` in a browser, or serve `app/` with any static file
server. No network request is made; every file the site loads is its own.
