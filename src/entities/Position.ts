import { PositionType } from "../types.js";

export class Position implements PositionType {
  constructor(public readonly data: PositionType) {
    Object.assign(this, data);
  }

  readonly date = this.data.date;
  readonly driver_number = this.data.driver_number;
  readonly meeting_key = this.data.meeting_key;
  readonly position = this.data.position;
  readonly session_key = this.data.session_key;
}
