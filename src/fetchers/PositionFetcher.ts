import { Transport } from "../transport/Transport.js";
import type { PositionType } from "../types.js";
import { Position } from "../entities/Position.js";
import { Fetcher } from "./Fetcher.js";

export class PositionFetcher extends Fetcher<PositionType, Position> {
  constructor(transport: Transport) {
    super(transport, "positions", Position.fromArray);
  }
}
