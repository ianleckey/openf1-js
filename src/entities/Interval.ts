import { IntervalType } from "../types.js";

export class Interval {
  date: string;
  driver_number: number;
  gap_to_leader: number | string | null;
  interval: number | string | null;
  meeting_key: number;
  session_key: number;

  constructor(data: IntervalType) {
    this.date = data.date;
    this.driver_number = data.driver_number;
    this.gap_to_leader = data.gap_to_leader;
    this.interval = data.interval;
    this.meeting_key = data.meeting_key;
    this.session_key = data.session_key;
  }

  get gapToLeaderSeconds(): number | null {
    const gap = this.gap_to_leader;
    if (typeof gap !== "string" || !gap || isNaN(parseFloat(gap))) return null;
    return parseFloat(gap.replace("+", ""));
  }

  static fromArray(data: IntervalType[]): Interval[] {
    return data.map((d) => new Interval(d));
  }
}
