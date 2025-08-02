import {
  Session,
  Lap,
  Weather,
  Interval,
  CarData,
  RaceControl,
} from "../src/entities";

describe("Computed Methods", () => {
  it("Session: isRace and startDate", () => {
    const s = new Session({
      session_name: "Grand Prix",
      session_type: "Race",
      date_start: "2023-07-29T15:05:00+00:00",
    } as any);

    expect(s.isRace).toBe(true);
    expect(s.startDate instanceof Date).toBe(true);
  });

  it("Lap: durationMs", () => {
    const l = new Lap({
      lap_time: "1:23.456",
    } as any);

    expect(l.durationMs).toBeCloseTo(83456, 0);
  });

  it("Weather: formattedTemperature and humidityPercent", () => {
    const w = new Weather({
      air_temperature: 28.678,
      humidity: 63,
    } as any);

    expect(w.formattedTemperature).toBe("28.7 °C");
    expect(w.humidityPercent).toBe("63%");
  });

  it("Interval: gapToLeaderSeconds", () => {
    const i = new Interval({
      gap_to_leader: "+12.345",
    } as any);

    expect(i.gapToLeaderSeconds).toBeCloseTo(12.345, 3);
  });

  it("CarData: speedKmh and throttlePercent", () => {
    const c = new CarData({
      speed: 312,
      throttle: 0.92,
    } as any);

    expect(c.speedKmh).toBe(312);
    expect(c.throttlePercent).toBe("92%");
  });

  it("RaceControl: isFlag", () => {
    const rc = new RaceControl({
      category: "Yellow Flag",
    } as any);

    expect(rc.isFlag).toBe(true);
  });
});
