import { Volcano, SearchFilters, SearchResult } from "./types";

function matchesText(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

function matchesFilter(value: string, filter: string | undefined): boolean {
  if (!filter) return true;
  return value.toLowerCase() === filter.toLowerCase();
}

function matchesRange(
  value: number,
  min: number | undefined,
  max: number | undefined
): boolean {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

export function search(
  volcanoes: Volcano[],
  filters: SearchFilters
): SearchResult {
  const results = volcanoes.filter((v) => {
    if (filters.query) {
      const q = filters.query;
      const textMatch =
        matchesText(v.volcanoName, q) ||
        matchesText(v.country, q) ||
        matchesText(v.volcanicRegion, q) ||
        matchesText(v.volcanicRegionGroup, q) ||
        matchesText(v.primaryVolcanoType, q) ||
        matchesText(v.dominantRockType, q) ||
        matchesText(v.tectonicSetting, q) ||
        matchesText(v.lastKnownEruption, q) ||
        matchesText(String(v.volcanoNumber), q);
      if (!textMatch) return false;
    }

    if (!matchesFilter(v.country, filters.country)) return false;
    if (!matchesFilter(v.volcanicRegion, filters.region)) return false;
    if (!matchesFilter(v.primaryVolcanoType, filters.volcanoType))
      return false;
    if (!matchesFilter(v.dominantRockType, filters.rockType)) return false;
    if (!matchesFilter(v.tectonicSetting, filters.tectonicSetting))
      return false;
    if (filters.epoch && v.epoch !== filters.epoch) return false;

    if (
      !matchesRange(v.elevation, filters.minElevation, filters.maxElevation)
    )
      return false;
    if (
      !matchesRange(v.latitude, filters.minLatitude, filters.maxLatitude)
    )
      return false;
    if (
      !matchesRange(v.longitude, filters.minLongitude, filters.maxLongitude)
    )
      return false;

    return true;
  });

  return {
    volcanoes: results,
    total: results.length,
    filters,
  };
}

export function getDistinctValues(
  volcanoes: Volcano[],
  field: keyof Volcano
): string[] {
  const values = new Set<string>();
  for (const v of volcanoes) {
    const val = String(v[field]).trim();
    if (val) values.add(val);
  }
  return Array.from(values).sort();
}
