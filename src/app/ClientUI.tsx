"use client";

import { useState } from "react";

type ClientUIProps = {
  byLine: Record<string, { station: Record<string, number[]> }>;
  byStation: Record<string, { line: Record<string, number[]> }>;
  routeMap: Record<string, string>;
  stopMap: Record<string, string>;
};

export default function ClientUI({ byLine, byStation, routeMap, stopMap }: ClientUIProps) {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  const allStations = Object.keys(byStation).map((id) => ({
    id,
    name: stopMap[id.toString()] || id,
  }));

  console.log('yo', allStations)

  const allLines = Object.keys(byLine).map((id) => ({
    id,
    name: routeMap[id] || id,
  }));

  return (
    <div className="space-y-8">
      <div className="flex gap-6">
        <div>
          <label className="block font-semibold mb-1">Choose a Station:</label>
          <select className="border rounded p-2" onChange={(e) => setSelectedStation(e.target.value)}>
            <option value="">-- Select Station --</option>
            {allStations.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Choose a Line:</label>
          <select className="border rounded p-2" onChange={(e) => setSelectedLine(e.target.value)}>
            <option value="">-- Select Line --</option>
            {allLines.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedLine && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Delays for Line: {routeMap[selectedLine]}</h2>
          <ul className="list-disc ml-4">
            {Object.entries(byLine[selectedLine]?.station || {}).map(([stationId, delays]) => (
              <li key={stationId}>
                {stopMap[stationId] || stationId}: [{delays.join(", ")}]
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedStation && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Delays at Station: {stopMap[selectedStation]}</h2>
          <ul className="list-disc ml-4">
            {Object.entries(byStation[selectedStation]?.line || {}).map(([lineId, delays]) => (
              <li key={lineId}>
                {routeMap[lineId] || lineId}: [{delays.join(", ")}]
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
