import { Transport } from "../transport/Transport.js";
import type { StartingGridType } from "../types.js";
import { StartingGrid } from "../entities/StartingGrid.js";
import { Fetcher } from "./Fetcher.js";

export class StartingGridFetcher extends Fetcher<
  StartingGridType,
  StartingGrid
> {
  constructor(transport: Transport) {
    super(transport, "starting_grid", StartingGrid.fromArray);
  }
}
