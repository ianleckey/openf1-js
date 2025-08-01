import { OpenF1 } from "../src/index";
import nock from "nock";

describe("OpenF1 SDK Endpoints", () => {
  const sdk = new OpenF1();

  const base = "https://api.openf1.org";

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
    const expected = [
      {
        circuit_key: 7,
        circuit_short_name: "Spa-Francorchamps",
        country_code: "BEL",
        country_key: 16,
        country_name: "Belgium",
        date_end: "2023-07-29T15:35:00+00:00",
        date_start: "2023-07-29T15:05:00+00:00",
        gmt_offset: "02:00:00",
        location: "Spa-Francorchamps",
        meeting_key: 1216,
        session_key: 9140,
        session_name: "Sprint",
        session_type: "Race",
        year: 2023,
      },
    ];
    nock(base)
      .get("/v1/sessions")
      .query({ country_name: "Belgium", session_name: "Sprint", year: 2023 })
      .reply(200, expected);
    const res = await sdk.getSessions({
      country_name: "Belgium",
      session_name: "Sprint",
      year: 2023,
    });
    expect(res).toEqual(expected);
  });

  it("should fetch session results", async () => {
    const expected = [
      {
        dnf: false,
        dns: false,
        dsq: false,
        driver_number: 1,
        duration: 77.565,
        gap_to_leader: 0,
        number_of_laps: 24,
        meeting_key: 1143,
        position: 1,
        session_key: 7782,
      },
      {
        dnf: false,
        dns: false,
        dsq: false,
        driver_number: 14,
        duration: 77.727,
        gap_to_leader: 0.162,
        number_of_laps: 26,
        meeting_key: 1143,
        position: 2,
        session_key: 7782,
      },
      {
        dnf: false,
        dns: false,
        dsq: false,
        driver_number: 31,
        duration: 77.938,
        gap_to_leader: 0.373,
        number_of_laps: 23,
        meeting_key: 1143,
        position: 3,
        session_key: 7782,
      },
    ];
    nock(base)
      .get("/v1/session_result")
      .query({ session_key: 7782, position: "<=3" })
      .reply(200, expected);
    const res = await sdk.getSessionResult({
      session_key: 7782,
      position: "<=3",
    });
    expect(res).toEqual(expected);
  });

  it("should fetch starting grid", async () => {
    const expected = [
      {
        position: 1,
        driver_number: 1,
        lap_duration: 76.732,
        meeting_key: 1143,
        session_key: 7783,
      },
      {
        position: 2,
        driver_number: 63,
        lap_duration: 76.968,
        meeting_key: 1143,
        session_key: 7783,
      },
      {
        position: 3,
        driver_number: 44,
        lap_duration: 77.104,
        meeting_key: 1143,
        session_key: 7783,
      },
    ];
    nock(base)
      .get("/v1/starting_grid")
      .query({ session_key: 7783, position: "<=3" })
      .reply(200, expected);
    const res = await sdk.getStartingGrid({
      session_key: 7783,
      position: "<=3",
    });
    expect(res).toEqual(expected);
  });

  it("should fetch stints", async () => {
    const expected = [
      {
        compound: "SOFT",
        driver_number: 16,
        lap_end: 20,
        lap_start: 1,
        meeting_key: 1219,
        session_key: 9165,
        stint_number: 1,
        tyre_age_at_start: 3,
      },
      {
        compound: "SOFT",
        driver_number: 20,
        lap_end: 62,
        lap_start: 44,
        meeting_key: 1219,
        session_key: 9165,
        stint_number: 3,
        tyre_age_at_start: 3,
      },
    ];
    nock(base)
      .get("/v1/stints")
      .query({ session_key: 9165, tyre_age_at_start: ">=3" })
      .reply(200, expected);
    const res = await sdk.getStints({
      session_key: 9165,
      tyre_age_at_start: ">=3",
    });
    expect(res).toEqual(expected);
  });

  it("should fetch meetings", async () => {
    const expected = [
      {
        circuit_key: 61,
        circuit_short_name: "Singapore",
        country_code: "SGP",
        country_key: 157,
        country_name: "Singapore",
        date_start: "2023-09-15T09:30:00+00:00",
        gmt_offset: "08:00:00",
        location: "Marina Bay",
        meeting_key: 1219,
        meeting_name: "Singapore Grand Prix",
        meeting_official_name:
          "FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2023",
        year: 2023,
      },
    ];
    nock(base)
      .get("/v1/meetings")
      .query({ year: 2023, country_name: "Singapore" })
      .reply(200, expected);
    const res = await sdk.getMeetings({
      year: 2023,
      country_name: "Singapore",
    });
    expect(res).toEqual(expected);
  });

  it("should fetch pit", async () => {
    const expected = [
      {
        date: "2023-09-15T09:38:23.038000+00:00",
        driver_number: 63,
        lap_number: 5,
        meeting_key: 1219,
        pit_duration: 24.5,
        session_key: 9158,
      },
      {
        date: "2023-09-15T10:05:01.229000+00:00",
        driver_number: 81,
        lap_number: 13,
        meeting_key: 1219,
        pit_duration: 30.8,
        session_key: 9158,
      },
    ];
    nock(base)
      .get("/v1/pit")
      .query({ session_key: 9158, pit_duration: "<31" })
      .reply(200, expected);
    const res = await sdk.getPit({ session_key: 9158, pit_duration: "<31" });
    expect(res).toEqual(expected);
  });

  it("should fetch position", async () => {
    const expected = [
      {
        date: "2023-08-26T09:30:47.199000+00:00",
        driver_number: 40,
        meeting_key: 1217,
        position: 2,
        session_key: 9144,
      },
      {
        date: "2023-08-26T09:35:51.477000+00:00",
        driver_number: 40,
        meeting_key: 1217,
        position: 3,
        session_key: 9144,
      },
    ];
    nock(base)
      .get("/v1/position")
      .query({ meeting_key: 1217, driver_number: 40, position: "<=3" })
      .reply(200, expected);
    const res = await sdk.getPosition({
      meeting_key: 1217,
      driver_number: 40,
      position: "<=3",
    });
    expect(res).toEqual(expected);
  });

  it("should fetch race control", async () => {
    const expected = [
      {
        category: "Flag",
        date: "2023-06-04T14:21:01+00:00",
        driver_number: 1,
        flag: "BLACK AND WHITE",
        lap_number: 59,
        meeting_key: 1211,
        message: "BLACK AND WHITE FLAG FOR CAR 1 (VER) - TRACK LIMITS",
        scope: "Driver",
        sector: null,
        session_key: 9102,
      },
    ];
    nock(base)
      .get("/v1/race_control")
      .query({
        flag: "BLACK AND WHITE",
        driver_number: 1,
        date: ">=2023-01-01",
        date2: "<2023-09-01",
      })
      .reply(200, expected);
    const res = await sdk.getRaceControl({
      flag: "BLACK AND WHITE",
      driver_number: 1,
      date: ">=2023-01-01",
      date2: "<2023-09-01",
    });
    expect(res).toEqual(expected);
  });

  it("should fetch location", async () => {
    const expected = [
      {
        date: "2023-09-16T13:03:35.292000+00:00",
        driver_number: 81,
        meeting_key: 1219,
        session_key: 9161,
        x: 567,
        y: 3195,
        z: 187,
      },
      {
        date: "2023-09-16T13:03:35.752000+00:00",
        driver_number: 81,
        meeting_key: 1219,
        session_key: 9161,
        x: 489,
        y: 3403,
        z: 186,
      },
    ];
    nock(base)
      .get("/v1/location")
      .query({
        session_key: 9161,
        driver_number: 81,
        date: ">2023-09-16T13:03:35.200",
        date2: "<2023-09-16T13:03:35.800",
      })
      .reply(200, expected);
    const res = await sdk.getLocation({
      session_key: 9161,
      driver_number: 81,
      date: ">2023-09-16T13:03:35.200",
      date2: "<2023-09-16T13:03:35.800",
    });
    expect(res).toEqual(expected);
  });

  it("should fetch laps", async () => {
    const expected = [
      {
        date_start: "2023-09-16T13:59:07.606000+00:00",
        driver_number: 63,
        duration_sector_1: 26.966,
        duration_sector_2: 38.657,
        duration_sector_3: 26.12,
        i1_speed: 307,
        i2_speed: 277,
        is_pit_out_lap: false,
        lap_duration: 91.743,
        lap_number: 8,
        meeting_key: 1219,
        segments_sector_1: [2049, 2049, 2049, 2051, 2049, 2051, 2049, 2049],
        segments_sector_2: [2049, 2049, 2049, 2049, 2049, 2049, 2049, 2049],
        segments_sector_3: [2048, 2048, 2048, 2048, 2048, 2064, 2064, 2064],
        session_key: 9161,
        st_speed: 298,
      },
    ];
    nock(base)
      .get("/v1/laps")
      .query({ session_key: 9161, driver_number: 63, lap_number: 8 })
      .reply(200, expected);
    const res = await sdk.getLaps({
      session_key: 9161,
      driver_number: 63,
      lap_number: 8,
    });
    expect(res).toEqual(expected);
  });

  it("should fetch car data", async () => {
    const expected = [
      {
        brake: 0,
        date: "2023-09-15T13:08:19.923000+00:00",
        driver_number: 55,
        drs: 12,
        meeting_key: 1219,
        n_gear: 8,
        rpm: 11141,
        session_key: 9159,
        speed: 315,
        throttle: 99,
      },
      {
        brake: 100,
        date: "2023-09-15T13:35:41.808000+00:00",
        driver_number: 55,
        drs: 8,
        meeting_key: 1219,
        n_gear: 8,
        rpm: 11023,
        session_key: 9159,
        speed: 315,
        throttle: 57,
      },
    ];
    nock(base)
      .get("/v1/car_data")
      .query({ driver_number: 55, session_key: 9159, speed: ">=315" })
      .reply(200, expected);
    const res = await sdk.getCarData({
      driver_number: 55,
      session_key: 9159,
      speed: ">=315",
    });
    expect(res).toEqual(expected);
  });

  it("should fetch drivers", async () => {
    const expected = [
      {
        broadcast_name: "M VERSTAPPEN",
        country_code: "NED",
        driver_number: 1,
        first_name: "Max",
        full_name: "Max VERSTAPPEN",
        headshot_url:
          "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
        last_name: "Verstappen",
        meeting_key: 1219,
        name_acronym: "VER",
        session_key: 9158,
        team_colour: "3671C6",
        team_name: "Red Bull Racing",
      },
    ];
    nock(base)
      .get("/v1/drivers")
      .query({ driver_number: 1, session_key: 9158 })
      .reply(200, expected);
    const res = await sdk.getDrivers({ driver_number: 1, session_key: 9158 });
    expect(res).toEqual(expected);
  });

  it("should fetch intervals", async () => {
    const expected = [
      {
        date: "2023-09-17T13:31:02.395000+00:00",
        driver_number: 1,
        gap_to_leader: 41.019,
        interval: 0.003,
        meeting_key: 1219,
        session_key: 9165,
      },
    ];
    nock(base)
      .get("/v1/intervals")
      .query({ session_key: 9165, interval: "<0.005" })
      .reply(200, expected);
    const res = await sdk.getIntervals({
      session_key: 9165,
      interval: "<0.005",
    });
    expect(res).toEqual(expected);
  });

  it("should fetch team radio", async () => {
    const expected = [
      {
        date: "2023-09-15T09:40:43.005000",
        driver_number: 11,
        meeting_key: 1219,
        recording_url:
          "https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-15_Practice_1/TeamRadio/SERPER01_11_20230915_104008.mp3",
        session_key: 9158,
      },
      {
        date: "2023-09-15T10:32:47.325000",
        driver_number: 11,
        meeting_key: 1219,
        recording_url:
          "https://livetiming.formula1.com/static/2023/2023-09-17_Singapore_Grand_Prix/2023-09-15_Practice_1/TeamRadio/SERPER01_11_20230915_113201.mp3",
        session_key: 9158,
      },
    ];
    nock(base)
      .get("/v1/team_radio")
      .query({ session_key: 9158, driver_number: 11 })
      .reply(200, expected);
    const res = await sdk.getTeamRadio({
      session_key: 9158,
      driver_number: 11,
    });
    expect(res).toEqual(expected);
  });

  it("should fetch weather", async () => {
    const expected = [
      {
        air_temperature: 27.8,
        date: "2023-05-07T18:42:25.233000+00:00",
        humidity: 58,
        meeting_key: 1208,
        pressure: 1018.7,
        rainfall: 0,
        session_key: 9078,
        track_temperature: 52.5,
        wind_direction: 136,
        wind_speed: 2.4,
      },
    ];
    nock(base)
      .get("/v1/weather")
      .query({
        meeting_key: 1208,
        wind_direction: ">=130",
        track_temperature: ">=52",
      })
      .reply(200, expected);
    const res = await sdk.getWeather({
      meeting_key: 1208,
      wind_direction: ">=130",
      track_temperature: ">=52",
    });
    expect(res).toEqual(expected);
  });
});
