import type { PositionType } from "../types.js";
import { Position } from "../entities/Position.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export class PositionFetcher extends Fetcher<PositionType, Position> {
  constructor(transport: Transport) {
    super("positions", transport, (rows) => rows.map((r) => new Position(r)));
  }
}
