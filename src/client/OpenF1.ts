import { Transport, TransportOptions } from "../transport/Transport.js";
import {
  createFetcherRegistry,
  FetcherRegistry,
} from "../fetchers/FetcherRegistry.js";
import { RaceWeekend } from "../entities/RaceWeekend.js";

export class OpenF1 {
  readonly transport: Transport;
  readonly fetchers: FetcherRegistry;

  constructor(options: TransportOptions = {}) {
    this.transport = new Transport(options);
    this.fetchers = createFetcherRegistry(this.transport);
  }

  getRaceWeekend(meetingKey: number): RaceWeekend {
    return new RaceWeekend(meetingKey, {
      meeting: this.fetchers.meeting,
      session: this.fetchers.session,
      driver: this.fetchers.driver,
    });
  }

  /**
   * Lists all available endpoints that can be accessed through the OpenF1 client.
   * This method provides a way to discover all registered fetcher endpoints.
   *
   * @returns {string[]} An array of strings representing the names of all available API endpoints.
   *
   * @example
   * ```typescript
   * const client = new OpenF1();
   * const endpoints = client.listAvailableEndpoints();
   * // Returns: ['drivers', 'sessions', 'timing', ...]
   * ```
   */
  listAvailableEndpoints(): string[] {
    return Object.keys(this.fetchers);
  }

  // --- Deprecated compatibility methods ---
  /** @deprecated Use `client.fetchers.session.fetch(params)` instead. */
  async getSessions(params?: Record<string, any>) {
    this._deprecationWarning("getSessions", "fetchers.session.fetch");
    return this.fetchers.session.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.sessionResult.fetch(params)` instead. */
  async getSessionResult(params?: Record<string, any>) {
    this._deprecationWarning(
      "getSessionResult",
      "fetchers.sessionResult.fetch"
    );
    return this.fetchers.sessionResult.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.startingGrid.fetch(params)` instead. */
  async getStartingGrid(params?: Record<string, any>) {
    this._deprecationWarning("getStartingGrid", "fetchers.startingGrid.fetch");
    return this.fetchers.startingGrid.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.stint.fetch(params)` instead. */
  async getStints(params?: Record<string, any>) {
    this._deprecationWarning("getStints", "fetchers.stint.fetch");
    return this.fetchers.stint.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.meeting.fetch(params)` instead. */
  async getMeetings(params?: Record<string, any>) {
    this._deprecationWarning("getMeetings", "fetchers.meeting.fetch");
    return this.fetchers.meeting.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.pit.fetch(params)` instead. */
  async getPit(params?: Record<string, any>) {
    this._deprecationWarning("getPit", "fetchers.pit.fetch");
    return this.fetchers.pit.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.position.fetch(params)` instead. */
  async getPosition(params?: Record<string, any>) {
    this._deprecationWarning("getPosition", "fetchers.position.fetch");
    return this.fetchers.position.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.raceControl.fetch(params)` instead. */
  async getRaceControl(params?: Record<string, any>) {
    this._deprecationWarning("getRaceControl", "fetchers.raceControl.fetch");
    return this.fetchers.raceControl.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.location.fetch(params)` instead. */
  async getLocation(params?: Record<string, any>) {
    this._deprecationWarning("getLocation", "fetchers.location.fetch");
    return this.fetchers.location.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.lap.fetch(params)` instead. */
  async getLaps(params?: Record<string, any>) {
    this._deprecationWarning("getLaps", "fetchers.lap.fetch");
    return this.fetchers.lap.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.carData.fetch(params)` instead. */
  async getCarData(params?: Record<string, any>) {
    this._deprecationWarning("getCarData", "fetchers.carData.fetch");
    return this.fetchers.carData.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.driver.fetch(params)` instead. */
  async getDrivers(params?: Record<string, any>) {
    this._deprecationWarning("getDrivers", "fetchers.driver.fetch");
    return this.fetchers.driver.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.interval.fetch(params)` instead. */
  async getIntervals(params?: Record<string, any>) {
    this._deprecationWarning("getIntervals", "fetchers.interval.fetch");
    return this.fetchers.interval.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.teamRadio.fetch(params)` instead. */
  async getTeamRadio(params?: Record<string, any>) {
    this._deprecationWarning("getTeamRadio", "fetchers.teamRadio.fetch");
    return this.fetchers.teamRadio.fetch(params || {});
  }
  /** @deprecated Use `client.fetchers.weather.fetch(params)` instead. */
  async getWeather(params?: Record<string, any>) {
    this._deprecationWarning("getWeather", "fetchers.weather.fetch");
    return this.fetchers.weather.fetch(params || {});
  }

  private _deprecationWarning(oldMethod: string, newMethod: string) {
    if (process && process.emitWarning) {
      process.emitWarning(
        `[DEPRECATION] OpenF1.${oldMethod} is deprecated. Use OpenF1.${newMethod} instead.`,
        "DeprecationWarning"
      );
    } else {
      // fallback for browsers or environments without process.emitWarning
      console.warn(
        `[DEPRECATION] OpenF1.${oldMethod} is deprecated. Use OpenF1.${newMethod} instead.`
      );
    }
  }
}
