import { StartingGridType } from "../types.js";

export class StartingGrid implements StartingGridType {
  constructor(public readonly data: StartingGridType) {
    Object.assign(this, data);
  }

  readonly position = this.data.position;
  readonly driver_number = this.data.driver_number;
  readonly lap_duration = this.data.lap_duration;
  readonly meeting_key = this.data.meeting_key;
  readonly session_key = this.data.session_key;
}
