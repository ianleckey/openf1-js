import type { TeamRadioType } from "../types.js";
import { TeamRadio } from "../entities/TeamRadio.js";
import { Fetcher } from "./Fetcher.js";
import { Transport } from "../transport/Transport.js";

export class TeamRadioFetcher extends Fetcher<TeamRadioType, TeamRadio> {
  constructor(transport: Transport) {
    super("team_radio", transport, (rows) => rows.map((r) => new TeamRadio(r)));
  }
}
