import { SessionResultType } from "../types.js";

export class SessionResult {
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  driver_number: number;
  duration: number | number[];
  gap_to_leader: number | string | number[];
  number_of_laps: number;
  meeting_key: number;
  position: number;
  session_key: number;

  constructor(data: SessionResultType) {
    this.dnf = data.dnf;
    this.dns = data.dns;
    this.dsq = data.dsq;
    this.driver_number = data.driver_number;
    this.duration = data.duration;
    this.gap_to_leader = data.gap_to_leader;
    this.number_of_laps = data.number_of_laps;
    this.meeting_key = data.meeting_key;
    this.position = data.position;
    this.session_key = data.session_key;
  }

  static fromArray(data: SessionResultType[]): SessionResult[] {
    return data.map((d) => new SessionResult(d));
  }
}
