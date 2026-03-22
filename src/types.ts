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
  geologicalSummary?: string;
  primaryPhotoLink?: string;
  primaryPhotoCaption?: string;
  primaryPhotoCredit?: string;
}

export interface Eruption {
  volcanoNumber: number;
  volcanoName: string;
  eruptionNumber: number;
  activityType: string;
  activityArea: string;
  explosivityIndexMax: number | null;
  startDateYear: number | null;
  startDateYearUncertainty: number | null;
  startDateMonth: number | null;
  startDateDay: number | null;
  startEvidenceMethod: string;
}

export interface GeoJSONFeature<T> {
  type: "Feature";
  properties: T;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface GeoJSONResponse<T> {
  type: "FeatureCollection";
  totalFeatures: number;
  features: GeoJSONFeature<T>[];
}

export interface ContinuingEruption {
  volcanoNumber: number;
  volcanoName: string;
  latitude: number;
  longitude: number;
  explosivityIndexMax: number | null;
  startDate: string;
  startDateYear: number | null;
  startDateMonth: number | null;
  startDateDay: number | null;
  endDate: string | null;
  endDateYear: number | null;
  endDateMonth: number | null;
  endDateDay: number | null;
}

export interface GlobalActivitySnapshot {
  fetchedUtc: string;
  continuingEruptions: ContinuingEruption[];
  totalEruptionsSince1960: number;
}

export type AlertLevel = "NORMAL" | "ADVISORY" | "WATCH" | "WARNING";
export type ColorCode = "GREEN" | "YELLOW" | "ORANGE" | "RED";

export interface VolcanoAlert {
  volcanoNumber: string;
  volcanoName: string;
  alertLevel: AlertLevel;
  colorCode: ColorCode;
  synopsis: string;
  observatory: string;
  observatoryAbbr: string;
  sentUtc: string;
  noticeUrl: string;
  previousAlertLevel: AlertLevel | null;
  previousColorCode: ColorCode | null;
}

export interface ActivitySnapshot {
  fetchedUtc: string;
  elevatedVolcanoes: VolcanoAlert[];
  monitoredCount: number;
}

export type PagerAlert = "green" | "yellow" | "orange" | "red";

export interface Earthquake {
  id: string;
  magnitude: number;
  magnitudeType: string;
  place: string;
  time: string;
  updated: string;
  url: string;
  latitude: number;
  longitude: number;
  depth: number;
  felt: number | null;
  cdi: number | null;
  mmi: number | null;
  alert: PagerAlert | null;
  tsunami: boolean;
  significance: number;
  status: string;
  type: string;
  title: string;
  nearestVolcano?: {
    volcanoNumber: number;
    volcanoName: string;
    distanceKm: number;
  };
}

export interface EarthquakeSnapshot {
  fetchedUtc: string;
  feed: string;
  earthquakes: Earthquake[];
  totalCount: number;
  nearVolcanoCount: number;
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
