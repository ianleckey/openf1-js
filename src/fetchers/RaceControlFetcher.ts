import { Transport } from "../transport/Transport.js";
import type { RaceControlType } from "../types.js";
import { RaceControl } from "../entities/RaceControl.js";
import { Fetcher } from "./Fetcher.js";

export class RaceControlFetcher extends Fetcher<RaceControlType, RaceControl> {
  constructor(transport: Transport) {
    super(transport, "race_control", RaceControl.fromArray);
  }
}
