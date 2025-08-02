import { RaceWeekend } from "../dist/index.js";
import { mockTransport } from "./mocks.js";
import { describe, it, expect } from "@jest/globals";

describe("RaceWeekend", () => {
  const weekend = new RaceWeekend(1200, { transport: mockTransport });

  it("should instantiate with a meeting_key", () => {
    expect(weekend.meetingKey).toBe(1200);
  });

  it("should fetch drivers", async () => {
    const drivers = await weekend.getDrivers();
    expect(drivers).toBeDefined();
    expect(Array.isArray(drivers)).toBe(true);
  });
});
