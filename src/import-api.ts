import * as fs from "fs";
import * as path from "path";
import {
  Volcano,
  Eruption,
  ContinuingEruption,
  GlobalActivitySnapshot,
  GeoJSONResponse,
} from "./types";

const DATA_DIR = path.join(__dirname, "..", "data");

const WFS_BASE =
  "https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows";

const ENDPOINTS = {
  holoceneVolcanoes:
    "Smithsonian_VOTW_Holocene_Volcanoes",
  pleistoceneVolcanoes:
    "Smithsonian_VOTW_Pleistocene_Volcanoes",
  holoceneEruptions:
    "Smithsonian_VOTW_Holocene_Eruptions",
  eruptionsSince1960:
    "E3WebApp_Eruptions1960",
};

function buildWfsUrl(typeName: string, maxFeatures: number): string {
  const params = new URLSearchParams({
    service: "WFS",
    version: "1.0.0",
    request: "GetFeature",
    typeName: `GVP-VOTW:${typeName}`,
    maxFeatures: String(maxFeatures),
    outputFormat: "application/json",
  });
  return `${WFS_BASE}?${params}`;
}

interface HoloceneProps {
  Volcano_Number: number;
  Volcano_Name: string;
  Country: string;
  Region: string;
  Subregion: string;
  Volcanic_Landform: string;
  Primary_Volcano_Type: string;
  Evidence_Category: string;
  Last_Eruption_Year: number | null;
  Latitude: number;
  Longitude: number;
  Elevation: number;
  Major_Rock_Type: string;
  Tectonic_Setting: string;
  Geologic_Epoch: string;
  Geological_Summary: string | null;
  Primary_Photo_Link: string | null;
  Primary_Photo_Caption: string | null;
  Primary_Photo_Credit: string | null;
}

interface PleistoceneProps {
  Volcano_Number: number;
  Volcano_Name: string;
  Country: string;
  Region: string;
  Subregion: string;
  Volcanic_Landform: string;
  Primary_Volcano_Type: string;
  Latitude: number;
  Longitude: number;
  Elevation: number;
  Geologic_Epoch: string;
  Geological_Summary: string | null;
}

interface EruptionProps {
  Volcano_Number: number;
  Volcano_Name: string;
  Eruption_Number: number;
  Activity_Type: string;
  ActivityArea: string;
  ExplosivityIndexMax: number | null;
  StartDateYear: number | null;
  StartDateYearUncertainty: number | null;
  StartDateMonth: number | null;
  StartDateDay: number | null;
  StartEvidenceMethod: string;
}

interface E3EruptionProps {
  VolcanoNumber: number;
  VolcanoName: string;
  ExplosivityIndexMax: number | null;
  StartDate: string;
  StartDateYear: number | null;
  StartDateMonth: number | null;
  StartDateDay: number | null;
  EndDate: string | null;
  EndDateYear: number | null;
  EndDateMonth: number | null;
  EndDateDay: number | null;
  ContinuingEruption: string;
  LatitudeDecimal: number;
  LongitudeDecimal: number;
  Activity_ID: number;
}

function mapContinuingEruption(props: E3EruptionProps): ContinuingEruption {
  return {
    volcanoNumber: props.VolcanoNumber,
    volcanoName: props.VolcanoName || "",
    latitude: props.LatitudeDecimal || 0,
    longitude: props.LongitudeDecimal || 0,
    explosivityIndexMax: props.ExplosivityIndexMax,
    startDate: props.StartDate || "",
    startDateYear: props.StartDateYear,
    startDateMonth: props.StartDateMonth || null,
    startDateDay: props.StartDateDay || null,
    endDate: props.EndDate || null,
    endDateYear: props.EndDateYear,
    endDateMonth: props.EndDateMonth || null,
    endDateDay: props.EndDateDay || null,
  };
}

