// app/stations.ts
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

export async function loadStopMap(): Promise<Record<string, string>> {
  const stopMap: Record<string, string> = {};

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(process.cwd(),"./src/app/stops.txt"))
      .pipe(csvParser({
        mapHeaders: ({ header }) => header.replace("\uFEFF", "").trim()
      }))
      .on("data", (row) => {
        const stopId = row["stop_id"];
        const stopName = row["stop_name"];
        const locationType = row["location_type"];

        // Only include real stations (not bus stands, ramps, or entries)
        if (stopId && stopName && (locationType === "1" || locationType === "")) {
          stopMap[stopId] = stopName.replace(/ Station.*/, ""); // Clean: "Blacktown Station" → "Blacktown"
        }
      })
      .on("end", () => resolve(stopMap))
      .on("error", reject);
  });
}
