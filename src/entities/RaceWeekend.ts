// src/entities/RaceWeekend.ts
import { Transport } from "../transport/Transport.js";
import {
  CarDataFetcher,
  LapFetcher,
  SessionFetcher,
  SessionResultFetcher,
  StartingGridFetcher,
  StintFetcher,
  PitFetcher,
  PositionFetcher,
  RaceControlFetcher,
  LocationFetcher,
  DriverFetcher,
  IntervalFetcher,
  TeamRadioFetcher,
  WeatherFetcher,
} from "../fetchers/index.js";

export class RaceWeekend {
  private carData = new CarDataFetcher(this.transport);
  private laps = new LapFetcher(this.transport);
  private sessions = new SessionFetcher(this.transport);
  private sessionResults = new SessionResultFetcher(this.transport);
  private startingGrid = new StartingGridFetcher(this.transport);
  private stints = new StintFetcher(this.transport);
  private pit = new PitFetcher(this.transport);
  private position = new PositionFetcher(this.transport);
  private raceControl = new RaceControlFetcher(this.transport);
  private location = new LocationFetcher(this.transport);
  private drivers = new DriverFetcher(this.transport);
  private intervals = new IntervalFetcher(this.transport);
  private teamRadio = new TeamRadioFetcher(this.transport);
  private weather = new WeatherFetcher(this.transport);

  constructor(private meetingKey: number, private transport: Transport) {}

  getCarData(params: any = {}) {
    return this.carData.fetch({ ...params, meeting_key: this.meetingKey });
  }

  getLaps(params: any = {}) {
    return this.laps.fetch({ ...params, meeting_key: this.meetingKey });
  }

  getSessions(params: any = {}) {
    return this.sessions.fetch({ ...params, meeting_key: this.meetingKey });
  }

  getSessionResults(params: any = {}) {
    return this.sessionResults.fetch({
      ...params,
      meeting_key: this.meetingKey,
    });
  }

  getStartingGrid(params: any = {}) {
    return this.startingGrid.fetch({ ...params, meeting_key: this.meetingKey });
  }

  getStints(params: any = {}) {
    return this.stints.fetch({ ...params, meeting_key: this.meetingKey });
  }

  getPitStops(params: any = {}) {
    return this.pit.fetch({ ...params, meeting_key: this.meetingKey });
  }

  getPositions(params: any = {}) {
    return this.position.fetch({ ...params, meeting_key: this.meetingKey });
  }

  getRaceControlMessages(params: any = {}) {
    return this.raceControl.fetch({ ...params, meeting_key: this.meetingKey });
  }

  getLocationData(params: any = {}) {
    return this.location.fetch({ ...params, meeting_key: this.meetingKey });
  }

  getDrivers(params: any = {}) {
    return this.drivers.fetch({ ...params, meeting_key: this.meetingKey });
  }

  getIntervals(params: any = {}) {
    return this.intervals.fetch({ ...params, meeting_key: this.meetingKey });
  }

  getTeamRadio(params: any = {}) {
    return this.teamRadio.fetch({ ...params, meeting_key: this.meetingKey });
  }

  getWeather(params: any = {}) {
    return this.weather.fetch({ ...params, meeting_key: this.meetingKey });
  }
}
