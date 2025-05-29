"use client";

import { useState } from "react";

type DelayInfo = {
  stationId: string;
  stationName: string;
  delays: number[];
};

type StationDelayInfo = {
  lineId: string;
  lineName: string;
  delays: number[];
};

type ClientUIProps = {
  stations: { id: string; name: string }[];
  lines: { id: string; name: string }[];
  lineDelays: Record<string, DelayInfo[]>;
  stationDelays: Record<string, StationDelayInfo[]>;
};

export default function ClientUI({
  stations,
  lines,
  lineDelays,
  stationDelays,
}: ClientUIProps) {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex gap-6">
        <div>
          <label className="block font-semibold mb-1">Choose a Station:</label>
          <select
            className="border rounded p-2"
            onChange={(e) => setSelectedStation(e.target.value || null)}
          >
            <option value="">-- Select Station --</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Choose a Line:</label>
          <select
            className="border rounded p-2"
            onChange={(e) => setSelectedLine(e.target.value || null)}
          >
            <option value="">-- Select Line --</option>
            {lines.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedLine && lineDelays[selectedLine] && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Delays for Line: {lines.find((l) => l.id === selectedLine)?.name}
          </h2>
          <ul className="list-disc ml-4">
            {lineDelays[selectedLine].map(({ stationId, stationName, delays }) => (
              <li key={stationId}>
                {stationName}: [{delays.join(", ")}]
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedStation && stationDelays[selectedStation] && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Delays at Station: {stations.find((s) => s.id === selectedStation)?.name}
          </h2>
          <ul className="list-disc ml-4">
            {stationDelays[selectedStation].map(({ lineId, lineName, delays }) => (
              <li key={lineId}>
                {lineName}: [{delays.join(", ")}]
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
