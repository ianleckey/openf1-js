import type { LapType } from "../types.js";
import { Lap } from "../entities/Lap.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export class LapFetcher extends Fetcher<LapType, Lap> {
  constructor(transport: Transport) {
    super("laps", transport, (rows) => rows.map((r) => new Lap(r)));
  }
}
