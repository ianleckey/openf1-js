import { Transport } from "../transport/Transport.js";
import type { StintType } from "../types.js";
import { Stint } from "../entities/Stint.js";
import { Fetcher } from "./Fetcher.js";

export class StintFetcher extends Fetcher<StintType, Stint> {
  constructor(transport: Transport) {
    super(transport, "stints", Stint.fromArray);
  }
}
