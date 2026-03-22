import * as fs from "fs";
import * as path from "path";
import {
  Volcano,
  Earthquake,
  EarthquakeSnapshot,
  PagerAlert,
} from "./types";

const DATA_DIR = path.join(__dirname, "..", "data");

const FEED_BASE =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary";

const FEEDS: Record<string, string> = {
  "significant-week": `${FEED_BASE}/significant_week.geojson`,
  "4.5-week": `${FEED_BASE}/4.5_week.geojson`,
  "2.5-week": `${FEED_BASE}/2.5_week.geojson`,
  "4.5-month": `${FEED_BASE}/4.5_month.geojson`,
  "significant-month": `${FEED_BASE}/significant_month.geojson`,
};

const DEFAULT_FEED = "4.5-week";
const VOLCANO_PROXIMITY_KM = 50;

interface USGSFeatureProps {
  mag: number;
  place: string;
  time: number;
  updated: number;
  url: string;
  detail: string;
  felt: number | null;
  cdi: number | null;
  mmi: number | null;
  alert: PagerAlert | null;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  type: string;
  title: string;
  magType: string;
}

interface USGSFeature {
  type: "Feature";
  id: string;
  properties: USGSFeatureProps;
  geometry: {
    type: "Point";
    coordinates: [number, number, number];
  };
}

interface USGSFeedResponse {
  type: "FeatureCollection";
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: USGSFeature[];
}

/**
 * Haversine distance between two points in km.
 */
function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestVolcano(
  lat: number,
  lon: number,
  volcanoes: Volcano[]
): { volcanoNumber: number; volcanoName: string; distanceKm: number } | undefined {
  let nearest: { volcanoNumber: number; volcanoName: string; distanceKm: number } | undefined;

  for (const v of volcanoes) {
    const dist = distanceKm(lat, lon, v.latitude, v.longitude);
    if (dist <= VOLCANO_PROXIMITY_KM && (!nearest || dist < nearest.distanceKm)) {
      nearest = {
        volcanoNumber: v.volcanoNumber,
        volcanoName: v.volcanoName,
        distanceKm: Math.round(dist * 10) / 10,
      };
    }
  }

  return nearest;
}

function mapEarthquake(
  feature: USGSFeature,
  volcanoes: Volcano[]
): Earthquake {
  const p = feature.properties;
  const [lon, lat, depth] = feature.geometry.coordinates;

  const eq: Earthquake = {
    id: feature.id,
    magnitude: p.mag,
    magnitudeType: p.magType || "",
    place: p.place || "",
    time: new Date(p.time).toISOString(),
    updated: new Date(p.updated).toISOString(),
    url: p.url || "",
    latitude: lat,
    longitude: lon,
    depth: depth || 0,
    felt: p.felt,
    cdi: p.cdi,
    mmi: p.mmi,
    alert: p.alert,
    tsunami: p.tsunami === 1,
    significance: p.sig || 0,
    status: p.status || "",
    type: p.type || "",
    title: p.title || "",
  };

  const nearest = findNearestVolcano(lat, lon, volcanoes);
  if (nearest) {
    eq.nearestVolcano = nearest;
  }

  return eq;
}

function loadVolcanoes(): Volcano[] {
  const volcanoesPath = path.join(DATA_DIR, "volcanoes.json");
  if (!fs.existsSync(volcanoesPath)) {
    console.warn(
      "Warning: volcanoes.json not found — run 'npm run import' first."
    );
    console.warn("  Earthquake import will proceed without volcano proximity matching.\n");
    return [];
  }
  return JSON.parse(fs.readFileSync(volcanoesPath, "utf-8")) as Volcano[];
}

function parseFeedArg(): string {
  const feedArg = process.argv.find((a) => a.startsWith("--feed="));
  if (feedArg) {
    const name = feedArg.split("=")[1];
    if (name in FEEDS) return name;
    console.error(`Unknown feed: ${name}`);
    console.error(`Available feeds: ${Object.keys(FEEDS).join(", ")}`);
    process.exit(1);
  }
  return DEFAULT_FEED;
}

async function importEarthquakes(): Promise<void> {
  const feedName = parseFeedArg();
  const feedUrl = FEEDS[feedName];

  console.log("Importing earthquake data from USGS...\n");
  console.log(`Feed: ${feedName}`);
  console.log(`URL:  ${feedUrl}\n`);

  const volcanoes = loadVolcanoes();
  if (volcanoes.length > 0) {
    console.log(
      `Loaded ${volcanoes.length} volcanoes for proximity matching (${VOLCANO_PROXIMITY_KM} km radius)\n`
    );
  }

  console.log("Fetching earthquake feed...");
  const response = await fetch(feedUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch feed: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as USGSFeedResponse;
  console.log(
    `  Received ${data.features.length} earthquakes (${data.metadata.title})`
  );

  const earthquakes = data.features.map((f) => mapEarthquake(f, volcanoes));
  const nearVolcano = earthquakes.filter((e) => e.nearestVolcano);

  const snapshot: EarthquakeSnapshot = {
    fetchedUtc: new Date().toISOString(),
    feed: feedName,
    earthquakes,
    totalCount: earthquakes.length,
    nearVolcanoCount: nearVolcano.length,
  };

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const outputPath = path.join(DATA_DIR, "earthquakes.json");
  fs.writeFileSync(outputPath, JSON.stringify(snapshot, null, 2));

  console.log(`\nEarthquake import complete:`);
  console.log(`  Total earthquakes:       ${earthquakes.length}`);
  console.log(`  Near volcanoes (≤${VOLCANO_PROXIMITY_KM} km): ${nearVolcano.length}`);
  console.log(`  Written to:              ${outputPath}`);

  if (nearVolcano.length > 0) {
    console.log(`\nEarthquakes near volcanoes:`);
    for (const eq of nearVolcano.sort((a, b) => b.magnitude - a.magnitude)) {
      const v = eq.nearestVolcano!;
      console.log(
        `  M${eq.magnitude.toFixed(1)} ${eq.place.padEnd(40)} ${v.distanceKm} km from ${v.volcanoName}`
      );
    }
  }

  // Summary by magnitude
  const m6plus = earthquakes.filter((e) => e.magnitude >= 6).length;
  const m5plus = earthquakes.filter((e) => e.magnitude >= 5).length;
  const tsunamis = earthquakes.filter((e) => e.tsunami).length;

  if (m6plus > 0 || tsunamis > 0) {
    console.log(`\nNotable:`);
    if (m6plus > 0) console.log(`  M6+ earthquakes: ${m6plus}`);
    if (m5plus > 0) console.log(`  M5+ earthquakes: ${m5plus}`);
    if (tsunamis > 0) console.log(`  Tsunami advisories: ${tsunamis}`);
  }
}

importEarthquakes().catch((err) => {
  console.error("Earthquake import failed:", err.message);
  process.exit(1);
});
