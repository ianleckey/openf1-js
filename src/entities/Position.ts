import { PositionType } from "../types.js";

export class Position {
  date: string;
  driver_number: number;
  meeting_key: number;
  position: number;
  session_key: number;

  constructor(data: PositionType) {
    this.date = data.date;
    this.driver_number = data.driver_number;
    this.meeting_key = data.meeting_key;
    this.position = data.position;
    this.session_key = data.session_key;
  }

  static fromArray(data: PositionType[]): Position[] {
    return data.map((d) => new Position(d));
  }
}
