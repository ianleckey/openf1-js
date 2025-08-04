import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import * as td from "testdouble";
import { createFetcherRegistry } from "../../src/fetchers/FetcherRegistry.js";
import {
  PitFetcher,
  SessionFetcher,
  DriverFetcher,
  WeatherFetcher,
  IntervalFetcher,
  PositionFetcher,
  CarDataFetcher,
  TeamRadioFetcher,
  RaceControlFetcher,
  SessionResultFetcher,
  MeetingFetcher,
  StintFetcher,
  LocationFetcher,
  StartingGridFetcher,
  LapFetcher,
} from "../../src/fetchers/index.js";

describe("createFetcherRegistry", () => {
  let transport: any;
  let registry: ReturnType<typeof createFetcherRegistry>;

  beforeEach(() => {
    transport = td.object(["request"]);
    registry = createFetcherRegistry(transport);
  });

  test("returns an object with expected fetcher keys", () => {
    const expectedKeys = [
      "pit",
      "session",
      "driver",
      "weather",
      "interval",
      "position",
      "carData",
      "teamRadio",
      "raceControl",
      "sessionResult",
      "meeting",
      "location",
      "stint",
      "startingGrid",
      "lap",
    ];
    assert.deepEqual(Object.keys(registry).sort(), expectedKeys.sort());
  });

  test("each fetcher is constructed with the provided transport", () => {
    for (const key in registry) {
      assert.ok(registry[key]);
      // All fetchers should have a transport property
      assert.strictEqual(registry[key]["transport"], transport);
    }
  });

  test("fetchers are instances of their respective classes", () => {
    const instanceChecks = {
      pit: PitFetcher,
      session: SessionFetcher,
      driver: DriverFetcher,
      weather: WeatherFetcher,
      interval: IntervalFetcher,
      position: PositionFetcher,
      carData: CarDataFetcher,
      teamRadio: TeamRadioFetcher,
      raceControl: RaceControlFetcher,
      sessionResult: SessionResultFetcher,
      meeting: MeetingFetcher,
      location: LocationFetcher,
      stint: StintFetcher,
      startingGrid: StartingGridFetcher,
      lap: LapFetcher,
    };

    for (const [key, Class] of Object.entries(instanceChecks)) {
      assert.ok(registry[key] instanceof Class);
    }
  });
});
