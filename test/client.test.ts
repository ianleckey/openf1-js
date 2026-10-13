import nock from "nock";
import { OpenF1, OpenF1Error } from "../src/index";

const base = "https://api.openf1.org";
const at = (expected: string) => (uri: string) => decodeURIComponent(uri) === expected;

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());
afterEach(() => nock.cleanAll());

describe("resources", () => {
  const f1 = new OpenF1();

  it("list() returns JSON and serialises filters", async () => {
    const laps = [{ lap_number: 8, driver_number: 1 }];
    nock(base)
      .get(at("/v1/laps?session_key=9161&driver_number=1&driver_number=44&lap_duration<100"))
      .matchHeader("accept", "application/json")
      .reply(200, laps);
    await expect(
      f1.laps.list({ session_key: 9161, driver_number: [1, 44], lap_duration: { lt: 100 } })
    ).resolves.toEqual(laps);
  });

  it("list() returns [] when OpenF1 finds no results", async () => {
    nock(base).get("/v1/pit").query(true).reply(404, { detail: "No results found." });
    await expect(f1.pit.list({ session_key: 1 })).resolves.toEqual([]);
  });

  it("csv() opts in to CSV", async () => {
    nock(base)
      .get(at("/v1/weather?session_key=9158&csv=true"))
      .matchHeader("accept", "text/csv")
      .reply(200, "air_temperature,date\n27.8,2023-05-07");
    await expect(f1.weather.csv({ session_key: 9158 })).resolves.toBe(
      "air_temperature,date\n27.8,2023-05-07"
    );
  });

  it.each([
    ["overtakes", "overtakes"],
    ["championshipDrivers", "championship_drivers"],
    ["championshipTeams", "championship_teams"],
  ] as const)("exposes %s at /v1/%s", async (prop, path) => {
    nock(base).get(at(`/v1/${path}?session_key=9839`)).reply(200, [{ ok: true }]);
    await expect(f1[prop].list({ session_key: 9839 })).resolves.toEqual([{ ok: true }]);
  });

  it("request() calls arbitrary endpoints", async () => {
    nock(base).get(at("/v1/something_new?a>=1")).reply(200, [1]);
    await expect(f1.request("something_new", { a: { gte: 1 } })).resolves.toEqual([1]);
  });
});

describe("session scope", () => {
  const f1 = new OpenF1();

  it("binds session_key to every call", async () => {
    nock(base)
      .get(at("/v1/team_radio?driver_number=1&session_key=latest"))
      .reply(200, [{ driver_number: 1 }]);
    await expect(f1.session("latest").teamRadio({ driver_number: 1 })).resolves.toEqual([
      { driver_number: 1 },
    ]);
  });

  it("info() returns the session record", async () => {
    nock(base).get(at("/v1/sessions?session_key=9158")).reply(200, [{ session_key: 9158 }]);
    await expect(f1.session(9158).info()).resolves.toEqual({ session_key: 9158 });
  });
});

describe("transport", () => {
  it("throws OpenF1Error with status and body", async () => {
    nock(base).get("/v1/laps").query(true).reply(500, { detail: "boom" });
    const error = await new OpenF1().laps.list({ session_key: 1 }).catch((e) => e);
    expect(error).toBeInstanceOf(OpenF1Error);
    expect(error.status).toBe(500);
    expect(error.body).toEqual({ detail: "boom" });
    expect(error.message).toContain("boom");
  });

  it("legacy methods still throw on no results", async () => {
    nock(base).get("/v1/pit").query(true).reply(404, { detail: "No results found." });
    await expect(new OpenF1().getPit({ session_key: 1 })).rejects.toMatchObject({ status: 404 });
  });

  it("retries after a 429", async () => {
    nock(base)
      .get("/v1/drivers")
      .reply(429, {}, { "Retry-After": "0" })
      .get("/v1/drivers")
      .reply(200, [{ driver_number: 1 }]);
    await expect(new OpenF1().drivers.list()).resolves.toEqual([{ driver_number: 1 }]);
  });

  it("gives up after the configured retries", async () => {
    nock(base).get("/v1/drivers").times(2).reply(429, {}, { "Retry-After": "0" });
    await expect(new OpenF1({ retries: 1 }).drivers.list()).rejects.toMatchObject({
      status: 429,
    });
  });

  it("times out", async () => {
    nock(base).get("/v1/drivers").delay(200).reply(200, []);
    await expect(new OpenF1({ timeoutMs: 20 }).drivers.list()).rejects.toThrow(/timed out/);
  });

  it("sends the access token as a Bearer header", async () => {
    nock(base)
      .get("/v1/drivers")
      .matchHeader("authorization", "Bearer abc")
      .reply(200, []);
    await expect(
      new OpenF1({ accessToken: async () => "abc" }).drivers.list()
    ).resolves.toEqual([]);
  });

  it("uses a custom baseURL and fetch", async () => {
    const calls: string[] = [];
    const fetch = (async (url: string) => {
      calls.push(url);
      return new Response("[]", { status: 200 });
    }) as typeof globalThis.fetch;
    await new OpenF1({ baseURL: "http://localhost:1/v1", fetch }).laps.list({ lap_number: 1 });
    expect(calls).toEqual(["http://localhost:1/v1/laps?lap_number=1"]);
  });

  it("legacy CSV mode still works", async () => {
    nock(base).get(at("/v1/drivers?session_key=1&csv=true")).reply(200, "a,b");
    await expect(new OpenF1({ mode: "csv" }).getDrivers({ session_key: 1 })).resolves.toBe("a,b");
  });
});

describe("fetchToken", () => {
  it("exchanges credentials for a token", async () => {
    nock(base)
      .post("/token", "username=me%40example.com&password=pw")
      .reply(200, { access_token: "tok", expires_in: "3600", token_type: "bearer" });
    const token = await OpenF1.fetchToken({ username: "me@example.com", password: "pw" });
    expect(token.accessToken).toBe("tok");
    expect(token.expiresAt.getTime()).toBeGreaterThan(Date.now() + 3500_000);
  });

  it("throws on bad credentials", async () => {
    nock(base).post("/token").reply(401, { detail: "Invalid credentials" });
    await expect(
      OpenF1.fetchToken({ username: "x", password: "y" })
    ).rejects.toBeInstanceOf(OpenF1Error);
  });
});

describe("cancellation", () => {
  it("aborts while waiting to retry a 429", async () => {
    nock(base).get("/v1/drivers").reply(429, {}, { "Retry-After": "30" });
    const controller = new AbortController();
    const pending = new OpenF1().drivers.list(undefined, { signal: controller.signal });
    setTimeout(() => controller.abort(), 20);
    await expect(pending).rejects.toThrow(/aborted/);
  });
});

describe("public API", () => {
  it("has a stable set of runtime exports (changing this is a semver decision)", async () => {
    const mod = await import("../src/index");
    expect(Object.keys(mod).sort()).toEqual(
      ["DEFAULT_BASE_URL", "OpenF1", "OpenF1Error", "isNoResults"].sort()
    );
  });
});
