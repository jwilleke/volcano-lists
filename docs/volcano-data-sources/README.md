# Volcano Data Sources

Reference documentation for all volcano data sources — APIs, feeds, and datasets used or available for integration.

## Currently Integrated

- [GVP WFS API](gvp-wfs-api.md) — Smithsonian volcano catalog, eruption history, and global continuing eruptions
- [USGS HANS API](usgs-hans-api.md) — Real-time US volcano alerts
- [USGS Earthquake API](usgs-earthquake-api.md) — Global earthquake data with volcano proximity matching

## Evaluated for Future Use

- [Volcanic Ash Advisory Centers (VAACs)](vaac.md) — Global ash advisories from 9 regional centers
- [NASA FIRMS](nasa-firms.md) — Satellite thermal hotspot detection (free, requires Earthdata login)
- [Satellite Monitoring](satellite-monitoring.md) — MIROVA, MOUNTS, MODVOLC, Sentinel
- [VolcanoDiscovery](volcanodiscovery.md) — Aggregated global activity (RSS)
- [Other Sources](other-sources.md) — Commercial APIs, regional observatories

## Import Scripts

| Script | Source | Output | Command |
| --- | --- | --- | --- |
| `src/import-api.ts` | GVP WFS API | `data/volcanoes.json` | `npm run import` |
| `src/import-api.ts --eruptions` | GVP WFS API | `data/eruptions.json` | `npm run import:eruptions` |
| `src/import-api.ts --activity` | GVP WFS API | `data/global-activity.json` | `npm run import:global-activity` |
| `src/import-activity.ts` | USGS HANS API | `data/activity.json` | `npm run import:activity` |
| `src/import-earthquakes.ts` | USGS Earthquake API | `data/earthquakes.json` | `npm run import:earthquakes` |
| `src/import.ts` | GVP XLS files | `data/volcanoes.json` | `npm run import:xls` |

### Earthquake Feed Options

Pass `--feed=NAME` to select a different feed (default: `4.5-week`):

| Feed | Description |
| --- | --- |
| `significant-week` | Significant earthquakes, past 7 days |
| `significant-month` | Significant earthquakes, past 30 days |
| `4.5-week` | M4.5+ earthquakes, past 7 days (default) |
| `4.5-month` | M4.5+ earthquakes, past 30 days |
| `2.5-week` | M2.5+ earthquakes, past 7 days |
