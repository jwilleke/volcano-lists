import { loadVolcanoes } from "./parser";
import { search, getDistinctValues } from "./search";
import { SearchFilters, Volcano } from "./types";
import * as readline from "readline";

function formatVolcano(v: Volcano): string {
  const parts = [
    `${v.volcanoName} (#${v.volcanoNumber})`,
    `  ${v.country} | ${v.volcanicRegion}`,
    `  Type: ${v.primaryVolcanoType} | Landform: ${v.volcanoLandform}`,
    `  Elevation: ${v.elevation}m | Lat: ${v.latitude}, Lon: ${v.longitude}`,
  ];
  if (v.lastKnownEruption) parts.push(`  Last eruption: ${v.lastKnownEruption}`);
  if (v.dominantRockType) parts.push(`  Rock: ${v.dominantRockType}`);
  if (v.tectonicSetting) parts.push(`  Tectonic: ${v.tectonicSetting}`);
  parts.push(`  Epoch: ${v.epoch}`);
  return parts.join("\n");
}

function printHelp(): void {
  console.log(`
Volcano Search — Commands:
  search <text>          Free-text search across all fields
  country <name>         Filter by country
  region <name>          Filter by volcanic region
  type <name>            Filter by primary volcano type
  rock <name>            Filter by dominant rock type
  tectonic <name>        Filter by tectonic setting
  epoch <H|P>            Filter by epoch (Holocene/Pleistocene)
  elevation <min> <max>  Filter by elevation range
  lat <min> <max>        Filter by latitude range
  lon <min> <max>        Filter by longitude range
  list countries         List all distinct countries
  list regions           List all distinct volcanic regions
  list types             List all distinct volcano types
  list rocks             List all distinct rock types
  list tectonics         List all distinct tectonic settings
  stats                  Show dataset statistics
  clear                  Clear all filters
  help                   Show this help
  quit                   Exit
  `);
}

function printStats(volcanoes: Volcano[]): void {
  const holocene = volcanoes.filter((v) => v.epoch === "Holocene").length;
  const pleistocene = volcanoes.filter((v) => v.epoch === "Pleistocene").length;
  const countries = new Set(volcanoes.map((v) => v.country)).size;
  const regions = new Set(volcanoes.map((v) => v.volcanicRegion)).size;
  const types = new Set(volcanoes.map((v) => v.primaryVolcanoType)).size;

  console.log(`\nDataset Statistics:`);
  console.log(`  Total volcanoes: ${volcanoes.length}`);
  console.log(`  Holocene: ${holocene}`);
  console.log(`  Pleistocene: ${pleistocene}`);
  console.log(`  Countries: ${countries}`);
  console.log(`  Volcanic regions: ${regions}`);
  console.log(`  Volcano types: ${types}`);
}

function main(): void {
  console.log("Loading volcano data...");
  const volcanoes = loadVolcanoes();
  console.log(`Loaded ${volcanoes.length} volcanoes.\n`);

  const filters: SearchFilters = {};

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "volcano> ",
  });

  printHelp();
  rl.prompt();

  rl.on("line", (line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      rl.prompt();
      return;
    }

    const [cmd, ...args] = trimmed.split(/\s+/);
    const arg = args.join(" ");

    switch (cmd.toLowerCase()) {
      case "search":
      case "s":
        filters.query = arg || undefined;
        break;
      case "country":
        filters.country = arg || undefined;
        break;
      case "region":
        filters.region = arg || undefined;
        break;
      case "type":
        filters.volcanoType = arg || undefined;
        break;
      case "rock":
        filters.rockType = arg || undefined;
        break;
      case "tectonic":
        filters.tectonicSetting = arg || undefined;
        break;
      case "epoch":
        if (arg.toLowerCase().startsWith("h")) filters.epoch = "Holocene";
        else if (arg.toLowerCase().startsWith("p"))
          filters.epoch = "Pleistocene";
        else filters.epoch = undefined;
        break;
      case "elevation":
        filters.minElevation = args[0] ? Number(args[0]) : undefined;
        filters.maxElevation = args[1] ? Number(args[1]) : undefined;
        break;
      case "lat":
        filters.minLatitude = args[0] ? Number(args[0]) : undefined;
        filters.maxLatitude = args[1] ? Number(args[1]) : undefined;
        break;
      case "lon":
        filters.minLongitude = args[0] ? Number(args[0]) : undefined;
        filters.maxLongitude = args[1] ? Number(args[1]) : undefined;
        break;
      case "list": {
        const fieldMap: Record<string, keyof Volcano> = {
          countries: "country",
          regions: "volcanicRegion",
          types: "primaryVolcanoType",
          rocks: "dominantRockType",
          tectonics: "tectonicSetting",
        };
        const field = fieldMap[args[0]?.toLowerCase()];
        if (field) {
          const values = getDistinctValues(volcanoes, field);
          console.log(`\n${args[0]} (${values.length}):`);
          values.forEach((v) => console.log(`  ${v}`));
        } else {
          console.log(
            "Usage: list [countries|regions|types|rocks|tectonics]"
          );
        }
        rl.prompt();
        return;
      }
      case "stats":
        printStats(volcanoes);
        rl.prompt();
        return;
      case "clear":
        Object.keys(filters).forEach(
          (k) => delete (filters as Record<string, unknown>)[k]
        );
        console.log("Filters cleared.");
        rl.prompt();
        return;
      case "help":
      case "h":
        printHelp();
        rl.prompt();
        return;
      case "quit":
      case "exit":
      case "q":
        rl.close();
        return;
      default:
        // Treat the whole line as a search query
        filters.query = trimmed;
        break;
    }

    const result = search(volcanoes, filters);
    console.log(`\n${result.total} result(s):\n`);

    const display = result.volcanoes.slice(0, 25);
    display.forEach((v) => {
      console.log(formatVolcano(v));
      console.log();
    });

    if (result.total > 25) {
      console.log(`... and ${result.total - 25} more. Refine your search.`);
    }

    rl.prompt();
  });

  rl.on("close", () => {
    console.log("\nGoodbye!");
    process.exit(0);
  });
}

main();
