import type { IntervalType } from "../types.js";
import { Interval } from "../entities/Interval.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export class IntervalFetcher extends Fetcher<IntervalType, Interval> {
  constructor(transport: Transport) {
    super("intervals", transport, (rows) => rows.map((r) => new Interval(r)));
  }
}
