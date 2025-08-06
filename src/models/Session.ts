import { OpenF1Error } from "../errors/OpenF1Error.js";
import { Model } from "./Model.js";
import {
  PitModel,
  TelemetryModel,
  RaceControlModel,
  IntervalModel,
  PositionModel,
  PitData,
  TelemetryData,
  RaceControlData,
  IntervalData,
  PositionData,
  LocationModel,
  LapModel,
  WeatherModel,
  StintModel,
  DriverModel,
  SessionResultModel,
  StartingGridModel,
} from "./index.js";

export interface SessionData {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number | "latest";
  session_key: number | "latest";
  session_name: string;
  session_type: string;
  year: number;
}

export class SessionModel extends Model<SessionData, SessionModel> {
  static override endpoint = "sessions";

  private _cache = {
    pits: undefined as PitModel[] | undefined,
    telemetry: undefined as TelemetryModel[] | undefined,
    raceControl: undefined as RaceControlModel[] | undefined,
    intervals: undefined as IntervalModel[] | undefined,
    positions: undefined as PositionModel[] | undefined,
    laps: undefined as LapModel[] | undefined,
    locations: undefined as LocationModel[] | undefined,
    weather: undefined as WeatherModel[] | undefined,
    stints: undefined as StintModel[] | undefined,
    drivers: undefined as DriverModel[] | undefined,
    result: undefined as SessionResultModel | undefined,
    grid: undefined as StartingGridModel | undefined,
  };

  get circuitKey(): number {
    return this._data.circuit_key;
  }
  get circuitName(): string {
    return this._data.circuit_short_name;
  }
  get countryCode(): string {
    return this._data.country_code;
  }
  get countryKey(): number {
    return this._data.country_key;
  }
  get countryName(): string {
    return this._data.country_name;
  }
  get dateEnd(): string {
    return this._data.date_end;
  }
  get dateStart(): string {
    return this._data.date_start;
  }
  get gmtOffset(): string {
    return this._data.gmt_offset;
  }
  get location(): string {
    return this._data.location;
  }
  get meetingKey(): number | "latest" {
    return this._data.meeting_key;
  }
  get sessionKey(): number | "latest" {
    return this._data.session_key;
  }
  get sessionName(): string {
    return this._data.session_name;
  }
  get sessionType(): string {
    return this._data.session_type;
  }
  get year(): number {
    return this._data.year;
  }

  async getPits(params = {}) {
    if (!this._cache.pits) {
      const data = await PitModel.where({
        session_key: this.sessionKey,
        meeting_key: this.meetingKey,
        ...params,
      });
      this._cache.pits = PitModel.fromMany(data);
    }
    return this._cache.pits;
  }

  async getTelemetry(params = {}) {
    if (!this._cache.telemetry) {
      const data = await TelemetryModel.where({
        session_key: this.sessionKey,
        ...params,
      });
      this._cache.telemetry = TelemetryModel.fromMany(data);
    }
    return this._cache.telemetry;
  }

  async getRaceControl(params = {}) {
    if (!this._cache.raceControl) {
      const data = await RaceControlModel.where({
        session_key: this.sessionKey,
        ...params,
      });
      this._cache.raceControl = RaceControlModel.fromMany(data);
    }
    return this._cache.raceControl;
  }

  async getIntervals(params = {}) {
    if (!this._cache.intervals) {
      const data = await IntervalModel.where({
        session_key: this.sessionKey,
        ...params,
      });
      this._cache.intervals = IntervalModel.fromMany(data);
    }
    return this._cache.intervals;
  }

  async getPositions(params = {}) {
    if (!this._cache.positions) {
      const data = await PositionModel.where({
        session_key: this.sessionKey,
        ...params,
      });
      this._cache.positions = PositionModel.fromMany(
        data as PositionData[]
      ) as PositionModel[];
    }
    return this._cache.positions;
  }

  async getLocations(params = {}): Promise<LocationModel[]> {
    if (!this._cache.locations) {
      this._cache.locations = await LocationModel.where({
        session_key: this.sessionKey,
        ...params,
      });
    }
    return this._cache.locations;
  }

  async getLaps(params = {}): Promise<LapModel[]> {
    if (!this._cache.laps) {
      this._cache.laps = await LapModel.where({
        session_key: this.sessionKey,
        ...params,
      });
    }
    return this._cache.laps;
  }

  async getWeather(params = {}): Promise<WeatherModel[]> {
    if (!this._cache.weather) {
      this._cache.weather = await WeatherModel.where({
        session_key: this.sessionKey,
        ...params,
      });
    }
    return this._cache.weather;
  }

  async getStints(params = {}): Promise<StintModel[]> {
    if (!this._cache.stints) {
      this._cache.stints = await StintModel.where({
        session_key: this.sessionKey,
        ...params,
      });
    }
    return this._cache.stints;
  }

  async getDrivers(params = {}): Promise<DriverModel[]> {
    if (!this._cache.drivers) {
      this._cache.drivers = await DriverModel.where({
        session_key: this.sessionKey,
        ...params,
      });
    }
    return this._cache.drivers;
  }

  async getSessionResults(
    params = {}
  ): Promise<SessionResultModel | undefined> {
    if (!this._cache.result) {
      this._cache.result = await SessionResultModel.find({
        session_key: this.sessionKey,
        ...params,
      });
    }

    return this._cache.result;
  }

  async getStartingGrid(params = {}): Promise<StartingGridModel | undefined> {
    if (this.sessionType !== "Race") {
      throw new OpenF1Error(
        `Starting grid is only available for a race session, but the current session is ${this.sessionType}`
      );
    }

    if (!this._cache.grid) {
      this._cache.grid = await StartingGridModel.find({
        session_key: this.sessionKey,
        ...params,
      });
    }

    return this._cache.grid;
  }
}
