import type { StartingGridType } from "../types.js";
import { StartingGrid } from "../entities/StartingGrid.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export class StartingGridFetcher extends Fetcher<
  StartingGridType,
  StartingGrid
> {
  constructor(transport: Transport) {
    super("starting_grid", transport, (rows) =>
      rows.map((r) => new StartingGrid(r))
    );
  }
}
