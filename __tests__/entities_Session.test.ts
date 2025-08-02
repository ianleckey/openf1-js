import { Session } from "../dist/index.js";
import { mockTransport } from "./mocks.js";
import { describe, it, expect } from "@jest/globals";

describe("Session", () => {
  const session = new Session(9999, { transport: mockTransport });

  it("should fetch car data", async () => {
    const data = await session.getCarData();
    expect(Array.isArray(data)).toBe(true);
  });
});