function formatEruptionYear(year: number | null): string {
  if (year === null || year === undefined) return "Unknown";
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

function mapHoloceneVolcano(props: HoloceneProps): Volcano {
  return {
    volcanoNumber: props.Volcano_Number,
    volcanoName: props.Volcano_Name || "",
    country: props.Country || "",
    volcanicRegionGroup: props.Region || "",
    volcanicRegion: props.Subregion || "",
    volcanoLandform: props.Volcanic_Landform || "",
    primaryVolcanoType: props.Primary_Volcano_Type || "",
    activityEvidence: props.Evidence_Category || "",
    lastKnownEruption: formatEruptionYear(props.Last_Eruption_Year),
    latitude: props.Latitude || 0,
    longitude: props.Longitude || 0,
    elevation: props.Elevation || 0,
    dominantRockType: props.Major_Rock_Type || "",
    tectonicSetting: props.Tectonic_Setting || "",
    epoch: "Holocene",
    geologicalSummary: props.Geological_Summary || undefined,
    primaryPhotoLink: props.Primary_Photo_Link || undefined,
    primaryPhotoCaption: props.Primary_Photo_Caption || undefined,
    primaryPhotoCredit: props.Primary_Photo_Credit || undefined,
  };
}

function mapPleistoceneVolcano(props: PleistoceneProps): Volcano {
  return {
    volcanoNumber: props.Volcano_Number,
    volcanoName: props.Volcano_Name || "",
    country: props.Country || "",
    volcanicRegionGroup: props.Region || "",
    volcanicRegion: props.Subregion || "",
    volcanoLandform: props.Volcanic_Landform || "",
    primaryVolcanoType: props.Primary_Volcano_Type || "",
    activityEvidence: "",
    lastKnownEruption: "Unknown",
    latitude: props.Latitude || 0,
    longitude: props.Longitude || 0,
    elevation: props.Elevation || 0,
    dominantRockType: "",
    tectonicSetting: "",
    epoch: "Pleistocene",
    geologicalSummary: props.Geological_Summary || undefined,
  };
}

function mapEruption(props: EruptionProps): Eruption {
  return {
    volcanoNumber: props.Volcano_Number,
    volcanoName: props.Volcano_Name || "",
    eruptionNumber: props.Eruption_Number,
    activityType: props.Activity_Type || "",
    activityArea: props.ActivityArea || "",
    explosivityIndexMax: props.ExplosivityIndexMax,
    startDateYear: props.StartDateYear,
    startDateYearUncertainty: props.StartDateYearUncertainty,
    startDateMonth: props.StartDateMonth || null,
    startDateDay: props.StartDateDay || null,
    startEvidenceMethod: props.StartEvidenceMethod || "",
  };
}

async function fetchGeoJSON<T>(
  typeName: string,
  label: string
): Promise<GeoJSONResponse<T>> {
  const url = buildWfsUrl(typeName, 50000);
  console.log(`Fetching ${label}...`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${label}: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as GeoJSONResponse<T>;
  console.log(
    `  Received ${data.features.length} of ${data.totalFeatures} features`
  );
  return data;
}

async function importFromApi(): Promise<void> {
  console.log("Importing volcano data from GVP WFS API...\n");

  const includeEruptions = process.argv.includes("--eruptions");
  const includeActivity = process.argv.includes("--activity");

  // Fetch volcano data
  const [holoceneData, pleistoceneData] = await Promise.all([
    fetchGeoJSON<HoloceneProps>(
      ENDPOINTS.holoceneVolcanoes,
      "Holocene volcanoes"
    ),
    fetchGeoJSON<PleistoceneProps>(
      ENDPOINTS.pleistoceneVolcanoes,
      "Pleistocene volcanoes"
    ),
  ]);

  const holoceneVolcanoes = holoceneData.features.map((f) =>
    mapHoloceneVolcano(f.properties)
  );
  const pleistoceneVolcanoes = pleistoceneData.features.map((f) =>
    mapPleistoceneVolcano(f.properties)
  );

  const allVolcanoes = [...holoceneVolcanoes, ...pleistoceneVolcanoes];

  // Write volcanoes
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const volcanoesPath = path.join(DATA_DIR, "volcanoes.json");
  fs.writeFileSync(volcanoesPath, JSON.stringify(allVolcanoes, null, 2));

  console.log(`\nVolcano import complete:`);
  console.log(`  Holocene:    ${holoceneVolcanoes.length}`);
  console.log(`  Pleistocene: ${pleistoceneVolcanoes.length}`);
  console.log(`  Total:       ${allVolcanoes.length}`);
  console.log(`  Written to:  ${volcanoesPath}`);

  // Optionally fetch eruptions
  if (includeEruptions) {
    const eruptionsData = await fetchGeoJSON<EruptionProps>(
      ENDPOINTS.holoceneEruptions,
      "Holocene eruptions"
    );

    const eruptions = eruptionsData.features.map((f) =>
      mapEruption(f.properties)
    );

    const eruptionsPath = path.join(DATA_DIR, "eruptions.json");
    fs.writeFileSync(eruptionsPath, JSON.stringify(eruptions, null, 2));

    console.log(`\nEruption import complete:`);
    console.log(`  Eruptions:  ${eruptions.length}`);
    console.log(`  Written to: ${eruptionsPath}`);
  }

  // Optionally fetch global activity (continuing eruptions)
  if (includeActivity) {
    const e3Data = await fetchGeoJSON<E3EruptionProps>(
      ENDPOINTS.eruptionsSince1960,
      "eruptions since 1960 (global activity)"
    );

    const continuing = e3Data.features
      .filter((f) => f.properties.ContinuingEruption === "True")
      .map((f) => mapContinuingEruption(f.properties))
      .sort((a, b) => (b.startDateYear || 0) - (a.startDateYear || 0));

    const snapshot: GlobalActivitySnapshot = {
      fetchedUtc: new Date().toISOString(),
      continuingEruptions: continuing,
      totalEruptionsSince1960: e3Data.features.length,
    };

    const activityPath = path.join(DATA_DIR, "global-activity.json");
    fs.writeFileSync(activityPath, JSON.stringify(snapshot, null, 2));

    console.log(`\nGlobal activity import complete:`);
    console.log(`  Continuing eruptions: ${continuing.length}`);
    console.log(`  Total since 1960:     ${e3Data.features.length}`);
    console.log(`  Written to:           ${activityPath}`);

    if (continuing.length > 0) {
      console.log(`\nCurrently erupting:`);
      for (const e of continuing) {
        const vei = e.explosivityIndexMax !== null ? `VEI ${e.explosivityIndexMax}` : "VEI ?";
        console.log(`  ${e.volcanoName.padEnd(30)} since ${e.startDate}  ${vei}`);
      }
    }
  }
}

importFromApi().catch((err) => {
  console.error("Import failed:", err.message);
  process.exit(1);
});
