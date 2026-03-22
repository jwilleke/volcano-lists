import * as fs from "fs";
import * as path from "path";
import { Volcano } from "./types";

const DATA_DIR = path.join(__dirname, "..", "data");
const JSON_FILE = path.join(DATA_DIR, "volcanoes.json");

export function loadVolcanoes(): Volcano[] {
  if (!fs.existsSync(JSON_FILE)) {
    console.error(
      `Data file not found: ${JSON_FILE}\nRun "npm run import" first to import XLS data.`
    );
    process.exit(1);
  }

  const raw = fs.readFileSync(JSON_FILE, "utf-8");
  return JSON.parse(raw) as Volcano[];
}
