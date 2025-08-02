import { Transport } from "../transport/Transport.js";
import type { PitType } from "../types.js";
import { Pit } from "../entities/Pit.js";
import { Fetcher } from "./Fetcher.js";

export class PitFetcher extends Fetcher<PitType, Pit> {
  constructor(transport: Transport) {
    super(transport, "pits", Pit.fromArray);
  }
}
