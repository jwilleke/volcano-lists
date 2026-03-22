import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { Volcano } from "./types";

const DATA_DIR = path.join(__dirname, "..", "data");

const HOLOCENE_HEADERS = [
  "Volcano Number",
  "Volcano Name",
  "Country",
  "Volcanic Region Group",
  "Volcanic Region",
  "Volcano Landform",
  "Primary Volcano Type",
  "Activity Evidence",
  "Last Known Eruption",
  "Latitude",
  "Longitude",
  "Elevation (m)",
  "Tectonic Setting",
  "Dominant Rock Type",
];

const PLEISTOCENE_HEADERS = [
  "Volcano Number",
  "Volcano Name",
  "Country",
  "Volcanic Region Group",
  "Volcanic Region",
  "Volcano Landform",
  "Primary Volcano Type",
  "Activity Evidence",
  "Last Known Eruption",
  "Latitude",
  "Longitude",
  "Elevation (m)",
  "Dominant Rock Type",
  "Tectonic Setting",
];

function parseRow(
  row: Record<string, unknown>,
  headers: string[],
  epoch: "Holocene" | "Pleistocene"
): Volcano | null {
  const get = (header: string): string => {
    const val = row[header];
    return val != null ? String(val).trim() : "";
  };

  const numStr = get(headers[0]);
  if (!numStr || isNaN(Number(numStr))) return null;

  return {
    volcanoNumber: Number(numStr),
    volcanoName: get(headers[1]),
    country: get(headers[2]),
    volcanicRegionGroup: get(headers[3]),
    volcanicRegion: get(headers[4]),
    volcanoLandform: get(headers[5]),
    primaryVolcanoType: get(headers[6]),
    activityEvidence: get(headers[7]),
    lastKnownEruption: get(headers[8]),
    latitude: Number(get(headers[9])) || 0,
    longitude: Number(get(headers[10])) || 0,
    elevation: Number(get(headers[11])) || 0,
    tectonicSetting:
      epoch === "Holocene" ? get(headers[12]) : get(headers[13]),
    dominantRockType:
      epoch === "Holocene" ? get(headers[13]) : get(headers[12]),
    epoch,
  };
}

function parseXlsFile(
  filePath: string,
  headers: string[],
  epoch: "Holocene" | "Pleistocene"
): Volcano[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    header: headers,
    range: 2,
  });

  const volcanoes: Volcano[] = [];
  for (const row of rows) {
    const v = parseRow(row, headers, epoch);
    if (v) volcanoes.push(v);
  }
  return volcanoes;
}

function detectEpoch(
  filename: string
): "Holocene" | "Pleistocene" | null {
  const lower = filename.toLowerCase();
  if (lower.includes("holocene")) return "Holocene";
  if (lower.includes("pleistocene")) return "Pleistocene";
  return null;
}

function findXlsFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".xls") || f.endsWith(".xlsx"))
    .map((f) => path.join(dir, f));
}

function importData(dataDir?: string): void {
  const dir = dataDir || DATA_DIR;
  const xlsFiles = findXlsFiles(dir);

  if (xlsFiles.length === 0) {
    console.error(`No .xls/.xlsx files found in ${dir}`);
    process.exit(1);
  }

  console.log(`Found ${xlsFiles.length} spreadsheet(s) in ${dir}`);

  const allVolcanoes: Volcano[] = [];

  for (const file of xlsFiles) {
    const basename = path.basename(file);
    const epoch = detectEpoch(basename);
    if (!epoch) {
      console.warn(
        `Skipping ${basename} — cannot detect epoch (filename must contain "Holocene" or "Pleistocene")`
      );
      continue;
    }

    const headers =
      epoch === "Holocene" ? HOLOCENE_HEADERS : PLEISTOCENE_HEADERS;
    console.log(`Parsing ${basename} as ${epoch}...`);
    const volcanoes = parseXlsFile(file, headers, epoch);
    console.log(`  ${volcanoes.length} volcanoes imported`);
    allVolcanoes.push(...volcanoes);
  }

  const outputPath = path.join(dir, "volcanoes.json");
  fs.writeFileSync(outputPath, JSON.stringify(allVolcanoes, null, 2));

  const holocene = allVolcanoes.filter((v) => v.epoch === "Holocene").length;
  const pleistocene = allVolcanoes.filter(
    (v) => v.epoch === "Pleistocene"
  ).length;

  console.log(`\nImport complete:`);
  console.log(`  Holocene: ${holocene}`);
  console.log(`  Pleistocene: ${pleistocene}`);
  console.log(`  Total: ${allVolcanoes.length}`);
  console.log(`  Written to: ${outputPath}`);
}

// Run if called directly
const customDir = process.argv[2];
importData(customDir);
