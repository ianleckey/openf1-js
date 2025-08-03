import { PitType } from "../types.js";

export class Pit implements PitType {
  constructor(public readonly data: PitType) {
    Object.assign(this, data);
  }

  readonly meeting_key = this.data.meeting_key;
  readonly session_key = this.data.session_key;
  readonly driver_number = this.data.driver_number;
  readonly lap_number = this.data.lap_number;
  readonly pit_duration = this.data.pit_duration;
  readonly date = this.data.date;
}
