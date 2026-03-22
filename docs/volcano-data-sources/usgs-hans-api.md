# USGS HANS API — Hazard Alert Notification System

**Status:** Integrated
**Import script:** `src/import-activity.ts`
**Output:** `data/activity.json`

## Overview

Public JSON API for real-time US volcano alerts from the USGS Volcano Hazards Program.

- **Base URL:** `https://volcanoes.usgs.gov/hans-public/api`
- **Docs:** <https://volcanoes.usgs.gov/hans-public/api/>
- **Auth:** None required
- **Format:** JSON (some endpoints return XML)
- **Scope:** US volcanoes only (65 monitored)

## Endpoints Used

| Endpoint | Description |
| --- | --- |
| `/notice/getDailySummaryData` | Daily synopses with alert levels and previous states |
| `/volcano/getElevatedVolcanoes` | Currently elevated volcanoes (ADVISORY/WATCH/WARNING) |
| `/volcano/getMonitoredVolcanoes` | All USGS-monitored volcanoes with latest notice |

## Additional Endpoints Available

| Endpoint | Description |
| --- | --- |
| `/volcano/getVolcano/{vnum}` | Single volcano by GVP number or USGS code |
| `/volcano/newestForVolcano/{vnum}` | Latest notice for a volcano |
| `/volcano/getUSVolcanoes` | All US volcanoes |
| `/volcano/getCapElevated` | CAP XML for elevated volcanoes |
| `/volcano/getSocialMediaRSS` | RSS XML feed |
| `/notice/getRecentNotices` | Last month of notices |
| `/notice/recent/{obs}/{days}` | Recent notices by observatory and day range (1-7) |
| `/notice/getNewestOrRecent` | Recent or newest per observatory |
| `/notice/getVonasWithinLastYear` | Aviation notices (VONA) |
| `/notice/getDailySummaryData` | Daily summary in JSON |
| `/notice/getNotice/{id}` | Single notice HTML |
| `/notice/getNoticeParts/{id}` | Notice sections as JSON |
| `/notice/getNoticeFormatted/{id}/{fmt}` | Notice in json, html, text, or sms format |

## Observatory Codes

| Code | Observatory |
| --- | --- |
| `avo` | Alaska Volcano Observatory |
| `hvo` | Hawaiian Volcano Observatory |
| `cvo` | Cascades Volcano Observatory |
| `calvo` | California Volcano Observatory |
| `yvo` | Yellowstone Volcano Observatory |
| `nmi` | Northern Mariana Islands |

## Alert Levels

| Level | Description |
| --- | --- |
| NORMAL | Volcano is in typical background state |
| ADVISORY | Elevated unrest above known background levels |
| WATCH | Heightened or escalating unrest with increased potential for eruption |
| WARNING | Highly hazardous eruption imminent or underway |

## Aviation Color Codes

| Code | Description |
| --- | --- |
| GREEN | Normal background activity |
| YELLOW | Elevated unrest |
| ORANGE | Heightened unrest or eruption with limited ash |
| RED | Significant ash emission expected or occurring |

## Additional USGS APIs

Further APIs exist at `https://volcanoes.usgs.gov/vsc/api/`:

- `hansApi` — alerts and notices lookup
- `hvoWebcamsApi` — Hawaiian Volcano Observatory webcams
- `observatoryApi` — observatory data
- `volcanoApi` — volcano data
- `volcanoMessageApi` — volcano messages

## Data Linking

Links to GVP data via `vnum` field (Smithsonian Volcano Number), same as `volcanoNumber` in `volcanoes.json`.
