import express from "express";
import * as path from "path";
import { loadVolcanoes } from "./parser";
import { search, getDistinctValues } from "./search";
import { SearchFilters, Volcano } from "./types";

const PORT = Number(process.env.PORT) || 9110;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

console.log("Loading volcano data...");
const volcanoes = loadVolcanoes();
console.log(`Loaded ${volcanoes.length} volcanoes.`);

app.get("/api/search", (req, res) => {
  const filters: SearchFilters = {};

  if (req.query.query) filters.query = String(req.query.query);
  if (req.query.country) filters.country = String(req.query.country);
  if (req.query.region) filters.region = String(req.query.region);
  if (req.query.volcanoType)
    filters.volcanoType = String(req.query.volcanoType);
  if (req.query.rockType) filters.rockType = String(req.query.rockType);
  if (req.query.tectonicSetting)
    filters.tectonicSetting = String(req.query.tectonicSetting);
  if (req.query.epoch)
    filters.epoch = String(req.query.epoch) as "Holocene" | "Pleistocene";
  if (req.query.minElevation)
    filters.minElevation = Number(req.query.minElevation);
  if (req.query.maxElevation)
    filters.maxElevation = Number(req.query.maxElevation);
  if (req.query.minLatitude)
    filters.minLatitude = Number(req.query.minLatitude);
  if (req.query.maxLatitude)
    filters.maxLatitude = Number(req.query.maxLatitude);
  if (req.query.minLongitude)
    filters.minLongitude = Number(req.query.minLongitude);
  if (req.query.maxLongitude)
    filters.maxLongitude = Number(req.query.maxLongitude);

  const result = search(volcanoes, filters);
  res.json(result);
});

app.get("/api/facets", (_req, res) => {
  const facets: Record<string, string[]> = {
    countries: getDistinctValues(volcanoes, "country"),
    regions: getDistinctValues(volcanoes, "volcanicRegion"),
    volcanoTypes: getDistinctValues(volcanoes, "primaryVolcanoType"),
    rockTypes: getDistinctValues(volcanoes, "dominantRockType"),
    tectonicSettings: getDistinctValues(volcanoes, "tectonicSetting"),
  };
  res.json(facets);
});

app.get("/api/stats", (_req, res) => {
  const holocene = volcanoes.filter(
    (v: Volcano) => v.epoch === "Holocene"
  ).length;
  const pleistocene = volcanoes.filter(
    (v: Volcano) => v.epoch === "Pleistocene"
  ).length;
  res.json({
    total: volcanoes.length,
    holocene,
    pleistocene,
    countries: new Set(volcanoes.map((v: Volcano) => v.country)).size,
    regions: new Set(volcanoes.map((v: Volcano) => v.volcanicRegion)).size,
    volcanoTypes: new Set(
      volcanoes.map((v: Volcano) => v.primaryVolcanoType)
    ).size,
  });
});

app.listen(PORT, () => {
  console.log(`Volcano search running at http://localhost:${PORT}`);
});
