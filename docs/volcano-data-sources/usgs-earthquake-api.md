# USGS Earthquake Hazards API

**Status:** Evaluated — ready for integration

## Overview

Comprehensive global earthquake data from the USGS. Two access methods: real-time GeoJSON feeds (updated every minute) and a full query API for historical/filtered searches.

- **Feed Base:** `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/`
- **Query API:** `https://earthquake.usgs.gov/fdsnws/event/1/`
- **Auth:** None required
- **Formats:** GeoJSON, CSV, QuakeML (XML), KML, text
- **Scope:** Global
- **Rate limits:** Max 20,000 results per query
- **Contact:** gs-haz_dev_team_group@usgs.gov

## Real-Time GeoJSON Feeds

Updated every minute. 25 feeds across 5 magnitude thresholds and 4 time windows.

### Feed URL Pattern

```text
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/{magnitude}_{period}.geojson
```

### Magnitude Thresholds

| Threshold | Description |
| --- | --- |
| `significant` | Significant earthquakes only |
| `4.5` | Magnitude 4.5+ |
| `2.5` | Magnitude 2.5+ |
| `1.0` | Magnitude 1.0+ |
| `all` | All detected earthquakes |

### Time Periods

| Period | Description |
| --- | --- |
| `hour` | Past hour |
| `day` | Past 24 hours |
| `week` | Past 7 days |
| `month` | Past 30 days |

### Recommended Feeds for Our Use

| Feed | URL | Use Case |
| --- | --- | --- |
| Significant, past week | `significant_week.geojson` | Dashboard headline events |
| M4.5+, past day | `4.5_day.geojson` | Daily significant activity |
| M2.5+, past week | `2.5_week.geojson` | Volcanic seismicity near known volcanoes |
| All, past hour | `all_hour.geojson` | Near-real-time monitoring |

## Query API

For historical searches, filtered queries, and spatial searches.

### Base URL

```text
https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&{parameters}
```

### Time Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `starttime` | ISO8601 | NOW - 30 days | Events on or after |
| `endtime` | ISO8601 | Present | Events on or before |
| `updatedafter` | ISO8601 | null | Events updated after |

### Location Parameters (Rectangle)

| Parameter | Type | Range | Default |
| --- | --- | --- | --- |
| `minlatitude` | Decimal | [-90, 90] | -90 |
| `maxlatitude` | Decimal | [-90, 90] | 90 |
| `minlongitude` | Decimal | [-360, 360] | -180 |
| `maxlongitude` | Decimal | [-360, 360] | 180 |

### Location Parameters (Circle — for volcano proximity searches)

| Parameter | Type | Range | Description |
| --- | --- | --- | --- |
| `latitude` | Decimal | [-90, 90] | Center latitude |
| `longitude` | Decimal | [-180, 180] | Center longitude |
| `maxradiuskm` | Decimal | [0, 20001.6] | Radius in km |

### Magnitude and Depth

| Parameter | Type | Description |
| --- | --- | --- |
| `minmagnitude` | Decimal | Minimum magnitude |
| `maxmagnitude` | Decimal | Maximum magnitude |
| `mindepth` | Decimal (km) | Minimum depth [-100, 1000] |
| `maxdepth` | Decimal (km) | Maximum depth [-100, 1000] |

### Result Control

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `limit` | Integer | null | Max results [1, 20000] |
| `offset` | Integer | 1 | Starting result |
| `orderby` | String | time | `time`, `time-asc`, `magnitude`, `magnitude-asc` |

### Alert Level (PAGER)

| Parameter | Values | Description |
| --- | --- | --- |
| `alertlevel` | green, yellow, orange, red | Exact alert level |
| `minalertlevel` | green, yellow, orange, red | Minimum alert level |

### Other Useful Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `eventtype` | String | Filter by event type (earthquake, etc.) |
| `reviewstatus` | String | `automatic`, `reviewed`, or `all` |
| `minsig` | Integer | Minimum significance score |
| `minfelt` | Integer | Minimum "Did You Feel It?" responses |

## GeoJSON Response Fields

### Feature Properties

| Field | Type | Description |
| --- | --- | --- |
| `mag` | Decimal | Magnitude |
| `place` | String | Text description of location |
| `time` | Long | Unix timestamp (ms) |
| `updated` | Long | Last updated timestamp (ms) |
| `url` | String | USGS event page URL |
| `detail` | String | GeoJSON detail URL for this event |
| `felt` | Integer | Number of "Did You Feel It?" reports |
| `cdi` | Decimal | Community Determined Intensity [0-12] |
| `mmi` | Decimal | Modified Mercalli Intensity [0-12] |
| `alert` | String | PAGER alert level (green/yellow/orange/red) |
| `status` | String | `automatic` or `reviewed` |
| `tsunami` | Integer | 1 if tsunami advisory issued |
| `sig` | Integer | Significance score (0-1000+) |
| `net` | String | Data source network |
| `code` | String | Event identifier |
| `type` | String | Event type (earthquake, quarry blast, etc.) |
| `title` | String | Formatted title ("M 6.6 - location") |
| `magType` | String | Magnitude type (mww, mb, ml, etc.) |
| `nst` | Integer | Number of stations used |
| `dmin` | Decimal | Minimum distance to station (degrees) |
| `rms` | Decimal | Root mean square travel time residual |
| `gap` | Decimal | Azimuthal gap (degrees) |

### Geometry

Point coordinates: `[longitude, latitude, depth_km]`

## Example Queries

```text
# All M5+ earthquakes in the past week
/fdsnws/event/1/query?format=geojson&starttime=2026-03-15&minmagnitude=5

# Earthquakes within 50km of Kilauea (19.421, -155.287)
/fdsnws/event/1/query?format=geojson&latitude=19.421&longitude=-155.287&maxradiuskm=50&starttime=2026-03-01

# Red/orange PAGER alerts in the past month
/fdsnws/event/1/query?format=geojson&minalertlevel=orange

# Count earthquakes near Etna
/fdsnws/event/1/count?latitude=37.751&longitude=14.999&maxradiuskm=30&starttime=2026-03-01
```

## Volcano Proximity Use Case

The circle search (`latitude`, `longitude`, `maxradiuskm`) enables querying earthquakes near known volcanoes. Combined with our `volcanoes.json` coordinates, we can:

- Detect volcanic seismicity swarms (eruption precursors)
- Show recent earthquakes on volcano profile pages
- Build a seismic activity dashboard for monitored volcanoes
- Cross-reference with USGS HANS alert level changes

Recommended radius: 30-50 km from volcano summit for volcanic seismicity detection.

## Integration Notes

- **Preferred access:** Use real-time GeoJSON feeds for periodic imports (updated every minute, no query limits)
- **Query API:** Use for historical searches and volcano-proximity queries
- **USGS recommends** using feeds over the query API for automated applications
- Feeds are lightweight — `significant_week.geojson` typically contains 0-5 events
- `4.5_month.geojson` typically contains 100-200 events globally
