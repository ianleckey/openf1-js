import { Transport } from "../transport/Transport.js";
import type { LapType } from "../types.js";
import { Lap } from "../entities/Lap.js";
import { Fetcher } from "./Fetcher.js";

export class LapFetcher extends Fetcher<LapType, Lap> {
  constructor(transport: Transport) {
    super(transport, "laps", Lap.fromArray);
  }
}
