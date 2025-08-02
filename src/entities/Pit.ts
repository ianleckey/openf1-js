import { PitType } from "../types.js";

export class Pit {
  date: string;
  driver_number: number;
  lap_number: number;
  meeting_key: number;
  pit_duration: number;
  session_key: number;

  constructor(data: PitType) {
    this.date = data.date;
    this.driver_number = data.driver_number;
    this.lap_number = data.lap_number;
    this.meeting_key = data.meeting_key;
    this.pit_duration = data.pit_duration;
    this.session_key = data.session_key;
  }

  static fromArray(data: PitType[]): Pit[] {
    return data.map((d) => new Pit(d));
  }
}
