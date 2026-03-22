# Satellite Monitoring Systems

**Status:** Evaluated — not yet integrated

## MIROVA (Middle InfraRed Observation of Volcanic Activity)

Near-real-time volcanic thermal anomaly detection using MODIS and VIIRS satellite data.

- **Website:** <https://www.mirovaweb.it/>
- **NRT Dashboard:** <https://www.mirovaweb.it/NRT/>
- **Archive:** <https://www.mirovaweb.it/?action=archive>
- **Historical database (v1.0):** <https://osf.io/zm62w/> — 111 volcanoes, 2000-2019, XLS format
- **Data:** Volcanic Radiative Power (VRP) time series
- **Auth:** None for web; OSF download for historical data
- **API:** None — web interface and OSF repository only

## MODVOLC (MODIS Volcanic Thermal Alert System)

University of Hawaii thermal alert system using MODIS data.

- **Website:** <http://modis.higp.hawaii.edu/>
- **Data format:** ASCII text files with location, spectral radiance, time, observation geometry
- **Access:** Monthly summary pages with downloadable .txt alert files
- **Coverage:** Global, ~48-hour revisit, alerts within 12-18 hours
- **Note:** Transitioning from MODIS to VIIRS as MODIS satellites age
- **Status:** May be intermittent — connection issues reported

## MOUNTS (Monitoring Unrest from Space)

Multi-parameter satellite monitoring of 93+ volcanoes.

- **Website:** <http://www.mounts-project.com/home>
- **Data:** Surface deformation (Sentinel-1), heat anomalies (Sentinel-2), SO2 emissions (Sentinel-5P), local seismicity
- **Access:** Open-access website with value-added products from Sentinel data
- **API:** None — contact `valade@igeofisica.unam.mx` for alerts or adding volcanoes

## Sentinel / Copernicus Ecosystem

### Sentinel-5P TROPOMI (SO2 volcanic gas monitoring)

- **Data:** Near-daily SO2 column maps
- **Access:** Free via Copernicus Data Space Ecosystem: <https://dataspace.copernicus.eu/>
- **Also via:** Google Earth Engine as `COPERNICUS/S5P/OFFL/L3_SO2`
- **Near-daily maps:** <https://maps.s5p-pal.com/so2-7km/day/>

### Sentinel-2 SWIR (thermal anomalies)

- 20m resolution, 5-day revisit
- Useful for detecting lava flows and dome growth

### Sentinel-1 SAR (ground deformation via InSAR)

- Detects surface swelling/deflation indicating magma movement

### Sentinel Hub APIs

- **Docs:** <https://www.sentinel-hub.com/develop/api/>
- Processing API, Batch Processing API, Statistical API
- Supports WMS, WCS, WMTS, WFS
- **Registration:** Required at <https://dataspace.copernicus.eu/>

## ESA VISTA Project

Volcanic monItoring using SenTinel sensors by an integrated Approach.

- **Project page:** <https://eo4society.esa.int/projects/vista/>

## Comparison

| System | What it detects | Latency | API | Global |
| --- | --- | --- | --- | --- |
| NASA FIRMS | Thermal hotspots | ~3 hours | Yes (CSV) | Yes |
| MIROVA | Volcanic thermal power | Near-real-time | No | Yes |
| MODVOLC | MODIS thermal alerts | 12-18 hours | No | Yes |
| MOUNTS | Deformation, heat, SO2, seismicity | Varies | No | 93 volcanoes |
| Sentinel-5P | SO2 emissions | ~daily | Yes (Copernicus) | Yes |
| Sentinel Hub | Multi-sensor imagery | Varies | Yes (REST) | Yes |

## Integration Notes

NASA FIRMS is the most accessible for programmatic integration (see [nasa-firms.md](nasa-firms.md)). Others require web scraping or manual download. For a comprehensive satellite view, FIRMS thermal data combined with Sentinel-5P SO2 would cover both lava/heat and volcanic gas signatures.
