import { SessionResultType } from "../types.js";

export class SessionResult implements SessionResultType {
  constructor(public readonly data: SessionResultType) {
    Object.assign(this, data);
  }

  readonly dnf = this.data.dnf;
  readonly dns = this.data.dns;
  readonly dsq = this.data.dsq;
  readonly driver_number = this.data.driver_number;
  readonly duration = this.data.duration;
  readonly gap_to_leader = this.data.gap_to_leader;
  readonly number_of_laps = this.data.number_of_laps;
  readonly meeting_key = this.data.meeting_key;
  readonly position = this.data.position;
  readonly session_key = this.data.session_key;
}
