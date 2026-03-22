# NASA FIRMS — Fire Information for Resource Management System

**Status:** Evaluated — next for integration

## Overview

NASA's near-real-time satellite thermal hotspot detection system. Uses MODIS and VIIRS sensors to detect thermal anomalies globally, including volcanic activity. Data available within 3 hours of satellite observation.

- **Website:** <https://www.earthdata.nasa.gov/data/tools/firms>
- **API Base:** <https://firms.modaps.eosdis.nasa.gov/api/>
- **Auth:** Free Earthdata login required — register at <https://urs.earthdata.nasa.gov/users/new>
- **Formats:** CSV, SHP, KML, WMS
- **Scope:** Global
- **Latency:** ~3 hours from satellite pass

## API Endpoints

| Endpoint | Description |
| --- | --- |
| `/api/area/` | Thermal hotspots by area, date, and sensor (CSV) |
| `/api/country/` | Hotspots by country |
| `/api/data_availability/` | Date availability per sensor |
| `/api/kml_fire_footprints/` | KML footprints |

## Usage for Volcano Monitoring

FIRMS detects the same MODIS/VIIRS thermal anomalies as MIROVA and MODVOLC. To filter for volcanic activity:

- Query by lat/lon bounding box around known volcano locations
- Cross-reference with GVP volcano coordinates from `volcanoes.json`
- Filter by brightness temperature and fire radiative power (FRP) thresholds

## Sensors

| Sensor | Platform | Resolution | Revisit |
| --- | --- | --- | --- |
| MODIS | Terra/Aqua | 1 km | ~12 hours |
| VIIRS 375m | Suomi NPP, NOAA-20/21 | 375 m | ~12 hours |

## Integration Plan

- Register for Earthdata account (free)
- Query FIRMS API for hotspots near known volcano coordinates
- Match to `volcanoes.json` entries by proximity (e.g., within 10 km radius)
- Store as `data/thermal.json` with volcano linkage
- Refresh periodically (daily or more frequent)

## Citation

> NASA FIRMS. Fire Information for Resource Management System. NASA EOSDIS Land Processes DAAC. <https://firms.modaps.eosdis.nasa.gov/>
