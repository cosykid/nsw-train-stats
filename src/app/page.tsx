// app/page.tsx
import { getTodaysDelays } from "./delays";
import { loadRouteMap } from "./routes";
import { loadStopMap } from "./stops";
import ClientUI from "./ClientUI"; // ⬅️ next step

export default async function Page() {
  const { byLine, byStation } = await getTodaysDelays();
  const routeMap = await loadRouteMap();
  const stopMap = await loadStopMap();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sydney Train Delay Explorer</h1>
      <ClientUI
        byLine={byLine}
        byStation={byStation}
        routeMap={routeMap}
        stopMap={stopMap}
      />
    </main>
  );
}
