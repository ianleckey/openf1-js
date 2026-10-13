import { OpenF1Error } from "./errors.js";
import { httpGet, type Format, type HttpConfig, type RequestOptions } from "./http.js";
import { serializeQuery, translateLegacyParams } from "./query.js";
import { Resource } from "./resource.js";
import { SessionScope } from "./session-scope.js";
import type {
  CarData,
  ChampionshipDriver,
  ChampionshipTeam,
  Driver,
  Interval,
  Lap,
  Location,
  Meeting,
  Overtake,
  Pit,
  Position,
  RaceControl,
  Session,
  SessionResult,
  StartingGrid,
  Stint,
  TeamRadio,
  Weather,
} from "./types.js";

export const DEFAULT_BASE_URL = "https://api.openf1.org/v1/";

export interface OpenF1Options<M extends Format = Format> {
  /** API base URL. Default: `https://api.openf1.org/v1/`. */
  baseURL?: string;
  /**
   * Response format for the legacy `getX()` methods only. Default: `"json"`.
   * New code should use `f1.<endpoint>.list()` (JSON) or `.csv()` instead.
   */
  mode?: M;
  /** Custom `fetch` implementation. Default: the global `fetch`. */
  fetch?: typeof fetch;
  /** Request timeout in milliseconds. Default: 30000. */
  timeoutMs?: number;
  /** How many times to retry after a 429 rate-limit response. Default: 2. */
  retries?: number;
  /** Extra headers sent with every request. */
  headers?: Record<string, string>;
  /**
   * OpenF1 access token for sponsor-tier (live) data, or a function that returns one.
   * Get one with `OpenF1.fetchToken()`. Keep it server-side.
   */
  accessToken?: string | (() => string | Promise<string>);
}

/** Return type of the legacy `getX()` methods: `T[]` in JSON mode, `string` in CSV mode. */
export type LegacyResult<M extends Format, T> = M extends "csv" ? string : T[];

export interface AccessToken {
  accessToken: string;
  /** When the token expires (OpenF1 tokens last one hour). */
  expiresAt: Date;
}

/**
 * OpenF1 API client.
 *
 * @example
 * const f1 = new OpenF1();
 * const laps = await f1.laps.list({ session_key: 9161, driver_number: 1 });
 * const race = f1.session("latest");
 * const weather = await race.weather();
 */
export class OpenF1<M extends Format = "json"> {
  /** Car telemetry (speed, throttle, brake, gear, RPM, DRS), ~3.7 Hz. */
  readonly carData: Resource<CarData>;
  /** Drivers' championship standings before/after a race. Beta. */
  readonly championshipDrivers: Resource<ChampionshipDriver>;
  /** Teams' championship standings before/after a race. Beta. */
  readonly championshipTeams: Resource<ChampionshipTeam>;
  /** Driver details per session. */
  readonly drivers: Resource<Driver>;
  /** Gaps to the leader and the car ahead. Races only. */
  readonly intervals: Resource<Interval>;
  /** Lap and sector times, speed traps. */
  readonly laps: Resource<Lap>;
  /** Car x/y/z positions on track, ~3.7 Hz. */
  readonly location: Resource<Location>;
  /** Grand Prix and testing weekends. */
  readonly meetings: Resource<Meeting>;
  /** On-track overtakes. Races only; may be incomplete. */
  readonly overtakes: Resource<Overtake>;
  /** Pit lane visits. */
  readonly pit: Resource<Pit>;
  /** Driver positions over time. */
  readonly position: Resource<Position>;
  /** Race control messages: flags, safety car, incidents. */
  readonly raceControl: Resource<RaceControl>;
  /** Sessions (practice, qualifying, sprint, race). */
  readonly sessions: Resource<Session>;
  /** Final classification of a session. */
  readonly sessionResult: Resource<SessionResult>;
  /** Starting grid for a race. */
  readonly startingGrid: Resource<StartingGrid>;
  /** Tyre stints. */
  readonly stints: Resource<Stint>;
  /** Team radio recordings. */
  readonly teamRadio: Resource<TeamRadio>;
  /** Track weather, every minute. */
  readonly weather: Resource<Weather>;

  private readonly http: HttpConfig;
  private readonly mode: M;

  constructor(options: OpenF1Options<M> = {}) {
    this.mode = (options.mode === "csv" ? "csv" : "json") as M;
    const fetchImpl = options.fetch ?? globalThis.fetch;
    if (typeof fetchImpl !== "function") {
      throw new Error(
        "openf1-js: no global fetch found. Use Node 18+ or pass `fetch` in the options."
      );
    }
    this.http = {
      baseURL: options.baseURL || DEFAULT_BASE_URL,
      fetch: (input, init) => fetchImpl(input, init),
      timeoutMs: options.timeoutMs ?? 30_000,
      retries: options.retries ?? 2,
      headers: options.headers ?? {},
      accessToken: options.accessToken,
    };

    const r = <T>(endpoint: string) => new Resource<T>(this.http, endpoint);
    this.carData = r("car_data");
    this.championshipDrivers = r("championship_drivers");
    this.championshipTeams = r("championship_teams");
    this.drivers = r("drivers");
    this.intervals = r("intervals");
    this.laps = r("laps");
    this.location = r("location");
    this.meetings = r("meetings");
    this.overtakes = r("overtakes");
    this.pit = r("pit");
    this.position = r("position");
    this.raceControl = r("race_control");
    this.sessions = r("sessions");
    this.sessionResult = r("session_result");
    this.startingGrid = r("starting_grid");
    this.stints = r("stints");
    this.teamRadio = r("team_radio");
    this.weather = r("weather");
  }

