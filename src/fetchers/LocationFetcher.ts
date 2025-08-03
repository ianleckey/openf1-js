import type { LocationType } from "../types.js";
import { Location } from "../entities/Location.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export class LocationFetcher extends Fetcher<LocationType, Location> {
  constructor(transport: Transport) {
    super("locations", transport, (rows) => rows.map((r) => new Location(r)));
  }
}
