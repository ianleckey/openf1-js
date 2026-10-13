import type { RequestOptions } from "./http.js";
import type { Query } from "./query.js";
import type { Resource } from "./resource.js";
import type {
  CarData,
  ChampionshipDriver,
  ChampionshipTeam,
  Driver,
  Interval,
  Lap,
  Location,
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

/** A query with `session_key` already bound by the scope. */
export type ScopedQuery<T> = Omit<Query<T>, "session_key">;

type ScopedMethod<T> = (query?: ScopedQuery<T>, options?: RequestOptions) => Promise<T[]>;

/** The resources a `SessionScope` reads from. */
export interface SessionResources {
  carData: Resource<CarData>;
  championshipDrivers: Resource<ChampionshipDriver>;
  championshipTeams: Resource<ChampionshipTeam>;
  drivers: Resource<Driver>;
  intervals: Resource<Interval>;
  laps: Resource<Lap>;
  location: Resource<Location>;
  overtakes: Resource<Overtake>;
  pit: Resource<Pit>;
  position: Resource<Position>;
  raceControl: Resource<RaceControl>;
  sessions: Resource<Session>;
  sessionResult: Resource<SessionResult>;
  startingGrid: Resource<StartingGrid>;
  stints: Resource<Stint>;
  teamRadio: Resource<TeamRadio>;
  weather: Resource<Weather>;
}

/**
 * Every endpoint, pre-filtered to one session. Created with `f1.session(key)`.
 * Methods return JSON; for CSV use `f1.<endpoint>.csv({ session_key })`.
 *
 * @example
 * const race = f1.session("latest");
 * const radio = await race.teamRadio({ driver_number: 1 });
 */
export class SessionScope {
  readonly carData: ScopedMethod<CarData>;
  readonly championshipDrivers: ScopedMethod<ChampionshipDriver>;
  readonly championshipTeams: ScopedMethod<ChampionshipTeam>;
  readonly drivers: ScopedMethod<Driver>;
  readonly intervals: ScopedMethod<Interval>;
  readonly laps: ScopedMethod<Lap>;
  readonly location: ScopedMethod<Location>;
  readonly overtakes: ScopedMethod<Overtake>;
  readonly pit: ScopedMethod<Pit>;
  readonly position: ScopedMethod<Position>;
  readonly raceControl: ScopedMethod<RaceControl>;
  readonly sessionResult: ScopedMethod<SessionResult>;
  readonly startingGrid: ScopedMethod<StartingGrid>;
  readonly stints: ScopedMethod<Stint>;
  readonly teamRadio: ScopedMethod<TeamRadio>;
  readonly weather: ScopedMethod<Weather>;

  constructor(
    private readonly resources: SessionResources,
    /** The bound session key: a number, or `"latest"`. */
    readonly sessionKey: number | "latest"
  ) {
    const bind =
      <T>(resource: Resource<T>): ScopedMethod<T> =>
      (query, options) =>
        resource.list({ ...query, session_key: sessionKey } as unknown as Query<T>, options);

    this.carData = bind(resources.carData);
    this.championshipDrivers = bind(resources.championshipDrivers);
    this.championshipTeams = bind(resources.championshipTeams);
    this.drivers = bind(resources.drivers);
    this.intervals = bind(resources.intervals);
    this.laps = bind(resources.laps);
    this.location = bind(resources.location);
    this.overtakes = bind(resources.overtakes);
    this.pit = bind(resources.pit);
    this.position = bind(resources.position);
    this.raceControl = bind(resources.raceControl);
    this.sessionResult = bind(resources.sessionResult);
    this.startingGrid = bind(resources.startingGrid);
    this.stints = bind(resources.stints);
    this.teamRadio = bind(resources.teamRadio);
    this.weather = bind(resources.weather);
  }

  /** The session's own record from `/sessions`, or `undefined` if it doesn't exist. */
  async info(options?: RequestOptions): Promise<Session | undefined> {
    const [session] = await this.resources.sessions.list(
      { session_key: this.sessionKey },
      options
    );
    return session;
  }
}
