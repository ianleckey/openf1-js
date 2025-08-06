// src/models/RaceWeekend.ts

import { Transport } from "../core/Transport.js";
import { DriverData } from "./index.js";

export class RaceWeekend {
  //private driversCache?: DriverData[];

  constructor(
    private readonly meeting_key: number,
    private readonly transport: Transport
  ) {}

  /**
   * Load all drivers for the race weekend.
   */
  /*async drivers(): Promise<DriverData[]> {
    if (!this.driversCache) {
      this.driversCache = await this.transport.get<DriverData[]>("drivers", {
        meeting_key: this.meeting_key,
      });
    }
    return this.driversCache;
  }
*/
  toJSON() {
    return {
      meeting_key: this.meeting_key,
    };
  }
}
