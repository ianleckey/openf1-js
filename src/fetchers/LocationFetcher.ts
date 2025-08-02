import { Transport } from "../transport/Transport.js";
import type { LocationType } from "../types.js";
import { Location } from "../entities/Location.js";
import { Fetcher } from "./Fetcher.js";

export class LocationFetcher extends Fetcher<LocationType, Location> {
  constructor(transport: Transport) {
    super(transport, "locations", Location.fromArray);
  }
}
