import { IntervalType } from "../types.js";

export class Interval implements IntervalType {
  constructor(public readonly data: IntervalType) {
    Object.assign(this, data);
  }

  readonly date = this.data.date;
  readonly driver_number = this.data.driver_number;
  readonly gap_to_leader = this.data.gap_to_leader;
  readonly interval = this.data.interval;
  readonly meeting_key = this.data.meeting_key;
  readonly session_key = this.data.session_key;

  get gapToLeaderSeconds(): number | null {
    const gap = this.gap_to_leader;
    if (typeof gap !== "string" || !gap || isNaN(parseFloat(gap))) return null;
    return parseFloat(gap.replace("+", ""));
  }
}
