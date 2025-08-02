import { Lap } from "../entities/Lap.js";

export interface DriverComparisonResult {
  driverA: number;
  driverB: number;
  lapsCompared: number;
  averageDelta: number;
  perLapDeltas: {
    lapNumber: number;
    delta: number; // A - B
  }[];
}

export interface SectorDelta {
  lapNumber: number;
  sector: 1 | 2 | 3;
  delta: number;
}

export interface DriverSectorComparisonResult {
  driverA: number;
  driverB: number;
  sectorDeltas: SectorDelta[];
  averageSectorDelta: number;
}
export function compareDrivers(
  driverA: number,
  driverB: number,
  laps: Lap[]
): DriverComparisonResult {
  const lapsA = laps.filter((l) => l.driver_number === driverA);
  const lapsB = laps.filter((l) => l.driver_number === driverB);
  const commonLapNumbers = [...new Set(lapsA.map((l) => l.lap_number))].filter(
    (n) => lapsB.some((b) => b.lap_number === n)
  );

  const perLapDeltas = commonLapNumbers.map((lapNumber) => {
    const lapA = lapsA.find((l) => l.lap_number === lapNumber);
    const lapB = lapsB.find((l) => l.lap_number === lapNumber);
    const delta = (lapA?.lap_duration ?? 0) - (lapB?.lap_duration ?? 0);
    return { lapNumber, delta };
  });

  const averageDelta =
    perLapDeltas.reduce((sum, d) => sum + d.delta, 0) /
    (perLapDeltas.length || 1);

  return {
    driverA,
    driverB,
    lapsCompared: perLapDeltas.length,
    averageDelta,
    perLapDeltas,
  };
}

export function compareDriverSectors(
  driverA: number,
  driverB: number,
  laps: Lap[]
): DriverSectorComparisonResult {
  const lapsA = laps.filter((l) => l.driver_number === driverA);
  const lapsB = laps.filter((l) => l.driver_number === driverB);
  const sectorDeltas: SectorDelta[] = [];

  for (const lapA of lapsA) {
    const lapB = lapsB.find((b) => b.lap_number === lapA.lap_number);
    if (!lapB) continue;

    for (const sector of [1, 2, 3] as const) {
      // Assuming Lap has duration_sector_1, duration_sector_2, duration_sector_3
      let timeA: number | null = null;
      let timeB: number | null = null;
      if (sector === 1) {
        timeA = lapA.duration_sector_1;
        timeB = lapB.duration_sector_1;
      } else if (sector === 2) {
        timeA = lapA.duration_sector_2;
        timeB = lapB.duration_sector_2;
      } else if (sector === 3) {
        timeA = lapA.duration_sector_3;
        timeB = lapB.duration_sector_3;
      }
      if (timeA !== null && timeB !== null) {
        sectorDeltas.push({
          lapNumber: lapA.lap_number,
          sector,
          delta: timeA - timeB,
        });
      }
    }
  }

  const avgDelta =
    sectorDeltas.reduce((sum, d) => sum + d.delta, 0) /
    (sectorDeltas.length || 1);

  return {
    driverA,
    driverB,
    sectorDeltas,
    averageSectorDelta: avgDelta,
  };
}
