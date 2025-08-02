import { StintType } from "../types.js";

export class Stint {
  compound: string;
  driver_number: number;
  lap_end: number;
  lap_start: number;
  meeting_key: number;
  session_key: number;
  stint_number: number;
  tyre_age_at_start: number;

  constructor(data: StintType) {
    this.compound = data.compound;
    this.driver_number = data.driver_number;
    this.lap_end = data.lap_end;
    this.lap_start = data.lap_start;
    this.meeting_key = data.meeting_key;
    this.session_key = data.session_key;
    this.stint_number = data.stint_number;
    this.tyre_age_at_start = data.tyre_age_at_start;
  }

  static fromArray(data: StintType[]): Stint[] {
    return data.map((d) => new Stint(d));
  }
}
