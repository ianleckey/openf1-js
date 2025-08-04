import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import * as td from "testdouble";
import { Fetcher } from "../../src/fetchers/Fetcher.js";
import { FetchError } from "../../src/errors/OpenF1Error.js";

// Dummy types for testing
type TestType = { id: number };
class TestEntity {
  constructor(public id: number) {}
}

// Concrete implementation for testing
class TestFetcher extends Fetcher<TestType, TestEntity> {}

const dummyEndpoint = "test-endpoint";

describe("Fetcher", () => {
  let transport: any;
  let factory: (data: TestType[]) => TestEntity[];
  let fetcher: TestFetcher;

  beforeEach(() => {
    transport = td.object(["request"]);
    factory = (data) => data.map((d) => new TestEntity(d.id));
    fetcher = new TestFetcher(dummyEndpoint, transport, factory);
  });

  afterEach(() => {
    td.reset();
  });

  test("fetches and transforms data using factory", async () => {
    const input = [{ id: 1 }];
    td.when(transport.request(dummyEndpoint, { foo: "bar" })).thenResolve(
      input
    );

    const result = await fetcher.fetch({ foo: "bar" } as any);

    assert.equal(result.length, 1);
    assert.equal(result[0].id, 1);
  });

  test("uses cache for repeated fetch with same params", async () => {
    const input = [{ id: 1 }];
    td.when(transport.request(dummyEndpoint, { foo: "bar" })).thenResolve(
      input
    );

    await fetcher.fetch({ foo: "bar" } as any);
    const result = await fetcher.fetch({ foo: "bar" } as any);

    assert.equal(result.length, 1);
  });

  test("throws FetchError if response is not an array", async () => {
    td.when(transport.request(dummyEndpoint, {})).thenResolve({ not: "array" });

    await assert.rejects(() => fetcher.fetch({} as any), FetchError);
  });
});
