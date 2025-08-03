import { Pit } from "./Pit.js";
import { CarData } from "./CarData.js";
import { TeamRadio } from "./TeamRadio.js";
import { RaceControl } from "./RaceControl.js";
import { Interval } from "./Interval.js";
import { Position } from "./Position.js";
import { SessionResult } from "./SessionResult.js";

import { SessionType } from "../types.js";
import { FetcherRegistry } from "../fetchers/FetcherRegistry.js";

export class Session implements SessionType {
  constructor(
    private readonly data: SessionType,
    private readonly fetchers: Pick<
      FetcherRegistry,
      | "pit"
      | "carData"
      | "teamRadio"
      | "raceControl"
      | "interval"
      | "position"
      | "sessionResult"
    >
  ) {}

  readonly session_key = this.data.session_key;
  readonly meeting_key = this.data.meeting_key;
  readonly session_type = this.data.session_type;
  readonly session_name = this.data.session_name;
  readonly date_start = this.data.date_start;
  readonly date_end = this.data.date_end;
  readonly location = this.data.location;
  readonly gmt_offset = this.data.gmt_offset;
  readonly country_code = this.data.country_code;
  readonly circuit_key = this.data.circuit_key;
  readonly year = this.data.year;
  readonly country_name = this.data.country_name;
  readonly country_key = this.data.country_key;
  readonly circuit_short_name = this.data.circuit_short_name;

  private cache = {
    pits: undefined as Pit[] | undefined,
    carData: undefined as CarData[] | undefined,
    radios: undefined as TeamRadio[] | undefined,
    control: undefined as RaceControl[] | undefined,
    intervals: undefined as Interval[] | undefined,
    positions: undefined as Position[] | undefined,
    results: undefined as SessionResult[] | undefined,
  };

  async pits(): Promise<Pit[]> {
    if (!this.cache.pits)
      this.cache.pits = await this.fetchers.pit.fetch({
        session_key: this.session_key,
      });
    return this.cache.pits;
  }

  async telemetry(): Promise<CarData[]> {
    if (!this.cache.carData)
      this.cache.carData = await this.fetchers.carData.fetch({
        session_key: this.session_key,
      });
    return this.cache.carData;
  }

  async teamRadios(): Promise<TeamRadio[]> {
    if (!this.cache.radios)
      this.cache.radios = await this.fetchers.teamRadio.fetch({
        session_key: this.session_key,
      });
    return this.cache.radios;
  }

  async raceControl(): Promise<RaceControl[]> {
    if (!this.cache.control)
      this.cache.control = await this.fetchers.raceControl.fetch({
        session_key: this.session_key,
      });
    return this.cache.control;
  }

  async intervals(): Promise<Interval[]> {
    if (!this.cache.intervals)
      this.cache.intervals = await this.fetchers.interval.fetch({
        session_key: this.session_key,
      });
    return this.cache.intervals;
  }

  async positions(): Promise<Position[]> {
    if (!this.cache.positions)
      this.cache.positions = await this.fetchers.position.fetch({
        session_key: this.session_key,
      });
    return this.cache.positions;
  }

  async results(): Promise<SessionResult[]> {
    if (!this.cache.results)
      this.cache.results = await this.fetchers.sessionResult.fetch({
        session_key: this.session_key,
      });
    return this.cache.results;
  }

  loaded() {
    return {
      pits: !!this.cache.pits,
      telemetry: !!this.cache.carData,
      radios: !!this.cache.radios,
      control: !!this.cache.control,
      intervals: !!this.cache.intervals,
      positions: !!this.cache.positions,
      results: !!this.cache.results,
    };
  }
}
