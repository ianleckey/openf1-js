import { Transport } from "../transport/Transport.js";
import type { DriverType } from "../types.js";
import { Driver } from "../entities/Driver.js";
import { Fetcher } from "./Fetcher.js";

export class DriverFetcher extends Fetcher<DriverType, Driver> {
  constructor(transport: Transport) {
    super(transport, "drivers", Driver.fromArray);
  }
}
