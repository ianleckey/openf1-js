import { test, describe } from "node:test";
import assert from "node:assert/strict";
import * as td from "testdouble";
import { Transport } from "../../src/transport/Transport.js";
import { FetchError, NotFoundError } from "../../src/errors/OpenF1Error.js";

describe("Transport", () => {
  test("constructs with default options", () => {
    const transport = new Transport();
    assert.ok(transport);
    // Check default baseURL
    assert.strictEqual(
      transport["axios"].defaults.baseURL,
      "https://api.openf1.org/v1/"
    );
  });

  test("constructs with custom options", () => {
    const transport = new Transport({
      baseURL: "http://localhost:1234",
      retries: 5,
      retryDelayMs: 1000,
      mode: "csv",
    });
    assert.strictEqual(
      transport["axios"].defaults.baseURL,
      "http://localhost:1234"
    );
    assert.strictEqual(transport["mode"], "csv");
    assert.strictEqual(transport["retries"], 5);
    assert.strictEqual(transport["delay"], 1000);
  });

  test("request calls axios.get with correct params", async () => {
    const transport = new Transport();
    const axiosStub = td.object(["get"]) as any;
    axiosStub.defaults = { baseURL: "https://api.openf1.org/v1/" };
    transport["axios"] = axiosStub;
    td.when(axiosStub.get("endpoint", td.matchers.anything())).thenResolve({
      data: "ok",
    });
    const result = await transport.request("endpoint", { foo: "bar" });
    assert.strictEqual(result, "ok");
  });

  test("request throws FetchError on unknown error", async () => {
    const transport = new Transport();
    const axiosStub = td.object(["get"]) as any;
    axiosStub.defaults = { baseURL: "https://api.openf1.org/v1/" };
    transport["axios"] = axiosStub;
    td.when(axiosStub.get("endpoint", td.matchers.anything())).thenReject(
      new Error("fail")
    );
    await assert.rejects(() => transport.request("endpoint"), FetchError);
  });

  test("request throws NotFoundError on 404", async () => {
    const transport = new Transport();
    const axiosStub = td.object(["get"]) as any;
    axiosStub.defaults = { baseURL: "https://api.openf1.org/v1/" };
    transport["axios"] = axiosStub;
    td.when(axiosStub.get("endpoint", td.matchers.anything())).thenReject({
      response: { status: 404 },
    });
    await assert.rejects(() => transport.request("endpoint"), NotFoundError);
  });
});
