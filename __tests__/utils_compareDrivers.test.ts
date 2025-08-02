import { compareDrivers } from "../dist/index.js";
import { describe, it, expect } from "@jest/globals";

const mockLaps = [
  { data: { driver_number: "1", lap_number: 1 }, durationSeconds: 85.0 },
  { data: { driver_number: "44", lap_number: 1 }, durationSeconds: 84.5 },
  { data: { driver_number: "1", lap_number: 2 }, durationSeconds: 86.0 },
  { data: { driver_number: "44", lap_number: 2 }, durationSeconds: 85.8 },
];

describe("compareDrivers", () => {
  it("computes average lap deltas", () => {
    const result = compareDrivers(44, 1, mockLaps);
    expect(result.averageDelta).toBeCloseTo(-0.35);
    expect(result.lapsCompared).toBe(2);
  });
});
