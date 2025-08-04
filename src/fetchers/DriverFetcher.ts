import type { DriverType } from "../types.js";
import { Driver } from "../entities/Driver.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";
import { OpenF1Error } from "../errors/OpenF1Error.js";

export class DriverFetcher extends Fetcher<DriverType, Driver> {
  constructor(transport: Transport) {
    super("drivers", transport, (rows) => rows.map((r) => new Driver(r)));
  }

  async fetchOneForSession({
    driver_number,
    session_key,
  }: {
    driver_number: number;
    session_key: number | "latest";
  }): Promise<Driver> {
    const drivers = await this.fetch({ driver_number, session_key });
    if (drivers.length === 0) {
      throw new OpenF1Error(
        `Driver ${driver_number} on session ${session_key} not found`
      );
    }
    return drivers[0];
  }
}
