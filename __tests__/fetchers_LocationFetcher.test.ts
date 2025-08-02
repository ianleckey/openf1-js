import { LocationFetcher } from "../dist/index.js";
import { mockTransport } from "./mocks.js";
import { describe, it, expect } from "@jest/globals";

describe("LocationFetcher", () => {
  const fetcher = new LocationFetcher(mockTransport);

  it("should fetch locations with session_key", async () => {
    const result = await fetcher.get({ session_key: 9000 });
    expect(Array.isArray(result)).toBe(true);
  });
});