  /**
   * Scope every endpoint to one session.
   *
   * @param sessionKey A session key, or `"latest"` for the current or most recent session.
   */
  session(sessionKey: number | "latest"): SessionScope {
    return new SessionScope(this, sessionKey);
  }

  /**
   * Call any endpoint by path, e.g. one this SDK doesn't wrap yet.
   * Filters use the same syntax as `list()`. Unlike `list()`, a query that matches
   * nothing throws an `OpenF1Error` with status 404.
   */
  request<T = unknown>(
    endpoint: string,
    query?: Record<string, unknown>,
    options?: RequestOptions & { format?: "json" }
  ): Promise<T[]>;
  request(
    endpoint: string,
    query: Record<string, unknown> | undefined,
    options: RequestOptions & { format: "csv" }
  ): Promise<string>;
  request(
    endpoint: string,
    query?: Record<string, unknown>,
    options: RequestOptions & { format?: Format } = {}
  ): Promise<unknown> {
    return httpGet(
      this.http,
      endpoint,
      serializeQuery(query),
      options.format ?? "json",
      options
    );
  }

  /**
   * Exchange OpenF1 account credentials for an access token (sponsor tier).
   * Call this from a server; never ship credentials to a browser.
   */
  static async fetchToken(credentials: {
    username: string;
    password: string;
    baseURL?: string;
    fetch?: typeof fetch;
  }): Promise<AccessToken> {
    const fetchImpl = credentials.fetch ?? globalThis.fetch;
    const url = new URL("/token", credentials.baseURL ?? DEFAULT_BASE_URL).toString();
    const res = await fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: credentials.username,
        password: credentials.password,
      }).toString(),
    });
    const body = (await res.json().catch(() => undefined)) as
      | { access_token?: string; expires_in?: string | number }
      | undefined;
    if (!res.ok || !body?.access_token) {
      throw new OpenF1Error(`OpenF1 token request failed with status ${res.status}`, {
        url,
        status: res.status,
        body,
      });
    }
    const expiresIn = Number(body.expires_in ?? 3600);
    return {
      accessToken: body.access_token,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    };
  }

  // ---------------------------------------------------------------------------
  // Legacy 0.1.x API. Kept for backwards compatibility.
  // ---------------------------------------------------------------------------

  private legacy<T>(endpoint: string, params?: Record<string, any>) {
    return httpGet(
      this.http,
      endpoint,
      serializeQuery(translateLegacyParams(params)),
      this.mode
    ) as Promise<LegacyResult<M, T>>;
  }

  /** @deprecated Use `f1.sessions.list()`. */
  getSessions(params?: Record<string, any>) {
    return this.legacy<Session>("sessions", params);
  }
  /** @deprecated Use `f1.sessionResult.list()`. */
  getSessionResult(params?: Record<string, any>) {
    return this.legacy<SessionResult>("session_result", params);
  }
  /** @deprecated Use `f1.startingGrid.list()`. */
  getStartingGrid(params?: Record<string, any>) {
    return this.legacy<StartingGrid>("starting_grid", params);
  }
  /** @deprecated Use `f1.stints.list()`. */
  getStints(params?: Record<string, any>) {
    return this.legacy<Stint>("stints", params);
  }
  /** @deprecated Use `f1.meetings.list()`. */
  getMeetings(params?: Record<string, any>) {
    return this.legacy<Meeting>("meetings", params);
  }
  /** @deprecated Use `f1.pit.list()`. */
  getPit(params?: Record<string, any>) {
    return this.legacy<Pit>("pit", params);
  }
  /** @deprecated Use `f1.position.list()`. */
  getPosition(params?: Record<string, any>) {
    return this.legacy<Position>("position", params);
  }
  /** @deprecated Use `f1.raceControl.list()`. */
  getRaceControl(params?: Record<string, any>) {
    return this.legacy<RaceControl>("race_control", params);
  }
  /** @deprecated Use `f1.location.list()`. */
  getLocation(params?: Record<string, any>) {
    return this.legacy<Location>("location", params);
  }
  /** @deprecated Use `f1.laps.list()`. */
  getLaps(params?: Record<string, any>) {
    return this.legacy<Lap>("laps", params);
  }
  /** @deprecated Use `f1.carData.list()`. */
  getCarData(params?: Record<string, any>) {
    return this.legacy<CarData>("car_data", params);
  }
  /** @deprecated Use `f1.drivers.list()`. */
  getDrivers(params?: Record<string, any>) {
    return this.legacy<Driver>("drivers", params);
  }
  /** @deprecated Use `f1.intervals.list()`. */
  getIntervals(params?: Record<string, any>) {
    return this.legacy<Interval>("intervals", params);
  }
  /** @deprecated Use `f1.teamRadio.list()`. */
  getTeamRadio(params?: Record<string, any>) {
    return this.legacy<TeamRadio>("team_radio", params);
  }
  /** @deprecated Use `f1.weather.list()`. */
  getWeather(params?: Record<string, any>) {
    return this.legacy<Weather>("weather", params);
  }
}
