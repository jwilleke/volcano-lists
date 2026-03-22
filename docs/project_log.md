# Project Log

This document tracks ongoing work and session history for the volcano-lists project.

## Current Status

- Phase: Data pipeline buildout
- Build Status: Working — CLI, web UI, 4 import scripts functional
- Last Updated: 2026-03-22
- Overall Health: Active
- Next Task: Add earthquake data to web UI (API endpoint + tabbed view in index.html)

## Session Logs

### Session Log Required Format

```
### yyyy-MM-dd-##

- Agent: [Claude/Gemini/Other]
- Subject: [Brief description]
- Current Issue: [issue]
- Work Done:
  - [task 1]
  - [task 2]
- Commits: [hash]
- Files Modified:
  - [file1.js]
  - [file2.md]
```

### 2026-03-22-03

- Agent: Claude
- Subject: USGS Earthquake API — importer + data source docs
- Current Issue: Adding earthquake data with volcano proximity matching
- Work Done:
  - Evaluated USGS Earthquake Hazards API (feeds + query API)
  - Created `src/import-earthquakes.ts` — fetches USGS GeoJSON feeds, matches earthquakes within 50 km of known volcanoes using Haversine distance
  - Added `Earthquake`, `EarthquakeSnapshot`, `PagerAlert` types
  - Added `usgs-earthquake-api.md` data source doc with full API reference
  - Tested: 106 M4.5+ earthquakes in past week, 13 near known volcanoes
  - Next: add `/api/earthquakes` endpoint to server.ts and earthquake tab to web UI
- Commits: (included in 2026-03-22-04 commit)
- Files Modified:
  - `src/import-earthquakes.ts` (new)
  - `src/types.ts`
  - `package.json`
  - `.gitignore`
  - `docs/volcano-data-sources/usgs-earthquake-api.md` (new)
  - `docs/volcano-data-sources/README.md`

### 2026-03-22-02

- Agent: Claude
- Subject: GVP WFS API importer + USGS HANS activity + global eruptions
- Current Issue: Replacing XLS import with API-based pipeline, adding current activity data
- Work Done:
  - Discovered GVP GeoServer WFS API at volcano.si.edu/database/webservices.cfm
  - Created `src/import-api.ts` — fetches Holocene + Pleistocene volcanoes via GeoJSON (2,661 total), optional eruption history (11,079), optional global activity (34 continuing eruptions)
  - Added `geologicalSummary`, `primaryPhoto*` fields to Volcano type (not yet used in UI — reserved for amdWiki addon Phase 1/4)
  - Added `Eruption`, `ContinuingEruption`, `GlobalActivitySnapshot` types
  - Discovered USGS HANS public JSON API at volcanoes.usgs.gov/hans-public/api/
  - Created `src/import-activity.ts` — fetches US volcano alerts (4 currently elevated)
  - Created `docs/volcano-data-sources/` with 7 reference docs covering all evaluated data sources (GVP, USGS HANS, VAACs, NASA FIRMS, satellite monitoring, VolcanoDiscovery, other)
  - Updated `docs/volcano-wiki-addon-plan.md` with API data sources and refresh workflow
  - Evaluated NASA FIRMS — deferred (noisy for volcano use, requires filtering fires vs volcanic activity)
- Commits: (included in 2026-03-22-04 commit)
- Files Modified:
  - `src/import-api.ts` (new)
  - `src/import-activity.ts` (new)
  - `src/types.ts`
  - `package.json`
  - `.gitignore`
  - `docs/volcano-wiki-addon-plan.md`
  - `docs/volcano-data-sources/` (new directory, 7 files)

### 2026-03-22-01

- Agent: Claude
- Subject: Project initialization from mjs-project-template
- Current Issue: Setting up searchable TypeScript app for GVP volcano data
- Work Done:
  - Applied mjs-project-template to project directory
  - Updated AGENTS.md with project-specific context
  - Updated package.json with project name and description
  - Updated project_log.md with initial session
