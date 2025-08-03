import { Pit } from "../entities/Pit.js";
import { Transport } from "../transport/Transport.js";
import { PitType } from "../types.js";
import { Fetcher } from "./Fetcher.js";

export class PitFetcher extends Fetcher<PitType, Pit> {
  constructor(transport: Transport) {
    super("pit", transport, (rows) => rows.map((r) => new Pit(r)));
  }
}
