import { Transport } from "../transport/Transport.js";
import type { TeamRadioType } from "../types.js";
import { TeamRadio } from "../entities/TeamRadio.js";
import { Fetcher } from "./Fetcher.js";

export class TeamRadioFetcher extends Fetcher<TeamRadioType, TeamRadio> {
  constructor(transport: Transport) {
    super(transport, "team_radio", TeamRadio.fromArray);
  }
}
