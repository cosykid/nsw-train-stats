import * as GtfsRealtimeBindings from "gtfs-realtime-bindings";

export type DelaySec = number;

export interface Aggregates {
  byLine: Record<
    string,
    {
      station: Record<string, DelaySec[]>;
      avg: number;
    }
  >;
  byStation: Record<
    string,
    {
      line: Record<string, DelaySec[]>;
      avg: number;
    }
  >;
}

const API_URL = "https://api.transport.nsw.gov.au/v2/gtfs/realtime/sydneytrains";

export async function getTodaysDelays(): Promise<Aggregates> {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `apikey ${process.env.NSW_API_KEY!}`,
      Accept: "application/x-google-protobuf",
    },
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type");
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API failed: ${res.status} ${errorText}`);
  }
  if (!contentType?.includes("application/x-google-protobuf")) {
    const text = await res.text();
    throw new Error(`Expected protobuf, got:\n${text.slice(0, 300)}`);
  }

  const buffer = new Uint8Array(await res.arrayBuffer());
  const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);

  const byLine: Aggregates["byLine"] = {};
  const byStation: Aggregates["byStation"] = {};

  for (const entity of feed.entity) {
    const tripUpdate = entity.tripUpdate;
    if (!tripUpdate?.trip || !tripUpdate.stopTimeUpdate) continue;

    const routeId = tripUpdate.trip.routeId?.toString() || "unknown";

    for (const update of tripUpdate.stopTimeUpdate) {
      const stopId = update.stopId?.toString() || "unknown";
      const delay = update.departure?.delay;

      if (typeof delay !== "number") continue; // skip missing delay data

      // byLine
      if (!byLine[routeId]) byLine[routeId] = { station: {}, avg: 0 };
      if (!byLine[routeId].station[stopId]) byLine[routeId].station[stopId] = [];
      byLine[routeId].station[stopId].push(delay);

      // byStation
      if (!byStation[stopId]) byStation[stopId] = { line: {}, avg: 0 };
      if (!byStation[stopId].line[routeId]) byStation[stopId].line[routeId] = [];
      byStation[stopId].line[routeId].push(delay);
    }
  }

  // Calculate averages
  for (const [line, data] of Object.entries(byLine)) {
    const allDelays = Object.values(data.station).flat();
    data.avg = allDelays.length > 0
      ? Math.round(allDelays.reduce((a, b) => a + b, 0) / allDelays.length)
      : 0;
  }

  for (const [station, data] of Object.entries(byStation)) {
    const allDelays = Object.values(data.line).flat();
    data.avg = allDelays.length > 0
      ? Math.round(allDelays.reduce((a, b) => a + b, 0) / allDelays.length)
      : 0;
  }

  return { byLine, byStation };
}