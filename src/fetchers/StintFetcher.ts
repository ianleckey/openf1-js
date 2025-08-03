import type { StintType } from "../types.js";
import { Stint } from "../entities/Stint.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export class StintFetcher extends Fetcher<StintType, Stint> {
  constructor(transport: Transport) {
    super("stints", transport, (rows) => rows.map((r) => new Stint(r)));
  }
}
