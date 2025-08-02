import { DriversFetcher } from "../dist/index.js";
import { mockTransport } from "./mocks.js";
import { describe, it, expect } from "@jest/globals";

describe("DriversFetcher", () => {
  const fetcher = new DriversFetcher(mockTransport);

  it("fetches drivers with mock transport", async () => {
    const result = await fetcher.get({ session_key: 100 });
    expect(Array.isArray(result)).toBe(true);
  });
});
