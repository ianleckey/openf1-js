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
    return new RaceWeekend(meetingKey, this.fetchers);
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
}
