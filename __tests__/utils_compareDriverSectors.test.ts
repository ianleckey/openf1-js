import { compareDriverSectors } from "../dist/index.js";
import { describe, it, expect } from "@jest/globals";

const mockLaps = [
  {
    data: { driver_number: "1", lap_number: 1 },
    getSectorTime: (sector: number) => sector === 1 ? 25.0 : sector === 2 ? 30.0 : 35.0
  },
  {
    data: { driver_number: "44", lap_number: 1 },
    getSectorTime: (sector: number) => sector === 1 ? 24.8 : sector === 2 ? 29.9 : 35.1
  }
];

describe("compareDriverSectors", () => {
  it("computes sector-by-sector deltas", () => {
    const result = compareDriverSectors(44, 1, mockLaps);
    expect(result.sectorDeltas.length).toBe(3);
    expect(result.averageSectorDelta).toBeCloseTo(-0.066, 2);
  });
});
