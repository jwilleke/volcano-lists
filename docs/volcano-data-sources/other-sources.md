# Other Data Sources

## Ambee Volcano API (Commercial)

- **Website:** <https://www.getambee.com/api/volcano>
- **Docs:** <https://docs.ambeedata.com/apis/natural_disasters>
- **Data:** Real-time eruption status, seismic activity, ash clouds, alert levels, severity scores
- **Format:** JSON REST API
- **Pricing:** Free trial, then paid tiers
- **Status:** Not evaluated in depth — commercial licensing

## Regional Volcano Observatories

National and regional observatories that monitor volcanoes within their jurisdiction. Most provide web-based reports; few have public APIs.

| Observatory | Region | Website |
| --- | --- | --- |
| Alaska Volcano Observatory (AVO) | Alaska | <https://avo.alaska.edu/> |
| Hawaiian Volcano Observatory (HVO) | Hawaii | <https://www.usgs.gov/observatories/hvo/> |
| Cascades Volcano Observatory (CVO) | Pacific NW | <https://www.usgs.gov/observatories/cvo> |
| California Volcano Observatory (CalVO) | California | <https://www.usgs.gov/observatories/calvo> |
| Japan Meteorological Agency (JMA) | Japan | <https://www.data.jma.go.jp/vois/data/tokyo/STOCK/activity_info/activity_info_en.html> |
| INGV | Italy | <https://www.ct.ingv.it/index.php/en/> |
| PHIVOLCS | Philippines | <https://www.phivolcs.dost.gov.ph/> |
| CVGHM (PVMBG) | Indonesia | <https://magma.esdm.go.id/> |
| SERNAGEOMIN | Chile | <https://www.sernageomin.cl/> |
| INGEMMET | Peru | <https://www.ingemmet.gob.pe/> |
| GeoNet | New Zealand | <https://www.geonet.org.nz/volcano> |
| INSIVUMEH | Guatemala | <https://insivumeh.gob.gt/> |

## Earthquake / Seismic Data (Related)

Seismic data near volcanoes can indicate unrest before eruptions.

| Source | Website | API |
| --- | --- | --- |
| USGS Earthquake Hazards | <https://earthquake.usgs.gov/> | Yes — GeoJSON |
| PNSN (Pacific NW Seismic Network) | <http://www.pnsn.org/volcanoes> | Limited |
| UNAVCO (Yellowstone deformation) | <http://www.unavco.org/> | Limited |

## ICAO / Aviation Data

- ICAO mandates VONA (Volcano Observatory Notice for Aviation) from State Volcano Observatories
- VONAs migrating to IWXXM XML format
- No single aggregated VONA feed — each observatory issues its own
- USGS VONAs available via HANS API (see [usgs-hans-api.md](usgs-hans-api.md))
