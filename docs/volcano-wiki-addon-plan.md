# Plan: Recreate volcano.si.edu as an amdWiki Addon

## Context

The goal is to build a volcano data platform comparable to volcano.si.edu using amdWiki's addon system.

The GVP site serves ~227K visits/month — mostly quick lookups of volcano profiles and data. We already have a `volcano-lists` project that parses GVP XLS data (2,661 volcanoes) with search/filter capabilities.

The approach: build a self-contained amdWiki addon (`volcano-wiki`) that creates wiki pages for each volcano, provides structured data queries via a VolcanoDataManager, and renders interactive UI through plugins — all without modifying amdWiki core.

## Architecture: Hybrid (Wiki Pages + Structured Data Manager)

- **Each volcano = a wiki page** with YAML frontmatter linking to its GVP number
- **VolcanoDataManager** loads `volcanoes.json` into memory for structured/faceted queries
- **Plugins** render structured data (infobox, map, search form, listings) within wiki pages
- **Wiki page body** is editable markdown for narrative content (geological summaries, etc.)
- **Data refresh** updates only `volcanoes.json`; wiki page bodies are never overwritten after creation

```text
GVP WFS API → npm run import → volcanoes.json (+eruptions.json)
                                      │
    ┌─────────────────────────────────┤
    │                                 │
    ▼                                 ▼
VolcanoDataManager              volcano-import.ts
(in-memory queries)             (one-time page generation)
    │                                 │
    ├─→ API routes                    ▼
    ├─→ Plugins                  2,661 wiki pages
    └─→ Map data                 (Lunr-indexed, editable)
```

## Addon Structure

```text
addons/volcano-wiki/
├── index.ts                    # AddonModule: register(), status(), shutdown()
├── package.json                # Addon metadata + dependencies (leaflet)
├── data/
│   ├── volcanoes.json          # Copied from volcano-lists output
│   └── *.xls                   # GVP source spreadsheets
├── managers/
│   └── VolcanoDataManager.ts   # Loads JSON, faceted/range queries
├── plugins/
│   ├── VolcanoInfoboxPlugin.ts # Structured data sidebar on profile pages
│   ├── VolcanoMapPlugin.ts     # Leaflet map (single volcano or world view)
│   ├── VolcanoSearchPlugin.ts  # Faceted search form + results table
│   └── VolcanoListPlugin.ts    # Holocene/Pleistocene/country listings
├── routes/
│   └── api.ts                  # REST: /api/volcano/search, /facets, /stats, /:id
├── import/
│   └── volcano-import.ts       # XLS→JSON + JSON→wiki pages bulk import
├── templates/
│   └── volcano-page.md.ejs     # EJS template for auto-generated page markdown
├── public/
│   ├── css/volcano.css         # Volcano-specific styles
│   └── js/volcano-map.js       # Leaflet map initialization
└── README.md
```

## Phased Implementation

### Phase 1: MVP — Volcano Pages + Browse (first priority)

Goal: Every volcano has a viewable, searchable wiki page with structured data.

#### Step 1 — Addon scaffold

- Create `addons/volcano-wiki/index.ts` implementing `AddonModule` interface
- `register()` loads VolcanoDataManager, registers plugins, mounts API routes
- Config: `amdwiki.addons.volcano-wiki.enabled: true`
- Add `addons/volcano-wiki/plugins/` to `amdwiki.managers.pluginManager.searchPaths`

#### Step 2 — VolcanoDataManager

- File: `addons/volcano-wiki/managers/VolcanoDataManager.ts`
- Reuse `Volcano`, `SearchFilters`, `SearchResult` interfaces from `volcano-lists/src/types.ts`
- Reuse `search()` and `getDistinctValues()` logic from `volcano-lists/src/search.ts`
- Methods: `getById(volcanoNumber)`, `search(filters)`, `getFacets()`, `getStats()`

#### Step 3 — Bulk page importer

- File: `addons/volcano-wiki/import/volcano-import.ts`
- Reads `volcanoes.json`, generates 2,661 markdown pages in amdWiki's `data/pages/`
- Each page has frontmatter: title, uuid, slug, category ("Volcano"), user-keywords (epoch, country, type), volcanoNumber
- Body contains `[{VolcanoInfobox volcanoNumber='NNNNNN'}]` plugin call + placeholder sections for Geological Summary and Eruptive History

#### Step 4 — VolcanoInfoboxPlugin

- File: `addons/volcano-wiki/plugins/VolcanoInfoboxPlugin.ts`
- Implements `PluginObject` interface (same pattern as existing amdWiki plugins)
- Reads volcanoNumber param, fetches data from VolcanoDataManager
- Renders Bootstrap card: name, GVP link, type, country, region, elevation, coordinates, rock type, tectonic setting, last eruption, epoch

#### Step 5 — API routes

- File: `addons/volcano-wiki/routes/api.ts`
- Port endpoints from `volcano-lists/src/server.ts`:
  - `GET /api/volcano/search` — faceted search
  - `GET /api/volcano/facets` — distinct filter values
  - `GET /api/volcano/stats` — dataset counts
  - `GET /api/volcano/:volcanoNumber` — single record

### Phase 2: Faceted Search UI + Listings

#### Step 6 — VolcanoSearchPlugin

- Renders interactive search form (dropdowns + range inputs)
- Client-side JS fetches from `/api/volcano/search` and `/api/volcano/facets`
- Results as sortable table with links to wiki pages
- Placed on a wiki page: `[{VolcanoSearch}]`

#### Step 7 — VolcanoListPlugin

- Params: `epoch`, `country`, `region`
- Renders paginated table of matching volcanoes
- Wiki pages: `Holocene-Volcanoes.md` → `[{VolcanoList epoch='Holocene'}]`
- Auto-generate per-country listing pages

