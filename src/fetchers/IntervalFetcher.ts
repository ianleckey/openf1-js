import { Transport } from "../transport/Transport.js";
import type { IntervalType } from "../types.js";
import { Interval } from "../entities/Interval.js";
import { Fetcher } from "./Fetcher.js";

export class IntervalFetcher extends Fetcher<IntervalType, Interval> {
  constructor(transport: Transport) {
    super(transport, "intervals", Interval.fromArray);
  }
}
