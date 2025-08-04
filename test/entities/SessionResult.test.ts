import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as td from "testdouble";
import { SessionResult } from "../../src/entities/SessionResult.js";
import { OpenF1Error } from "../../src/errors/OpenF1Error.js";

const dummyData = {
  dnf: false,
  dns: false,
  dsq: false,
  driver_number: 44,
  duration: 7200,
  gap_to_leader: 0,
  number_of_laps: 58,
  meeting_key: 123,
  position: 1,
  session_key: 456,
};

describe("SessionResult", () => {
  let fetchers: any;
  let sessionResult: SessionResult;
  let driverEntity: any;

  beforeEach(() => {
    driverEntity = { driver_number: 44, name: "Lewis Hamilton" };
    fetchers = { driver: td.object(["fetchOneForSession"]) };
    sessionResult = new SessionResult(dummyData, fetchers);
  });

  afterEach(() => {
    td.reset();
  });

  test("computed properties: isWinner, isPodium, isInPoints", () => {
    assert.equal(sessionResult.isWinner, true);
    assert.equal(sessionResult.isPodium, true);
    assert.equal(sessionResult.isInPoints, true);
  });

  test("points getter returns correct value for position", () => {
    assert.equal(sessionResult.points, 25);
    sessionResult = new SessionResult({ ...dummyData, position: 2 }, fetchers);
    assert.equal(sessionResult.points, 18);
    sessionResult = new SessionResult({ ...dummyData, position: 11 }, fetchers);
    assert.equal(sessionResult.points, 0);
  });

  test("driver() fetches and caches driver", async () => {
    td.when(
      fetchers.driver.fetchOneForSession({
        driver_number: dummyData.driver_number,
        session_key: dummyData.session_key,
      })
    ).thenResolve(driverEntity);

    const driver = await sessionResult.driver();
    assert.deepEqual(driver, driverEntity);
    // Should use cache on second call
    const cachedDriver = await sessionResult.driver();
    assert.deepEqual(cachedDriver, driverEntity);
  });

  test("driver() throws if fetcher returns undefined", async () => {
    td.when(
      fetchers.driver.fetchOneForSession(td.matchers.anything())
    ).thenResolve(undefined);
    await assert.rejects(() => sessionResult.driver(), OpenF1Error);
  });

  test("loaded() returns correct cache state", async () => {
    assert.deepEqual(sessionResult.loaded(), { driver: false });
    td.when(
      fetchers.driver.fetchOneForSession(td.matchers.anything())
    ).thenResolve(driverEntity);
    await sessionResult.driver();
    assert.deepEqual(sessionResult.loaded(), { driver: true });
  });
});
