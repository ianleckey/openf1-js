import { SectorModeler } from "../dist/index.js";
import { describe, it, expect } from "@jest/globals";

describe("SectorModeler", () => {
  it("assigns sectors based on mock location paths", () => {
    const locations = [
      { x: 10, y: 10, session_key: 1, driver_number: 1 },
      { x: 50, y: 50, session_key: 1, driver_number: 1 },
      { x: 90, y: 90, session_key: 1, driver_number: 1 },
    ];
    const modeler = new SectorModeler();
    const result = modeler.assignSectors(locations);
    expect(result.every(r => r.sector)).toBe(true);
  });
});
