import { LocationType } from "../types.js";

export class Location implements LocationType {
  constructor(public readonly data: LocationType) {
    Object.assign(this, data);
  }

  readonly date = this.data.date;
  readonly driver_number = this.data.driver_number;
  readonly meeting_key = this.data.meeting_key;
  readonly session_key = this.data.session_key;
  readonly x = this.data.x;
  readonly y = this.data.y;
  readonly z = this.data.z;
}
