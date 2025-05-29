import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

export async function loadRouteMap(): Promise<Record<string, string>> {
  const routeMap: Record<string, string> = {};

  return new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(process.cwd(), "./src/app/routes-reference-20170922_v8.csv"))
      .pipe(csvParser())
      .on("data", (row) => {
        const routeId = row["route_id"]; // i.e. APS_1f
        const short = row["route_short_name"]; // i.e. T8
        const long = row["LongName"]; // i.e. City Circle to Leppington via Sydenham
        if (routeId && short && long) {
          routeMap[routeId] = `${short} - ${long}`; // dictionary
        }
      })
      .on("end", () => resolve(routeMap))
      .on("error", reject);
  });
}
