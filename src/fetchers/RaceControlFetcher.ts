import type { RaceControlType } from "../types.js";
import { RaceControl } from "../entities/RaceControl.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export class RaceControlFetcher extends Fetcher<RaceControlType, RaceControl> {
  constructor(transport: Transport) {
    super("race_control", transport, (rows) =>
      rows.map((r) => new RaceControl(r))
    );
  }
}
