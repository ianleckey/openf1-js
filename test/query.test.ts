import { serializeQuery, translateLegacyParams } from "../src/query";

describe("serializeQuery", () => {
  it("writes equality filters", () => {
    expect(serializeQuery({ session_key: 9159, driver_number: 55 })).toBe(
      "session_key=9159&driver_number=55"
    );
  });

  it("puts range operators in the key", () => {
    expect(serializeQuery({ speed: { gte: 315 } })).toBe("speed>=315");
    expect(serializeQuery({ interval: { gt: 0, lt: 0.005 } })).toBe("interval>0&interval<0.005");
    expect(serializeQuery({ position: { lte: 3 } })).toBe("position<=3");
  });

  it("repeats the key for arrays", () => {
    expect(serializeQuery({ driver_number: [1, 44] })).toBe("driver_number=1&driver_number=44");
  });

  it("serialises dates as ISO 8601", () => {
    const d = new Date("2023-09-16T13:03:35.200Z");
    expect(serializeQuery({ date: d })).toBe("date=2023-09-16T13%3A03%3A35.200Z");
    expect(serializeQuery({ date: { gt: d } })).toBe("date>2023-09-16T13%3A03%3A35.200Z");
  });

  it("encodes values and skips undefined/null", () => {
    expect(
      serializeQuery({ flag: "BLACK AND WHITE", session_key: "latest", lap: undefined, x: null })
    ).toBe("flag=BLACK%20AND%20WHITE&session_key=latest");
  });

  it("returns an empty string for no query", () => {
    expect(serializeQuery()).toBe("");
    expect(serializeQuery({})).toBe("");
  });
});

describe("translateLegacyParams", () => {
  it("moves operators from values into ranges", () => {
    expect(translateLegacyParams({ speed: ">=315", driver_number: 55 })).toEqual({
      speed: { gte: "315" },
      driver_number: 55,
    });
  });

  it("merges numbered keys into one range", () => {
    expect(
      translateLegacyParams({ date: ">=2023-01-01", date2: "<2023-09-01" })
    ).toEqual({ date: { gte: "2023-01-01", lt: "2023-09-01" } });
  });

  it("keeps field names that end in a digit", () => {
    expect(translateLegacyParams({ duration_sector_1: "<30", i1_speed: ">300" })).toEqual({
      duration_sector_1: { lt: "30" },
      i1_speed: { gt: "300" },
    });
  });

  it("round-trips to the OpenF1 wire format", () => {
    expect(
      serializeQuery(translateLegacyParams({ session_key: 9161, date: ">2023-09-16", date2: "<2023-09-17" }))
    ).toBe("session_key=9161&date>2023-09-16&date<2023-09-17");
  });
});
