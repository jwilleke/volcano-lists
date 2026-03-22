import * as fs from "fs";
import * as path from "path";
import {
  VolcanoAlert,
  ActivitySnapshot,
  AlertLevel,
  ColorCode,
} from "./types";

const DATA_DIR = path.join(__dirname, "..", "data");

const HANS_API = "https://volcanoes.usgs.gov/hans-public/api";

interface DailySummaryItem {
  noticeId: string;
  vName: string;
  vnum: string;
  synopsis: string;
  alertLevel: AlertLevel;
  colorCode: ColorCode;
  sentUnixtime: number;
  sentRFC: string;
  statusUnixtime: number;
  statusRFC: string;
  prevAlertLevel: AlertLevel | null;
  prevColorCode: ColorCode | null;
}

interface ElevatedItem {
  obs_fullname: string;
  obs_abbr: string;
  volcano_name: string;
  vnum: string;
  notice_type_cd: string;
  notice_identifier: string;
  sent_utc: string;
  sent_unixtime: number;
  color_code: ColorCode;
  alert_level: AlertLevel;
  notice_url: string;
  notice_data: string;
}

interface MonitoredItem {
  volcano_name: string;
  vnum: string | null;
}

async function fetchJson<T>(endpoint: string, label: string): Promise<T> {
  const url = `${HANS_API}${endpoint}`;
  console.log(`Fetching ${label}...`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${label}: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as T;
}

async function importActivity(): Promise<void> {
  console.log("Importing volcano activity from USGS HANS API...\n");

  const [dailySummary, elevated, monitored] = await Promise.all([
    fetchJson<DailySummaryItem[]>(
      "/notice/getDailySummaryData",
      "daily summary"
    ),
    fetchJson<ElevatedItem[]>(
      "/volcano/getElevatedVolcanoes",
      "elevated volcanoes"
    ),
    fetchJson<MonitoredItem[]>(
      "/volcano/getMonitoredVolcanoes",
      "monitored volcanoes"
    ),
  ]);

  // Build a map of synopses from daily summary (keyed by vnum)
  const synopsisMap = new Map<string, DailySummaryItem>();
  for (const item of dailySummary) {
    if (item.vnum) {
      synopsisMap.set(item.vnum, item);
    }
  }

  // Merge elevated volcanoes with synopses
  const alerts: VolcanoAlert[] = elevated
    .filter((e) => e.vnum)
    .map((e) => {
      const summary = synopsisMap.get(e.vnum);
      return {
        volcanoNumber: e.vnum,
        volcanoName: e.volcano_name,
        alertLevel: e.alert_level,
        colorCode: e.color_code,
        synopsis: summary?.synopsis || "",
        observatory: e.obs_fullname,
        observatoryAbbr: e.obs_abbr,
        sentUtc: e.sent_utc,
        noticeUrl: e.notice_url,
        previousAlertLevel: summary?.prevAlertLevel || null,
        previousColorCode: summary?.prevColorCode || null,
      };
    });

  const monitoredCount = monitored.filter((m) => m.vnum).length;

  const snapshot: ActivitySnapshot = {
    fetchedUtc: new Date().toISOString(),
    elevatedVolcanoes: alerts,
    monitoredCount,
  };

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const outputPath = path.join(DATA_DIR, "activity.json");
  fs.writeFileSync(outputPath, JSON.stringify(snapshot, null, 2));

  console.log(`\nActivity import complete:`);
  console.log(`  Elevated volcanoes: ${alerts.length}`);
  console.log(`  Monitored volcanoes: ${monitoredCount}`);
  console.log(`  Fetched at: ${snapshot.fetchedUtc}`);
  console.log(`  Written to: ${outputPath}`);

  if (alerts.length > 0) {
    console.log(`\nCurrent alerts:`);
    for (const a of alerts) {
      console.log(
        `  ${a.colorCode.padEnd(6)} ${a.alertLevel.padEnd(8)} ${a.volcanoName}`
      );
    }
  }
}

importActivity().catch((err) => {
  console.error("Activity import failed:", err.message);
  process.exit(1);
});
