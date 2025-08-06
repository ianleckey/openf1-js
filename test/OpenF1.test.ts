import { test, describe } from "node:test";
import assert from "node:assert/strict";
import * as td from "testdouble";
import { OpenF1 } from "../src/OpenF1.js";
import {
  DriverModel,
  IntervalModel,
  LapModel,
  LocationModel,
  MeetingModel,
  PitModel,
  PositionModel,
  RaceControlModel,
  SessionModel,
  SessionResultModel,
  StartingGridModel,
  StintModel,
  TeamRadioModel,
  TelemetryModel,
  WeatherModel,
} from "../src/models/index.js";
import { QueryBuilder } from "../src/utils/QueryBuilder.js";

describe("OpenF1", () => {
  const deprecatedMethods = [
    {
      method: "getSessions",
      model: SessionModel,
      modelMethod: "all",
      expected: ["session"],
    },
    {
      method: "getSessionResult",
      model: SessionResultModel,
      modelMethod: "all",
      expected: ["result"],
    },
    {
      method: "getStartingGrid",
      model: StartingGridModel,
      modelMethod: "all",
      expected: ["grid"],
    },
    {
      method: "getStints",
      model: StintModel,
      modelMethod: "all",
      expected: ["stint"],
    },
    {
      method: "getMeetings",
      model: MeetingModel,
      modelMethod: "all",
      expected: ["meeting"],
    },
    {
      method: "getPit",
      model: PitModel,
      modelMethod: "all",
      expected: ["pit"],
    },
    {
      method: "getPosition",
      model: PositionModel,
      modelMethod: "all",
      expected: ["position"],
    },
    {
      method: "getRaceControl",
      model: RaceControlModel,
      modelMethod: "all",
      expected: ["racecontrol"],
    },
    {
      method: "getLocation",
      model: LocationModel,
      modelMethod: "all",
      expected: ["location"],
    },
    {
      method: "getLaps",
      model: LapModel,
      modelMethod: "all",
      expected: ["lap"],
    },
    {
      method: "getCarData",
      model: TelemetryModel,
      modelMethod: "all",
      expected: ["telemetry"],
    },
    {
      method: "getDrivers",
      model: DriverModel,
      modelMethod: "all",
      expected: ["driver"],
    },
    {
      method: "getIntervals",
      model: IntervalModel,
      modelMethod: "all",
      expected: ["interval"],
    },
    {
      method: "getTeamRadio",
      model: TeamRadioModel,
      modelMethod: "all",
      expected: ["teamradio"],
    },
    {
      method: "getWeather",
      model: WeatherModel,
      modelMethod: "all",
      expected: ["weather"],
    },
  ];

  for (const { method, model, modelMethod, expected } of deprecatedMethods) {
    test(`${method} calls correct model and emits warning`, async () => {
      const client = new OpenF1();
      const stub = td.function();
      td.when(stub({})).thenResolve(expected);
      td.replace(model, modelMethod, stub);

      let warningCalled = false;
      const origEmitWarning = process.emitWarning;
      process.emitWarning = () => {
        warningCalled = true;
      };

      const result = await client[method]();
      assert.deepEqual(result, expected);
      assert.ok(warningCalled);

      process.emitWarning = origEmitWarning;
      td.reset();
    });
  }

  test("model class exposure", () => {
    const client = new OpenF1();
    assert.strictEqual(client.Driver, DriverModel);
    assert.strictEqual(client.Interval, IntervalModel);
    assert.strictEqual(client.Lap, LapModel);
    assert.strictEqual(client.Location, LocationModel);
    assert.strictEqual(client.Meeting, MeetingModel);
    assert.strictEqual(client.Pit, PitModel);
    assert.strictEqual(client.Position, PositionModel);
    assert.strictEqual(client.RaceControl, RaceControlModel);
    assert.strictEqual(client.Session, SessionModel);
    assert.strictEqual(client.SessionResult, SessionResultModel);
    assert.strictEqual(client.StartingGrid, StartingGridModel);
    assert.strictEqual(client.Stint, StintModel);
    assert.strictEqual(client.TeamRadio, TeamRadioModel);
    assert.strictEqual(client.Telemetry, TelemetryModel);
    assert.strictEqual(client.Weather, WeatherModel);
  });

  test("QueryBuilder exposure", () => {
    const client = new OpenF1();
    assert.strictEqual(client.QueryBuilder, QueryBuilder);
  });
});