### Phase 3: Interactive Map

#### Step 8 — VolcanoMapPlugin

- Leaflet map with volcano markers, color-coded by epoch or type
- Clickable markers link to wiki pages
- Params: `center`, `zoom`, `epoch`, `country`, `volcanoNumber` (for profile pages)
- World map page: `Volcano-Map.md` → `[{VolcanoMap}]`
- Served from `addons/volcano-wiki/public/`

### Phase 4: Enhanced Content

#### Step 9 — Rich profiles

- Community editing of geological summaries via amdWiki's built-in edit
- Photo/gallery support via existing MediaManager + AttachmentManager
- External links section in VolcanoInfoboxPlugin (GVP, Wikipedia, Google Earth)

### Phase 5: Reports + Data Export

#### Step 10 — Current eruptions dashboard

- `VolcanoActivityPlugin` rendering eruption status
- Wiki page: `Current-Eruptions.md`

#### Step 11 — Data export API

- `GET /api/volcano/export?format=csv|geojson|kml`

## Key Files to Reuse

- `volcano-lists/src/types.ts` — Volcano, Eruption, SearchFilters, SearchResult interfaces
- `volcano-lists/src/search.ts` — search() and getDistinctValues() functions
- `volcano-lists/src/import-api.ts` — GVP WFS API importer (primary)
- `volcano-lists/src/import.ts` — XLS parsing logic (fallback)
- `amdWiki/plugins/LocationPlugin.ts` — Already renders embedded OSM maps from coordinates. Volcano profile pages can use `[{Location coords='lat,lon' embed=true name='Name'}]` directly — no custom map plugin needed for single-volcano views. Only the world map (Phase 3) needs a custom VolcanoMapPlugin.

## Key amdWiki Files (reference, not modified)

- `amdWiki/src/managers/AddonsManager.ts` — AddonModule interface
- `amdWiki/src/managers/PluginManager.ts` — PluginObject interface, plugin registration
- `amdWiki/src/managers/SearchManager.ts` — Lunr search (works as-is for text search)

## No amdWiki Core Modifications Required

Everything is additive via the addon system.

## GVP WFS API (Data Source)

Data is now imported via the GVP GeoServer WFS API instead of manual XLS downloads:

- **Base URL:** `https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows`
- **Endpoints:** Holocene Volcanoes, Pleistocene Volcanoes, Holocene Eruptions
- **Format:** GeoJSON (also supports CSV, KML, Shapefile, GML)
- **Docs:** <https://volcano.si.edu/database/webservices.cfm>

The API provides additional fields already imported into `volcanoes.json` but not yet used in the UI:

- `geologicalSummary` — full text descriptions (available for VolcanoInfoboxPlugin, Phase 1 Step 4)
- `primaryPhotoLink`, `primaryPhotoCaption`, `primaryPhotoCredit` — volcano photos (available for Phase 4 rich profiles)

Eruption history (11,079 records) is available via `npm run import:eruptions` for the Phase 5 eruptions dashboard.

## USGS HANS API (Current Activity)

Real-time volcano alert data for US volcanoes via the USGS Hazard Alert Notification System:

- **Base URL:** `https://volcanoes.usgs.gov/hans-public/api`
- **Docs:** <https://volcanoes.usgs.gov/hans-public/api/>
- **Format:** JSON
- **Scope:** US volcanoes only (65 monitored)

Key endpoints used:

| Endpoint | Description |
| --- | --- |
| `/notice/getDailySummaryData` | Daily synopses with alert levels and previous states |
| `/volcano/getElevatedVolcanoes` | Currently elevated volcanoes (ADVISORY/WATCH/WARNING) |
| `/volcano/getMonitoredVolcanoes` | All USGS-monitored volcanoes |

Additional endpoints available for future use:

| Endpoint | Description |
| --- | --- |
| `/volcano/getVolcano/{vnum}` | Single volcano by GVP number |
| `/volcano/newestForVolcano/{vnum}` | Latest notice for a volcano |
| `/notice/getRecentNotices` | Last month of notices |
| `/notice/recent/{obs}/{days}` | Recent notices by observatory (avo, hvo, cvo, calvo, yvo, nmi) |
| `/notice/getVonasWithinLastYear` | Aviation notices (VONA) |
| `/volcano/getSocialMediaRSS` | RSS feed |

Imported via `npm run import:activity` → `data/activity.json`. Links to GVP data via `vnum` (GVP Volcano Number). Feeds the Phase 5 Current Eruptions dashboard.

## Data Refresh Workflow

- Run `npm run import` to fetch latest data from GVP WFS API
- Run `npm run import:activity` to fetch current USGS volcano alerts
- Optionally run `npm run import:eruptions` to include eruption history
- XLS fallback: `npm run import:xls` (requires manual download from volcano.si.edu)
- VolcanoDataManager picks up changes on restart
- Existing wiki page bodies (user-edited content) are preserved
- Optionally re-run page importer with `--new-only` flag to add pages for newly added volcanoes

## Verification

- `npm run build` in amdWiki compiles addon TypeScript
- Start amdWiki, verify addon loads in logs
- Browse to a volcano wiki page, verify infobox renders
- Use `/api/volcano/search?query=Vesuvius` to test API
- Use amdWiki search to find volcano pages by name/keyword
- Verify page editing works (add geological summary, save, verify it persists)

## Data Citation

> Global Volcanism Program, 2025. [Database] Volcanoes of the World (v. 5.3.4; 30 Dec 2025). Distributed by Smithsonian Institution, compiled by Venzke, E. <https://doi.org/10.5479/si.GVP.VOTW5-2025.5.3>

Source: [Global Volcanism Program, Smithsonian Institution](https://volcano.si.edu/)
