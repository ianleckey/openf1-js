import { isNoResults } from "./errors.js";
import { httpGet, type HttpConfig, type RequestOptions } from "./http.js";
import { serializeQuery, type Query } from "./query.js";

/** One OpenF1 endpoint, e.g. `f1.laps`. */
export class Resource<T> {
  constructor(
    private readonly http: HttpConfig,
    /** The endpoint path, e.g. `"laps"`. */
    readonly endpoint: string
  ) {}

  /**
   * Fetch matching records as JSON. Returns `[]` when nothing matches.
   *
   * @example
   * await f1.laps.list({ session_key: 9161, driver_number: [1, 44], lap_duration: { lt: 100 } });
   */
  async list(query?: Query<T>, options?: RequestOptions): Promise<T[]> {
    try {
      return (await httpGet(
        this.http,
        this.endpoint,
        serializeQuery(query as Record<string, unknown>),
        "json",
        options
      )) as T[];
    } catch (error) {
      if (isNoResults(error)) return [];
      throw error;
    }
  }

  /**
   * Fetch matching records as a CSV string (opt-in; `list()` returns JSON).
   * Returns `""` when nothing matches.
   */
  async csv(query?: Query<T>, options?: RequestOptions): Promise<string> {
    try {
      return (await httpGet(
        this.http,
        this.endpoint,
        serializeQuery(query as Record<string, unknown>),
        "csv",
        options
      )) as string;
    } catch (error) {
      if (isNoResults(error)) return "";
      throw error;
    }
  }
}
