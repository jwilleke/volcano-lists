export interface Volcano {
  volcanoNumber: number;
  volcanoName: string;
  country: string;
  volcanicRegionGroup: string;
  volcanicRegion: string;
  volcanoLandform: string;
  primaryVolcanoType: string;
  activityEvidence: string;
  lastKnownEruption: string;
  latitude: number;
  longitude: number;
  elevation: number;
  dominantRockType: string;
  tectonicSetting: string;
  epoch: "Holocene" | "Pleistocene";
}

export interface SearchFilters {
  query?: string;
  country?: string;
  region?: string;
  volcanoType?: string;
  rockType?: string;
  tectonicSetting?: string;
  epoch?: "Holocene" | "Pleistocene";
  minElevation?: number;
  maxElevation?: number;
  minLatitude?: number;
  maxLatitude?: number;
  minLongitude?: number;
  maxLongitude?: number;
}

export interface SearchResult {
  volcanoes: Volcano[];
  total: number;
  filters: SearchFilters;
}
