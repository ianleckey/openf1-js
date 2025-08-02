import { OpenF1 } from "../src";
import nock from "nock";

describe("OpenF1 SDK", () => {
  const sdk = new OpenF1({ baseURL: "https://api.openf1.org/v1" });

  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("should fetch sessions", async () => {
    const expected = [{ session_key: 1234, session_name: "Test Session" }];
    nock("https://api.openf1.org")
      .get("/v1/sessions")
      .query(true)
      .reply(200, expected);

    const sessions = await sdk.getSessions();
    expect(sessions).toEqual(expected);
  });

  it("should create a RaceWeekend and fetch data", async () => {
    const expected = [{ driver_number: 44, lap_number: 1 }];
    nock("https://api.openf1.org")
      .get("/v1/laps")
      .query((q) => q.meeting_key === 999)
      .reply(200, expected);

    const weekend = sdk.getRaceWeekend(999);
    const laps = await weekend.getLaps();
    expect(laps).toEqual(expected);
  });
});
