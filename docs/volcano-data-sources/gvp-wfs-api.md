# GVP WFS API — Smithsonian Global Volcanism Program

**Status:** Integrated
**Import script:** `src/import-api.ts`
**Output:** `data/volcanoes.json`, `data/eruptions.json`

## Overview

OGC Web Feature Service (WFS) via GeoServer providing the authoritative global volcano catalog.

- **Base URL:** `https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows`
- **Docs:** <https://volcano.si.edu/database/webservices.cfm>
- **Auth:** None required
- **Format:** GeoJSON, CSV, KML, Shapefile, GML
- **Rate limits:** None documented

## Datasets

| Layer | typeName | Records |
| --- | --- | --- |
| Holocene Volcanoes | `GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes` | 1,222 |
| Pleistocene Volcanoes | `GVP-VOTW:Smithsonian_VOTW_Pleistocene_Volcanoes` | 1,439 |
| Holocene Eruptions | `GVP-VOTW:Smithsonian_VOTW_Holocene_Eruptions` | 11,079 |
| E3 Eruptions since 1960 | `GVP-VOTW:E3WebApp_Eruptions1960` | 2,224 |
| E3 Holocene Volcanoes | `GVP-VOTW:E3WebApp_HoloceneVolcanoes` | — |
| E3 Emissions | `GVP-VOTW:E3WebApp_Emissions` | — |

## URL Pattern

```text
{base}?service=WFS&version=1.0.0&request=GetFeature&typeName={typeName}&maxFeatures={n}&outputFormat=application/json
```

## Holocene Volcano Fields

- `Volcano_Number`, `Volcano_Name`, `Country`, `Region`, `Subregion`
- `Volcanic_Landform`, `Primary_Volcano_Type`, `Evidence_Category`
- `Last_Eruption_Year`, `Latitude`, `Longitude`, `Elevation`
- `Tectonic_Setting`, `Major_Rock_Type`, `Geologic_Epoch`
- `Geological_Summary`, `Primary_Photo_Link`, `Primary_Photo_Caption`, `Primary_Photo_Credit`

## Pleistocene Volcano Fields

Subset of Holocene — missing `Tectonic_Setting`, `Major_Rock_Type`, `Evidence_Category`, `Last_Eruption_Year`, photo fields.

## Eruption Fields (E3WebApp_Eruptions1960)

- `VolcanoNumber`, `VolcanoName`, `ExplosivityIndexMax`
- `StartDate`, `StartDateYear`, `StartDateMonth`, `StartDateDay`
- `EndDate`, `EndDateYear`, `EndDateMonth`, `EndDateDay`
- `ContinuingEruption` ("True"/"False")
- `LatitudeDecimal`, `LongitudeDecimal`, `Activity_ID`

## Global Continuing Eruptions

The `E3WebApp_Eruptions1960` layer with `ContinuingEruption=True` provides **global** current eruption data (34 volcanoes as of 2026-03-22). This fills the gap left by USGS HANS which only covers US volcanoes.

- **Import:** `npm run import:global-activity`
- **Output:** `data/global-activity.json`
- **Includes:** Volcano name/number, lat/lon, VEI, start/end dates
- **Scope:** Global — all continuing eruptions since 1960

## Citation

> Global Volcanism Program, 2025. [Database] Volcanoes of the World (v. 5.3.4; 30 Dec 2025). Distributed by Smithsonian Institution, compiled by Venzke, E. <https://doi.org/10.5479/si.GVP.VOTW5-2025.5.3>
