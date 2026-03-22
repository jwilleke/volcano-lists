# Volcanic Ash Advisory Centers (VAACs)

**Status:** Evaluated — not yet integrated

## Overview

Nine regional centers issue Volcanic Ash Advisories (VAAs) and Volcano Observatory Notices for Aviation (VONAs) under ICAO mandate. Primary source for global real-time ash cloud tracking.

## The 9 VAACs

| VAAC | Operator | Region | Website |
| --- | --- | --- | --- |
| Anchorage | NOAA/NWS | North Pacific, Alaska | <http://www.weather.gov/vaac/> |
| Buenos Aires | SMN Argentina | South America | <https://ssl.smn.gob.ar/vaac/buenosaires/productos.php?lang=en> |
| Darwin | Bureau of Meteorology | Australia, Indonesia, PNG | <https://www.bom.gov.au/aviation/volcanic-ash/> |
| London | UK Met Office | Europe, N. Atlantic, Iceland | <https://www.metoffice.gov.uk/services/transport/aviation/regulated/international-aviation/vaac/va-advisories> |
| Montreal | Environment Canada | Canada, N. Atlantic | <https://weather.gc.ca/eer/vaac/index_e.html> |
| Tokyo | JMA | East Asia, W. Pacific | <https://www.data.jma.go.jp/vaac/data/vaac_list.html> |
| Toulouse | Meteo-France | Africa, Mediterranean, Europe | <https://vaac.meteo.fr/> |
| Washington | NOAA/OSPO | Americas, E. Pacific, Caribbean | <https://www.ospo.noaa.gov/products/atmosphere/vaac/messages.html> |
| Wellington | MetService NZ | SW Pacific, NZ | <http://vaac.metservice.com/> |

## Programmatic Access

### Washington VAAC (best structured, no auth)

- **Formats:** XML, KML, JPEG per advisory
- **URL pattern:** `https://www.ospo.noaa.gov/VAAC/ARCH26/{VOLCANO}/{filename}.xml`
- **Archive:** <https://www.ospo.noaa.gov/products/atmosphere/vaac/archive.html>
- No formal API — consistent URL naming allows scripted access

### London VAAC (only true REST API)

- **QVA API:** RESTful, OGC Environmental Data Retrieval (EDR) standard
- **Endpoint:** `https://gateway.api-management.metoffice.cloud/vaac-london-qva-gridded-data/1.0/`
- **Format:** IWXXM XML (WMO standard)
- **Rate limit:** 500 requests/day
- **Registration:** Email `vaac@metoffice.gov.uk`, accept licence agreement
- **Docs:** <https://www.metoffice.gov.uk/services/transport/aviation/regulated/international-aviation/vaac/qva/qva-api>

### Toulouse VAAC

- **Formats per advisory:** PNG, CSV, JSON (QVA concentration levels)
- No public API — contact `contact.metgate_mf@meteo.fr`

### Darwin VAAC

- Produces IWXXM 3.0 XML format advisories
- Contact `webav@bom.gov.au` for data services
- Backup via Tokyo VAAC: <https://www.data.jma.go.jp/vaac/data/vaac_darwin_list.html>

### Other VAACs

Tokyo, Buenos Aires, Montreal, Wellington, Anchorage — web-based text advisories and graphics only, no documented APIs.

## IWXXM Standard

The ICAO Meteorological Information Exchange Model is the emerging XML standard for aviation weather, including volcanic ash advisories and VONAs.

- **GitHub schema:** <https://github.com/wmo-im/iwxxm>
- **WMO schemas:** <https://schemas.wmo.int/iwxxm/>
- VAACs are progressively adopting IWXXM.

## Integration Notes

- Aviation-focused — tracks ash clouds, not general eruption status
- No single aggregated feed across all 9 VAACs
- Best approach: Washington VAAC XML for Americas + London VAAC API for Europe
- VolcanoDiscovery aggregates all 9 VAACs in their RSS feed (see [volcanodiscovery.md](volcanodiscovery.md))

## Archived Data

- **NZ Open Data** (Wellington VAAC): <https://catalogue.data.govt.nz/dataset/metservice-volcanic-ash-advisory>
- **UCAR/NCAR** (Darwin VAAC): <https://data.ucar.edu/dataset/volcanic-ash-advisory-center-darwin-ash-advisory>
