import type { DriverType } from "../types.js";
import { Driver } from "../entities/Driver.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export class DriverFetcher extends Fetcher<DriverType, Driver> {
  constructor(transport: Transport) {
    super("drivers", transport, (rows) => rows.map((r) => new Driver(r)));
  }
}
