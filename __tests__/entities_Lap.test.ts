import { Lap } from "../dist/index.js";
import { describe, it, expect } from "@jest/globals";

describe("Lap", () => {
  const lap = new Lap({ lap_number: 1, duration: 90.123 });

  it("computes duration in seconds", () => {
    expect(lap.durationSeconds).toBeCloseTo(90.123);
  });
});
