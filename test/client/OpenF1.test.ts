import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import * as td from "testdouble";
import { OpenF1 } from "../../src/client/OpenF1.js";
import { Transport } from "../../src/transport/Transport.js";

describe("OpenF1", () => {
  // No beforeEach needed, construct OpenF1 normally in each test

  test("constructs with a Transport and fetcher registry", () => {
    const client = new OpenF1();
    assert.ok(client.transport instanceof Transport);
    assert.ok(client.fetchers);
    assert.ok(typeof client.fetchers === "object");
  });

  test("listAvailableEndpoints returns all fetcher keys", () => {
    const client = new OpenF1();
    const endpoints = client.listAvailableEndpoints();
    assert.deepEqual(endpoints.sort(), Object.keys(client.fetchers).sort());
  });

  test("deprecated methods call correct fetcher and emit warning", async () => {
    const client = new OpenF1();
    // Replace fetchers.session.fetch with a testdouble stub
    const fetchStub = td.function();
    td.when(fetchStub({})).thenResolve(["session"]);
    Object.defineProperty(client.fetchers.session, "fetch", {
      value: fetchStub,
      writable: true,
    });
    let warningCalled = false;
    const origEmitWarning = process.emitWarning;
    process.emitWarning = () => {
      warningCalled = true;
    };
    const result = await client.getSessions();
    assert.deepEqual(result, ["session"]);
    assert.ok(warningCalled);
    process.emitWarning = origEmitWarning;
  });
});
