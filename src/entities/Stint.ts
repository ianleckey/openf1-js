import { StintType } from "../types.js";

export class Stint implements StintType {
  constructor(public readonly data: StintType) {
    Object.assign(this, data);
  }

  readonly compound = this.data.compound;
  readonly driver_number = this.data.driver_number;
  readonly lap_end = this.data.lap_end;
  readonly lap_start = this.data.lap_start;
  readonly meeting_key = this.data.meeting_key;
  readonly session_key = this.data.session_key;
  readonly stint_number = this.data.stint_number;
  readonly tyre_age_at_start = this.data.tyre_age_at_start;
}
