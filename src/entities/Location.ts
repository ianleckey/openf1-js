import { LocationType } from "../types.js";

export class Location {
  date: string;
  driver_number: number;
  meeting_key: number;
  session_key: number;
  x: number;
  y: number;
  z: number;

  constructor(data: LocationType) {
    this.date = data.date;
    this.driver_number = data.driver_number;
    this.meeting_key = data.meeting_key;
    this.session_key = data.session_key;
    this.x = data.x;
    this.y = data.y;
    this.z = data.z;
  }

  static fromArray(data: LocationType[]): Location[] {
    return data.map((d) => new Location(d));
  }
}
