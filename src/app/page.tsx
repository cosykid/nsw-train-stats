import { getTodaysDelays } from "./delays";
import { loadRouteMap } from "./routes";
import { loadStopMap } from "./stops";
import ClientUI from "./ClientUI";

export default async function Page() {
  const { byLine, byStation } = await getTodaysDelays();
  const routeMap = await loadRouteMap();
  const stopMap = await loadStopMap();

  const stations = Object.keys(byStation).map((id) => ({
    id,
    name: stopMap[id] || id,
  }));

  const lines = Object.keys(byLine).map((id) => ({
    id,
    name: routeMap[id] || id,
  }));

  const lineDelays = Object.fromEntries(
    Object.entries(byLine).map(([lineId, { station }]) => [
      lineId,
      Object.entries(station).map(([stationId, delays]) => ({
        stationId,
        stationName: stopMap[stationId] || stationId,
        delays,
      })),
    ])
  );

  const stationDelays = Object.fromEntries(
    Object.entries(byStation).map(([stationId, { line }]) => [
      stationId,
      Object.entries(line).map(([lineId, delays]) => ({
        lineId,
        lineName: routeMap[lineId] || lineId,
        delays,
      })),
    ])
  );

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sydney Train Delay Explorer</h1>
      <ClientUI
        stations={stations}
        lines={lines}
        lineDelays={lineDelays}
        stationDelays={stationDelays}
      />
    </main>
  );
}
